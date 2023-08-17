import { Component, OnInit } from '@angular/core';
import { FreightRoadActivityData,Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from "../../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { IndexCode } from '../../transport-list/transport-list.component';

@Component({
  selector: 'app-road-transport-form',
  templateUrl: './road-transport-form.component.html',
  styleUrls: ['./road-transport-form.component.css']
})
export class RoadTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  // freight: FreightTransportActivityData = new FreightTransportActivityData();
  freightRoad: FreightRoadActivityData = new FreightRoadActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  totalUpCost: number 
  totalDownCost: number 

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public methods_freightTransport: {name: string, id: number}[] = []
  public freightModes: {name: string, id: number}[] = []
  public ownership_freightTransport: {name: string, id: number}[] = []
  public transient_freightTransport: {name: string, id: number}[] = []
  public distanceTravelledUnits_freightTransport: {name: string, id: number}[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []
  public unit: any
  public freightTypes_freightTransport: {name: string, id: number}[] = []
  public fuelType1: any[] = []//{name: string, id: number, code: string}[] = []
  public options_freightTransport: {name: string, id: number}[] = []
  public cargoType_road_freightTransport: {code: string, name: string, id: number}[] = []
  public cargoType_shared: {code: string, name: string, id: number}[] = []
  public orgCargoTypes: {code: string, name: string, id: number}[]  = []
  
  public units: any={};
  public fuel: any={};
  public fuel_unit: any={};
  public distance: any={};
  public onSelectUnitId: any={};
  public onSelectUpDistanceUnitId: any = 2
  public onSelectDownDistanceUnitId: any = 2
  public upDistance_unit: any={};
  public downDistance_unit: any={};
  public upWeight_unit: any={};
  public downWeight_unit: any={};

  month: any;
  method: any;
  freightType: any;
  // fuelType: any;
  freightMode: any;
  ownership: any;
  transient: any ={};
  distanceTravelledUnits: any ={};
  domesticInternational: any ={};
  // cargoType: any;

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;
  checked: any
  checkedShared: any[] = []

  public sharedCargos: string[] = []

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
    this.freightModes = this.masterDataService.freightModes;
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.transient_freightTransport = this.masterDataService.transient_freightTransport;
    this.methods_freightTransport = this.masterDataService.methods_freightTransport;
    this.freightTypes_freightTransport =this.masterDataService.freightTypes_freightTransport;
    this.fuelType1 = this.masterDataService.fuel;
    this.options_freightTransport =this.masterDataService.options_freightTransport;
    this.units = this.masterDataService.road_freight_units;
    this.cargoType_road_freightTransport = this.masterDataService.cargoType_road_freightTransport;
    this.cargoType_shared = this.masterDataService.cargoType_shared;
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.orgCargoTypes = [...this.cargoType_road_freightTransport]

    this.sharedCargos = this.cargoType_shared.map(e => {return e.code})

    //this.onSelect(this.selectedSource.id);
    
    this.setAction();
    await this.setInitialState();
    await this.setUnit();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();
  }

  onSelectMethod(selected:any){
    this.method = this.methods_freightTransport
    .find(m=> 
     m.id === selected.value.id);
    let idx = this.cargoType_road_freightTransport.findIndex(o => o.code === 'OTHER')
    if (this.method.id === 2) this.cargoType_road_freightTransport.splice(idx, 1)
  }



  onSelectUnit(selected:any){

   if (selected.value.code==="LKR") {
   this.onSelectUnitId = 1
   } else {
    this.onSelectUnitId = 2
   }
  }

  onSelectUpDistanceUnit(selected:any){

    if (selected.value.code==="LKR") {
    this.onSelectUpDistanceUnitId = 1
    } else {
     this.onSelectUpDistanceUnitId = 2
    }
  }

  onSelectDownDistanceUnit(selected:any){

    if (selected.value.code==="LKR") {
    this.onSelectDownDistanceUnitId = 1
    } else {
     this.onSelectDownDistanceUnitId = 2
    }
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
      this.freightRoad.user = this.creator;
    }
  }


  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Freight_road)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.freightRoad.unit && this.freightRoad.unit.id){
          this.selectedUnit = this.freightRoad.unit;
        }
      }
    }
    this.freightRoad.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.freightRoad.mobile = false;
      this.freightRoad.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.freightRoad.project, PuesDataReqDtoSourceName.Freight_road, this.selectedUnit);    
  }

  isMobileChange(){
    this.freightRoad.mobile = this.isMobile;
    this.freightRoad.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Freight_road.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.freightRoad.year.toString(), this.month.value, this.freightRoad)
    let e = this.freightRoad.project;
    if(this.month && this.month.value === 12 && e){
      this.freightRoad.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.freightRoad.project = e;
    this.freightRoad.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Freight_road)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseFreightRoadActivityDataControllerFreightRoadActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.freightRoad = res;

      let project = await this.getProject(this.freightRoad.project.id);
      if (project){
        this.freightRoad.project = project;
        this.isMobile = this.freightRoad.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.freightRoad.month);        
      this.ownership = this.ownership_freightTransport.find(o=>o.name===this.freightRoad.ownership);
      // this.cargoType = this.cargoType_road_freightTransport.find(c=>c.code===this.freightRoad.cargoType)
      this.method = this.methods_freightTransport.find(m=>m.name===this.freightRoad.method);
      this.domesticInternational = this.domesticInternationals.find(o => o.code === this.freightRoad.domOrInt)
      this.checkedShared.push(this.freightRoad.isShared)
      this.setCargoTypes(this.freightRoad.isShared)
      let cargoType = this.cargoType_road_freightTransport.find(o => o.code === this.freightRoad.cargoType)
      this.freightRoad.cargoType = cargoType ? cargoType.code : ''
    }else{
      this.setCreator();
    }

  }


  async save(freightRoadForm: NgForm) {
    this.creating=true;

    if(freightRoadForm.valid && this.freightRoad.project.id){
      this.freightRoad.month = this.month.value
      this.freightRoad.method =this.method.name
      this.freightRoad.ownership =this.ownership.name
      this.freightRoad.downDistance_unit = this.downDistance_unit.code
      this.freightRoad.upDistance_unit = this.upDistance_unit.code
      this.freightRoad.fuelConsumption_unit = this.fuel_unit.code
      // this.freightRoad.cargoType = this.cargoType.code
      this.freightRoad.upWeight_unit = this.upWeight_unit.code
      this.freightRoad.downWeight_unit = this.downWeight_unit.code
      this.freightRoad.domOrInt = this.domesticInternational.code
      if (!this.freightRoad.isShared) this.freightRoad.isShared = false

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseFreightRoadActivityDataControllerFreightRoadActivityData(this.freightRoad)
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
        this.serviceProxy.updateOneBaseFreightRoadActivityDataControllerFreightRoadActivityData(this.freightRoad.id, this.freightRoad)
          .subscribe(
            (res) => {
              
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              // console.log('FreightRoad',res)
              setTimeout(() => {
                this.onBackClick();
              }, 500);
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
     
    // console.log(user)
    // this.cooking.user = user
  }




  onBackClick() {
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 0, subTabIndex:1, subTabIndexCode: IndexCode.F_ROAD}});
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.freightRoad.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseFreightRoadActivityDataControllerFreightRoadActivityData(id)
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
        this.router.navigate(['../freight-transport-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Freight_road);
    }
  }

  check(){
    this.freightRoad.paidByCompany = this.checked[0]
  }

  checkShared(){
    this.freightRoad.isShared = this.checkedShared[0]
    this.setCargoTypes(this.freightRoad.isShared)
  }

  setCargoTypes(isShared: any){
    if (isShared) {
      this.cargoType_road_freightTransport.push(...this.cargoType_shared)
    } else {
      this.cargoType_road_freightTransport = this.orgCargoTypes
    }
  }

  onUpdateFuel(event: string) {
    this.freightRoad.fuelType = event;
  }

  upDistanceKm: string = "";
  downDistanceKm: string = "";
  onUpCostChange(e: any){
    this.freightRoad.upDistance  = e;
    this.upDistanceKm = (e / this.freightRoad.upCost).toFixed(2)
  }

  onDownCostChange(e: any){
    this.freightRoad.downDistance  = e;
    this.downDistanceKm = (e / this.freightRoad.downCost).toFixed(2)
  }
}
