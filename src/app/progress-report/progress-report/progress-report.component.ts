import { Component, OnInit } from '@angular/core';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService, RecordStatus } from 'shared/AppService';
import { EmissionBaseControllerServiceProxy, EmissionSource, ProgressDetailDto, ProgressDetailDtoEsCode, Project, ProjectStatus, PuesDataReqDtoSourceName, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';
import { ProgressDetailComponent } from '../progress-detail/progress-detail.component';
import * as XLSX from 'xlsx'; 
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.css']
})
export class ProgressReportComponent implements OnInit {
  public roles = Roles
public userActions = UserActions


  loggedUnit: Unit;
  unit:Unit
  projects: Project[] = []
  selectProject: Project;
  progressData: any = []

  esList: any[] = []
  totalRecords: number;
  excellist: any[] = [];
  isCSIUser: boolean = false;

  public ref: DynamicDialogRef;

  esWithOwnership = [
    PuesDataReqDtoSourceName.Business_travel, PuesDataReqDtoSourceName.Freight_rail, PuesDataReqDtoSourceName.Freight_road,
    PuesDataReqDtoSourceName.Freight_water, PuesDataReqDtoSourceName.Passenger_offroad, PuesDataReqDtoSourceName.Passenger_rail, PuesDataReqDtoSourceName.Passenger_water
  ]

  esWithGasType = [PuesDataReqDtoSourceName.Cooking_gas]

  ownershipPrefix = [
    {name: '-Own', code: '_Own'},
    {name: '-Hired', code: '_Hired'},
    {name: '-Rented', code: '_Rented'}
  ]

  gasTypePrefix = [
    {name: '- LP Gas', code: '_LP Gas'},
    {name: '- Biogas', code: '_Biogas'}
  ]

  completable: boolean = false


  constructor(
    private serviceProxy: ServiceProxy,
    private emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public appService: AppService,
    private masterDataService: MasterDataService
  ) {
   
  }

  //select project
  // { 
        // unit: unit
        // es: electricity 
        // completeness: complete | pending | no data 
  // }

  async ngOnInit(): Promise<void> {
    this.isCSIUser = this.appService.isCSIUser()
    let u = await this.appService.getLogedUnit();
    if(u){
      this.loggedUnit = u;
    }
    this.getProjects();
    // this.getEmissionSources();
    this.completable = this.appService.hasUserActionAccessTo(UserActions.COMPLENESS_CHECK_VERIFY)
  }


