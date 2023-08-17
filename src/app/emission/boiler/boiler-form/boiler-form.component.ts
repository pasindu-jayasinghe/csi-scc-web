import { Component, OnInit } from '@angular/core';
import { BoilerActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-boiler-form',
  templateUrl: './boiler-form.component.html',
  styleUrls: ['./boiler-form.component.css']
})
export class BoilerFormComponent extends EmissionCreateBaseComponent implements OnInit {

  boiler: BoilerActivityData = new BoilerActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  boilerUpdate: BoilerActivityData;
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public fuelTypeBoilers:any[] = []
  public purposes:any[] = []
  public boilerTypes:any[] = []
  public unit: any

  fuelType: any;
  fuel:any;
  purpose:any;
  month: any;


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

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
    this.months = this.masterDataService.months;
    this.purposes = this.masterDataService.purposes;
    this.boilerTypes = this.masterDataService.boilerTypes;
    this.fuelTypeBoilers = this.masterDataService.fuelTypeBoilers;
    this.units = this.masterDataService.boiler_units
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
      this.boiler.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Boiler)
    
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.boiler.unit && this.boiler.unit.id){
          this.selectedUnit = this.boiler.unit;
        }
      }
    }
    this.boiler.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.boiler.mobile = false;
      this.boiler.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.boiler.project, PuesDataReqDtoSourceName.Boiler, this.selectedUnit);    
  }

  isMobileChange(){
    this.boiler.mobile = this.isMobile;
    this.boiler.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Boiler.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.boiler.year.toString(), this.month.value, this.boiler)
    let e = this.boiler.project;
    if(this.month && this.month.value === 12 && e){
      this.boiler.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.boiler.project = e;
    this.boiler.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Boiler)
    

  }

  onSelect(selected:any){
    this.fuelTypeBoilers = this.masterDataService.fuelTypeBoilers
    .filter(e=> 
     e.boilerId == selected.value.id);
    console.log("Boiler Fuel types",this.fuelTypeBoilers)
    console.log("selected",selected)
   
    if(selected.value.id==2){
      console.log("selected1")
      this.consumptionunit=this.units.consumption[1]
    }else{
      console.log("selected2")
      this.consumptionunit=this.units.consumption[0]
    }
    
  }


  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseBoilerActivityDataControllerBoilerActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.boiler = res;
      let boilerStringify = res;

      //@ts-ignore
      boilerStringify = JSON.stringify(boilerStringify);
      //@ts-ignore
      boilerStringify = this.cleanString(boilerStringify);
      //@ts-ignore
      this.boilerUpdate = JSON.parse(boilerStringify);
    console.log('this.boilerUpdate',this.boilerUpdate)
      let project = await this.getProject(this.boiler.project.id);
      if (project){
        this.boiler.project = project;
        this.isMobile = this.boiler.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.boiler.month);  
      this.purpose = this.purposes.find(p=>p.name===this.boiler.purpose);
      this.fuelType = this.boilerTypes.find(b=>b.name===this.boiler.fuelType);
      // this.fuel = this.fuelTypeBoilers.find(f=>f.code===this.boiler.fuel);
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



  async save(boilForm: NgForm) {
    this.creating=true;

    
    if(boilForm.valid && this.boiler.project.id){
      this.boiler.month = this.month.value
      this.boiler.fuelType = this.fuelType.name
      // this.boiler.purpose = this.purpose.name
      // this.boiler.fuelType = this.fuelType.name
      this.boiler.consumption_unit = this.consumptionunit.code

      console.log("fffff",this.boiler)
    
      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseBoilerActivityDataControllerBoilerActivityData(this.boiler)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            console.log('Boiler',res);
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
        this.serviceProxy.updateOneBaseBoilerActivityDataControllerBoilerActivityData(this.boiler.id, this.boiler)
          .subscribe(
            (res: { emission: any; }) => {
              this.boiler.emission = res.emission;
              let boilerStringify = JSON.stringify(res);
              boilerStringify = this.cleanString(boilerStringify);
              this.boiler = JSON.parse(boilerStringify);
              this.boilerUpdate = JSON.parse(boilerStringify);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              console.log('Boiler',res)
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
    this.router.navigate(['app/emission/boilers-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.boiler.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseBoilerActivityDataControllerBoilerActivityData(id)
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
        this.router.navigate(['../boilers-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Boiler);
    }
  }

  onUpdateFuel(event: string) { // TODO: change to work with dependant dropdown
    this.boiler.fuel = event;
  }


}

export interface IEmission {
  emission:{
    e_sc_co2: number;
    e_sc_ch4: number;
    e_sc_n2o: number;
    e_sc: number;
  }
}