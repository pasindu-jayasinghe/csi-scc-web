import { Component, OnInit, ViewChild } from '@angular/core';
import { AmountSpendBasedNetZeroBusinessTravelEmissionSourceData, Country, FuelBasedNetZeroBusinessTravelEmissionSourceData, FuelFuelBasedNetZeroBusinessTravelEmissionSourceData, GeneratorActivityData, GridFuelBasedNetZeroBusinessTravelEmissionSourceData, HotelDistanceBasedNetZeroBusinessTravelEmissionSourceData, NetZeroBusinessTravelActivityData, NetZeroBusinessTravelActivityDataControllerServiceProxy, NetZeroBusinessTravelActivityDataDto, NetZeroBusinessTravelActivityDataDtoMethod, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, RefrigerantFuelBasedNetZeroBusinessTravelEmissionSourceData, ServiceProxy, Unit, User, VehicleDistanceBasedNetZeroBusinessTravelEmissionSourceData } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-net-zero-business-travel-form',
  templateUrl: './net-zero-business-travel-form.component.html',
  styleUrls: ['./net-zero-business-travel-form.component.css']
})
export class NetZeroBusinessTravelFormComponent extends EmissionCreateBaseComponent implements OnInit {



  business_travel: NetZeroBusinessTravelActivityDataDto = new NetZeroBusinessTravelActivityDataDto();
  creator: User;
  selectedUnit: Unit;

  
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  groupNumber: string;
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public years: any[] = [];
  public months: {name: string, value: number}[] = []
  public fuel:any[] = []
  public units:any
  public types:any
  month: any;
  fuelType:any;
  unit:any
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  creating: boolean = false;


  method: any;
  countries: Country[] = [];
  public genUnits: any;
  public genUnit: any

