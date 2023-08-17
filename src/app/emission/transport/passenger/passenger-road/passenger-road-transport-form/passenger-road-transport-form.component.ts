import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs/operators';
import { AppService } from 'shared/AppService';
import { EmployeeName, PassengerRoadActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { IndexCode } from 'app/emission/transport/transport-list/transport-list.component';

import { NewEmployeeComponent } from '../new-employee/new-employee.component';

@Component({
  selector: 'app-passenger-road-transport-form',
  templateUrl: './passenger-road-transport-form.component.html',
  styleUrls: ['./passenger-road-transport-form.component.css']
})
export class PassengerRoadTransportFormComponent extends EmissionCreateBaseComponent implements OnInit, OnChanges {

  @Input() roadMethod: any

  passengerRoad: PassengerRoadActivityData = new PassengerRoadActivityData()
  employeeName:EmployeeName = new EmployeeName();
  empName:any
  employees:any
  display:boolean = false
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: any;

  checked: any;

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public methods_freightTransport: {name: string, id: number}[] = []
  public ownership_freightTransport: {name: string, id: number}[] = []
  public fuelType1: {name: string, id: number}[] = []
  public fuelTypeBT: {name: string, id: number}[] = []
  public options_freightTransport: {name: string, id: number}[] = []
  public no_emission_modes: { name: string, id: number, code: string }[] = []
  public private_modes: { name: string, id: number, code: string }[] = []
  public public_modes: { name: string, id: number, code: string }[] = []
  public onroadMethods: { name: string, id: number, code: string }[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []

  public units: any
  public onSelectUnitId: any
  public totalCost: number
  public transport_method: any;

  month: any;
  method: any;
  ownership: any;
  fuelType: any;
  distance_unit: any = {}
  btFuelConsumption_unit: any = {}
  fuelEconomy_unit: any = {}
  petrolConsumption_unit: any = {}
  dieselConsumption_unit: any = {}
  noEmissionDistance_unit: any = {}
  privateDistance_unit: any = {}
  publicDistance_unit: any = {}
  public_mode: any = {}
  private_mode: any = {}
  directTransportMode: any
  no_emission_mode: any = {}
  onroadMethod: any = {};
  domesticInternational: any;
  empId:any;
  nextempId:number;

  creating: boolean = false;
  direct: boolean;


  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute:ActivatedRoute,
    protected appService: AppService,
    protected dialogService: DialogService,

    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy
  ) {
        super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }

  async ngOnInit(): Promise<void> {
    this.passengerRoad.transportMethod = this.masterDataService.passenger_onroad_methods[0].code
    this.months = this.masterDataService.months;
    this.methods_freightTransport = this.masterDataService.methods_freightTransport;
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.fuelType1 = this.masterDataService.fuel;
    this.fuelTypeBT = this.masterDataService.fuel;
    this.options_freightTransport =this.masterDataService.options_freightTransport;
    this.units = this.masterDataService.passenger_road_units
    this.no_emission_modes = this.masterDataService.noEmission_transport_modes;
    this.private_modes = this.masterDataService.private_transport_modes;
    this.public_modes = this.masterDataService.public_transport_modes;
    this.onroadMethods = this.masterDataService.passenger_onroad_methods;
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this.domesticInternationals = this.masterDataService.domesticInternationals;

    let empres = await this.serviceProxy
   .getManyBaseEmployeeNameControllerEmployeeName(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    3000,
    0,
    0,
    0
   ).toPromise();
   this.employees = empres.data;

  
console.log("PPPPPP",this.employees)


   this.employees = this.employees.map((divition: any) => {
    return {
      ...divition,
      displayLabel: divition.name + ' ' + divition.empId,
    };
  });


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
      this.passengerRoad.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_road)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.passengerRoad.unit && this.passengerRoad.unit.id){
          this.selectedUnit = this.passengerRoad.unit;
        }
      }
    }
    this.passengerRoad.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.passengerRoad.mobile = false;
      this.passengerRoad.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.passengerRoad.project, PuesDataReqDtoSourceName.Passenger_road, this.selectedUnit);  
  }

  isMobileChange(){
    this.passengerRoad.mobile = this.isMobile;
    this.passengerRoad.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Passenger_road.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.passengerRoad.year.toString(), this.month.value, this.passengerRoad)
    let e = this.passengerRoad.project;
    if(this.month && this.month.value === 12 && e){
      this.passengerRoad.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.passengerRoad.project = e;
    this.passengerRoad.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_road)
  }

  ngOnChanges(){
  }

  async setInitialState(){

    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBasePassengerRoadActivityDataControllerPassengerRoadActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.passengerRoad = res;
      let project = await this.getProject(this.passengerRoad.project.id);
      if (project){
        this.passengerRoad.project = project;
        this.isMobile = this.passengerRoad.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.passengerRoad.month);
      this.method = this.methods_freightTransport.find(m => m.name === this.passengerRoad.method);


    }else{
      this.setCreator();
    }

    this.passengerRoad.transportMethod = "EC";

  }

  onSelectMethod(selected:any){
    this.method = this.methods_freightTransport
    .find(m=> 
     m.id === selected.value.id);
    if (this.method.id ===  1){
      this.passengerRoad.noOfTrips = 1
    }
  }


  // onSelectOption(selected:any){
  //   this.option = this.options_freightTransport
  //   .find(o=> 
  //    o.id === selected.value.id);
  // }

  onSelectUnit(selected:any){
    this.onSelectUnitId = selected.value.code
   }

  onCostChange(e: any){
    // this.passengerRoad.totalDistanceTravelled = e * this.passengerRoad.cost
  }

  async saveEmployee(event: any){
    let ref = this.dialogService.open(NewEmployeeComponent, {
      header: 'Add New Employee',
      width: '30%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        unit: this.passengerRoad.unit,
      },
  });

  ref.onClose.pipe(take(1)).subscribe(async (res) => {   
    let empres = await this.serviceProxy
   .getManyBaseEmployeeNameControllerEmployeeName(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    3000,
    0,
    0,
    0
   ).toPromise();
   this.employees = empres.data;
  



   this.employees = this.employees.map((divition: any) => {
    return {
      ...divition,
      displayLabel: divition.name + ' ' + divition.empId,
    };
  });

     })

}



  
  


  save(passengerForm: NgForm){
    this.creating=true;

    console.log("prod",this.passengerRoad)

    if(passengerForm.valid && this.passengerRoad.project.id && this.passengerRoad.employeeName ){
      
      this.passengerRoad.month = this.month.value
      this.passengerRoad.method =this.method.name

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBasePassengerRoadActivityDataControllerPassengerRoadActivityData(this.passengerRoad)
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
        this.serviceProxy.updateOneBasePassengerRoadActivityDataControllerPassengerRoadActivityData(this.passengerRoad.id, this.passengerRoad)
          .subscribe(
            (res: any) => {
              this.passengerRoad.e_sc = res.e_sc;
              
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
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
     
  }


  onBackClick() {
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 1, subTabIndex:3, subTabIndexCode: IndexCode.EMP_COM}} );
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.passengerRoad.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBasePassengerRoadActivityDataControllerPassengerRoadActivityData(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Passenger_road);
    }
  }

  check(){
    this.passengerRoad.paidByCompany = this.checked[0]
  }


  onUpdateFuel(event: string) { 
    this.passengerRoad.fuelType = event;
  }

  onUpdateHiredFuel(event: string) {
    this.passengerRoad.hiredFuelType = event;
  }
}
