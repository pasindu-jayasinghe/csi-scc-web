import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { CombustedData, CreateNetZeroUseOfSoldProductDto, CreateNetZeroUseOfSoldProductDtoMethod, ElectricityData, FuelData, GreenhouseData, IndirectElectricityData, IndirectFuelData, IndirectGHGData, IndirectRefrigerantdata, IntermediateData, NetZeroUseOfSoldProductActivityDataTypeName, NetZeroUseOfSoldProductsActivityDataControllerServiceProxy, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, RefrigerantData, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-net-zero-use-of-sold-products-form',
  templateUrl: './net-zero-use-of-sold-products-form.component.html',
  styleUrls: ['./net-zero-use-of-sold-products-form.component.css']
})
export class NetZeroUseOfSoldProductsFormComponent extends EmissionCreateBaseComponent  implements OnInit {

 
  soldProducts: CreateNetZeroUseOfSoldProductDto = new CreateNetZeroUseOfSoldProductDto();
  creator: User;
  selectedUnit: Unit;
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  groupNumber: string;
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;
  months: { name: string, value: number }[] = [];
  month: any;
  countries: any;
  methods_use_of_sold_products: {id: number, name: string, code: string }[] = [];
  units: any
  creating: boolean;
  isMobile: any;
  refrigerant_types: { name: string; id: number; }[];
  ghg_types: { name: string; id: number; code: string }[];
  intermediate_products: { name: string; id: number; code: string }[];

  constructor(
    protected appService: AppService,
    protected serviceProxy: ServiceProxy,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    protected messageService: MessageService,
    private projectAndSelectService: ProjectAndSelectService,
    private masterDataService: MasterDataService,
    private confirmationService: ConfirmationService,
    private netZeroUseOfSoldProductsActivityDataControllerServiceProxy: NetZeroUseOfSoldProductsActivityDataControllerServiceProxy,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }

  public get createNetZeroUseOfSoldProductDtoMethod(): typeof CreateNetZeroUseOfSoldProductDtoMethod {
    return CreateNetZeroUseOfSoldProductDtoMethod;
  }

  public get netZeroUseOfSoldProductActivityDataTypeName(): typeof NetZeroUseOfSoldProductActivityDataTypeName {
    return NetZeroUseOfSoldProductActivityDataTypeName;
  }

  async ngOnInit(): Promise<void> {
    this.months = this.masterDataService.months;
    this.units = this.masterDataService.units_use_of_sold_products
    this.methods_use_of_sold_products = this.masterDataService.use_of_sold_products_method
    this.refrigerant_types = this.masterDataService.gWP_RGs;
    this.ghg_types = this.masterDataService.ghg_types;
    this.intermediate_products = this.masterDataService.intermediate_products


    this.setAction();
    await this.setInitialState();
    await this.setUnit();


    this.isAnyAdmin = this.appService.isAnyAdmin();
    this.isProjectSelected = true;
    await super.ngOnInit();
  }

