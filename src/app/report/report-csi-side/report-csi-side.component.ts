import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Project, ReportControllerServiceProxy, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';
import { Recomendation, NextStep, Report } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-report-csi-side',
  templateUrl: './report-csi-side.component.html',
  styleUrls: ['./report-csi-side.component.css']
})
export class ReportCsiSideComponent implements OnInit {

  @Input() selectedUnit: Unit;
  @Input() selectedProject: Project;

  parentId: any = undefined;
 
  public roles = Roles
public userActions = UserActions

  csiFormGroup: FormGroup = this._fb.group({
    dissemination: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
    dataGatheringMethods: ['', [Validators.required]],
    recomandations: [[], [Validators.required]],
    nextSteps: [[], [Validators.required]],
    attempt:   [[], [Validators.required]],
    ISOStandard:   [[], [Validators.required]],
    Pr_ISOStandard: [[], [Validators.required]],
    proposed_Date: [[], [Validators.required]],
    proposalNumber: [[], [Validators.required]],
  });

  reportData: Report = new Report();
  constructor(
    protected messageService: MessageService,
    public appService: AppService,
    private _fb: FormBuilder, 
    private serviceProxy: ServiceProxy,
    private reportControllerServiceProxy: ReportControllerServiceProxy,
  ) { 
    this.getData()
  }



  ngOnChanges(changes: SimpleChanges): void {
    this.reportData= new Report();
    this.getData();
  }

  async ngOnInit() {
    this.getData();
  }


  async saveCSIData(){
    let data = this.csiFormGroup.value;
    this.reportData.dataGatheringMethods = data['dataGatheringMethods']?data['dataGatheringMethods'].join(",") : ''

    try{
      if(this.reportData.id){
        this.reportData = await this.serviceProxy.updateOneBaseReportControllerReport(this.reportData.id,this.reportData).toPromise();      
      }else{
        if(this.selectedUnit && this.selectedProject){
          this.reportData.project = this.selectedProject;
          this.reportData.unit = this.selectedUnit;
          this.reportData = await this.serviceProxy.createOneBaseReportControllerReport(this.reportData).toPromise();
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

  async getUnAsignedESList(){

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
          this.parentId  = this.reportData.id
          // this.selectedDataGatheringMethods = this.reportData.dataGatheringMethods.split(",");

          // let convertTime = moment(this.reportData.proposedDate).format("YYYY-MM-DD HH:mm:ss");
          // let convertTimeObject = new Date(convertTime);
          // //@ts-ignore
          // this.reportData.proposedDate = convertTimeObject;
        } else {
          this.parentId = undefined
        }
      }catch(err){
        console.log(err);
      }
    }
  }

  onSave(e: any){
    this.parentId = e
  }

  onUpdateCheck(e: any){
    console.log(e)
    this.reportControllerServiceProxy.allowClientToGenerate((this.reportData.id).toString(), e.checked as string).subscribe(res => {
      console.log(res)
    })
    
  }

}
