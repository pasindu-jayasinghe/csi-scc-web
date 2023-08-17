import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Unit, Project, ServiceProxy, EsExcludeReason, Report } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-report-es-excluded',
  templateUrl: './report-es-excluded.component.html',
  styleUrls: ['./report-es-excluded.component.css']
})
export class ReportEsExcludedComponent implements OnInit {

  @Input() selectedUnit: Unit;
  @Input() selectedProject: Project;
  @Input() parentId: number;

  public roles = Roles
public userActions = UserActions

  emissionSources: any[] = []
  excludedEs: any[] = []
  esIds: any[] = []
  report: Report

  constructor(
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    public appService: AppService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getEmissionSources()
    console.log(this.emissionSources)
    await this.getExcludedEs()
    await this.setInitials()
  }

  async getEmissionSources() {
    let filters = ["status||$ne||" + RecordStatus.Deleted];
    if (this.selectedProject && this.selectedUnit) {
      filters.push("project.id||$eq||" + this.selectedProject.id);
      filters.push("unit.id||$eq||" + this.selectedUnit.id);

      let pu = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined, undefined, filters, undefined, undefined, undefined, 1000, 0, 1, 0).toPromise()

      if (pu) {
        let filter = ["status||$ne||" + RecordStatus.Deleted, "projectUnit.id||$eq||" + pu.data[0].id]
        let pues = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        pues.data.map((p: any) => {
          if (p.emissionSource.id) this.emissionSources.push(p.emissionSource.id)
        })
      }
    }
  }

  async getExcludedEs(){
    let filter = ["status||$ne||" + RecordStatus.Deleted]
    filter.push("id||$notin||"+ this.emissionSources)

    let es = await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
      undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
    ).toPromise()

    this.excludedEs = es.data.map(_es => {
      this.esIds.push(_es.id)
      return {
        name: _es.name,
        id: _es.id,
        code: _es.code,
        reason: ''
      }
    })
  }

  async setInitials(){
    let filters = [ "status||$ne||"+RecordStatus.Deleted];
    filters.push("unit.id||$eq||"+this.selectedUnit.id);
    filters.push("project.id||$eq||"+this.selectedProject.id);

    let report = await this.serviceProxy.getManyBaseReportControllerReport(
      undefined, undefined, filters, undefined, undefined, undefined, 1000, 0, 1, 0
    ).toPromise()

      this.report = report.data[0]

    if (this.esIds.length > 0){
      let filter = ["emissionSource.id||$in||" + this.esIds, "report.id||$eq||" + this.report.id]
      let esDataSources = await this.serviceProxy.getManyBaseEsExcludeReasonControllerEsExcludeReason(
        undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
      ).toPromise()

      if (esDataSources.data.length > 0){
        esDataSources.data.map(data => {
          if (data.reason !== '') {
            this.excludedEs = this.excludedEs.map(es => {
              if (es.id === data.emissionSource.id){
                es.reason = data.reason
              }
              return es
            })
          }
        })
      }
    }
  }

  async saveCSIData(){
    console.log(this.excludedEs)
    let filters = [ "status||$ne||"+RecordStatus.Deleted];
    filters.push("unit.id||$eq||"+this.selectedUnit.id);
    filters.push("project.id||$eq||"+this.selectedProject.id);

    try {

      let report = await this.serviceProxy.getManyBaseReportControllerReport(
        undefined, undefined, filters, undefined, undefined, undefined, 1000, 0, 1, 0
      ).toPromise()

      this.excludedEs.forEach(async _es => {
        if  (_es.reason !== ''){
          let es = await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
            undefined, undefined, ["code||$eq||"+_es.code], undefined, undefined, undefined, 1000, 0, 1, 0
          ).toPromise()
  
          let excluded = new EsExcludeReason();
          excluded.emissionSource = es.data[0]
          excluded.reason = _es.reason
          excluded.report = report.data[0]
  
  
          let filter = ["emissionSource.id||$eq||"+es.data[0].id, "report.id||$eq||"+report.data[0].id]
  
          let exist = await this.serviceProxy.getManyBaseEsExcludeReasonControllerEsExcludeReason(
            undefined, undefined, filter, undefined, undefined, ['emissionSource'], 1000, 0, 1, 0
          ).toPromise()
          if (exist.data.length > 0){
            this.serviceProxy.updateOneBaseEsExcludeReasonControllerEsExcludeReason(exist.data[0].id, excluded).subscribe(res => console.log(res))
          } else {
            this.serviceProxy.createOneBaseEsExcludeReasonControllerEsExcludeReason(excluded).subscribe(res => console.log(res))
          }
        }
        
      })

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'has saved successfully',
        closable: true,
      });

    } catch (err) {
      console.log(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred, please try again',
        closable: true,
      });
    }
  }

}
