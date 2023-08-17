import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { AverageDataMethodData, FuelBasedeData, FuelBasede_Data, ProcessingOfSoldProductsActivityDataActivityType, ProcessingOfSoldProductsActivityDataControllerServiceProxy, ProcessingOfSoldProductsActivityDataDto, ProcessingOfSoldProductsActivityDataDtoActivityType, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, RefrigerantBasdeData, RefrigerantBasde_Data, ServiceProxy, Unit, User, WasteBasede_Data } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-processing-of-sold-product-form',
  templateUrl: './processing-of-sold-product-form.component.html',
  styleUrls: ['./processing-of-sold-product-form.component.css']
})
export class ProcessingOfSoldProductFormComponent extends EmissionCreateBaseComponent implements OnInit {


  ProcessingOfSoldProduct: ProcessingOfSoldProductsActivityDataDto = new ProcessingOfSoldProductsActivityDataDto();



  creator: User;
  selectedUnit: Unit;

  public investfActivityTypes: any[] = []

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
  refTypes: any
  unit: any
  isMobile: boolean;
  ownerships: { id: number, name: string }[] = []

   fuelTypes_lc:any

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  creating: boolean = false;

  public genUnits: any;
  public genUnit: any;
  investeeSectors: any
  operatingSectors: any
  constructSectors: any
  building_types: any
  activites_ProcessingOfSoldProduct: {name: string, id: number,code:string}[] = []
  public disposalWasteTypes: any[] = [];
  public disposalMethods: any[] = [];
  public sold_intermediate_type:any[] = []




