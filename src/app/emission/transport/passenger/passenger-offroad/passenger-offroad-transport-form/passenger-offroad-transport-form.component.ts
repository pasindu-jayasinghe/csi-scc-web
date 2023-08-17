import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { PassengerOffroadActivityData, User, Unit, Project, ServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ProjectUnitEmissionSourceControllerServiceProxy, Industry, IndustryType } from 'shared/service-proxies/service-proxies';
import { IndexCode } from 'app/emission/transport/transport-list/transport-list.component';


@Component({
  selector: 'app-passenger-offroad-transport-form',
  templateUrl: './passenger-offroad-transport-form.component.html',
  styleUrls: ['./passenger-offroad-transport-form.component.css']
})
export class PassengerOffroadTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  passengerOffroad: PassengerOffroadActivityData = new PassengerOffroadActivityData();
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
  public fuelType1: {name: string, id: number, code: string}[] = []
  public options_freightTransport: {name: string, id: number}[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []
  public strokes: {name: string, id: number, code: string}[] = []

  public units: any
  public onSelectUnitId: any
  // public cost_per_km: number
  // public totalCost: number

  month: any;
  method: any;
  ownership: any;
  distance_unit: any;
  fuelConsumption_unit: any;
  fuelEconomy_unit: any;
  domesticInternational: any;

  creating: boolean = false;

  industries: Industry[]

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
    this.methods_freightTransport = this.masterDataService.methods_freightTransport;
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.fuelType1 = this.masterDataService.fuel;
    this.options_freightTransport =this.masterDataService.options_freightTransport;
    this.units = this.masterDataService.passenger_offroad_units
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.strokes = this.masterDataService.strokes

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
    await this.getIndustries();
       
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
      this.passengerOffroad.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_offroad)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.passengerOffroad.unit && this.passengerOffroad.unit.id){
          this.selectedUnit = this.passengerOffroad.unit;
        }
      }
    }
    this.passengerOffroad.unit = this.selectedUnit;
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
      this.passengerOffroad.mobile = false;
      this.passengerOffroad.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.passengerOffroad.project, PuesDataReqDtoSourceName.Passenger_offroad, this.selectedUnit);    
  }

  isMobileChange(){
    this.passengerOffroad.mobile = this.isMobile;
    this.passengerOffroad.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Passenger_offroad.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.passengerOffroad.year.toString(), this.month.value, this.passengerOffroad)
    let e = this.passengerOffroad.project;
    if(this.month && this.month.value === 12 && e){
      this.passengerOffroad.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.passengerOffroad.project = e;
    this.passengerOffroad.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_offroad)

  }

  async setInitialState() {
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBasePassengerOffroadActivityDataControllerPassengerOffroadActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.passengerOffroad = res;
      let project = await this.getProject(this.passengerOffroad.project.id);
      if (project) {
        this.passengerOffroad.project = project;
        this.isMobile = this.passengerOffroad.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.passengerOffroad.month);
      this.ownership = this.ownership_freightTransport.find(o => o.name === this.passengerOffroad.ownership);

      this.method = this.methods_freightTransport.find(m => m.name === this.passengerOffroad.method);

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
  //   console.log("Freight Option",this.option.id)
  //   console.log("selected",selected)
  // }

  onSelectUnit(selected:any){
    this.onSelectUnitId = selected.value.code
   }

  // onCostchange(val: number){
  //   this.passengerOffroad.totalDistanceTravelled =  val * this.cost_per_km
  // }


  save(offRoadForm: NgForm){
    this.creating=true;

    this.setUnit()
    
    
    
    if(offRoadForm.valid && this.passengerOffroad.project.id){
      this.passengerOffroad.month = this.month.value
      this.passengerOffroad.method =this.method.name

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBasePassengerOffroadActivityDataControllerPassengerOffroadActivityData(this.passengerOffroad)
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
        this.passengerOffroad.e_sc = this.passengerOffroad.e_sc
        this.serviceProxy.updateOneBasePassengerOffroadActivityDataControllerPassengerOffroadActivityData(this.passengerOffroad.id, this.passengerOffroad)
          .subscribe(
            (res: any) => {
              this.passengerOffroad.e_sc = res.e_sc;
              
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
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 1, subTabIndex:1, subTabIndexCode: IndexCode.OFF_ROAD}} );
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.passengerOffroad.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBasePassengerOffroadActivityDataControllerPassengerOffroadActivityData(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Passenger_offroad);
    }
  }

  check(){
    this.passengerOffroad.paidByCompany = this.checked[0]
  }

  onUpdateFuel(event: string) {
    this.passengerOffroad.fuelType = event;
  }

}
