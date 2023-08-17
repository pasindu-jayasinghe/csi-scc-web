import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { ServiceProxy, UpstreamTransportationActivityData, User, Unit, PuesDataDto, Project, Country, ProjectUnitEmissionSourceControllerServiceProxy, FranchisesActivityDataControllerServiceProxy, PuesDataReqDtoSourceName, UpstreamTransportationActivityDataMethod, FreightAirActivityData, SpecificMethodParameters, SampleGroupParameters, AverageDataMethodFloorSpaceDataParameters, AverageDataMethodNotFloorSpaceDataParameters, NotSubMeteredParameters, UpstreamTransportationActivityDataControllerServiceProxy, UpstreamTransportationActivityDataDto, UpstreamTransportationActivityDataDtoMethod, DistanceBaseMethodDataParameters, DTAverageDataMethodDataParameters, SiteSpecificMethodParameters, SpendBaseMethodDataParameters, FuelParameters, BackhaulParameters, ElectricityParameters, RefrigerentParameters } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-net-zero-upstream-transportation-form',
  templateUrl: './net-zero-upstream-transportation-form.component.html',
  styleUrls: ['./net-zero-upstream-transportation-form.component.css']
})
export class NetZeroUpstreamTransportationFormComponent extends EmissionCreateBaseComponent implements OnInit {



  upstreamTransportation: UpstreamTransportationActivityDataDto = new UpstreamTransportationActivityDataDto();
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