  constructor(
    protected serviceProxy: ServiceProxy,
    private ProcessingOfSoldProductProxy: ProcessingOfSoldProductsActivityDataControllerServiceProxy,
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

  public get ProcessingOfSoldProductActivityDataDtoActivityType(): typeof ProcessingOfSoldProductsActivityDataDtoActivityType {
    return ProcessingOfSoldProductsActivityDataDtoActivityType;
  }

  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    // this.units = this.masterDataService.investment_units;
    this.ownerships = this.masterDataService.ownership_freightTransport;
    this.investfActivityTypes = this.masterDataService.investActivityTypes;
    this.units = this.masterDataService.upstream_lead_asset_units;
    this.investeeSectors = this.masterDataService.ivesteesectors;
    this.operatingSectors = this.masterDataService.operatingsectors;
    this.constructSectors = this.masterDataService.constructsectors;
     this.activites_ProcessingOfSoldProduct = this.masterDataService.processingOfSoldProductActivityTypes;
    this.building_types = this.masterDataService.building_types;
    this.fuelType = this.masterDataService.fuel;
    this.fuelTypes_lc = this.masterDataService.fuel_lifecycle;

    this.refTypes = this.masterDataService.gWP_RGs;
    this.disposalMethods = this.masterDataService.disposalMethods;
    this.disposalWasteTypes = this.masterDataService.disposalWasteTypes;
    this.sold_intermediate_type = this.masterDataService.sold_intermediate_type;

    
    








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
      // this.editEntryId = parseInt(id);
      this.editEntryId = id;

      console.log("gggg", this.editEntryId)
      this.isNewEntry = false;
    }
  }

  async setCreator() {
    let u = await this.appService.getUser();
    if (u) {
      this.creator = u;
      this.ProcessingOfSoldProduct.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Upstream_leased_assets)

  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.ProcessingOfSoldProduct.unit && this.ProcessingOfSoldProduct.unit.id) {
          this.selectedUnit = this.ProcessingOfSoldProduct.unit;
        }
      }
    }
    this.ProcessingOfSoldProduct.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.ProcessingOfSoldProduct.mobile = false;
      this.ProcessingOfSoldProduct.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.ProcessingOfSoldProduct.project, PuesDataReqDtoSourceName.Upstream_leased_assets, this.selectedUnit);
  }

  isMobileChange() {
    this.ProcessingOfSoldProduct.mobile = this.isMobile;
    this.ProcessingOfSoldProduct.stationary = !this.isMobile;
  }



  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Upstream_leased_assets.toString(), this.selectedProject.id, this.selectedUnit.id,
      this.ProcessingOfSoldProduct.year.toString(), this.month.value, this.ProcessingOfSoldProduct)
    let e = this.ProcessingOfSoldProduct.project;
    if (this.month && this.month.value === 12 && e) {
      this.ProcessingOfSoldProduct.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.ProcessingOfSoldProduct.project = e;
    this.ProcessingOfSoldProduct.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Upstream_leased_assets)
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

  

  onSelect(selected:any){

    const des=this.disposalMethods.find(a=>a.name==selected.value);
    if(des)
    this.disposalWasteTypes = this.masterDataService.waste_type_waste_generated_in_operations
    .filter(e=> 
     e.wasteId == des.id);

    // this.disposalWasteTypes = this.masterDataService.disposalWasteTypes
    // .filter(e=> 
    //  e.wasteId == selected.value.id);
 
  }

  async setInitialState() {
    if (this.editEntryId && this.editEntryId !== undefined) {
      let res = await this.ProcessingOfSoldProductProxy.getEntryById(
        this.editEntryId,
      ).toPromise();
      this.ProcessingOfSoldProduct = res;
      console.log("llll", this.ProcessingOfSoldProduct)
      let project = await this.getProject(res.project.id);
      console.log("pppp", project)

      if (project) {

        this.ProcessingOfSoldProduct.project = project;
        this.isMobile = this.ProcessingOfSoldProduct.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.ProcessingOfSoldProduct.month);
      // this.fuelType = this.fuel.find(f=>f.code===this.ProcessingOfSoldProduct.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.ProcessingOfSoldProduct.fc_unit);
    } else {
      this.setCreator();
    }
  }

  onSelectMethod(event: any) {
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.fuel_data = []
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.refrigerant_data = []
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.waste_data = []



    this.ProcessingOfSoldProduct.average_data_method = []

  }

  addMethodAFuelData() {
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.fuel_data.push(new FuelBasede_Data({ fuel_type: '', quntity_unit: '', id: 0, quntity: undefined,typeName:'',user_input_ef:undefined }))


  }


  addMethodARefData() {
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.refrigerant_data.push(new RefrigerantBasde_Data({ refrigerant_type: '', quntity: undefined, quntity_unit: '', id: 0 ,typeName:''}))

  }





  addMethodAWasteData() {
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.waste_data.push(new WasteBasede_Data({ waste_type: '', mass: undefined, id: 0, mass_unit: '',disposalMethod:'', typeName:'' }))


  }




  sold_intermediate_mass_unit: string;
  addMethodBData() {
    this.ProcessingOfSoldProduct.average_data_method.push(new AverageDataMethodData({ sold_intermediate_type: '', mass: undefined, mass_unit: '', id: 0 , user_input_ef:undefined}))

  }



  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;

    console.log("OOOOO----", this.ProcessingOfSoldProduct)

    if (genForm.valid && this.ProcessingOfSoldProduct.project.id && [this.ProcessingOfSoldProduct.site_specific_method_cO2_data.fuel_data, this.ProcessingOfSoldProduct.site_specific_method_cO2_data.refrigerant_data, this.ProcessingOfSoldProduct.site_specific_method_cO2_data.waste_data,  this.ProcessingOfSoldProduct.average_data_method].some(arr => arr.length > 0) ) {
      this.ProcessingOfSoldProduct.month = this.month.value
      // this.ProcessingOfSoldProduct.fuelType = this.fuelType.code
      // this.ProcessingOfSoldProduct.fc_unit = this.unit.code



      if (this.isNewEntry) {

        this.ProcessingOfSoldProductProxy.createAll(this.ProcessingOfSoldProduct)
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
        this.ProcessingOfSoldProductProxy.updateAll(0, this.ProcessingOfSoldProduct)
          .subscribe(
            (res) => {
              this.creating = false
              //   this.ProcessingOfSoldProduct.emission = res.emission;
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
    this.router.navigate(['app/emission/processing-of-sold-product-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.ProcessingOfSoldProduct.groupNo);
      },
      reject: () => { },
    });
  }

  delete(groupNo: string) {

    this.ProcessingOfSoldProductProxy.deleteAllEntry(groupNo)
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
        this.router.navigate(['../upstream-leased-assets-list'], { relativeTo: this.activatedRoute });
      })
  }


  deleteOneAFuel(i: number, id: number) {
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.fuel_data.splice(i, 1);

    this.deleteOneEntry(id);

  }


  deleteOneARef(i: number, id: number) {
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.refrigerant_data.splice(i, 1);

    this.deleteOneEntry(id);

  }

  deleteOneWaste(i: number, id: number) {
    this.ProcessingOfSoldProduct.site_specific_method_cO2_data.waste_data.splice(i, 1);

    this.deleteOneEntry(id);

  }

  deleteOneB(i: number, id: number) {
    this.ProcessingOfSoldProduct.average_data_method.splice(i, 1);
    this.deleteOneEntry(id);
  }





  deleteOneEntry(id: number) {
    if (id > 0) {
      this.ProcessingOfSoldProductProxy.deleteEntry(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Upstream_leased_assets);
    }
  }

  onUpdateFuel(event: string) {
    // this.ProcessingOfSoldProduct.fuelType = event;
  }

}