  public methods_netZeroBusinessTravel: {name: string, id: number,value:string}[] = []
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
    protected netZeroBusinessTravelActivityDataControllerServiceProxy: NetZeroBusinessTravelActivityDataControllerServiceProxy,
  
  ) { 
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }
  public get netZeroBusinessTravelActivityDataDtoMethod(): typeof NetZeroBusinessTravelActivityDataDtoMethod {
    return NetZeroBusinessTravelActivityDataDtoMethod; 
  }
  async ngOnInit() {
    
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    this.units = this.masterDataService.net_zero_business_travel_units;
    this.types= this.masterDataService.net_zero_business_travel_types;
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this. methods_netZeroBusinessTravel=this.masterDataService.methods_netZeroBusinessTravel;
    console.log('this.types',this.types)
    this.setAction();
    await this.setInitialState();
    await this.setUnit();
   
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();
  }

  async getCountries(){
    const res = await this.serviceProxy.getManyBaseCountryControllerCountry(
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
      this.countries = res.data
    })
  }

  public get sourceType(): typeof SourceType {
    return SourceType; 
  }
  
  setAction(){
    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if(id){
      // this.editEntryId = parseInt(id);
      this.groupNumber=id;
      this.isNewEntry = false;
    }
  }
  
  async setCreator(){
    let u = await this.appService.getUser();
    if(u){
      this.creator = u;
      this.business_travel.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Net_zero_business_travel)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.business_travel.unit && this.business_travel.unit.id){
          this.selectedUnit = this.business_travel.unit;
        }
      }
    }
    this.business_travel.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.business_travel.mobile = false;
      this.business_travel.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.business_travel.project, PuesDataReqDtoSourceName.Net_zero_business_travel, this.selectedUnit);    
  }

  isMobileChange(){
    this.business_travel.mobile = this.isMobile;
    this.business_travel.stationary = !this.isMobile;
  }



  async monthCgange(){
    await this.validateMonth(
      PuesDataReqDtoSourceName.Net_zero_business_travel.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.business_travel.year.toString(), this.month.value, this.business_travel)
    let e = this.business_travel.project;
    if(this.month && this.month.value === 12 && e){
      this.business_travel.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.business_travel.project = e;
    this.business_travel.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Net_zero_business_travel)
  }

  removeRow(data:any,index:number){
  
    if(data[index].id){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this data?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: () => {
         this.netZeroBusinessTravelActivityDataControllerServiceProxy.deleteOneRow(data[index].id).subscribe(a=>{

          data.splice(index, 1);
         });
        },
        reject: () => { },
      });
    }else{

      data.splice(index, 1);
    }
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

  async setInitialState(){
    if (this.groupNumber ) {
      let res = await this.netZeroBusinessTravelActivityDataControllerServiceProxy.getOneBussinesTravelDataSet(
        this.groupNumber,
       
      ).toPromise();

      this.business_travel = res;
      if(!this.isView){
        this.addMissingMethodEmptyObject();
      }
      if(this.business_travel.method==NetZeroBusinessTravelActivityDataDtoMethod.DistanceBase){
        await this.getCountries();
      }
      console.log('project',res)
      let project = await this.getProject(this.business_travel.project.id);
      if (project){
        this.business_travel.project = project;
        this.isMobile = this.business_travel.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.business_travel.month);
      // this.fuelType = this.fuel.find(f=>f.code===this.business_travel.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.business_travel.fc_unit);
    }else{
    
      this.setCreator();
    }
  }







  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating=true;

    if(genForm.valid && this.business_travel.project.id&&(
      (this.business_travel.fuel_emission_source_data&&((this.business_travel.fuel_emission_source_data.fuel_data&&this.business_travel.fuel_emission_source_data.fuel_data.length>0)||
      (this.business_travel.fuel_emission_source_data.grid_data&&this.business_travel.fuel_emission_source_data.grid_data.length>0)||
       (this.business_travel.fuel_emission_source_data.refrigerant_data&&this.business_travel.fuel_emission_source_data.refrigerant_data.length>0)))||
       (this.business_travel.distance_emission_source_data&&((this.business_travel.distance_emission_source_data.vehicale_data&&this.business_travel.distance_emission_source_data.vehicale_data.length>0)||
       ( this.business_travel.distance_emission_source_data.hotel_data&&this.business_travel.distance_emission_source_data.hotel_data.length>0)))||
       this.business_travel.spend_emission_source_data&&this.business_travel.spend_emission_source_data.amount_data.length>0

    )){
      this.business_travel.month = this.month.value
      // this.generator.fuelType = this.fuelType.code
      // this.business_travel.fc_unit = this.unit.code


      console.log("ssss",this.business_travel)

      if (this.isNewEntry) {

        this.netZeroBusinessTravelActivityDataControllerServiceProxy
          .createOne(this.business_travel)
          .subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            this.creating = false;
            setTimeout(() => {
              this.onBackClick();
            }, 500);
            },
            (error) => {
              this.creating = false
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'selected paramter may not have Emission factor or server error',
                closable: true,
              });
              console.log('Error', error);
              this.creating = false;
            },
            () => {
              this.creating = false;
            }
          );


      } else {
        this.netZeroBusinessTravelActivityDataControllerServiceProxy
        .createOne(this.business_travel)
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          this.creating = false;
          setTimeout(() => {
            this.onBackClick();
          }, 500);
          },
          (error) => {
            this.creating = false
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'selected paramter may not have Emission factor or server error',
              closable: true,
            });
            console.log('Error', error);
            this.creating = false;
          },
          () => {
            this.creating = false;
          }
        );
      }
    } else{
      this.creating = false
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields or Check input validation',
        closable: true,
      });
      
     }
  }

  async onSelectMethod(selected:any){
    console.log(selected.value);
    await this.getCountries();
    // this.business_travel
     this.business_travel.fuel_emission_source_data.fuel_data=[];
      this.business_travel.fuel_emission_source_data.grid_data=[];
       this.business_travel.fuel_emission_source_data.refrigerant_data=[];
       this.business_travel.distance_emission_source_data.vehicale_data=[];
       this.business_travel.distance_emission_source_data.hotel_data=[];
       this.business_travel.spend_emission_source_data.amount_data=[];
    if(selected.value==NetZeroBusinessTravelActivityDataDtoMethod.FuelBase){
      this.business_travel.fuel_emission_source_data.fuel_data.push(new FuelFuelBasedNetZeroBusinessTravelEmissionSourceData( ));
      this.business_travel.fuel_emission_source_data.grid_data.push(new GridFuelBasedNetZeroBusinessTravelEmissionSourceData( ));
      this.business_travel.fuel_emission_source_data.refrigerant_data.push(new RefrigerantFuelBasedNetZeroBusinessTravelEmissionSourceData( ));
    }else if(selected.value==NetZeroBusinessTravelActivityDataDtoMethod.DistanceBase){
      this.business_travel.distance_emission_source_data.vehicale_data.push(new VehicleDistanceBasedNetZeroBusinessTravelEmissionSourceData( ));
      this.business_travel.distance_emission_source_data.hotel_data.push(new HotelDistanceBasedNetZeroBusinessTravelEmissionSourceData( ));

    }else{
      this.business_travel.spend_emission_source_data.amount_data.push(new AmountSpendBasedNetZeroBusinessTravelEmissionSourceData( ));

    }
  
  }

   addMissingMethodEmptyObject(){
    
    if(this.business_travel.method==NetZeroBusinessTravelActivityDataDtoMethod.FuelBase){
      if(!this.business_travel.fuel_emission_source_data.fuel_data){
        this.business_travel.fuel_emission_source_data.fuel_data=[];
        this.business_travel.fuel_emission_source_data.fuel_data.push(new FuelFuelBasedNetZeroBusinessTravelEmissionSourceData( ));

      }
      if(!this.business_travel.fuel_emission_source_data.grid_data){
        this.business_travel.fuel_emission_source_data.grid_data=[];
        this.business_travel.fuel_emission_source_data.grid_data.push(new GridFuelBasedNetZeroBusinessTravelEmissionSourceData( ));

      }
      if(!this.business_travel.fuel_emission_source_data.refrigerant_data){
        this.business_travel.fuel_emission_source_data.refrigerant_data=[];
        this.business_travel.fuel_emission_source_data.refrigerant_data.push(new RefrigerantFuelBasedNetZeroBusinessTravelEmissionSourceData( ));

      }
    }else if(this.business_travel.method==NetZeroBusinessTravelActivityDataDtoMethod.DistanceBase){
      if( !this.business_travel.distance_emission_source_data.hotel_data){
        this.business_travel.distance_emission_source_data.hotel_data=[]
        this.business_travel.distance_emission_source_data.hotel_data.push(new HotelDistanceBasedNetZeroBusinessTravelEmissionSourceData( ));

      }

    }else{
      if( !this.business_travel.spend_emission_source_data.amount_data){
        this.business_travel.spend_emission_source_data.amount_data=[]
        this.business_travel.spend_emission_source_data.amount_data.push(new AmountSpendBasedNetZeroBusinessTravelEmissionSourceData( ));

      }

    }
  
  }
  addNewDataObject(arryName:string){
     if(arryName=='fuel'){
      this.business_travel.fuel_emission_source_data.fuel_data.push(new FuelFuelBasedNetZeroBusinessTravelEmissionSourceData( ));
     } else if(arryName=='grid'){
      this.business_travel.fuel_emission_source_data.grid_data.push(new GridFuelBasedNetZeroBusinessTravelEmissionSourceData( ));
     } else if(arryName=='ref'){
      this.business_travel.fuel_emission_source_data.refrigerant_data.push(new RefrigerantFuelBasedNetZeroBusinessTravelEmissionSourceData( ));

     } else if(arryName=='distance'){
      this.business_travel.distance_emission_source_data.vehicale_data.push(new VehicleDistanceBasedNetZeroBusinessTravelEmissionSourceData( ));

     } else if(arryName=='hotel'){
      this.business_travel.distance_emission_source_data.hotel_data.push(new HotelDistanceBasedNetZeroBusinessTravelEmissionSourceData( ));

     } else {
      this.business_travel.spend_emission_source_data.amount_data.push(new AmountSpendBasedNetZeroBusinessTravelEmissionSourceData( ));

     }

    
  }









  onBackClick() {
    this.router.navigate(['app/emission/net-zero-business-travel-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the Record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteWholeGroup();
      },
      reject: () => { },
    });
  }

  deleteWholeGroup() {
   

    this.netZeroBusinessTravelActivityDataControllerServiceProxy.deleteWholeGroup(this.groupNumber)
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
        this.router.navigate(['../net-zero-business-travel-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Net_zero_business_travel);
    }
  }

  onUpdateFuel(event: string,fuel:any) {
    fuel.fuel_type = event;
    // console.log(this.upstreamTransportation);
  }

}
