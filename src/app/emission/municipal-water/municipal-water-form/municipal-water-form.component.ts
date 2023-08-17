import { Component, OnInit } from '@angular/core';
import {  Project, MunicipalWaterActivityData, ServiceProxy, User, PuesDataDto, PuesDataReqDtoSourceName, Unit, ProjectUnitEmissionSourceControllerServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-municipal-water-form',
  templateUrl: './municipal-water-form.component.html',
  styleUrls: ['./municipal-water-form.component.css']
})
export class MunicipalWaterFormComponent extends EmissionCreateBaseComponent implements OnInit {

  municipalWater: MunicipalWaterActivityData = new MunicipalWaterActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  categories:{id: number, name: string, code: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;
  
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public projects: Project[] = [];
  public months: any[] = [];
  public units: any

  month: any;
  unit: any ;
  category: any;
  unitOption: boolean;
  
  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  coreatingUser: boolean = false;

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
    
    this.months = this.masterDataService.months;
    this.units = this.masterDataService.municipal_water_units;
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this.categories = this.masterDataService.municipal_water_categories;

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
      this.municipalWater.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Municipal_water)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.municipalWater.unit && this.municipalWater.unit.id){
          this.selectedUnit = this.municipalWater.unit;
        }
      }
    }
    this.municipalWater.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.municipalWater.mobile = false;
      this.municipalWater.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.municipalWater.project, PuesDataReqDtoSourceName.Municipal_water, this.selectedUnit);    
  }

  isMobileChange(){
    this.municipalWater.mobile = this.isMobile;
    this.municipalWater.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Municipal_water.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.municipalWater.year.toString(), this.month.value, this.municipalWater)
    let e = this.municipalWater.project;
    if(this.month && this.month.value === 12 && e){
      this.municipalWater.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.municipalWater.project = e;
    this.municipalWater.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Municipal_water)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseMunicipalWaterActivityDataControllerMunicipalWaterActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.municipalWater = res;
      let project = await this.getProject(this.municipalWater.project.id);
      if (project){
        this.municipalWater.project = project;
        this.isMobile = this.municipalWater.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.municipalWater.month);  
      this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.municipalWater.consumption_unit);
      //this.category = this.categories.find(m=>m.name === this.municipalWater.category);

    }else{
      this.setCreator();
    }
  }


  async save(municipalWaterForm: NgForm) {
    this.creating=true;

    if(municipalWaterForm.valid && this.municipalWater.project.id){
      this.municipalWater.month = this.month.value
      this.municipalWater.consumption_unit = this.unit.code
     // this.municipalWater.category = this.category

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseMunicipalWaterActivityDataControllerMunicipalWaterActivityData(this.municipalWater)
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
        this.serviceProxy.updateOneBaseMunicipalWaterActivityDataControllerMunicipalWaterActivityData(this.municipalWater.id, this.municipalWater)
          .subscribe(
            (res: { emission: any; }) => {
              this.municipalWater.emission = res.emission;
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

  onSelectOption(selected: any) {

    if (selected.value.code === "LKR") {
    this.unitOption = true
    }else {
      this.unitOption = false
    }
     //console.log("selected", selected)
  }

  onBackClick() {
    this.router.navigate(['app/emission/municipal-water-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.municipalWater.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseMunicipalWaterActivityDataControllerMunicipalWaterActivityData(id)
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
        this.router.navigate(['app/emission/municipal-water-list']);
        //this.router.navigate(['../municipal-water-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Municipal_water);
    }
  }

  changedConsumption(e: any){
    console.log(e)
    this.municipalWater.consumption = e
  }

}