  async getProjects() {
    console.log(this.isCSIUser);
    
    if(!this.isCSIUser){
      let filters = ["status||$ne||"+RecordStatus.Deleted,"project.status||$ne||"+RecordStatus.Deleted,"project.projectStatus||$ne||"+ProjectStatus.Initial]
      filters.push("unit.id||$eq||"+this.loggedUnit.id);
      const res = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined,
        undefined,
        filters,      
        undefined,
        undefined,
        ['unit','project','ownerUnit'],
        100,
        0,
        0,
        0
      ).toPromise();
      // console.log(res.data);

      let pIds = Array.from(new Set(res.data.map(item => item.project.id)));      
      let projects = res.data
        .filter(pu => pIds.includes(pu.project.id) && pu.project.status == RecordStatus.Active && pu.project.projectStatus !== ProjectStatus.Initial)
        .map(item => item.project);
      this.projects = projects;
    }else{
      let filters = ["status||$ne||" + RecordStatus.Deleted, "projectStatus||$ne||" + ProjectStatus.Initial];
      if(this.appService.isOnlyForcalPoint()){
        let ids = this.appService.getAllowedFtProjectIds();
        if(ids.length > 0){
          filters.push("id||$in||"+ids.join(","))
        }
      }
      this.serviceProxy.getManyBaseProjectControllerProject(
        undefined,
        undefined,
        filters,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).subscribe(res => {
        this.projects = res.data;
      })
    }    
  }

  async getOwnerUnit(projectId: number){
    try{
      let res = await this.serviceProxy.getOneBaseProjectControllerProject(projectId, undefined, undefined, undefined).toPromise();
      return res.ownerUnit.id;
    }catch(err){
      return 0;
    }
  }

  async getEmissionSources(){
    try{
      let filters = [ "status||$ne||"+RecordStatus.Deleted];
      let res = await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
        undefined, 
        undefined, 
        filters, 
        undefined, 
        undefined, 
        undefined, 
        1000, 
        0, 
        1, 
        0
      ).toPromise();
      // this.esList = res.data;
      res.data.map(e => {
        if (this.esWithOwnership.includes(e.code as unknown as PuesDataReqDtoSourceName)){
          this.ownershipPrefix.forEach(pre => {
            this.esList.push({name: e.name + pre.name, code: e.code + pre.code})
          })
        } else if (this.esWithGasType.includes(e.code as unknown as PuesDataReqDtoSourceName)){
          this.gasTypePrefix.forEach(pre => {
            this.esList.push({name: e.name + pre.name, code: e.code + pre.code})
          })
        } else {
          this.esList.push({name: e.name, code: e.code})
        }
      })
    }catch(err){
      this.esList = []
    }
  }

  async onSelectProject(){
    // console.log("onSelectProject")
    this.esList = []
    // console.log(this.selectProject);
    await this.load({})
  }

  async load(event: LazyLoadEvent){
    this.totalRecords = 0;
    let ownerUnitId = this.selectProject.ownerUnit.id;
    if(!ownerUnitId){
      ownerUnitId =  await this.getOwnerUnit(this.selectProject.id);
    }
    this.progressData = await this.emissionBaseControllerServiceProxy.getProgressData(this.selectProject.id, ownerUnitId).toPromise()
    // console.log("res", this.progressData)
    for await (let _data of this.progressData){
      Object.keys(_data).forEach(key => {
        if (Array.isArray(_data[key])){
          let name = _data[key][0].esName
          let code = _data[key][0].es
          const isFound = this.esList.some(e => {
            if (e.name === name && e.code === code) {
              return true;
            } else{
              return false;
            }
          });
          if (!isFound){
            this.esList.push({name: name, code: code,  status: _data[key][0].completeness})
          } else {
            this.esList = this.esList.map(obj => {
              if (obj.name === name && obj.code === code && obj.status === 'NOT_ASSIGNED'){
                obj.status = _data[key][0].completeness 
              }
              return obj
            })
          }
        }
      })
    }
    this.esList = this.esList.filter(es => es.status !== 'NOT_ASSIGNED')
    this.esList.sort((a,b) => a.code - b.code)
    console.log(this.esList)
  }

  getValue(arr: any){
    if (arr !==undefined){
      if (arr[0].completeness === 'COMPLETED'){
        return '#25933D'
      } else if (arr[0].completeness === 'PARTIAL'){
        return '#F0B61F'
      } else if (arr[0].completeness === 'NOT_ENTERED'){
        return '#FF1616'
      } else if (arr[0].completeness === 'NOT_ASSIGNED'){
        return '#747478'
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  getCursor(arr: any){
    if (arr !== undefined) {
      if (arr[0].completeness === 'COMPLETED') {
        return 'pointer'
      } else if (arr[0].completeness === 'PARTIAL') {
        return 'pointer'
      } else if (arr[0].completeness === 'NOT_ENTERED') {
        return 'pointer'
      } else if (arr[0].completeness === 'NOT_ASSIGNED') {
        return '#747478'
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  click(arr: any){
    if (arr !== undefined && arr.length !== 0){
      console.log("clicked", arr[0])
      this.ref = this.dialogService.open(ProgressDetailComponent, {
        header: 'Progress detail - ' + arr[0].unitName,
        width: arr[0].isEC ? '55%' : '99%',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
        baseZIndex: 10000,
        data: {data: arr[0], projectId: this.selectProject.id},
        closable: true
      });
    }
  }

  setCurser(){
    return "pointer"
  }

  getToolTip(arr: any){
    if (arr !== undefined && arr.length !== 0){
      if (arr[0]['noUnitDetail'] !==undefined || arr[0]['noEmpCount'] !== undefined){
        if (arr[0]['noEmpCount']){
          return 'Note: Unit details has not been filled for this unit. Please fill the unit details and enter the number of employees to get the progress.'
        } else if(arr[0]['noUnitDetail']){
          return 'Note: Number of employess has not been entered for this unit. Please enter the number of units to get the progress.'
        } else {
          return ''
        }
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  setAsCompleted(){
    this.confirmationService.confirm({
      message: 'Are you sure you want to complete the project?',
      header: 'Complete Project Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.selectProject.projectStatus = ProjectStatus.Data_Completed;

        this.serviceProxy.updateOneBaseProjectControllerProject(this.selectProject.id, this.selectProject)
          .subscribe(res => {
            if (res) {
              console.log('Project completed successfully')
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project completed successfully',
                closable: true,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Project completion failed',
                closable: true,
              });
            }
          })
      },
      reject: () => { },
    })
  }

  async downloadExcel() {
    let headers = [
      'Meter no', 'Fuel Type', 'Gas type', 'Weight per tank', 'Generator no', 'Refrigerant type', 'Waste type',
      'Treatment Method', 'Parameter', 'Vehicle No', 'Cargo type', 'Distance Based / Fuel Based', 'Route', 'Machine type'
    ]
    let months = this.masterDataService.months
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ header: 'Progress report' }], { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    let emissionSourceDetails: any = {}
    this.progressData.forEach((data: any) => {
      let obj: any = {}
      Object.keys(data).forEach((key) => {
        if (key === 'unitName') {
          obj[key] = data[key]
        } else if (key !== 'unitId') {
          obj[key] = data[key][0]['completeness']
          if (emissionSourceDetails[key]) {
            emissionSourceDetails[key].push(data[key][0])
          } else {
            emissionSourceDetails[key] = [data[key][0]]
          }
        }
      })
      this.excellist.push(obj)
    })
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.utils.sheet_add_json(ws, this.excellist, { skipHeader: false, origin: "A3" });

    for await (let key of Object.keys(emissionSourceDetails)){
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(wb, ws, key);
      let length = 3;
      let tableHeaders: string[] = []
      for await (let source of emissionSourceDetails[key]) {
        let req = new ProgressDetailDto()
        req.esCode = key as unknown as ProgressDetailDtoEsCode
        req.projectId = this.selectProject.id
        req.unitId = source.unit
        req.parameters = source.parameters
        // let acData = await this.emissionBaseControllerServiceProxy.modifyActivityData(req).toPromise()
        let acData: any[] = []
        if (!source.isEC){
          let res = await this.emissionBaseControllerServiceProxy.generateActivityData(req).toPromise()
          // acData = acData.map((d: any) => {
          //   delete d.code
          //   return d
          // })
          res.data.map((data: any) => {
            let obj: any = {}
            Object.keys(data).forEach(key => {
              let m = months.find(o => o.value === parseInt(key))
              if (m){
                obj[m.name] = data[key]
              } else {
                let m
                if (res.rows[1]){ 
                  m = res.rows[1].find((o:any) => o.code === key)
                } else {
                  m = res.rows[0].find((o:any) => o.code === key)
                }
                if (m){
                  obj[m.name] = data[key]
                }
              }
            })
            acData.push(obj)
            if (tableHeaders.length === 0){
              for (let header of Object.keys(obj)){
                console.log(header)
                if (headers.includes(header)){
                  tableHeaders.push(header)
                }
              }
              months.forEach(m => tableHeaders.push(m.name))
            }
          })
        } else {
          acData = [
            {'': 'Required', 'sample-paid': source.paidSample, 'sample-Not paid': source.notPaidSample, 'total-paid': source.paidTotal, 'total-Not paid': source.notPaidTotal},
            {'': 'Uploaded', 'sample-paid': source.uploadedPaid, 'sample-Not paid': source.uploadedNotPaid, 'total-paid': source.uploadedPaid, 'total-Not paid': source.uploadedNotPaid},
          ]
        }
        
        XLSX.utils.sheet_add_json(ws, [{ header: source.unitName }], { skipHeader: true, origin: "A" + (length - (source.isComplete ? 2 : 1)) });
        if (source.isComplete){
          XLSX.utils.sheet_add_json(ws, [{header: "This unit has been marked as completed"}], { skipHeader: true , origin: "A" + (length-1) });
        }
        if (acData.length === 0){
          acData = [{'':"No data entered for this unit"}]
          XLSX.utils.sheet_add_json(ws, acData, { skipHeader: false, origin: "A" + length});
        } else {
          XLSX.utils.sheet_add_json(ws, acData, { skipHeader: false, origin: "A" + length , header: tableHeaders});
        }
        length = length + acData.length + 5
      }
    }


    XLSX.writeFile(wb, 'Progress report.xlsx');
    this.excellist = []
  }

}
