import { Component, OnInit } from '@angular/core';
import {  Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, RefrigerantActivityData, ServiceProxy, Unit, User } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-refrigerant-form',
  templateUrl: './refrigerant-form.component.html',
  styleUrls: ['./refrigerant-form.component.css']
})
export class RefrigerantFormComponent extends EmissionCreateBaseComponent implements OnInit {

  refrigerant: RefrigerantActivityData = new RefrigerantActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public institutions: any[] = [];
  public projects: Project[] = [];
 // public years: any[] = [];
  public months: any[] = [];
  public gWP_RGs: any[] = [];

public refActivityTypes :any[] =[]
  public unit: any

  //year: any = {};
  month: any;
  gWP_RG: any;
 


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  coreatingUser: boolean = false;

  public units: any;
  public wrgunit: any;
  projectType: any;

  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private activatedRoute:ActivatedRoute,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy

  ) { 
        super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }


  async ngOnInit() {
    this.projectType =  this.appService.projectType.value

    console.log("lllll",this.projectType)

    this.gWP_RGs = this.masterDataService.gWP_RGs;
    this.refActivityTypes = this.masterDataService.refActivityTypes;

    this.months = this.masterDataService.months;
    this.units = this.masterDataService.refrigerant_units
    this.ownerships =this.masterDataService.ownership_freightTransport;

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();
  }

  setAction(){
    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if(id){
      this.editEntryId = parseInt(id);
      this.isNewEntry = false;
    }
  }
  
  async setCreator(){
    let u = await this.appService.getUser();
    if(u){
      this.creator = u;
      this.refrigerant.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Refrigerant)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.refrigerant.unit && this.refrigerant.unit.id){
          this.selectedUnit = this.refrigerant.unit;
        }
      }
    }
    this.refrigerant.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.refrigerant.mobile = false;
      this.refrigerant.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.refrigerant.project, PuesDataReqDtoSourceName.Refrigerant, this.selectedUnit);    
  }

  isMobileChange(){
    this.refrigerant.mobile = this.isMobile;
    this.refrigerant.stationary = !this.isMobile;
  }

  async getProject(id: number){
    let res = await this.serviceProxy.getOneBaseProjectControllerProject(
      id,
      undefined,
      undefined,
      0
    ).toPromise();
    return res;
  }

  async monthCgange(){
    await this.validateMonth(
      PuesDataReqDtoSourceName.Refrigerant.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.refrigerant.year.toString(), this.month.value, this.refrigerant)
    let e = this.refrigerant.project;
    if(this.month && this.month.value === 12 && e){
      this.refrigerant.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.refrigerant.project = e;
    this.refrigerant.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Refrigerant)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseRefrigerantActivityDataControllerRefrigerantActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.refrigerant = res;
      let project = await this.getProject(this.refrigerant.project.id);
      if (project){
        this.refrigerant.project = project;
        this.isMobile = this.refrigerant.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.refrigerant.month);
      this.gWP_RG = this.gWP_RGs.find(g=>g.name===this.refrigerant.gWP_RG);
  
    }else{
      this.setCreator();
    }
  }


  async save(refrigerantForm: NgForm) {
    this.creating=true;

    
    if(refrigerantForm.valid && this.refrigerant.project.id){
      console.log("llll",this.refrigerant)

      this.refrigerant.month = this.month.value
      this.refrigerant.gWP_RG = this.gWP_RG.name
      this.refrigerant.w_RG_unit = this.wrgunit.code

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseRefrigerantActivityDataControllerRefrigerantActivityData(this.refrigerant)
          .subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.onBackClick();}, 500);
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
              this.creating = false;
            }
          );


      } else {
        this.serviceProxy.updateOneBaseRefrigerantActivityDataControllerRefrigerantActivityData(this.refrigerant.id, this.refrigerant)
          .subscribe(
            (res) => {
              this.refrigerant.e_RL = res.e_RL;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
              this.creating = false;
            }
          );
      }
    } else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      this.creating = false
     }
  }












  onBackClick() {
    this.router.navigate(['app/emission/refrigerant-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.refrigerant.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseRefrigerantActivityDataControllerRefrigerantActivityData(id)
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      },error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, ()=> {
        this.router.navigate(['../refrigerant-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Refrigerant);
    }
  }


}
