import { Component, OnInit } from '@angular/core';
import { ForkliftsActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-forklifts-form',
  templateUrl: './forklifts-form.component.html',
  styleUrls: ['./forklifts-form.component.css']
})
export class ForkliftsFormComponent extends EmissionCreateBaseComponent implements OnInit {

  forklifts: ForkliftsActivityData = new ForkliftsActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
;
  public institutions: any[] = [];
  public projects: Project[] = [];
  public months: any[] = [];
  public fuelType1:any[] = []

  fuelType:any;
  month: any;
 
  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  coreatingUser: boolean = false;

  public units: any
  public consumptionunit: any

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
    
    //this.gWP_RGs = this.masterDataService.gWP_RGs;
    this.fuelType1 = this.masterDataService.fuelType1;
    this.months = this.masterDataService.months;
    this.units = this.masterDataService.forklifts_units
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
      this.forklifts.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Forklifts)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.forklifts.unit && this.forklifts.unit.id){
          this.selectedUnit = this.forklifts.unit;
        }
      }
    }
    this.forklifts.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.forklifts.mobile = false;
      this.forklifts.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.forklifts.project, PuesDataReqDtoSourceName.Forklifts, this.selectedUnit);    
  }

  isMobileChange(){
    this.forklifts.mobile = this.isMobile;
    this.forklifts.stationary = !this.isMobile;
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

  monthCgange(){
    let e = this.forklifts.project;
    if(this.month && this.month.value === 12 && e){
      this.forklifts.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.forklifts.project = e;
    this.forklifts.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);;

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Forklifts)

  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseForkliftsActivityDataControllerForkliftsActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.forklifts = res;
      let project = await this.getProject(this.forklifts.project.id);
      if (project){
        this.forklifts.project = project;
        this.isMobile = this.forklifts.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.forklifts.month);  
      this.fuelType = this.fuelType1.find(f=>f.name===this.forklifts.fuelType);

    }else{
      this.setCreator();
    }
  }


  async save(forkliftForm: NgForm) {
    this.creating=true;

    
    if(forkliftForm.valid && this.forklifts.project.id){
      
      this.forklifts.month = this.month.value
      this.forklifts.fuelType = this.fuelType.name
      this.forklifts.consumption_unit = this.consumptionunit.code
      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseForkliftsActivityDataControllerForkliftsActivityData(this.forklifts)
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
        this.serviceProxy.updateOneBaseForkliftsActivityDataControllerForkliftsActivityData(this.forklifts.id, this.forklifts)
          .subscribe(
            (res: { emission: any; }) => {
              this.forklifts.emission = res.emission;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
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
    this.router.navigate(['app/emission/forklifts-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.forklifts.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseForkliftsActivityDataControllerForkliftsActivityData(id)
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
        this.router.navigate(['app/emission/forklifts-list']);
        //this.router.navigate(['../forklifts-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Forklifts);
    }
  }


}
