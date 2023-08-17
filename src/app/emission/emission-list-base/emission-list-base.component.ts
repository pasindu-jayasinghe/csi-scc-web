import { Component, OnInit } from '@angular/core';
import { EvidenceRequestComponent } from 'app/verification/evidence-request/evidence-request.component';
import { LazyLoadEvent, MessageService, SortEvent } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService, ProjectTypes, RecordStatus, SavedData } from 'shared/AppService';
import { Roles, UserAction, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Fuel } from 'shared/service-proxies/es-service-proxies';
import { Unit, Project, ServiceProxy, User, ProjectUnitEmissionSource, PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';
import { ExcelDownloadDialogComponent } from '../excel-download-dialog/excel-download-dialog.component';
import { ExcellUplodDialogComponent } from '../excell-uplod-dialog/excell-uplod-dialog.component';
import { GuidanceVideoComponent } from '../guidance-video/guidance-video.component';

@Component({
  selector: 'app-emission-list-base',
  templateUrl: './emission-list-base.component.html',
  styleUrls: ['./emission-list-base.component.css']
})
export class EmissionListBaseComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions


  creatable: boolean = false;
  excellUploadable: boolean = false;
  editable: boolean = false;
  viewable: boolean = true;
  deletable: boolean = false;
  downloadable: boolean = false;
  requestable: boolean = false;
  parameterUnits: any;
  projectType: ProjectTypes;

  constructor(protected appService: AppService, protected serviceProxy: ServiceProxy, protected dialogService: DialogService,protected messageService: MessageService) {
    
  }

  public get projectTypesEnum(): typeof ProjectTypes {
    return ProjectTypes; 
  }

  isAnyAdmin: boolean = false;
  selectedUnit: Unit;
  selectedProject: Project;
  isCSIUser: boolean =false;
  isAuditor: boolean = false;
  public ref: DynamicDialogRef;


  fuels: Fuel[] = []

  logedUser: User;

  currectSearchField:string ="";
  currectOrder:number|undefined;
  orderText: string[]|undefined = undefined;
  private childRefrence:any;
  deleteConfirm:boolean = false;

  setChildReference(c: any){
    this.childRefrence =c;
  }

  selected: any[] = [];
  selectAll: boolean = false;

  async ngOnInit() {
    this.appService.projectType.subscribe(p => this.projectType = p);
    let selectedProjectString = localStorage.getItem(SavedData.SelectedProject);
    if(selectedProjectString){
      let sp = new Project();
      sp.init(JSON.parse(selectedProjectString));
      this.selectedProject =sp;
      // console.log("selectedProject", this.selectedProject)
    }

    this.parameterUnits = this.appService.parameterUnits;
    this.isAnyAdmin = this.appService.isAnyAdmin()
    this.isCSIUser = this.appService.isCSIUser();
    this.isAuditor = this.appService.isAuditor();
    let u = await this.appService.getUser();
    if(u){
      this.logedUser = u;
    }

    if(!this.isAnyAdmin){
      let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
    }
    this.setAccess();    
    await this.initFuelList();
  }

  setAccess(){
    if(this.isAnyAdmin){
      this.viewable = true;
      let hasActions = this.checkActions()
      this.creatable = hasActions.add;
      this.editable = hasActions.edit;
      this.deletable = hasActions.delete;
      this.excellUploadable = hasActions.excel
      this.downloadable = hasActions.download
    }
    if (this.isAuditor){
      this.requestable = this.appService.hasUserActionAccessTo(UserActions.REQUEST_EVIDENCE)
    }
  }

  async changeAccess(sourceName: PuesDataReqDtoSourceName){
    if(this.selectedProject && this.selectedUnit){
      // console.log(this.selectedProject.id, this.selectedUnit.id);
      let pu = await this.getPU();
      // console.log("pu ---- ", pu);
      if(pu){
        let puesIds = pu.projectUnitEmissionSources.map(pues => pues.id);
        let pues = await this.getPUES(puesIds, sourceName);
        // let pues_  = pu.
        if(pues){
          // console.log("pues.id -- ",pues.id)
          let assigned = await this.getAssignedES(pues);
          let hasActions = this.checkActions()
          console.log("assigned --- ",hasActions);
          if(assigned){
            this.editable = (assigned.edit && hasActions.edit);
            this.deletable = (assigned.delete && hasActions.delete);
            this.creatable = (assigned.add && hasActions.add);
            this.excellUploadable = (assigned.add && hasActions.excel);
            this.downloadable = hasActions.download
          } else {
            this.editable = hasActions.edit
            this.deletable = hasActions.delete
            this.creatable = hasActions.add
            this.excellUploadable = hasActions.excel
            this.downloadable = hasActions.download
          }
        }
      }
    }
    if (this.isAuditor){
      this.requestable = this.appService.hasUserActionAccessTo(UserActions.REQUEST_EVIDENCE)
    }
  }

  checkActions(){
    return {
      add: this.appService.hasUserActionAccessTo(UserActions.DATA_ENTER),
      edit: this.appService.hasUserActionAccessTo(UserActions.DATA_EDIT),
      delete: this.appService.hasUserActionAccessTo(UserActions.DATA_DELETE),
      excel: this.appService.hasUserActionAccessTo(UserActions.EXCEL_UOLOAD_DATA_ENTER),
      download: this.appService.hasUserActionAccessTo(UserActions.DATA_DOWNLOAD)
    }
  }


  async getPU(){
    try{
      const res = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined,
        undefined,
        [ "unit.id||$eq||" + this.selectedUnit.id, "project.id||$eq||" + this.selectedProject.id , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        ['unit','project'],
        1,
        0,
        0,
        0
      ).toPromise();
      if(res.data.length>0){
        return res.data[0];
      }
      return null;
    }catch(err){
      console.log(err);
      return null;
    }
  }

  async getPUES(ids: number[], sourceName: PuesDataReqDtoSourceName){
    const res = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
      undefined,
      undefined,
      ["id||$in||"+ids.join(","),"emissionSource.code||$eq||"+sourceName, "status||$ne||"+RecordStatus.Deleted],      
      undefined,
      undefined,
      ['emissionSource'],
      1,
      0,
      0,
      0
    ).toPromise();

    if(res.data.length >0){
      return res.data[0];
    }

    return null;
  }

  async getAssignedES(pues: ProjectUnitEmissionSource){
    try{
      const res = await this.serviceProxy.getManyBaseAssignedESsControllerAssignedES(
        undefined,
        undefined,
        [ "user.id||$in||" + this.logedUser.id, "pues.id||$eq||" + pues.id , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        ['user','pues'],
        1,
        0,
        0,
        0
      ).toPromise();
      if(res.data.length > 0){
        return res.data[0]
      }
      return null;
    }catch(err){
      console.log(err);
      return null;
    }
  }

  uploadExcell(sourceName: PuesDataReqDtoSourceName, component: any = null) {
    let ref = this.dialogService.open(ExcellUplodDialogComponent, {
      header: 'Upload Excel',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: sourceName,
      },
    });

    ref.onClose.subscribe(() => {
      if(component){
        component.load({})
      }
    })
  }

  downloadExcel(sourceName: PuesDataReqDtoSourceName, component: any = null){
    console.log("downloadExcel")
    let ref = this.dialogService.open(ExcelDownloadDialogComponent, {
      header: 'Download Excel',
      width: '50%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: sourceName,
      },
    })

    ref.onClose.subscribe(() => {
      if(component){
        component.load({})
      }
    })
  }

  async onCheck(data: any, code: PuesDataReqDtoSourceName){
    let project = await this.serviceProxy.getOneBaseProjectControllerProject(data.project.id, undefined, undefined, 0).toPromise()
    let _data = {data: data, unit: data.unit.name, type:code, project: project, user: this.logedUser, isRequest: true} //parameter: event.parameter
    this.ref = this.dialogService.open(EvidenceRequestComponent, {
      header: "Add evidence request",
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: _data,
      closable: false
    });
  }

  async initFuelList(){
    if(this.fuels.length < 1){
      this.fuels  = await this.appService.getFuels();
      // console.log(this.fuels);
    }
  }

  getFuelName(code: string){
    let m = this.fuels.find(o => o.code === code)
    return m?.name
  }

  getMonth(month: number){
    let m = this.appService.getMonths().find(o => o.value === month)
    return m?.name
  }

  // customSort(event: SortEvent) {
  //   console.log(this.currectSearchField,event.field ,this.currectOrder,event.order )
  //   if(event.field && (this.currectSearchField !== event.field || this.currectOrder !== event.order) ){

  //     let order = event.order && event.order===1? "ASC":"DESC"
  //     this.orderText = [event.field+","+order]
  //     this.currectSearchField = event.field;
  //     this.currectOrder = event.order
  //   }else{
  //     this.orderText = undefined;
  //   }    

  //   if(this.orderText){  
  //     console.log(this.orderText);
  //     this.childRefrence.load({})
  //   }
  // }

  setSortText(event: LazyLoadEvent){
    this.orderText = undefined;
    if(event.sortField && (this.currectSearchField !== event.sortField || this.currectOrder !== event.sortOrder) ){
      let order = event.sortField && event.sortOrder===1? "ASC":"DESC"
      this.orderText = [event.sortField+","+order]
      this.currectSearchField = event.sortField;
      this.currectOrder = event.sortOrder
    }else{
      this.orderText = undefined;
    }
  }


  isRowSelectable() {
    return true;
  }

  deleteAll(es: string){    
    this.appService.bulkDelete(es,this.selected.map(s =>s.id),this,true);
  }

  deleteAllNetZero(service:any){  
    
    this.childRefrence.confirmationService.confirm({
      message: 'These data cannot be recovered again',
      header: 'Are you sure? Do you want to delete all select data?',
      acceptIcon: 'icon-not-visible',
      acceptLabel: 'Delete All',
      rejectLabel: 'Cancel',
      accept: async () => {
       
        try{
          await service.deleteSelectedALL(this.selected.map(s =>s.acData_groupNo)).toPromise();
          this.deleteAllSuccess();
        }catch(er){
          console.log(er);
          this.deleteAllFailed();
        }
      },
      reject: () => {
        
      }
    });
  }

  deleteAllFailed(){
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred, please try again',
      closable: true,
    });
  }

  deleteAllSuccess(){
    this.childRefrence.load({});
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'has deleted successfully',
      closable: true,
    });
  }

  onSelectionChange(value = []) {
   
    this.selected = value;
    // console.log("work2",this.selected)
  }

  onSelectAllChange(event: any[]) {
    console.log("work1",event)
    this.selected = event;
  }
  

  listLoadable(){
    if(this.isAuditor){
      return  this.selectedProject;
    }else{
      return this.selectedUnit  && this.selectedProject;
    }
    // return this.listLoadable()
  }

  watchVideo(sourceName: PuesDataReqDtoSourceName){
    let ref = this.dialogService.open(GuidanceVideoComponent, {
      header: 'Guidance Video',
      width: '60%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        sourceName: sourceName,
      },
    });

    ref.onClose.subscribe(() => {
      
    })
  }
}
