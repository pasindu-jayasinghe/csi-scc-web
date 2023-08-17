import { Component, DoCheck, OnInit } from '@angular/core';
import { ElectricityActivityData, EmissionBaseControllerServiceProxy, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataDtoSourceType, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-electricity-form',
  templateUrl: './electricity-form.component.html',
  styleUrls: ['./electricity-form.component.css']
})
export class ElectricityFormComponent extends EmissionCreateBaseComponent implements OnInit, DoCheck {


  electricity: ElectricityActivityData = new ElectricityActivityData();
  creator: User;


  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public units: any
  public unit: any
  month: any;

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

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
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy

  ) { 
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);

  }
  ngDoCheck(): void {
    
  }

  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.units = this.masterDataService.electricity_units;
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
      this.electricity.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Electricity);
    
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.electricity.unit && this.electricity.unit.id){
          this.selectedUnit = this.electricity.unit;
        }
      }
    }
    this.electricity.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.electricity.mobile = false;
      this.electricity.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.electricity.project, PuesDataReqDtoSourceName.Electricity, this.selectedUnit);    
  }

  isMobileChange(){
    this.electricity.mobile = this.isMobile;
    this.electricity.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Electricity.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.electricity.year.toString(), this.month.value, this.electricity)
    let e = this.electricity.project;
    if(this.month && this.month.value === 12 && e){
      this.electricity.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.electricity.project = e;
    this.selectedProject = e;
    this.electricity.project = e;
    // this.electricity.year = e.year;
    this.electricity.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Electricity)
    
  }






  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseElectricityActivityDataControllerElectricityActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.electricity = res;
      let project = await this.getProject(this.electricity.project.id);
      if (project){
        this.electricity.project = project;
        this.isMobile = this.electricity.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.electricity.month);  
    }else{
      this.setCreator();
    }
  }


  async save(elecForm: NgForm) {

    console.log("ww",this.electricity)
    this.creating=true;

    console.log(elecForm)
    this.electricity.consumption_unit = this.unit.code
    if(elecForm.valid && this.electricity.project.id) {  
      this.electricity.month = this.month.value
      console.log("unitttttttt", this.unit, this.electricity)
      let unit = new Unit()
      unit.id = this.electricity.unit.id
      this.electricity.unit = unit
      if (this.isNewEntry) {
        this.serviceProxy
          .createOneBaseElectricityActivityDataControllerElectricityActivityData(this.electricity)
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
        this.serviceProxy.updateOneBaseElectricityActivityDataControllerElectricityActivityData(this.electricity.id, this.electricity)
          .subscribe(
            (res: { emission: any; }) => {
              this.electricity.emission = res.emission;
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
    this.router.navigate(['/app/emission/electricity-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.electricity.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseElectricityActivityDataControllerElectricityActivityData(id)
      .subscribe((res: any) => {
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
        this.router.navigate(['../electricity-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Electricity);
    }
  }

}
