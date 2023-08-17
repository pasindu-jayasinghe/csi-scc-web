import { Component, OnInit, ViewChild } from '@angular/core';
import { ElecBasedData, FuelBsedData, FuelEnergyRelatedActivitiesActivityData, FuelEnergyRelatedActivitiesActivityDataActivityDataStatus, FuelEnergyRelatedActivitiesActivityDataControllerServiceProxy, FuelEnergyRelatedActivitiesActivityDataDto, InvestmentsActivityData, InvestmentsActivityDataActivityDataStatus, InvestmentsActivityDataControllerServiceProxy, InvestmentsActivityDataDto, MethodABasedData, MethodBBasedData, MethodCBasedData, MethodDBasedData, MethodEBasedData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, PurchsoldBasedData, ServiceProxy, TanddBasedData, Unit, User } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-fuel-energy-activity-form',
  templateUrl: './fuel-energy-activity-form.component.html',
  styleUrls: ['./fuel-energy-activity-form.component.css']
})
export class FuelEnergyActivityFormComponent extends EmissionCreateBaseComponent implements OnInit {



  fuelenergyact: FuelEnergyRelatedActivitiesActivityDataDto= new FuelEnergyRelatedActivitiesActivityDataDto();



  creator: User;
  selectedUnit: Unit;

  public activityTypes: any[] = []

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: any;
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public years: any[] = [];
  public months: { name: string, value: number }[] = []
  public fuel: any[] = []
  public units: any
  public sectors: any

  month: any;
  fuelType: any;
  unit: any
  isMobile: boolean;
  ownerships: { id: number, name: string }[] = []


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  creating: boolean = false;

  public genUnits: any;
  public genUnit: any;
  fuelTypes_upstream:any
  fuelTypes_lc:any

  operatingSectors:any
  constructSectors:any



  constructor(
    protected serviceProxy: ServiceProxy,
    private fuelenergyactProxy: FuelEnergyRelatedActivitiesActivityDataControllerServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute: ActivatedRoute,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy
  ) {
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }

  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    // this.units = this.masterDataService.investment_units;
    this.ownerships = this.masterDataService.ownership_freightTransport;
    this.activityTypes = this.masterDataService.fuelEnergyActivityTypes;
    this.units = this.masterDataService.fuel_energy_activity_units;
    this.fuelTypes_upstream = this.masterDataService.fuel_upstream;
    this.operatingSectors = this.masterDataService.operatingsectors;
    this.constructSectors = this.masterDataService.constructsectors;
    this.fuelTypes_lc = this.masterDataService.fuel_lifecycle;





    this.setAction();
    await this.setInitialState();
    await this.setUnit();

    this.isAnyAdmin = this.appService.isAnyAdmin();
    this.isProjectSelected = true;

