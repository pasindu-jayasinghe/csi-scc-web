import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { AverageData, CreatePurchasedGoodsAndServiceDto, CreatePurchasedGoodsAndServiceDtoMethod, MaterialData, MaterialTransportData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, PurchaseData, PurchasedGoodsAndServicesActivityDataControllerServiceProxy, PurchasedGoodsAndServicesActivityDataMode, ServiceProxy, SpendData, SupplierData, Unit, User, WasteData, WasteDataWaste_activity, WasteOtherData } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-net-zero-purchased-good-and-services-form',
  templateUrl: './net-zero-purchased-good-and-services-form.component.html',
  styleUrls: ['./net-zero-purchased-good-and-services-form.component.css']
})
export class NetZeroPurchasedGoodAndServicesFormComponent extends EmissionCreateBaseComponent implements OnInit {


  purchasedGoodAndServices: CreatePurchasedGoodsAndServiceDto = new CreatePurchasedGoodsAndServiceDto();
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
  methods_purchased_good_and_services: { name: string, code: CreatePurchasedGoodsAndServiceDtoMethod }[] = [];
  supplier_specific_products: { id: number; name: string; code: string }[] = []
  hybrid_material_type: { id: number; name: string; code: string }[] = []
  hybrid_vehicle_type: { id: number; name: string; code: string }[] = []
  average_product_type: { id: number; name: string; code: string }[] = []
  spend_product_type: { id: number; name: string; code: string }[] = []
  wasteActivities: { name: string, code: WasteDataWaste_activity }[] = []
  gasTypes: any
  units: any
  wasteBasis: { name: string; id: number; }[];
  biologicalTreatments: { name: string; id: number; }[];
  wasteCategories: { name: string; id: number; }[];
  wasteTypes: any[];
  mswTypes: any[];
  treatmentTypeDischarge: { name: string; id: number; }[];
  disposalMethods: { name: string; id: number; }[];
  disposalWasteTypes: { name: string; id: number; wasteId: number; code: string; }[];
  incinerationWaste: { name: string; id: number; wasteId: number; code: string; }[];
  creating: boolean;
  isMobile: any;

  constructor(
    protected appService: AppService,
    protected serviceProxy: ServiceProxy,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    protected messageService: MessageService,
    private projectAndSelectService: ProjectAndSelectService,
    private masterDataService: MasterDataService,
    private confirmationService: ConfirmationService,
    private purchasedGoodsAndServicesActivityDataControllerServiceProxy: PurchasedGoodsAndServicesActivityDataControllerServiceProxy,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }

  public get createPurchasedGoodsAndServiceDtoMethod(): typeof CreatePurchasedGoodsAndServiceDtoMethod {
    return CreatePurchasedGoodsAndServiceDtoMethod;
  }

  public get wasteDataWaste_activity(): typeof WasteDataWaste_activity {
    return WasteDataWaste_activity;
  }

