import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Unit, Project, Recomendation, NextStep, Report, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-report-basic-info',
  templateUrl: './report-basic-info.component.html',
  styleUrls: ['./report-basic-info.component.css']
})
export class ReportBasicInfoComponent implements OnInit {

  @Input() selectedUnit: Unit;
  @Input() selectedProject: Project;
  @Output() savedId = new EventEmitter<number>();

  public roles = Roles
public userActions = UserActions

  dataGatheringMethods: string[] = ['Invoice', 'Central db']
  selectedDataGatheringMethods:string[] = [];
  lessOrGreater: string[] = ['Less than', 'Greater than']

  recomandations: Recomendation[] = []
  nextSteps: NextStep[] = []

  reportData: Report = new Report();

  constructor(
    private serviceProxy: ServiceProxy,
    private messageService: MessageService,
    public appService: AppService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.reportData= new Report();
    this.getData();
  }

  ngOnInit(): void {
    this.getRecomandations();
    this.getNextSteps();
  }

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
          this.selectedDataGatheringMethods = this.reportData.dataGatheringMethods.split(",");

          let convertTime = moment(this.reportData.proposedDate).format("YYYY-MM-DD HH:mm:ss");
          let convertTimeObject = new Date(convertTime);
          //@ts-ignore
          this.reportData.proposedDate = convertTimeObject;
        }
      }catch(err){
        console.log(err);
      }
    }
  }


  getRecomandations(){
    this.serviceProxy
      .getManyBaseRecomendationControllerRecomendation(
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
      ).subscribe((res: any) => {
        this.recomandations = res.data;

      })
  }

  getNextSteps(){
    this.serviceProxy
      .getManyBaseNextStepsControllerNextStep(
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
      ).subscribe((res: any) => {
        this.nextSteps = res.data;
      })
  }

  async saveCSIData(){
  
    this.reportData.dataGatheringMethods = this.selectedDataGatheringMethods ?this.selectedDataGatheringMethods.join(",") : ''

    try{
      if(this.reportData.id){
        this.reportData = await this.serviceProxy.updateOneBaseReportControllerReport(this.reportData.id,this.reportData).toPromise();  
        this.savedId.emit(this.reportData.id)    
      }else{
        if(this.selectedUnit && this.selectedProject){
          this.reportData.project = this.selectedProject;
          this.reportData.unit = this.selectedUnit;
          this.reportData = await this.serviceProxy.createOneBaseReportControllerReport(this.reportData).toPromise();
          this.savedId.emit(this.reportData.id)
        }
      }
     
      let convertTime = moment(this.reportData.proposedDate).format("YYYY-MM-DD HH:mm:ss");
      let convertTimeObject = new Date(convertTime);
      //@ts-ignore
      this.reportData.proposedDate = convertTimeObject;
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