    await super.ngOnInit();
  }



  public get sourceType(): typeof SourceType {
    return SourceType;
  }

  setAction() {
    this.route.url.subscribe(r => {
      if (r[0].path.includes("view")) {
        this.isView = true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editEntryId = id;

      console.log("gggg",this.editEntryId)
      this.isNewEntry = false;
    }
  }

  async setCreator() {
    let u = await this.appService.getUser();
    if (u) {
      this.creator = u;
      this.fuelenergyact.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Fuel_energy_related_activities)

  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.fuelenergyact.unit && this.fuelenergyact.unit.id) {
          this.selectedUnit = this.fuelenergyact.unit;
        }
      }
    }
    this.fuelenergyact.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.fuelenergyact.mobile = false;
      this.fuelenergyact.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.fuelenergyact.project, PuesDataReqDtoSourceName.Fuel_energy_related_activities, this.selectedUnit);
  }

  isMobileChange() {
    this.fuelenergyact.mobile = this.isMobile;
    this.fuelenergyact.stationary = !this.isMobile;
  }



  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Fuel_energy_related_activities.toString(), this.selectedProject.id, this.selectedUnit.id,
      this.fuelenergyact.year.toString(), this.month.value, this.fuelenergyact)
    let e = this.fuelenergyact.project;
    if (this.month && this.month.value === 12 && e) {
      this.fuelenergyact.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.fuelenergyact.project = e;
    this.fuelenergyact.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Fuel_energy_related_activities)
  }

  async getProject(id: number) {
    let res = await this.serviceProxy.getOneBaseProjectControllerProject(
      id,
      undefined,
      undefined,
      0
    ).toPromise();
    return res;
  }

  async setInitialState() {
    if (this.editEntryId && this.editEntryId !== undefined) {
      let res = await this.fuelenergyactProxy.getEntryById(
        this.editEntryId,
      ).toPromise();
       this.fuelenergyact = res;
      console.log("edit",this.fuelenergyact)
      let project = await this.getProject(res.project.id);

      if (project) {

        this.fuelenergyact.project = project;
        this.isMobile = this.fuelenergyact.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.fuelenergyact.month);
      // this.fuelType = this.fuel.find(f=>f.code===this.fuelenergyact.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.fuelenergyact.fc_unit);
    } else {
      this.setCreator();
    }
  }

  onSelectMethod(event:any){
    this.fuelenergyact.methodA_data = []
    this.fuelenergyact.methodB_data =[]
    this.fuelenergyact.methodC_data = []
    this.fuelenergyact.methodD_data = []
  }


  addMethodAData() {
    this.fuelenergyact.methodA_data.push(new FuelBsedData({ consumption: undefined, fuelType: "",id:0 ,consumption_unit:"0",user_input_ef:undefined}))

  }
  addMethodBData() {
    this.fuelenergyact.methodB_data.push(new ElecBasedData({ consumption: undefined, fuelType: "",id:0 ,consumption_unit:"0",user_input_ef:undefined}))

  }
  addMethodCData() {
    this.fuelenergyact.methodC_data.push(new TanddBasedData({ consumption: undefined, fuelType: "",id:0 ,consumption_unit:"0",user_input_ef:undefined}))

  }

  addMethodDData() {
    this.fuelenergyact.methodD_data.push(new PurchsoldBasedData({ consumption: undefined, fuelType: "",id:0 ,consumption_unit:"0",user_input_ef:undefined}))

  }




  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;


    if (genForm.valid && this.fuelenergyact.project.id && [this.fuelenergyact.methodA_data, this.fuelenergyact.methodB_data, this.fuelenergyact.methodC_data, this.fuelenergyact.methodD_data].some(arr => arr.length > 0) ) {
      this.fuelenergyact.month = this.month.value

      if (this.isNewEntry) {


        this.fuelenergyactProxy.createAll(this.fuelenergyact)
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
        this.fuelenergyactProxy.updateAll(0, this.fuelenergyact)
          .subscribe(
            (res) => {
              this.creating = false
           //   this.fuelenergyact.emission = res.emission;
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
              this.creating = false
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
    } else {
      this.creating = false
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });

    }
  }












  onBackClick() {
    this.router.navigate(['app/emission/fuel-energy-activity-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
       this.delete(this.fuelenergyact.groupNo);
      },
      reject: () => { },
    });
  }

  delete(groupNo: string) {
    
    this.fuelenergyactProxy.deleteAllEntry(groupNo)
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      }, error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, () => {
        this.router.navigate(['../fuelenergyact-list'], { relativeTo: this.activatedRoute });
      })
  }


  deleteOneA(i:number, id: number) {
    this.fuelenergyact.methodA_data.splice(i, 1);
    this.deleteOneEntry(id);

  }

  deleteOneB(i:number, id: number) {
    this.fuelenergyact.methodB_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneC(i:number, id: number) {
    this.fuelenergyact.methodC_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneD(i:number, id: number) {
    this.fuelenergyact.methodD_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

 
  deleteOneEntry(id:number){
    if(id>0){
      this.fuelenergyactProxy.deleteEntry(id)
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
        
      },
      //()=>this.onSearch()
      )}

  }
  async checkAccess() {
    if (this.selectedProject && this.selectedUnit) {
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Fuel_energy_related_activities);
    }
  }

  onUpdateFuel(event: string) {
    // this.fuelenergyact.fuelType = event;
  }

}
