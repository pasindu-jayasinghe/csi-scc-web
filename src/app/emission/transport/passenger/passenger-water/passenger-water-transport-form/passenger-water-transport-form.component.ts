import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { PassengerWaterActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { IndexCode } from 'app/emission/transport/transport-list/transport-list.component';


@Component({
  selector: 'app-passenger-water-transport-form',
  templateUrl: './passenger-water-transport-form.component.html',
  styleUrls: ['./passenger-water-transport-form.component.css']
})
export class PassengerWaterTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {
  passengerWater: PassengerWaterActivityData = new PassengerWaterActivityData()
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
  public fuelTypes: {name: string, id: number, code: string}[] = []
  public options_freightTransport: {name: string, id: number}[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []
  public vehicleModels: {name: string, id: number, code: string}[] = []

  public units: any
  public onSelectUnitId: any

  month: any;
  method: any;
  ownership: any;
  // fuelType: any;
  // domesticInternational: any;

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
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy
  ) {
        super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }

  async ngOnInit(): Promise<void> {
    this.months = this.masterDataService.months;
    this.methods_freightTransport = this.masterDataService.methods_freightTransport.filter(m => m.id === 1);
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.fuelTypes = this.masterDataService.fuel;
    this.options_freightTransport =this.masterDataService.options_freightTransport;
    this.units = this.masterDataService.passenger_water_units
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.vehicleModels = this.masterDataService.p_water_vehicle_model

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
      this.passengerWater.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_water)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.passengerWater.unit && this.passengerWater.unit.id){
          this.selectedUnit = this.passengerWater.unit;
        }
      }
    }
    this.passengerWater.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.passengerWater.mobile = false;
      this.passengerWater.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.passengerWater.project, PuesDataReqDtoSourceName.Passenger_water, this.selectedUnit);    
  }

  isMobileChange(){
    this.passengerWater.mobile = this.isMobile;
    this.passengerWater.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Passenger_water.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.passengerWater.year.toString(), this.month.value, this.passengerWater)
    let e = this.passengerWater.project;
    if(this.month && this.month.value === 12 && e){
      this.passengerWater.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.passengerWater.project = e;
    this.passengerWater.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_water)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBasePassengerWaterControllerPassengerWaterActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.passengerWater = res;
      let project = await this.getProject(this.passengerWater.project.id);
      if (project) {
        this.passengerWater.project = project;
        this.isMobile = this.passengerWater.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.passengerWater.month);
      this.ownership = this.ownership_freightTransport.find(o => o.name === this.passengerWater.ownership);

      this.method = this.methods_freightTransport.find(m => m.name === this.passengerWater.method);
    } else {
      this.setCreator();
    }
  }


  onSelectMethod(selected:any){
    this.method = this.methods_freightTransport
    .find(m=> 
     m.id === selected.value.id);
    console.log("Freight method",this.method.id)
    console.log("selected",selected)
  }

  // onSelectOption(selected:any){
  //   this.option = this.options_freightTransport
  //   .find(o=> 
  //    o.id === selected.value.id);
  // }

  onSelectUnit(selected:any){
    this.onSelectUnitId = selected.value.code
   }

  save(waterForm: NgForm){
    this.creating=true;
    
    
    if(waterForm.valid && this.passengerWater.project.id){
      this.passengerWater.month = this.month.value
      this.passengerWater.method =this.method.name
      // this.passengerWater.fuelType =this.fuelType.code
      this.passengerWater.ownership =this.ownership.name
      // this.passengerWater.totalDistanceTravelled_unit = this.distance_unit.code
      // this.passengerWater.fuelConsumption_unit = this.fuelConsumption_unit?.code
      // this.passengerWater.fuelEconomy_unit = this.fuelEconomy_unit?.code
      // this.passengerWater.domOrInt = this.domesticInternational.code

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBasePassengerWaterControllerPassengerWaterActivityData(this.passengerWater)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            console.log('Freight road',res);
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
        this.serviceProxy.updateOneBasePassengerWaterControllerPassengerWaterActivityData(this.passengerWater.id, this.passengerWater)
          .subscribe(
            (res: any) => {
              this.passengerWater.e_sc = res.e_sc;
              
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
  }

  onBackClick() {
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 1, subTabIndex:4, subTabIndexCode: IndexCode.WATER}} );
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.passengerWater.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBasePassengerWaterControllerPassengerWaterActivityData(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Passenger_water);
    }
  }

  check(){
    this.passengerWater.paidByCompany = this.checked[0]
  }

  onUpdateFuel(event: string) { 
    this.passengerWater.fuelType = event;
  }
}
