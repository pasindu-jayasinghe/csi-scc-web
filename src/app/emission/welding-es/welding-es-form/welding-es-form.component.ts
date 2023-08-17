import { Component, OnInit } from '@angular/core';
import { WeldingEsActivityData, Project, ServiceProxy, User, PuesDataDto, PuesDataReqDtoSourceName, Unit, ProjectUnitEmissionSourceControllerServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-welding-es-form',
  templateUrl: './welding-es-form.component.html',
  styleUrls: ['./welding-es-form.component.css']
})
export class WeldingEsFormComponent extends EmissionCreateBaseComponent implements OnInit {

  weldingEs: WeldingEsActivityData = new WeldingEsActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  weldingEsUpdate: IEmission;
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public projects: Project[] = [];
  public months: any[] = [];

  month: any;
  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;
  creating: boolean = false;
  coreatingUser: boolean = false;

  public units: any
  public acunit: any;
  public lcunit: any;

  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute:ActivatedRoute,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy
  ) { 
        super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }


  async ngOnInit() {
    

    this.months = this.masterDataService.months;
    this.units = this.masterDataService.welding_units
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
      this.weldingEs.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Welding_es)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.weldingEs.unit && this.weldingEs.unit.id){
          this.selectedUnit = this.weldingEs.unit;
        }
      }
    }
    this.weldingEs.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.weldingEs.mobile = false;
      this.weldingEs.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.weldingEs.project, PuesDataReqDtoSourceName.Welding_es, this.selectedUnit);    
  }

  isMobileChange(){
    this.weldingEs.mobile = this.isMobile;
    this.weldingEs.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Welding_es.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.weldingEs.year.toString(), this.month.value, this.weldingEs)
    let e = this.weldingEs.project;
    if(this.month && this.month.value === 12 && e){
      this.weldingEs.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.weldingEs.project = e;
    this.weldingEs.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Welding_es)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseWeldingEsActivityDataControllerWeldingEsActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.weldingEs = res;

      let weldingEsStringify = res;
      //@ts-ignore
      weldingEsStringify = JSON.stringify(weldingEsStringify);
       //@ts-ignore
      weldingEsStringify = this.cleanString(weldingEsStringify);
       //@ts-ignore
      this.weldingEsUpdate = JSON.parse(weldingEsStringify);

      let project = await this.getProject(this.weldingEs.project.id);
      if (project){
        this.weldingEs.project = project;
        this.isMobile = this.weldingEs.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.weldingEs.month);  
    }else{
      this.setCreator();
    }


  }

  cleanString(str:string) {

    str = str.replace(/}",/gi, '},');
    str = str.replace(/:"{/gi , ':{');
    str = str.replace(/[\/\\]/g, '');
   return str;
 }




  async save(weldingEs: NgForm) {
    this.creating=true;

    
    if(weldingEs.valid && this.weldingEs.project.id){
      
      this.weldingEs.month = this.month.value
      this.weldingEs.ac_unit = this.acunit.code
      this.weldingEs.lc_unit = this.lcunit.code
      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseWeldingEsActivityDataControllerWeldingEsActivityData(this.weldingEs)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.onBackClick();}, 500);
            },
            (error: any) => {
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
        this.serviceProxy.updateOneBaseWeldingEsActivityDataControllerWeldingEsActivityData(this.weldingEs.id, this.weldingEs)
          .subscribe(
            (res: any) => {
              this.weldingEs.emission = res.emission;
              let weldingEsStringify = JSON.stringify(res);
              weldingEsStringify = this.cleanString(weldingEsStringify);
              this.weldingEs = JSON.parse(weldingEsStringify);
              this.weldingEsUpdate = JSON.parse(weldingEsStringify);
              
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,

                
              });
              console.log('resData--',res)
              console.log('weldingEsUData--',this.weldingEs)
              console.log('weldingEsUUUUUData--',weldingEsStringify)
            },
            (error: any) => {
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
    } 
    else{
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
    this.router.navigate(['app/emission/welding-es-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.weldingEs.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseWeldingEsActivityDataControllerWeldingEsActivityData(id)
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      },(error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, ()=> {
        this.router.navigate(['../welding-es-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Welding_es);
    }
  }


}


export interface IEmission {
  emission:{
  Acetylene: number;
  liquidCo2: number;
  }
}
