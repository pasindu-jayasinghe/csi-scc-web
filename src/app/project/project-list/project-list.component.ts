import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectControllerServiceProxy, ProjectStatus, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { LoginProfileControllerServiceProxy, Roles, ServiceProxy as AuthServiceProxy, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import { AppService, csiRoles,   RecordStatus, SavedData } from 'shared/AppService';



@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})

export class ProjectListComponent implements OnInit, AfterViewInit{

  public roles = Roles
  public userActions = UserActions

  rows: number = 10;
  loading: boolean;
  projectDataList: Project[];
  paymentAddingProject: Project;
  refNo: string =""
  totalRecords: number;
  projectStatusList: ProjectStatus[] = []
  selectUnit: Unit;
  parentUnits: Unit[] = [];

  display:boolean = false
  displayAddPaymentInfo:boolean = false
  isEdit: boolean = false
  header: string 
  auditors: User[] = []
  auditor: User
  verificationProject: Project
  units: Unit[];
  selectUnitId: number;
  isAllData: boolean = true
  isFM: boolean = true

  constructor(
    private serviceProxy: ServiceProxy, 
    private authServiceProxy: AuthServiceProxy,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private router: Router,
    protected messageService: MessageService,
    private activatedRoute:ActivatedRoute, // {relativeTo:this.activatedRoute}
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private loginProfileServiceProxy: LoginProfileControllerServiceProxy,
    public appService: AppService

  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  
  async ngOnInit(): Promise<void> {
    this.isFM = this.appService.isFM();
    // console.log(Object.values(ProjectStatus).filter(a=>!a.toString().includes("_")));

    this.projectStatusList = Object.values(ProjectStatus).filter(a=>!a.toString().includes("_") && a.toString() !== "Initial" ) as ProjectStatus[];
    await this.loadAuditors();
    // this.load({});
    this.getUnits()
  }

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.totalRecords = 0;
    let filter = [ "status||$ne||"+RecordStatus.Deleted, "projectStatus||$ne||"+ProjectStatus.Initial]
    if (this.selectUnitId) {
      filter.push("ownerUnit.id||$eq||"+this.selectUnitId)
    }

    let pageNumber = (event.first === 0 || event.first == undefined) ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    if(this.appService.isOnlyForcalPoint()){
      let ids = this.appService.getAllowedFtProjectIds();
      if(ids.length > 0){
        filter.push("id||$in||"+ids.join(","))
      }
    }

    if(this.isFM){
      filter.push("projectStatus||$in||"+ProjectStatus.New+","+ProjectStatus.Payment_Pending)
    }

    this.serviceProxy.getManyBaseProjectControllerProject(
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      undefined,
      this.rows,
      0,
      pageNumber,
      0
    ).subscribe(res => {

      this.totalRecords =res.total;
      this.projectDataList = res.data;
      this.loading = false;

      this.projectDataList = res.data.map(_res => {
        if (_res.projectStatus === ProjectStatus.Verification_Pending) {
          let a = this.auditors?.find(o => o.id === _res.verifier.id)
          if (a) _res.verifier = a
        }
        return _res
      })
    })

  }


  new(){
    this.router.navigate(['../create'], {relativeTo:this.activatedRoute});
  }

