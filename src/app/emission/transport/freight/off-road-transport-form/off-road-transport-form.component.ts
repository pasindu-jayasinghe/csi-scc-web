import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { FreightOffroadActivityData, Industry, IndustryType, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { IndexCode } from '../../transport-list/transport-list.component';

@Component({
  selector: 'app-off-road-transport-form',
  templateUrl: './off-road-transport-form.component.html',
  styleUrls: ['./off-road-transport-form.component.css']
})
export class OffRoadTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  // freight: FreightTransportActivityData = new FreightTransportActivityData();
  freightOffroad: FreightOffroadActivityData = new FreightOffroadActivityData()
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  industries: Industry[] = []

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public methods_freightTransport: {name: string, id: number}[] = []
  public freightModes: {name: string, id: number}[] = []
  public ownership_freightTransport: {name: string, id: number}[] = []
  public distanceTravelledUnits_freightTransport: {name: string, id: number}[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []
  public unit: any
  public fuelType1: {name: string, id: number, code: string}[] = []
  public vehicleModel_freightTransport: {name: string, id: number}[] = []
  public options_freightTransport: {name: string, id: number}[] = []
  public stroke_offroad_freightTransport: {name: string, id: number, code: string}[] = []
  public cargoTypes: {code: string, name: string, id: number}[] = []

  public units: any ={};
  public fuel: any ={};
  public distance: any ={};
  public fuel_unit: any ={};
  public distance_unit: any ={};
  // public stroke: any = null;

  //public onSelectUnitId: any
  cargoType: any;
  month: any;
  method: any;
  freightMode: any;
  ownership: any;
  transient: any ={};
  distanceTravelledUnits: any ={};
  domesticInternational: any;
  // fuelType: any;
  vehicleModel: any;
  



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
    this.distanceTravelledUnits_freightTransport =this.masterDataService.distanceTravelledUnits_freightTransport;
    this.methods_freightTransport = this.masterDataService.methods_freightTransport.filter(m => m.id === 1);
    this.fuelType1 = this.masterDataService.fuel;
    this.vehicleModel_freightTransport =this.masterDataService.vehicleModel_freightTransport;
    this.vehicleModel_freightTransport.sort((a,b) => a.name.localeCompare(b.name));

    this.units = this.masterDataService.offroad_freight_units
    this.options_freightTransport =this.masterDataService.options_freightTransport;
    this.stroke_offroad_freightTransport = this.masterDataService.strokes;
    this.units = this.masterDataService.water_freight_units
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.cargoTypes = this.masterDataService.cargoType_road_freightTransport;
    this.cargoTypes.sort((a, b) => a.name.localeCompare(b.name));


    
    this.setAction();
    await this.setInitialState();
    await this.setUnit();
    await this.getIndustries();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();

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
      this.freightOffroad.user = this.creator;
    }
  }


  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Freight_offroad)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.freightOffroad.unit && this.freightOffroad.unit.id){
          this.selectedUnit = this.freightOffroad.unit;
        }
      }
    }
    this.freightOffroad.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async getIndustries() {
    let filter = ['type||$eq||'+ IndustryType.M]
    this.serviceProxy.getManyBaseIndustryControllerIndustry(
      undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
    ).subscribe(res => {
      this.industries = res.data
    })
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.freightOffroad.mobile = false;
      this.freightOffroad.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.freightOffroad.project, PuesDataReqDtoSourceName.Freight_offroad, this.selectedUnit);    
  }

  isMobileChange(){
    this.freightOffroad.mobile = this.isMobile;
    this.freightOffroad.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Freight_offroad.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.freightOffroad.year.toString(), this.month.value, this.freightOffroad)
    let e = this.freightOffroad.project;
    if(this.month && this.month.value === 12 && e){
      this.freightOffroad.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.freightOffroad.project = e;
    this.freightOffroad.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Freight_offroad)

  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseFreightOffroadActivityDataControllerFreightOffroadActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.freightOffroad = res;

      let project = await this.getProject(this.freightOffroad.project.id);
      if (project){
        this.freightOffroad.project = project;
        this.isMobile = this.freightOffroad.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.freightOffroad.month);
          
          this.ownership = this.ownership_freightTransport.find(o=>o.name===this.freightOffroad.ownership);
          this.method = this.methods_freightTransport.find(m=>m.name===this.freightOffroad.method);
          this.vehicleModel = this.vehicleModel_freightTransport.find(v=>v.name===this.freightOffroad.vehicleModel);
          this.domesticInternational = this.domesticInternationals.find(o => o.code === this.freightOffroad.domOrInt)
          this.cargoType = this.cargoTypes.find(c=>c.code===this.freightOffroad.cargoType)

    }else{
      this.setCreator();
    }

  }





  async save(freightOffroadForm: NgForm) {
    this.creating=true;

    
    
    
    if(freightOffroadForm.valid && this.freightOffroad.project.id){
      this.freightOffroad.month = this.month.value
      this.freightOffroad.method =this.method.name
      this.freightOffroad.ownership =this.ownership.name
      this.freightOffroad.distance_unit = this.distance_unit.code
      this.freightOffroad.vehicleModel =this.vehicleModel.name
      this.freightOffroad.fuelConsumption_unit = this.fuel_unit.code
      this.freightOffroad.domOrInt = this.domesticInternational.code
      this.freightOffroad.cargoType = this.cargoType.code


      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseFreightOffroadActivityDataControllerFreightOffroadActivityData(this.freightOffroad)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            console.log('Freight OffRoad',res);
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
        this.serviceProxy.updateOneBaseFreightOffroadActivityDataControllerFreightOffroadActivityData(this.freightOffroad.id, this.freightOffroad)
          .subscribe(
            (res: any) => {
              
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              // console.log('freight OffRoad',res)
              setTimeout(() => {
                this.onBackClick();
              }, 500);
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
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 0, subTabIndex:4, subTabIndexCode: IndexCode.F_OFF_ROAD}});
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.freightOffroad.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseFreightOffroadActivityDataControllerFreightOffroadActivityData(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Freight_offroad);
    }
  }

  check(){
    this.freightOffroad.paidByCompany = this.checked[0]
  }

  onUpdateFuel(event: string) { 
    this.freightOffroad.fuelType = event;
  }


}
