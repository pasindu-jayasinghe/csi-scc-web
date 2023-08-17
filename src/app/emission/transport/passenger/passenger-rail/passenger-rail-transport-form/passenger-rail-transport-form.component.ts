import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import {  PassengerRailActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { IndexCode } from 'app/emission/transport/transport-list/transport-list.component';


@Component({
  selector: 'app-passenger-rail-transport-form',
  templateUrl: './passenger-rail-transport-form.component.html',
  styleUrls: ['./passenger-rail-transport-form.component.css']
})
export class PassengerRailTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  passengerRail: PassengerRailActivityData = new PassengerRailActivityData()
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
  public railFuelType: {name: string, id: number, code: string}[] = []
  public options_freightTransport: {name: string, id: number}[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []

  public units: any
  public onSelectUnitId: any

  month: any;
  method: any;
  ownership: any;
  fuelType: any;
  distance_unit: any
  fuelConsumption_unit: any
  fuelEconomy_unit: any
  domesticInternational: any;

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
    this.methods_freightTransport = this.masterDataService.methods_freightTransport;
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.railFuelType = this.masterDataService.railFuelType;
    this.options_freightTransport =this.masterDataService.options_freightTransport;
    this.units = this.masterDataService.passenger_rail_units
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this.domesticInternationals = this.masterDataService.domesticInternationals;

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
      this.passengerRail.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_rail)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.passengerRail.unit && this.passengerRail.unit.id){
          this.selectedUnit = this.passengerRail.unit;
        }
      }
    }
    this.passengerRail.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.passengerRail.mobile = false;
      this.passengerRail.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.passengerRail.project, PuesDataReqDtoSourceName.Passenger_rail, this.selectedUnit);    
  }

  isMobileChange(){
    this.passengerRail.mobile = this.isMobile;
    this.passengerRail.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Passenger_rail.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.passengerRail.year.toString(), this.month.value, this.passengerRail)
    let e = this.passengerRail.project;
    if(this.month && this.month.value === 12 && e){
      this.passengerRail.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.passengerRail.project = e;
    this.passengerRail.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_rail)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBasePassengerRailActivityDataControllerPassengerRailActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.passengerRail = res;
      let project = await this.getProject(this.passengerRail.project.id);
      if (project) {
        this.passengerRail.project = project;
        this.isMobile = this.passengerRail.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.passengerRail.month);
      // this.ownership = this.ownership_freightTransport.find(o => o.name === this.passengerRail.ownership);

      this.method = this.methods_freightTransport.find(m => m.name === this.passengerRail.method);
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

  save(railForm: NgForm){
    this.creating=true;

    console.log(this.distance_unit)
    
    
    if(railForm.valid && this.passengerRail.project.id){
      this.passengerRail.month = this.month.value
      this.passengerRail.method =this.method.name

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBasePassengerRailActivityDataControllerPassengerRailActivityData(this.passengerRail)
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
        this.serviceProxy.updateOneBasePassengerRailActivityDataControllerPassengerRailActivityData(this.passengerRail.id, this.passengerRail)
          .subscribe(
            (res: any) => {
              this.passengerRail.e_sc = res.e_sc;
              
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
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 1, subTabIndex:2,subTabIndexCode: IndexCode.RAIL }} );
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.passengerRail.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBasePassengerRailActivityDataControllerPassengerRailActivityData(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Passenger_rail);
    }
  }

  check(){
    this.passengerRail.paidByCompany = this.checked[0]
  }

  onUpdateFuel(event: string) {
    this.passengerRail.fuelType = event;
  }
}
