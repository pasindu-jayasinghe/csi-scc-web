import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Project, Report, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-capproach-des',
  templateUrl: './capproach-des.component.html',
  styleUrls: ['./capproach-des.component.css']
})
export class CapproachDesComponent implements OnInit {
  public roles = Roles
public userActions = UserActions

  constructor(
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    public appService: AppService
  ) { 
  
  }
   sss:string =""
  @Input() selectedUnit: Unit;
  @Input() selectedProject: Project;
  @Input() parentId: number;

  reportData: Report = new Report();
  ngOnInit(): void {
    this.getData();
   
  }

  initialize(){
   this.reportData.standardAndApproach = "test text"  }
  


  async getData(){
    let filters = [ "status||$ne||"+RecordStatus.Deleted];
    if(this.selectedProject && this.selectedUnit){
      filters.push("project.id||$eq||"+this.selectedProject.id);
      filters.push("unit.id||$eq||"+this.selectedUnit.id);

      try{
        let res = await this.serviceProxy.getManyBaseReportControllerReport(
          undefined,
          undefined,
          filters,
          undefined,
          undefined,
          ['unit','project','recommendations','nextSteps'],
          100,
          0,
          0,
          0
        ).toPromise();
  
        if(res.total > 0){
          this.reportData=res.data[0];
          this.parentId  = this.reportData.id
          // this.selectedDataGatheringMethods = this.reportData.dataGatheringMethods.split(",");

          // let convertTime = moment(this.reportData.proposedDate).format("YYYY-MM-DD HH:mm:ss");
          // let convertTimeObject = new Date(convertTime);
          // //@ts-ignore
          // this.reportData.proposedDate = convertTimeObject;
        } else {
        //  this.parentId = undefined
        }
      }catch(err){
        console.log(err);
      }
    }
  }


  async saveCSIData(){
 //   this.reportData.dataGatheringMethods = this.selectedDataGatheringMethods ?this.selectedDataGatheringMethods.join(",") : ''

    try{
      if(this.reportData.id){
        this.reportData = await this.serviceProxy.updateOneBaseReportControllerReport(this.reportData.id,this.reportData).toPromise();  
        // this.savedId.emit(this.reportData.id)    
      }else{
        if(this.selectedUnit && this.selectedProject){
          // this.reportData.project = this.selectedProject;
          // this.reportData.unit = this.selectedUnit;
          // this.reportData = await this.serviceProxy.createOneBaseReportControllerReport(this.reportData).toPromise();
          // this.savedId.emit(this.reportData.id)
        }
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'has saved successfully',
        closable: true,
      });
    }catch(err){
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