  public methods: { name: string, code: UpstreamTransportationActivityDataDtoMethod}[] = []
  public refrigerantTypes: any[] = []
  public vehicleTypes: { name: string;id: number;code: string;}[] = []
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
    protected upstreamTransportationActivityDataControllerServiceProxy: UpstreamTransportationActivityDataControllerServiceProxy,
  
  ) { 
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }
  public get upstreamTransportationActivityDataDtoMethod(): typeof UpstreamTransportationActivityDataDtoMethod {
    return UpstreamTransportationActivityDataDtoMethod; 
  }

  // UpstreamTransportationActivityDataDtoMethod' and 'UpstreamTransportationActivityDataMethod' 

  async ngOnInit() {  

    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    this.units = this.masterDataService.downstreamTransportationUnits;
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this.refrigerantTypes = this.masterDataService.gWP_RGs;
    this.vehicleTypes =  this.masterDataService.public_transport_modes;

    let keys = Object.keys(UpstreamTransportationActivityDataDtoMethod);
    for(let i = 1; i < keys.length; i = i+2){
      this.methods.push({
        name: keys[i].toLowerCase(),
        code: keys[i] as unknown as UpstreamTransportationActivityDataDtoMethod
      })
    }
    

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
   
    console.log('this.upstreamTransportation',this.upstreamTransportation)
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
      this.upstreamTransportation.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Franchises)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.upstreamTransportation.unit && this.upstreamTransportation.unit.id){
          this.selectedUnit = this.upstreamTransportation.unit;
        }
      }
    }
    this.upstreamTransportation.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.upstreamTransportation.mobile = false;
      this.upstreamTransportation.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.upstreamTransportation.project, PuesDataReqDtoSourceName.Franchises, this.selectedUnit);    
  }

  isMobileChange(){
    this.upstreamTransportation.mobile = this.isMobile;
    this.upstreamTransportation.stationary = !this.isMobile;
  }



  async monthCgange(){
    await this.validateMonth(
      PuesDataReqDtoSourceName.Franchises.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.upstreamTransportation.year.toString(), this.month.value, this.upstreamTransportation)
    let e = this.upstreamTransportation.project;
    if(this.month && this.month.value === 12 && e){
      this.upstreamTransportation.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.upstreamTransportation.project = e;
    this.upstreamTransportation.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Franchises)
  }

  removeRow(data:any,index:number){
  
    if(this.groupNumber){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this data?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: () => {
         this.upstreamTransportationActivityDataControllerServiceProxy.deleteOneRow(data[index].id).subscribe(a=>{

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
      let res = await this.upstreamTransportationActivityDataControllerServiceProxy.getOneUpstreamTransportationDataSet(
        this.groupNumber,       
      ).toPromise();

      this.upstreamTransportation = res;
      let project = await this.getProject(this.upstreamTransportation.project.id);
      if (project){
        this.upstreamTransportation.project = project;
        this.isMobile = this.upstreamTransportation.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.upstreamTransportation.month);
    }else{    
      this.setCreator();
    }
  }







  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating=true;

    if(genForm.valid && this.upstreamTransportation.project.id){
      this.upstreamTransportation.month = this.month.value
      // this.generator.fuelType = this.fuelType.code
      // this.upstreamTransportation.fc_unit = this.unit.code


      console.log("bbbbb--------",this.upstreamTransportation)

      if (this.isNewEntry) {

        this.upstreamTransportationActivityDataControllerServiceProxy
          .createOne(this.upstreamTransportation)
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
                detail: 'An error occurred, please try again',
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
        this.upstreamTransportationActivityDataControllerServiceProxy
        .createOne(this.upstreamTransportation)
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
              detail: 'An error occurred, please try again',
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
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      
     }
  }

  async onSelectMethod(selected:any){
    // console.log(selected.value);
    switch(this.upstreamTransportation.method){
      case UpstreamTransportationActivityDataDtoMethod.FUELBASEMETHOD:
        this.upstreamTransportation.fule_based_method_data.fuel_data.push(new FuelParameters())
        this.upstreamTransportation.fule_based_method_data.electricity_data.push(new ElectricityParameters())
        this.upstreamTransportation.fule_based_method_data.refrigerent_data.push(new RefrigerentParameters())
        this.upstreamTransportation.fule_based_method_data.backhaul_data.push(new BackhaulParameters())
        break;
      case UpstreamTransportationActivityDataDtoMethod.DISTANCEBASEMETHOD:
        this.upstreamTransportation.distance_based_method_data.data.push(new DistanceBaseMethodDataParameters());
        break;
      case UpstreamTransportationActivityDataDtoMethod.SPENDBASEMETHOD:
        this.upstreamTransportation.spend_based_method_data.data.push(new SpendBaseMethodDataParameters());
        break;
      case UpstreamTransportationActivityDataDtoMethod.SITESPECIFICMETHOD:
        this.upstreamTransportation.site_specific_method_data.data.push(new SiteSpecificMethodParameters());
        break;
      case UpstreamTransportationActivityDataDtoMethod.AVERAGEDATAMETHOD:
        this.upstreamTransportation.average_data_method_data.data.push(new DTAverageDataMethodDataParameters());
        break;
    }
  }
  addNewDataObject(method:UpstreamTransportationActivityDataDtoMethod, type: string=''){
    switch(this.upstreamTransportation.method){
      case UpstreamTransportationActivityDataDtoMethod.FUELBASEMETHOD:
        switch(type){
          case 'fuel':
            this.upstreamTransportation.fule_based_method_data.fuel_data.push(new FuelParameters())
            break;
          case 'electricity':
            this.upstreamTransportation.fule_based_method_data.electricity_data.push(new ElectricityParameters())
            break;
          case 'refrigerent':
            this.upstreamTransportation.fule_based_method_data.refrigerent_data.push(new RefrigerentParameters())
            break;
          case 'backhaul':
            this.upstreamTransportation.fule_based_method_data.backhaul_data.push(new BackhaulParameters())
            break;
        }
        // this.upstreamTransportation.fule_based_method_data.data.push(new SpecificMethodParameters()); // TOFO
        break;
      case UpstreamTransportationActivityDataDtoMethod.DISTANCEBASEMETHOD:
        this.upstreamTransportation.distance_based_method_data.data.push(new DistanceBaseMethodDataParameters());
        break;
      case UpstreamTransportationActivityDataDtoMethod.SPENDBASEMETHOD:
        this.upstreamTransportation.spend_based_method_data.data.push(new SpendBaseMethodDataParameters());
        break;
      case UpstreamTransportationActivityDataDtoMethod.SITESPECIFICMETHOD:
        this.upstreamTransportation.site_specific_method_data.data.push(new SiteSpecificMethodParameters());
        break;
      case UpstreamTransportationActivityDataDtoMethod.AVERAGEDATAMETHOD:
        this.upstreamTransportation.average_data_method_data.data.push(new DTAverageDataMethodDataParameters());
        break;
    }
  }









  onBackClick() {
    this.router.navigate(['app/emission/upstream-transport-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        // this.deleteWholeGroup();
      },
      reject: () => { },
    });
  }

  deleteWholeGroup() {

    this.upstreamTransportationActivityDataControllerServiceProxy.deleteWholeGroup(this.upstreamTransportation.groupNo)
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
        this.onBackClick();
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Franchises);
    }
  }
  onUpdateFuel(event: string,fuel:any,type:any) {
    
    switch(type) { 
      case "fuelBasefuelType": { 
        fuel.fuelBasefuelType = event
        break; 
      } 
      case "fuelBaseBackhaulFuelType": { 
        fuel.fuelBaseBackhaulFuelType = event
        break; 
      } 
      case "fuel_type": { 
        fuel.fuel_type = event;
        break; 
     } 
     case "fuelType": { 
      fuel.fuelType = event;
      break; 
   } 
      default: { 
         //statements; 
         break; 
      } 
   } 

  }
}
