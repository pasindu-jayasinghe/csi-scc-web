import { Component, OnInit } from '@angular/core';
import { FreightRailActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, RailPort, ServiceProxy, Unit, User } from "../../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-rail-transport-form',
  templateUrl: './rail-transport-form.component.html',
  styleUrls: ['./rail-transport-form.component.css']
})
export class RailTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  // freight: FreightTransportActivityData = new FreightTransportActivityData();
  freightRail: FreightRailActivityData = new FreightRailActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  railPorts: RailPort[];

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public methods_freightTransport: {name: string, id: number}[] = []
  public freightModes: {name: string, id: number}[] = []
  public ownership_freightTransport: {name: string, id: number}[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []
  public unit: any
  public departureStation_freightTransport: {name: string, id: number}[] = []
  public destinationStation_freightTransport: {name: string, id: number}[] = []
  public fuelType1: {name: string, id: number, code: string}[] = []
  public cargoTypes: {code: string, name: string, id: number}[] = []
  public options_freightTransport: {name: string, id: number, code: string}[] = []
  public activities: {name: string, id: number, code: string}[] = []
  public types: {name: string, id: number, code: string}[] = []



  public units: any= {};
  public fuel_unit: any= {};
  public distance: any= {};
  //public onSelectUnitId: any
  cargoType: any;
  month: any;
  method: any;
  freightMode: any;
  ownership: any;
  distanceTravelledUnits: any ={};
  domesticInternational: any;
  // fuelType: any;
  departureStation: any;
  destinationStation: any;

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;
  checked: any

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
    this.methods_freightTransport = this.masterDataService.methods_freightTransport;
    this.destinationStation_freightTransport = this.masterDataService.destinationStation_freightTransport;
    this.departureStation_freightTransport = this.masterDataService.departureStation_freightTransport;
    this.units = this.masterDataService.rail_freight_units
    this.fuelType1 = this.masterDataService.railFuelType;
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.cargoTypes = this.masterDataService.cargoType_road_freightTransport;
    this.options_freightTransport = this.masterDataService.options_freightTransport;
    this.activities = this.masterDataService.railActivities;
    this.types = this.masterDataService.railTypes

    this.setAction();
    await this.getRailports();
    await this.setInitialState();
    await this.setUnit();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();
  }


  async getRailports(){
    this.serviceProxy.getManyBaseRailPortControllerRailPort(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res: any) => {
      this.railPorts = res.data
      this.railPorts.sort((a,b) => a.name.localeCompare(b.name));
      

    })
  }

  onSelectMethod(selected:any){
    this.method = this.methods_freightTransport
    .find(m=> 
     m.id === selected.value.id);
    console.log("Freight method",this.method.id)
    console.log("selected",selected)
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
      this.freightRail.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Freight_rail)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.freightRail.unit && this.freightRail.unit.id){
          this.selectedUnit = this.freightRail.unit;
        }
      }
    }
    this.freightRail.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.freightRail.mobile = false;
      this.freightRail.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.freightRail.project, PuesDataReqDtoSourceName.Freight_rail, this.selectedUnit);    
  }

  isMobileChange(){
    this.freightRail.mobile = this.isMobile;
    this.freightRail.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Freight_rail.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.freightRail.year.toString(), this.month.value, this.freightRail)
    let e = this.freightRail.project;
    if(this.month && this.month.value === 12 && e){
      this.freightRail.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.freightRail.project = e;
    this.freightRail.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Freight_rail)
  }


  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseFreightRailActivityDataControllerFreightRailActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.freightRail = res;

      let project = await this.getProject(this.freightRail.project.id);
      if (project){
        this.freightRail.project = project;
        this.isMobile = this.freightRail.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.freightRail.month);

      this.ownership = this.ownership_freightTransport.find(o => o.name === this.freightRail.ownership);
      this.method = this.methods_freightTransport.find(m => m.name === this.freightRail.method);
      this.domesticInternational = this.domesticInternationals.find(o => o.code === this.freightRail.domOrInt)
      this.cargoType = this.cargoTypes.find(c => c.code === this.freightRail.cargoType)

      let destUp = this.railPorts.find(d => d.id === this.freightRail.destinationStationUp.id)
      if (destUp) {
        this.freightRail.destinationStationUp = destUp;
      }
      let destDown = this.railPorts.find(d => d.id === this.freightRail.destinationStationDown.id)
      if (destDown) {
        this.freightRail.destinationStationDown = destDown;
      }
      let depUp = this.railPorts.find(d => d.id === this.freightRail.departureStationUp.id)
      if (depUp) {
        this.freightRail.departureStationUp = depUp;
      }
      let depDown = this.railPorts.find(d => d.id === this.freightRail.departureStationDown.id)
      if (depDown) {
        this.freightRail.departureStationDown = depDown;
      }

    }else{
      this.setCreator();
    }

  }


 
  async save(freightRailForm: NgForm) {
    this.creating=true;    

    this.removeNull()
    
    
    if(freightRailForm.valid && this.freightRail.project.id){
      this.freightRail.month = this.month.value
      this.freightRail.method =this.method.name
      this.freightRail.ownership =this.ownership.name
      this.freightRail.fuelConsumption_unit =this.fuel_unit.code
      this.freightRail.domOrInt = this.domesticInternational.code
      this.freightRail.cargoType = this.cargoType.code

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseFreightRailActivityDataControllerFreightRailActivityData(this.freightRail)
          .subscribe((res: any) => {
            this.creating=false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            console.log('Freight Rail',res);
            setTimeout(() => {
              this.onBackClick();}, 500);
            },
            (error) => {
              this.creating=false;
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
        this.serviceProxy.updateOneBaseFreightRailActivityDataControllerFreightRailActivityData(this.freightRail.id, this.freightRail)
          .subscribe(
            (res) => {
              this.creating=false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              // console.log('freightRail',res)
              setTimeout(() => {
                this.onBackClick();
              }, 500);
            },
            (error) => {
              this.creating=false;
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
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 0, subTabIndex:3}});
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.freightRail.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseFreightRailActivityDataControllerFreightRailActivityData(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Freight_rail);
    }
  }

  check(){
    this.freightRail.paidByCompany = this.checked[0]
  }

  onUpCostChange(e: any){
    this.freightRail.distanceUp = e * this.freightRail.upCostPerKM
  }

  onDownCostChange(e: any){
    this.freightRail.distanceUp = e * this.freightRail.upCostPerKM
  }

  removeNull() {
    let a = 0;
    //@ts-ignore
    !this.freightRail.destinationStationUp?.id ? this.freightRail.destinationStationUp = null : a = 1;
    //@ts-ignore
    !this.freightRail.departureStationDown?.id ? this.freightRail.destinationStationDown = null : a = 1;
    //@ts-ignore
    !this.freightRail.departureStationUp?.id ? this.freightRail.departureStationUp = null : a = 1;

    //@ts-ignore
    !this.freightRail.departureStationDown?.id ? this.freightRail.departureStationDown = null : a = 1;
  
  }

  onUpdateFuel(event: string) { 
    this.freightRail.fuelType = event;
  }

}
