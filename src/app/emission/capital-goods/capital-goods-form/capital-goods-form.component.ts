import { Component, OnInit, ViewChild } from '@angular/core';
import { CapitalGoodsActivityDataActivityDataStatus, CapitalGoodsActivityDataControllerServiceProxy, CapitalGoodsActivityDataDto, CgBasedData, ElecBasedData, EndOfLifeTreatmentOfSoldProductsActivityDataActivityDataStatus, EndOfLifeTreatmentOfSoldProductsActivityDataControllerServiceProxy, EndOfLifeTreatmentOfSoldProductsActivityDataDto, FuelBsedData, FuelEnergyRelatedActivitiesActivityData, FuelEnergyRelatedActivitiesActivityDataActivityDataStatus, FuelEnergyRelatedActivitiesActivityDataControllerServiceProxy, FuelEnergyRelatedActivitiesActivityDataDto, InvestmentsActivityData, InvestmentsActivityDataActivityDataStatus, InvestmentsActivityDataControllerServiceProxy, InvestmentsActivityDataDto, MethodABasedData, MethodBBasedData, MethodCBasedData, MethodDBasedData, MethodEBasedData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, PurchsoldBasedData, ServiceProxy, TanddBasedData, Unit, User, WasteBasedData } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-capital-goods-form',
  templateUrl: './capital-goods-form.component.html',
  styleUrls: ['./capital-goods-form.component.css']
})
export class CapitalGoodsFormComponent extends EmissionCreateBaseComponent implements OnInit {



  capitalgoods: CapitalGoodsActivityDataDto = new CapitalGoodsActivityDataDto();



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
  fuelTypes_upstream: any
  fuelTypes_lc: any

  operatingSectors: any
  constructSectors: any

  public anaerobicDeepLagoons: any[] = [];


  public capital_goods_categories: {
    name: string;
    id: number;
    typeId: number;
    code: string;
  }[] = [];
  public capital_goods_types: {
    name: string;
    id: number;
  }[] = [];


  categoryOptions: any[][];



  constructor(
    protected serviceProxy: ServiceProxy,
    private capitalgoodsProxy: CapitalGoodsActivityDataControllerServiceProxy,
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
    this.categoryOptions = [];

  }

  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    // this.units = this.masterDataService.investment_units;
    this.ownerships = this.masterDataService.ownership_freightTransport;
    this.activityTypes = this.masterDataService.fuelEnergyActivityTypes;
    this.units = this.masterDataService.capital_goods_units;
    this.capital_goods_types = this.masterDataService.capital_goods_types;
    this.capital_goods_categories = this.masterDataService.capital_goods_categories;





    this.setAction();
    await this.setInitialState();
    await this.setUnit();

    this.isAnyAdmin = this.appService.isAnyAdmin();
    this.isProjectSelected = true;

    await super.ngOnInit();
  }


  onSelect(selected: any, rowIndex:number) {

    const type = this.capital_goods_types.find(
      (a) => a.name == selected.value
    );

    if (type)
    
      this.capital_goods_categories =
        this.masterDataService.capital_goods_categories.filter(
          (e) => e.typeId == type.id
        );

        this.categoryOptions[rowIndex] = this.capital_goods_categories;

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

      console.log("gggg", this.editEntryId)
      this.isNewEntry = false;


    }
  }


  initializeCategoryOptionsForEdit(numberOfRows:number, data:any) {
    for (let i = 0; i < numberOfRows; i++) { 
      const selectedType = this.capital_goods_types.find((type) => type.name === data[i].type_of_cg);
      if (selectedType) {
        this.categoryOptions[i] = this.masterDataService.capital_goods_categories.filter(
          (e) => e.typeId === selectedType.id
        );
      } else {
        this.categoryOptions[i] = [];
      }
    }
  }

  async setCreator() {
    let u = await this.appService.getUser();
    if (u) {
      this.creator = u;
      this.capitalgoods.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Capital_goods)

  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.capitalgoods.unit && this.capitalgoods.unit.id) {
          this.selectedUnit = this.capitalgoods.unit;
        }
      }
    }
    this.capitalgoods.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.capitalgoods.mobile = false;
      this.capitalgoods.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.capitalgoods.project, PuesDataReqDtoSourceName.Capital_goods, this.selectedUnit);
  }

  isMobileChange() {
    this.capitalgoods.mobile = this.isMobile;
    this.capitalgoods.stationary = !this.isMobile;
  }



  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Capital_goods.toString(), this.selectedProject.id, this.selectedUnit.id,
      this.capitalgoods.year.toString(), this.month.value, this.capitalgoods)
    let e = this.capitalgoods.project;
    if (this.month && this.month.value === 12 && e) {
      this.capitalgoods.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.capitalgoods.project = e;
    this.capitalgoods.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Capital_goods)
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
      let res = await this.capitalgoodsProxy.getEntryById(
        this.editEntryId,
      ).toPromise();
      this.capitalgoods = res;
      console.log("edit", this.capitalgoods)

      this.initializeCategoryOptionsForEdit(this.capitalgoods.method_data.length,this.capitalgoods.method_data)


      let project = await this.getProject(res.project.id);



      if (project) {

        this.capitalgoods.project = project;
        this.isMobile = this.capitalgoods.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.capitalgoods.month);
      // this.fuelType = this.fuel.find(f=>f.code===this.capitalgoods.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.capitalgoods.fc_unit);
    } else {
      this.setCreator();
    }
  }

  wasteMethod: string;
  soldProducts: number;
  totalWaste: number;

  addMethodAData() {
    this.capitalgoods.method_data.push(new CgBasedData({ quantity: undefined, quantity_unit: '', id: 0, type_of_cg: '', category: "", user_input_ef: undefined, user_input_ef_unit: '' }))

  }





  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;


    if (genForm.valid && this.capitalgoods.project.id && [this.capitalgoods.method_data].some(arr => arr.length > 0)) {
      this.capitalgoods.month = this.month.value

      if (this.isNewEntry) {

        this.capitalgoodsProxy.createAll(this.capitalgoods)
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
        this.capitalgoodsProxy.updateAll(0, this.capitalgoods)
          .subscribe(
            (res) => {
              this.creating = false
              //   this.capitalgoods.emission = res.emission;
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
    this.router.navigate(['app/emission/capital-goods-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.capitalgoods.groupNo);
      },
      reject: () => { },
    });
  }

  delete(groupNo: string) {

    this.capitalgoodsProxy.deleteAllEntry(groupNo)
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
        this.router.navigate(['../capitalgoods-list'], { relativeTo: this.activatedRoute });
      })
  }


  deleteOneA(i: number, id: number) {
    this.capitalgoods.method_data.splice(i, 1);
    this.deleteOneEntry(id);

  }



  deleteOneEntry(id: number) {
    if (id > 0) {
      this.capitalgoodsProxy.deleteEntry(id)
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

        },
          //()=>this.onSearch()
        )
    }

  }
  async checkAccess() {
    if (this.selectedProject && this.selectedUnit) {
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Capital_goods);
    }
  }

  onUpdateFuel(event: string) {
    // this.capitalgoods.fuelType = event;
  }

}