  edit(id: number) {
    this.router.navigate(['../edit'], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../view'], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  onDeleteClick(id: number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the project?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(id);
      },
      reject: () => { },
    });
  }

  delete(id: number){
    const p = this.projectDataList.find(project => project.id  === id);
    if(p){
      p.status = RecordStatus.Deleted;
      this.serviceProxy.updateOneBaseProjectControllerProject(id, p)
        .subscribe(res => {
          this.load({rows: this.rows, first: 0});
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Deteled successfully',
            closable: true,
          });
        })
    }    
  }

  summary(id: number){
    this.router.navigate(['../project-summary'], { queryParams: { id: id }, relativeTo: this.activatedRoute});
  }

  async loadAuditors(){
    let profiles = await this.loginProfileServiceProxy.getByRole(Roles.AUDITOR.toString()).toPromise()
    await Promise.all(
        profiles.map(async (p) => {
        let filter = ["status||$ne||" + RecordStatus.Deleted, "loginProfile||$eq||" + p];
        let a = await this.serviceProxy.getManyBaseUsersControllerUser(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise();
        if (a.data[0] !== undefined) {
          this.auditors.push(a.data[0])
        }
        // return a.data[0];
      })
    ) 
  }

  async onChangeStatus(project: Project, e: any, disabled: boolean){

    if(!disabled){
      if (e.value === ProjectStatus.Verification_Pending) {
        this.verificationProject = project
        this.display = true
        this.header = "Assign a verifier"
      }
  
      if (!this.display){
        this.confirmationService.confirm({
          message: 'Are you sure you want to change status to '+ e.value+'?',
          header: 'Change Status Confirmation',
          acceptIcon: 'icon-not-visible',
          rejectIcon: 'icon-not-visible',
          accept: () => {
            this.projectControllerServiceProxy.changeStatus(project.id, e.value).subscribe(res=> {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Successfully changed',
                closable: true,
              });
            }, errr=>{
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to change status',
                closable: true,
              });
            }, ()=>this.load({}))
          },
          reject: () => { 
            this.load({})
          },
        });
      }
    }
  }

  saveAuditor() {
    this.verificationProject.verifier = this.auditor;
    if (!this.isEdit) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to change status to verification pending?',
        header: 'Change Status Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: async () => {
          this.display = false
          this.header = ""
          await this.serviceProxy.updateOneBaseProjectControllerProject(this.verificationProject.id, this.verificationProject).toPromise();
          this.projectControllerServiceProxy.changeStatus(this.verificationProject.id, ProjectStatus.Verification_Pending.toString())
            .subscribe(res => {
              this.sendMsg(res, "Successfully changed", "Failed to change status")
            })
        },
        reject: () => {
          this.display = false
          this.header = ""
          this.load({})
        },
      });
    } else {
      this.serviceProxy.updateOneBaseProjectControllerProject(this.verificationProject.id, this.verificationProject)
        .subscribe(res => {
          this.projectControllerServiceProxy.changeStatus(this.verificationProject.id, ProjectStatus.Verification_Pending.toString())
            .subscribe(res => {
              this.sendMsg(res, "Successfully saved", "Failed to save")
            },err => {
              this.sendMsg(undefined, "", "")
            })
        })
      this.isEdit = false
      this.display = false
      this.header = ""
    }
  }

  sendMsg(res: any, ok: string, error: string) {
    if (res) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: ok,
        closable: true,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
        closable: true,
      });
    }
    this.load({})
  }

  async editVerifier(project: Project){
    this.display = true
    this.isEdit = true
    this.header = "Edit the verifier"
    this.verificationProject = project
    this.auditor = project.verifier
  }

  cancel(){
    this.display = false
    this.isEdit = false
    this.header = ""
    this.load({})
  }

  onChangeUnit(u: Unit){
    // this.selectUnit = u;
    this.selectUnitId = this.selectUnit.id;
    this.load({})
  }


  async getUnits(){
    let data = localStorage.getItem(SavedData.units);
      if(data){
        let us = JSON.parse(data) as any[];
        let u: Unit[] = [];
        us.forEach(uu => {
          let nu = new Unit();
          nu.init(uu)
          u.push(nu);
        })
        this.units = u;
      }else{
        let filter = [ "status||$ne||"+RecordStatus.Deleted]
        if(this.appService.isOnlyOperationalAdmin()){
          let ids = this.appService.getAllowedUnitIds()
          if(ids.length > 0){
            filter.push("id||$in||"+ids.join(","))
          }
        }
        let res = await this.serviceProxy.getManyBaseUnitControllerUnit(
          undefined,
          undefined,
          filter,
          undefined,
          undefined,
          ['country','industry'],
          3000,
          0,
          0,
          0
        ).toPromise()
        this.units = res.data;
        localStorage.setItem(SavedData.units, JSON.stringify(this.units));
      }
      let units = this.units.filter(u => !u.parentUnit.id);
      this.parentUnits = units;  
      if(!localStorage.getItem(SavedData.parentUnits)){
        localStorage.setItem(SavedData.parentUnits, JSON.stringify(this.parentUnits));
      }
      if(this.selectUnitId){
        let u = this.parentUnits.find(pu=>pu.id===this.selectUnitId);
        if(u){
          this.selectUnit = u;
        }
      }
  }

  check(){
    this.load({})
  }

  addPaymentInfo(project: Project){
    this.paymentAddingProject = project;
    this.displayAddPaymentInfo = true;
  }

  saveReferance(){
    this.projectControllerServiceProxy.addPaymentRef(this.paymentAddingProject.id, this.refNo).subscribe(res => {
      this.projectControllerServiceProxy.changeStatus(this.paymentAddingProject.id, ProjectStatus.Payment_Completed+'').subscribe(res=> {
        this.load({});
        this.displayAddPaymentInfo = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully changed',
          closable: true,
        });
      }, errr=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to change status',
          closable: true,
        });
      })
    },
    errr=>{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to change status',
        closable: true,
      });
    },
    ()=>{
      this.load({});
      this.displayAddPaymentInfo = true;
    })    
  }

}
