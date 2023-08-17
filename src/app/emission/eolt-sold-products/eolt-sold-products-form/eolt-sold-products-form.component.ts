import { Component, OnInit, ViewChild } from '@angular/core';
import { ElecBasedData, EndOfLifeTreatmentOfSoldProductsActivityDataActivityDataStatus, EndOfLifeTreatmentOfSoldProductsActivityDataControllerServiceProxy, EndOfLifeTreatmentOfSoldProductsActivityDataDto, FuelBsedData, FuelEnergyRelatedActivitiesActivityData, FuelEnergyRelatedActivitiesActivityDataActivityDataStatus, FuelEnergyRelatedActivitiesActivityDataControllerServiceProxy, FuelEnergyRelatedActivitiesActivityDataDto, InvestmentsActivityData, InvestmentsActivityDataActivityDataStatus, InvestmentsActivityDataControllerServiceProxy, InvestmentsActivityDataDto, MethodABasedData, MethodBBasedData, MethodCBasedData, MethodDBasedData, MethodEBasedData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, PurchsoldBasedData, ServiceProxy, TanddBasedData, Unit, User, WasteBasedData } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-eolt-sold-products-form',
  templateUrl: './eolt-sold-products-form.component.html',
  styleUrls: ['./eolt-sold-products-form.component.css']
})
export class EoltSoldProductsFormComponent extends EmissionCreateBaseComponent implements OnInit {

  

  eoltsoldproductact: EndOfLifeTreatmentOfSoldProductsActivityDataDto = new EndOfLifeTreatmentOfSoldProductsActivityDataDto;



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

  public anaerobicDeepLagoons: any[] = [];



  constructor(
    protected serviceProxy: ServiceProxy,
    private eoltsoldproductactProxy: EndOfLifeTreatmentOfSoldProductsActivityDataControllerServiceProxy,
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
    this.units = this.masterDataService.eoltsold_products_units;
    this.fuelTypes_upstream = this.masterDataService.fuel_upstream;
    this.operatingSectors = this.masterDataService.operatingsectors;
    this.constructSectors = this.masterDataService.constructsectors;
    this.fuelTypes_lc = this.masterDataService.fuel_lifecycle;

    this.anaerobicDeepLagoons = this.masterDataService.anaerobicDeepLagoons;




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
      this.eoltsoldproductact.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.End_of_life_treatment_of_sold_products)

  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.eoltsoldproductact.unit && this.eoltsoldproductact.unit.id) {
          this.selectedUnit = this.eoltsoldproductact.unit;
        }
      }
    }
    this.eoltsoldproductact.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.eoltsoldproductact.mobile = false;
      this.eoltsoldproductact.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.eoltsoldproductact.project, PuesDataReqDtoSourceName.End_of_life_treatment_of_sold_products, this.selectedUnit);
  }

  isMobileChange() {
    this.eoltsoldproductact.mobile = this.isMobile;
    this.eoltsoldproductact.stationary = !this.isMobile;
  }



  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.End_of_life_treatment_of_sold_products.toString(), this.selectedProject.id, this.selectedUnit.id,
      this.eoltsoldproductact.year.toString(), this.month.value, this.eoltsoldproductact)
    let e = this.eoltsoldproductact.project;
    if (this.month && this.month.value === 12 && e) {
      this.eoltsoldproductact.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.eoltsoldproductact.project = e;
    this.eoltsoldproductact.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.End_of_life_treatment_of_sold_products)
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
      let res = await this.eoltsoldproductactProxy.getEntryById(
        this.editEntryId,
      ).toPromise();
       this.eoltsoldproductact = res;
      console.log("edit",this.eoltsoldproductact)
      let project = await this.getProject(res.project.id);

      if (project) {

        this.eoltsoldproductact.project = project;
        this.isMobile = this.eoltsoldproductact.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.eoltsoldproductact.month);
      // this.fuelType = this.fuel.find(f=>f.code===this.eoltsoldproductact.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.eoltsoldproductact.fc_unit);
    } else {
      this.setCreator();
    }
  }

  wasteMethod: string;
  soldProducts: number;
  totalWaste: number;

  addMethodAData() {
    this.eoltsoldproductact.method_data.push(new WasteBasedData({ wasteMethod: "", soldProducts: undefined,id:0 ,totalWaste:undefined,mass_unit:""}))

  }





  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;


    if (genForm.valid && this.eoltsoldproductact.project.id &&  [this.eoltsoldproductact.method_data].some(arr => arr.length > 0)) {
      this.eoltsoldproductact.month = this.month.value

      if (this.isNewEntry) {

        this.eoltsoldproductactProxy.createAll(this.eoltsoldproductact)
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
        this.eoltsoldproductactProxy.updateAll(0, this.eoltsoldproductact)
          .subscribe(
            (res) => {
              this.creating = false
           //   this.eoltsoldproductact.emission = res.emission;
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
        detail: 'Fill All Mandatory fields and check valid inputs',
        closable: true,
      });

    }
  }












  onBackClick() {
    this.router.navigate(['app/emission/eolt-sold-products-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
       this.delete(this.eoltsoldproductact.groupNo);
      },
      reject: () => { },
    });
  }

  delete(groupNo: string) {
    
    this.eoltsoldproductactProxy.deleteAllEntry(groupNo)
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
        this.router.navigate(['../eoltsoldproductact-list'], { relativeTo: this.activatedRoute });
      })
  }


  deleteOneA(i:number, id: number) {
    this.eoltsoldproductact.method_data.splice(i, 1);
    this.deleteOneEntry(id);

  }


 
  deleteOneEntry(id:number){
    if(id>0){
      this.eoltsoldproductactProxy.deleteEntry(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.End_of_life_treatment_of_sold_products);
    }
  }

  onUpdateFuel(event: string) {
    // this.eoltsoldproductact.fuelType = event;
  }

}
