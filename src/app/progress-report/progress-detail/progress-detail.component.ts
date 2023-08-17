import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService, RecordStatus } from 'shared/AppService';
import { UserActions } from 'shared/service-proxies/auth-service-proxies';
import { EmissionBaseControllerServiceProxy, EmissionSourceControllerServiceProxy, ProgressDetailDto, ProjectEmissionSourceControllerServiceProxy, PuesDataReqDtoSourceName, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-progress-detail',
  templateUrl: './progress-detail.component.html',
  styleUrls: ['./progress-detail.component.css']
})
export class ProgressDetailComponent implements OnInit {
  data: any;

  companyProfiles: any[] = [];
  types:string[] = []
  isShowTypes: boolean = false

  columns:any[] = []
  acData: any[] = []
  ecData: any[] = []
  projectId:number

  completable: boolean = false
  

  constructor(
    private serviceProxy: ServiceProxy,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private appService: AppService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.initialize()
    this.showTypes(this.data.es)
    this.completable = this.appService.hasUserActionAccessTo(UserActions.COMPLENESS_CHECK_VERIFY)
  }

  async initialize(){
    this.data = this.config.data.data
    this.projectId = this.config.data.projectId


    let req = new ProgressDetailDto()
    req.esCode = this.data.es
    req.projectId = this.projectId
    req.unitId = this.data.unit
    req.parameters = this.data.parameters

    // this.acData = await this.emissionBaseControllerServiceProxy.modifyActivityData(req).toPromise()
    // console.log(this.acData)

    // this.columns = [
    //     {name: "Parameter", code: "Parameter"},
    //     {name: "January", code: "January"},
    //     {name: "February", code: "February"},
    //     {name: "March", code: "March"},
    //     {name: "April", code: "April"},
    //     {name: "May", code: "May"},
    //     {name: "June", code: "June"},
    //     {name: "July", code: "July"},
    //     {name: "August", code: "August"},
    //     {name: "September", code: "September"},
    //     {name: "October", code: "October"},
    //     {name: "November", code: "November"},
    //     {name: "December", code: "December"},
    //     {name: "All", code: "All"},

    // ]



    if (this.data.isEC) {
      this.ecData.push({
        paidTotal: this.data.paidTotal,
        notPaidTotal: this.data.notPaidTotal,
        paidSample: this.data.paidSample,
        notPaidSample: this.data.notPaidSample,
        uploadedPaid: this.data.uploadedPaid,
        uploadedNotPaid: this.data.uploadedNotPaid,
      })
    } else {
      let res = await this.emissionBaseControllerServiceProxy.generateActivityData(req).toPromise()
      console.log(res)
      if (res) {
        this.columns = res.rows
        this.acData = res.data
      }
    }
    console.log(this.ecData)


  }

  showTypes(esCode: any){
    switch(esCode){
      case PuesDataReqDtoSourceName.Refrigerant:
        this.isShowTypes = true
        this.types.push(...this.masterDataService.gWP_RGs.map(m => m.name)) 
        break;
    }
  }

  getValue(val: number){
    if (val === 0) {
        return '-'
    } else {
        return val
    }
  }

  async setAsCompleted() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to complete this unit?',
      header: 'Complete Unit Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: async () => {
        let filters = []
        filters.push("project.id||$eq||" + this.projectId);
        filters.push("unit.id||$eq||" + this.data.unit);

        let pu = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
          undefined, undefined, filters, undefined, undefined, undefined, 1000, 0, 1, 0).toPromise()

        if (pu) {
          let filter = [
            "status||$ne||" + RecordStatus.Deleted,
            "projectUnit.id||$eq||" + pu.data[0].id,
            "emissionSource.code||$eq||" + this.data.es
          ]
          let pues = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
            undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
          ).toPromise()

          pues.data[0].isComplete = true
          this.serviceProxy.updateOneBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(pues.data[0].id, pues.data[0])
            .subscribe(res => {
              if (res) {
                console.log('Unit completed successfully')
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Unit completed successfully',
                  closable: true,
                });
                this.ref.close()
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Unit completion failed',
                  closable: true,
                });
                this.ref.close()
              }
            })
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Project unit not found',
            closable: true,
          });
          this.ref.close()
        }

      },
      reject: () => { },
    })
  }

}
