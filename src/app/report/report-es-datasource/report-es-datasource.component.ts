import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Unit, Project, Report, ServiceProxy, ProjectUnitEmissionSource, EsDatasource, EmissionCategory } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-report-es-datasource',
  templateUrl: './report-es-datasource.component.html',
  styleUrls: ['./report-es-datasource.component.css']
})
export class ReportEsDatasourceComponent implements OnInit {

  @Input() selectedUnit: Unit;
  @Input() selectedProject: Project;
  @Input() parentId: number;

  public roles = Roles
public userActions = UserActions

  emissionSources: any[] = [];
  esIds: any[] = []
  report: Report

  emissionCategories: EmissionCategory[];


  constructor(
    private serviceProxy :ServiceProxy,
    private messageService: MessageService,
    public appService: AppService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCategories();
    await this.getEmissionSources()
    await this.setInitials()
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
      let esDataSources = await this.serviceProxy.getManyBaseEsDatasourceControllerEsDatasource(
        undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
      ).toPromise()

      if (esDataSources.data.length > 0){
        esDataSources.data.map(data => {
          if (data.hiredDataSource !=='' || data.rentedDataSource !== '' || data.ownDataSource !== '' || data.noneDataSource !== ''){
            this.emissionSources = this.emissionSources.map(es => {
              if (es.esId === data.emissionSource.id){
                es.hiredSource = data.hiredDataSource
                es.rentedSource = data.rentedDataSource
                es.ownSource = data.ownDataSource
                es.noneSource = data.noneDataSource
               
                if(data.hiredCategory && data.hiredCategory.id){
                  let hc = this.emissionCategories.find(c => c.id === data.hiredCategory.id);
                  if(hc){
                    es.hiredCategory = hc;
                  }
                }
               
                es.rentedCategory = data.rentedCategory
                es.ownCategory = data.ownCategory
                es.noneCategory = data.noneCategory
              }
              return es
            })
          }
        })
      }
    }
  }

  async getEmissionSources(){
    let filters = [ "status||$ne||"+RecordStatus.Deleted];
    if(this.selectedProject && this.selectedUnit){
      filters.push("project.id||$eq||"+this.selectedProject.id);
      filters.push("unit.id||$eq||"+this.selectedUnit.id);

      let pu = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined, undefined, filters, undefined, undefined, undefined, 1000, 0, 1, 0).toPromise()

      if (pu) {
        let filter = [ "status||$ne||"+RecordStatus.Deleted, "projectUnit.id||$eq||"+pu.data[0].id]
        let pues = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
         pues.data.map((p: any)=> {
          if (p.emissionSource.id) {
            this.esIds.push(p.emissionSource.id)
            this.emissionSources.push({
              emissionSource: p.emissionSource.name,
              esId: p.emissionSource.id,
              hiredSource: '',
              rentedSource: '',
              ownSource: '',
              noneSource: '',
              hiredCategory: null,
              rentedCategory: null,
              ownCategory: null,
              noneCategory: null
            })
          }
          // return 
        })
      }
      
    }
  }

  async saveCSIData(){
    try {
     
      let esSourceList = await Promise.all(this.emissionSources.map(async _es => {
        let es  = await this.serviceProxy.getOneBaseEmissionSourceControllerEmissionSource(_es.esId, undefined, undefined, undefined).toPromise()

        let esSource = new EsDatasource()
        esSource.emissionSource = es
        esSource.report = this.report
        esSource.hiredDataSource = _es.hiredSource
        esSource.rentedDataSource = _es.rentedSource
        esSource.ownDataSource  = _es.ownSource
        esSource.noneDataSource = _es.noneSource

        esSource.hiredCategory = _es.hiredCategory && _es.hiredCategory.id ? _es.hiredCategory: undefined
        esSource.rentedCategory = _es.rentedCategory && _es.rentedCategory.id ? _es.rentedCategory: undefined
        esSource.ownCategory  = _es.ownCategory && _es.ownCategory.id ? _es.ownCategory: undefined
        esSource.noneCategory = _es.noneCategory && _es.noneCategory.id ?  _es.noneCategory: undefined

        return esSource;
      }))


      let res = await Promise.all(esSourceList.map(async _es => {
        let filter = ["emissionSource.id||$eq||" + _es.emissionSource.id, "report.id||$eq||" + this.report.id]
        try{
          let exist = await this.serviceProxy.getManyBaseEsDatasourceControllerEsDatasource(
            undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
          ).toPromise()
    
          if (exist.total > 0){
            try{
              await this.serviceProxy.updateOneBaseEsDatasourceControllerEsDatasource(exist.data[0].id, _es).toPromise();
              return true;
            }catch(err){
              return false;
            }
          } else {
            try{
              await this.serviceProxy.createOneBaseEsDatasourceControllerEsDatasource(_es).toPromise();
              return true;
            }catch(err){
              return false;
            }
          }
        }catch(err){
          return false;
        }
      }));

      let hasError  = res.some(r => !r)

      if(hasError){
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Some of records are not saved',
          closable: true,
        });
      }else{
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has saved successfully',
          closable: true,
        });
      }
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


  async getCategories(){
    try{
      let res =await this.serviceProxy
      .getManyBaseEmissionCategoryControllerEmissionCategory(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        100,
        0,
        0,
        0
      ).toPromise();
      this.emissionCategories = res.data;
    }catch(err){
      this.emissionCategories = [];
    }

  }

}