  async ngOnInit(): Promise<void> {
    this.months = this.masterDataService.months;
    this.units = this.masterDataService.units_purchase_good_and_services
    this.supplier_specific_products = this.masterDataService.supplier_specific_products
    this.hybrid_material_type = this.masterDataService.hybrid_material_type
    this.hybrid_vehicle_type = this.masterDataService.hybrid_vehicle_type
    this.average_product_type = this.masterDataService.average_product_type
    this.spend_product_type = this.masterDataService.spend_product_type
    this.gasTypes = this.masterDataService.gasTypes
    this.wasteBasis = this.masterDataService.wasteBasis;
    this.biologicalTreatments = this.masterDataService.biologicalTreatments;
    this.wasteCategories = this.masterDataService.wasteCategories;
    this.treatmentTypeDischarge = this.masterDataService.treatmentTypeDischarge;
    this.disposalMethods = this.masterDataService.disposalMethods;
    this.disposalWasteTypes = this.masterDataService.disposalWasteTypes;
    this.incinerationWaste = this.masterDataService.disposalWasteTypes.filter(d => d.wasteId === 9);


    let keys = Object.keys(CreatePurchasedGoodsAndServiceDtoMethod);
    for (let i = 1; i < keys.length; i = i + 2) {
      this.methods_purchased_good_and_services.push({
        name: keys[i].toLowerCase(),
        code: keys[i] as unknown as CreatePurchasedGoodsAndServiceDtoMethod
      })
    }

    let wasteKeys = Object.keys(WasteDataWaste_activity);
    for (let i = 0; i < wasteKeys.length; i = i + 1) {
      this.wasteActivities.push({
        name: (wasteKeys[i].toLowerCase()).replace(/_/g, " ").replace(/./, c => c.toUpperCase()),
        code: wasteKeys[i] as unknown as WasteDataWaste_activity
      })
    }

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
      let res = await this.purchasedGoodsAndServicesActivityDataControllerServiceProxy.getOnePurchasedGoodAndServicesDataSet(
        this.groupNumber, this.isView.toString()
      ).toPromise();

      this.purchasedGoodAndServices = res;
      let project = await this.getProject(this.purchasedGoodAndServices.project.id);
      if (project) {
        this.purchasedGoodAndServices.project = project;
        this.isMobile = this.purchasedGoodAndServices.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.purchasedGoodAndServices.month);
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
      this.purchasedGoodAndServices.user = this.creator;
    }
  }


  async setPUESData() {
    if (this.isNewEntry) {
      this.purchasedGoodAndServices.mobile = false;
      this.purchasedGoodAndServices.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.purchasedGoodAndServices.project, PuesDataReqDtoSourceName.Purchased_goods_and_services, this.selectedUnit);
  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.purchasedGoodAndServices.unit && this.purchasedGoodAndServices.unit.id) {
          this.selectedUnit = this.purchasedGoodAndServices.unit;
        }
      }
    }
    this.purchasedGoodAndServices.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async checkAccess() {
    if (this.selectedProject && this.selectedUnit) {
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Purchased_goods_and_services);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.purchasedGoodAndServices.project = e;
    this.purchasedGoodAndServices.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Purchased_goods_and_services)
  }

  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;
    let isValid = true
    // if (this.purchasedGoodAndServices.method === CreatePurchasedGoodsAndServiceDtoMethod.Hybrid_Method){
    //   isValid = await this.validateHybridMethod()
    // }

    if (genForm.valid && this.purchasedGoodAndServices.project.id && isValid) {
      this.purchasedGoodAndServices.month = this.month.value

      if (this.isNewEntry) {
        this.purchasedGoodsAndServicesActivityDataControllerServiceProxy
          .createPurchasedGoodAndServices(this.purchasedGoodAndServices)
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
        this.purchasedGoodsAndServicesActivityDataControllerServiceProxy
          .createPurchasedGoodAndServices(this.purchasedGoodAndServices)
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
    this.router.navigate(['app/emission/purchase-good-and-services-list']);
  }


  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Purchased_goods_and_services.toString(), this.selectedProject.id, this.selectedUnit.id,
      this.purchasedGoodAndServices.year.toString(), this.month.value, this.purchasedGoodAndServices)
    let e = this.purchasedGoodAndServices.project;
    if (this.month && this.month.value === 12 && e) {
      this.purchasedGoodAndServices.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  async onSelectMethod(selected: any) {
    switch (this.purchasedGoodAndServices.method) {
      case CreatePurchasedGoodsAndServiceDtoMethod.Supplier_Specific_Method:
        if (this.purchasedGoodAndServices.supplierSpecificMethod.supplierData.length === 0) {
          this.purchasedGoodAndServices.supplierSpecificMethod.supplierData.push(new SupplierData())
        }
        break;
      case CreatePurchasedGoodsAndServiceDtoMethod.Hybrid_Method:
        if (this.purchasedGoodAndServices.hybridMethod.purchaseData.length === 0) {
          this.purchasedGoodAndServices.hybridMethod.purchaseData.push(new PurchaseData())
        }
        if (this.purchasedGoodAndServices.hybridMethod.materialData.length === 0) {
          this.purchasedGoodAndServices.hybridMethod.materialData.push(new MaterialData())
        }
        if (this.purchasedGoodAndServices.hybridMethod.materialTrasportData.length === 0) {
          this.purchasedGoodAndServices.hybridMethod.materialTrasportData.push(new MaterialTransportData())
        }
        if (this.purchasedGoodAndServices.hybridMethod.wasteData.length === 0) {
          this.purchasedGoodAndServices.hybridMethod.wasteData.push(new WasteData())
        }
        if (this.purchasedGoodAndServices.hybridMethod.otherData.length === 0) {
          this.purchasedGoodAndServices.hybridMethod.otherData.push(new WasteOtherData())
        }
        break;
      case CreatePurchasedGoodsAndServiceDtoMethod.Average_Data_Method:
        if (this.purchasedGoodAndServices.averageDataMethod.averageData.length === 0) {
          this.purchasedGoodAndServices.averageDataMethod.averageData.push(new AverageData())
        }
        break;
      case CreatePurchasedGoodsAndServiceDtoMethod.Spend_Based_Method:
        if (this.purchasedGoodAndServices.spendBasedMethod.spendData.length === 0) {
          this.purchasedGoodAndServices.spendBasedMethod.spendData.push(new SpendData())
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
           this.purchasedGoodsAndServicesActivityDataControllerServiceProxy.deleteOneRow(data[index].id).subscribe(a=>{
            data.splice(index, 1);
           });
        },
        reject: () => { },
      });
    } else {

      data.splice(index, 1);
    }
  }

  addNewDataObject(method: CreatePurchasedGoodsAndServiceDtoMethod, type?: string) {
    switch (this.purchasedGoodAndServices.method) {
      case CreatePurchasedGoodsAndServiceDtoMethod.Supplier_Specific_Method:
        this.purchasedGoodAndServices.supplierSpecificMethod.supplierData.push(new SupplierData())
        break;
      case CreatePurchasedGoodsAndServiceDtoMethod.Hybrid_Method:
        switch (type) {
          case 'purchase':
            this.purchasedGoodAndServices.hybridMethod.purchaseData.push(new PurchaseData());
            break;
          case 'material':
            this.purchasedGoodAndServices.hybridMethod.materialData.push(new MaterialData());
            break;
          case 'material-transport':
            this.purchasedGoodAndServices.hybridMethod.materialTrasportData.push(new MaterialTransportData());
            break;
          case 'waste':
            this.purchasedGoodAndServices.hybridMethod.wasteData.push(new WasteData());
            break;
        }
        break;
      case CreatePurchasedGoodsAndServiceDtoMethod.Average_Data_Method:
        this.purchasedGoodAndServices.averageDataMethod.averageData.push(new AverageData())
        break;
      case CreatePurchasedGoodsAndServiceDtoMethod.Spend_Based_Method:
        this.purchasedGoodAndServices.spendBasedMethod.spendData.push(new SpendData())
        break;
    }
  }

  onChangeWasteCat(value: any) {
    this.masterDataService.getWasteTypes(value).subscribe(d => {
      this.wasteTypes = d;
    })
  }

  onChangeGasType(value: any) {
    this.masterDataService.getMSWType(value).subscribe(d => {
      this.mswTypes = d;
    })
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
    this.purchasedGoodsAndServicesActivityDataControllerServiceProxy.deleteWholeGroup(this.purchasedGoodAndServices.groupNo)
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

  onSelectWasteActivity(data: WasteData) {
    data.approach = ''
    data.biologicalTreatmentSystem = ''
    data.climateZone = ''
    data.disposalMethod = ''
    data.efCategory = ''
    data.efType = ''
    data.gas_type = ''
    data.mswType = ''
    data.treatmentDischargeType = ''
    data.typeOfWaste = ''
    data.waste = ''
    data.wasteBasis = ''
    data.wasteCategory = ''
  }

  async validateHybridMethod() {
    if (
      this.purchasedGoodAndServices.hybridMethod.purchaseData[0]?.purchaseType ||
      this.purchasedGoodAndServices.hybridMethod.materialData[0]?.materialType ||
      this.purchasedGoodAndServices.hybridMethod.materialTrasportData[0]?.materialTransType ||
      this.purchasedGoodAndServices.hybridMethod.wasteData[0]?.wasteType ||
      this.purchasedGoodAndServices.hybridMethod.otherData[0]?.otherEmission
      ) {
        for await (let data of this.purchasedGoodAndServices.hybridMethod.purchaseData) {
          if (data.purchaseType) {
            if (!data.purchaseEmission) return false
            else continue
          } else {
            continue
          }
        }
        for (let data of this.purchasedGoodAndServices.hybridMethod.materialData) {
          if (data.materialType) {
            if (!data.materialAmount) return false
            else continue
          } else {
            continue
          }
        }
    
        for (let data of this.purchasedGoodAndServices.hybridMethod.materialTrasportData) {
          if (data.materialTransType) {
              if (!data.materialTransAmount || !data.distance) return false
              else continue
          } else {
            continue
          }
        }
    
        for (let data of this.purchasedGoodAndServices.hybridMethod.wasteData) {
          if (data.wasteType) {
              if (!data.wasteAmount || !data.waste_activity) return false
              else continue
          } else {
            continue
          }
        }
        return true
    } else return false
  }


}