  onUpdateUnit(unit: Unit) {

    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Purchased_goods_and_services)

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
      this.groupNumber = id;
      this.isNewEntry = false;
    }
  }

  async setInitialState() {
    if (this.groupNumber) {
      let res = await this.netZeroUseOfSoldProductsActivityDataControllerServiceProxy.getOneUseOfSoldProductsDataSet(
        this.groupNumber, this.isView.toString()
      ).toPromise();

      this.soldProducts = res;
      console.log(this.soldProducts)
      let project = await this.getProject(this.soldProducts.project.id);
      if (project) {
        this.soldProducts.project = project;
        this.isMobile = this.soldProducts.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.soldProducts.month);
    } else {
      this.setCreator();
    }
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

  async setCreator() {
    let u = await this.appService.getUser();
    if (u) {
      this.creator = u;
      this.soldProducts.user = this.creator;
    }
  }


  async setPUESData() {
    if (this.isNewEntry) {
      this.soldProducts.mobile = false;
      this.soldProducts.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.soldProducts.project, PuesDataReqDtoSourceName.Use_of_sold_products, this.selectedUnit);
  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.soldProducts.unit && this.soldProducts.unit.id) {
          this.selectedUnit = this.soldProducts.unit;
        }
      }
    }
    this.soldProducts.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async checkAccess() {
    if (this.selectedProject && this.selectedUnit) {
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Use_of_sold_products);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.soldProducts.project = e;
    this.soldProducts.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Use_of_sold_products)
  }

  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;
    let isValid = true

    //TODO update validation
    // if (this.soldProducts.method === CreatePurchasedGoodsAndServiceDtoMethod.Hybrid_Method){
    //   isValid = await this.validateHybridMethod()
    //   console.log(isValid)
    // }

    console.log(genForm)
    if (genForm.valid && this.soldProducts.project.id && isValid) {
      this.soldProducts.month = this.month.value

      if (this.isNewEntry) {
        this.netZeroUseOfSoldProductsActivityDataControllerServiceProxy
          .createUseOfSoldProducts(this.soldProducts)
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
              this.creating = false;
            },
            () => {
              this.creating = false;
            }
          );


      } else {
        this.netZeroUseOfSoldProductsActivityDataControllerServiceProxy
          .createUseOfSoldProducts(this.soldProducts)
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
              this.creating = false;
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
    this.router.navigate(['app/emission/use-of-sold-products-list']);
  }


  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Use_of_sold_products.toString(), this.selectedProject.id, this.selectedUnit.id,
      this.soldProducts.year.toString(), this.month.value, this.soldProducts)
    let e = this.soldProducts.project;
    if (this.month && this.month.value === 12 && e) {
      this.soldProducts.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  async onSelectMethod(selected: any) {
    switch (this.soldProducts.method){
      case CreateNetZeroUseOfSoldProductDtoMethod.DIRECT_ENERGY: 
        if (this.soldProducts.directEnergy.fuelData.length === 0){
          this.soldProducts.directEnergy.fuelData.push(new FuelData())
        }
        if (this.soldProducts.directEnergy.electricityData.length === 0){
          this.soldProducts.directEnergy.electricityData.push(new ElectricityData())
        }
        if (this.soldProducts.directEnergy.refrigerantData.length === 0){
          this.soldProducts.directEnergy.refrigerantData.push(new RefrigerantData())
        }
        break;
      case CreateNetZeroUseOfSoldProductDtoMethod.DIRECT_COMBUSTED:
        if (this.soldProducts.directCombusted.combustedData.length === 0){
          this.soldProducts.directCombusted.combustedData.push(new CombustedData())
        }
        break;
      case CreateNetZeroUseOfSoldProductDtoMethod.DIRECT_GREENHOUSE:
        if (this.soldProducts.directGreenhouse.greenhouseData.length === 0){
          this.soldProducts.directGreenhouse.greenhouseData.push(new GreenhouseData())
        }
        break;
      case CreateNetZeroUseOfSoldProductDtoMethod.INDIRECT_ENERGY:
        if (this.soldProducts.indirectEnergy.fuelData.length === 0){
          this.soldProducts.indirectEnergy.fuelData.push(new IndirectFuelData())
        }
        if (this.soldProducts.indirectEnergy.electricityData.length === 0){
          this.soldProducts.indirectEnergy.electricityData.push(new IndirectElectricityData())
        }
        if (this.soldProducts.indirectEnergy.refrigerantData.length === 0){
          this.soldProducts.indirectEnergy.refrigerantData.push(new IndirectRefrigerantdata())
        }
        if (this.soldProducts.indirectEnergy.ghgData.length === 0){
          this.soldProducts.indirectEnergy.ghgData.push(new IndirectGHGData())
        }
        break;
      case CreateNetZeroUseOfSoldProductDtoMethod.INTERMEDIATE_PRODUCTS:
        if (this.soldProducts.intermediateProducts.intermediateData.length === 0){
          this.soldProducts.intermediateProducts.intermediateData.push(new IntermediateData())
        }
        break;
    }
  }


  async getCountries() {
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

  removeRow(data: any, index: number) {

    if (this.groupNumber && data[index].id) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this data?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: () => {
           this.netZeroUseOfSoldProductsActivityDataControllerServiceProxy.deleteOneRow(data[index].id).subscribe(a=>{
            data.splice(index, 1);
           });
        },
        reject: () => { },
      });
    } else {

      data.splice(index, 1);
    }
  }

  addNewDataObject(method: CreateNetZeroUseOfSoldProductDtoMethod, type?: NetZeroUseOfSoldProductActivityDataTypeName) {
    switch (this.soldProducts.method){
      case CreateNetZeroUseOfSoldProductDtoMethod.DIRECT_ENERGY:
        switch (type){
          case NetZeroUseOfSoldProductActivityDataTypeName.Direct_fuel_consumption:
            this.soldProducts.directEnergy.fuelData.push(new FuelData())
            break;
          case NetZeroUseOfSoldProductActivityDataTypeName.Direct_electricity_consumption:
            this.soldProducts.directEnergy.electricityData.push(new ElectricityData())
            break;
          case NetZeroUseOfSoldProductActivityDataTypeName.Direct_refrigerant_leakage:
            this.soldProducts.directEnergy.refrigerantData.push(new RefrigerantData())
            break;
        }
        break;
      case CreateNetZeroUseOfSoldProductDtoMethod.DIRECT_COMBUSTED:
        this.soldProducts.directCombusted.combustedData.push(new CombustedData())
        break;
      case CreateNetZeroUseOfSoldProductDtoMethod.DIRECT_GREENHOUSE:
        this.soldProducts.directGreenhouse.greenhouseData.push(new GreenhouseData())
        break;
      case CreateNetZeroUseOfSoldProductDtoMethod.INDIRECT_ENERGY:
        switch (type) {
          case NetZeroUseOfSoldProductActivityDataTypeName.Indirect_fuel_consumption:
            this.soldProducts.indirectEnergy.fuelData.push(new IndirectFuelData())
            break;
          case NetZeroUseOfSoldProductActivityDataTypeName.Indirect_electricity_consumption:
            this.soldProducts.indirectEnergy.electricityData.push(new IndirectElectricityData())
            break;
          case NetZeroUseOfSoldProductActivityDataTypeName.Indirect_refrigerant_leakage: 
            this.soldProducts.indirectEnergy.refrigerantData.push(new IndirectRefrigerantdata())
            break;
          case NetZeroUseOfSoldProductActivityDataTypeName.Indirect_GHG_emitted: 
            this.soldProducts.indirectEnergy.ghgData.push(new IndirectGHGData())
            break;
        }
        break;
      case CreateNetZeroUseOfSoldProductDtoMethod.INTERMEDIATE_PRODUCTS:
        this.soldProducts.intermediateProducts.intermediateData.push(new IntermediateData())
        break;
    }
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteWholeGroup();
      },
      reject: () => { },
    });
  }

  async deleteWholeGroup() {
    this.netZeroUseOfSoldProductsActivityDataControllerServiceProxy.deleteWholeGroup(this.soldProducts.groupNo)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      }, (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, () => {
        this.onBackClick();
      })
  }

  validateInput(inputElement: { value: string; }) {
    var value = parseFloat(inputElement.value);
    if (isNaN(value) || value < 0) {
      inputElement.value = '';
    }
  }

  // async validateHybridMethod() {
  //   for await (let data of this.purchasedGoodAndServices.hybridMethod.purchaseData) {
  //     if (data.purchaseType) {
  //       if (!data.purchaseEmission) return false
  //       else continue
  //     } else {
  //       return false
  //     }
  //   }
  //   for (let data of this.purchasedGoodAndServices.hybridMethod.materialData) {
  //     if (data.materialType) {
  //       if (!data.materialAmount) return false
  //       else continue
  //     } else {
  //       return false
  //     }
  //   }

  //   for (let data of this.purchasedGoodAndServices.hybridMethod.materialTrasportData) {
  //     if (data.materialTransType) {
  //         if (!data.materialTransAmount || !data.distance) return false
  //         else continue
  //     } else {
  //       return false
  //     }
  //   }

  //   for (let data of this.purchasedGoodAndServices.hybridMethod.wasteData) {
  //     if (data.wasteType) {
  //         if (!data.wasteAmount || !data.waste_activity) return false
  //         else continue
  //     } else {
  //       return false
  //     }
  //   }
  //   return true
  // }

  onUpdateFuel(event: string, data: FuelData | IndirectFuelData | CombustedData) {
    data.fuel_type = event;
  }

}
