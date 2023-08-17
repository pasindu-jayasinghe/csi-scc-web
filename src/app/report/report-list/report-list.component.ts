import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Unit, Project, ServiceProxy, ReportHistory, ReportControllerServiceProxy, GenerateDto } from 'shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
import { MasterDataService } from 'app/shared/master-data.service';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit, OnChanges {

  @Input() selectedUnit: Unit;
  @Input() selectedProject: Project;

  public roles = Roles
public userActions = UserActions

  public baseUrl:any = environment.baseUrlAPI;
  version: string = "";
  @Input() isCSIUser: boolean =false;
  @Input() isAuditor: boolean =false;
  isEnableGenerate: boolean = false

  constructor( 
    private serviceProxy: ServiceProxy,
    private reportControllerServiceProxy: ReportControllerServiceProxy,
    protected messageService: MessageService,
    private masterDataService: MasterDataService,
    public appService: AppService
  ) { 
    
  }

  hasUserActionAccessTo(){
    if(this.selectedUnit.parentUnit && this.selectedUnit.parentUnit.id){
      return this.appService.hasUserActionAccessTo(UserActions.REPORT_GENERATION) && this.appService.hasUserActionAccessTo(UserActions.ORGANISATION_WISE_REPORT_GENERATION);
    }else{
      return this.appService.hasUserActionAccessTo(UserActions.REPORT_GENERATION);
    }
  }

  reportHistoryList: ReportHistory[] = []

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.getReports();
    this.isEnableGenerate = await this.enableGenerate()
  }

  ngOnInit(): void {
  }

  getReports(){
    let filters = [ "status||$ne||"+RecordStatus.Deleted];

    if(this.selectedProject && this.selectedUnit){
      filters.push("project.id||$eq||"+this.selectedProject.id);
      filters.push("unit.id||$eq||"+this.selectedUnit.id);

      this.serviceProxy.getManyBaseReportHistoryControllerReportHistory(
        undefined,
        undefined,
        filters,
        undefined,
        undefined,
        ['unit','project'],
        100,
        0,
        0,
        0
      ).subscribe(res => {
        this.reportHistoryList = res.data;
        this.version = this.reportHistoryList[this.reportHistoryList.length-1].versionName
        // this.reportHistoryList = [...this.reportHistoryList,...this.reportHistoryList]
      })
    }
    
  }

  async generate(){
    if(this.selectedProject && this.selectedUnit){
     
      let types = [
        ...this.masterDataService.fireExtinguisherTypes,
        ...this.masterDataService.gWP_RGs,
        ...this.masterDataService.boilerTypes,
        ...this.masterDataService.fuelTypeBoilers,
        ...this.masterDataService.disposalMethods,
        ...this.masterDataService.disposalWasteTypes,
        ...this.masterDataService.cookingGasTypes,
        ...this.masterDataService.activities,
        ...this.masterDataService.fwTypes,
        ...this.masterDataService.fwSizes
      ]
      let body = new GenerateDto()
      body.versionName = this.version;
      body.unitId = this.selectedUnit.id
      body.projectId = this.selectedProject.id
      body.types = types
      try{
        let res = await this.reportControllerServiceProxy.generateReport(body).toPromise();
        this.getReports();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has generated successfully',
          closable: true,
        });
      }catch(err){
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }
    }
  }

  view(url: string){
    window.open(this.baseUrl +"/"+ url, "_blank");
  }

  async enableGenerate(){
    if (this.isAuditor){
      return false
    }
    let filters = ["status||$ne||" + RecordStatus.Deleted];
    if (this.selectedProject && this.selectedUnit) {
      filters.push("project.id||$eq||" + this.selectedProject.id);
      filters.push("unit.id||$eq||" + this.selectedUnit.id);

      try {
        let res = await this.serviceProxy.getManyBaseReportControllerReport(
          undefined,
          undefined,
          filters,
          undefined,
          undefined,
          ['unit', 'project', 'recommendations', 'nextSteps'],
          100,
          0,
          0,
          0
        ).toPromise();
        if ((res.total > 0 && res.data[0].allowClientGenerate) || this.isCSIUser){
          return true
        } else {
          return(false)
        }
      } catch (error) {
        return false
      }
    } else {
      return false
    }
  }

}
