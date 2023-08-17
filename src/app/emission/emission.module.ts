import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectricityListComponent } from './electricity/electricity-list/electricity-list.component';
import { ElectricityFormComponent } from './electricity/electricity-form/electricity-form.component';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FireExtinguisherListComponent } from './fire-extinguisher/fire-extinguisher-list/fire-extinguisher-list.component';
import { FireExtinguisherFormComponent } from './fire-extinguisher/fire-extinguisher-form/fire-extinguisher-form.component';
import { FireExtinguisherViewComponent } from './fire-extinguisher/fire-extinguisher-view/fire-extinguisher-view.component';
import { GeneratorFormComponent } from './generator/generator-form/generator-form.component';
import { GeneratorListComponent } from './generator/generator-list/generator-list.component';
import { GeneratorViewComponent } from './generator/generator-view/generator-view.component';
import { RefrigerantFormComponent } from './refrigerant/refrigerant-form/refrigerant-form.component';
import { RefrigerantListComponent } from './refrigerant/refrigerant-list/refrigerant-list.component';
//import { RefrigerantViewComponent } from './refrigerant/refrigerant-view/refrigerant-view.component';
// import { GasBiomassFormComponent } from './gas-biomass/gas-biomass-form/gas-biomass-form.component';
// import { GasBiomassListComponent } from './gas-biomass/gas-biomass-list/gas-biomass-list.component';
// import { GasBiomassViewComponent } from './gas-biomass/gas-biomass-view/gas-biomass-view.component';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { CardModule } from 'primeng/card';
import { WeldingEsFormComponent } from './welding-es/welding-es-form/welding-es-form.component';
import { WeldingEsListComponent } from './welding-es/welding-es-list/welding-es-list.component';
import { ForkliftsFormComponent } from './forklifts/forklifts-form/forklifts-form.component';
import { ForkliftsListComponent } from './forklifts/forklifts-list/forklifts-list.component';
import { BoilerListComponent } from './boiler/boiler-list/boiler-list.component';
import { BoilerFormComponent } from './boiler/boiler-form/boiler-form.component';
import { WasteWaterTreatmentFormComponent } from './waste-water-treatment/waste-water-treatment-form/waste-water-treatment-form.component';
import { WasteWaterTreatmentListComponent } from './waste-water-treatment/waste-water-treatment-list/waste-water-treatment-list.component';
import { MunicipalWaterListComponent } from './municipal-water/municipal-water-list/municipal-water-list.component';
import { MunicipalWaterFormComponent } from './municipal-water/municipal-water-form/municipal-water-form.component';
import { CookingGasFormComponent } from './cooking-gas/cooking-gas-form/cooking-gas-form.component';
import { CookingGasListComponent } from './cooking-gas/cooking-gas-list/cooking-gas-list.component';
import { WasteDisposalFormComponent } from './waste-disposal/waste-disposal-form/waste-disposal-form.component';
import { WasteDisposalListComponent } from './waste-disposal/waste-disposal-list/waste-disposal-list.component';
import { TransportListComponent } from './transport/transport-list/transport-list.component';
import { TabViewModule } from 'primeng/tabview';
import { TransportFormComponent } from './transport/transport-form/transport-form.component';
import { FreightTransportFormComponent } from './transport/freight/freight-transport-form/freight-transport-form.component';
import { AirTransportFormComponent } from './transport/freight/air-transport-form/air-transport-form.component';
import { RoadTransportFormComponent } from './transport/freight/road-transport-form/road-transport-form.component';
import { WaterTransportFormComponent } from './transport/freight/water-transport-form/water-transport-form.component';
import { RailTransportFormComponent } from './transport/freight/rail-transport-form/rail-transport-form.component';
import { OffRoadTransportFormComponent } from './transport/freight/off-road-transport-form/off-road-transport-form.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PassengerAirTransportFormComponent } from './transport/passenger/passenger-air/passenger-air-transport-form/passenger-air-transport-form.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PassengerOffroadTransportFormComponent } from './transport/passenger/passenger-offroad/passenger-offroad-transport-form/passenger-offroad-transport-form.component';
import { PassengerRailTransportFormComponent } from './transport/passenger/passenger-rail/passenger-rail-transport-form/passenger-rail-transport-form.component';
import { PassengerRoadTransportFormComponent } from './transport/passenger/passenger-road/passenger-road-transport-form/passenger-road-transport-form.component';
import { PassengerTransportFormComponent } from './transport/passenger/passenger-transport-form/passenger-transport-form.component';
import { FreightAirListComponent } from './transport/freight/freight-list/freight-air-list/freight-air-list.component';
import { FreightRoadListComponent } from './transport/freight/freight-list/freight-road-list/freight-road-list.component';
import { FreightOffroadListComponent } from './transport/freight/freight-list/freight-offroad-list/freight-offroad-list.component';
import { FreightRailListComponent } from './transport/freight/freight-list/freight-rail-list/freight-rail-list.component';
import { FreightWaterListComponent } from './transport/freight/freight-list/freight-water-list/freight-water-list.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OffroadTransportFormComponent } from './transport/offroad-machinery/offroad/offroad-transport-form/offroad-transport-form.component';
import { OffroadMachineryFormComponent } from './transport/offroad-machinery/offroad-machinery-form/offroad-machinery-form.component';
import { PassengerTransportListComponent } from './transport/passenger/passenger-transport-list/passenger-transport-list.component';
import { OffroadMachineryListComponent } from './transport/offroad-machinery/offroad-machinery-list/offroad-machinery-list.component';
import { PassengerAirListComponent } from './transport/passenger/passenger-air/passenger-air-list/passenger-air-list.component';
import { PassengerOffroadListComponent } from './transport/passenger/passenger-offroad/passenger-offroad-list/passenger-offroad-list.component';
import { PassengerRailListComponent } from './transport/passenger/passenger-rail/passenger-rail-list/passenger-rail-list.component';
import { PassengerRoadListComponent } from './transport/passenger/passenger-road/passenger-road-list/passenger-road-list.component';
import { OffroadTransportListComponent } from './transport/offroad-machinery/offroad/offroad-transport-list/offroad-transport-list.component';
import { UnitModule } from 'app/unit/unit.module';
import { ProjectModule } from 'app/project/project.module';
import { EmissionListBaseComponent } from './emission-list-base/emission-list-base.component';
import { EmissionCreateBaseComponent } from './emission-create-base/emission-create-base.component';
import { FreightTransportListComponent } from './transport/freight/freight-transport-list/freight-transport-list.component';
import { EsAccessService } from 'app/es-access-controle/es-access.service';
import { SharedModule } from 'shared/shared.module';

import { 
  EmissionBaseControllerServiceProxy,
  EndOfLifeTreatmentOfSoldProductsActivityDataControllerServiceProxy, 
  FuelEnergyRelatedActivitiesActivityDataControllerServiceProxy, 
  InvestmentsActivityDataControllerServiceProxy,
  NetZeroBusinessTravelActivityDataControllerServiceProxy,
  NetZeroEmployeeCommutingActivityDataControllerServiceProxy,
  PassengerAirActivityDataControllerServiceProxy,
  PassengerAirPortControllerServiceProxy,
  WasteGeneratedInOperationsActivityDataControllerServiceProxy,
  ProcessingOfSoldProductsActivityDataControllerServiceProxy, 
  UpstreamLeasedAssetsActivityDataControllerServiceProxy, 
  FranchisesActivityDataControllerServiceProxy,
  PurchasedGoodsAndServicesActivityDataControllerServiceProxy,
  DownstreamLeasedAssetsActivityDataControllerServiceProxy,
  DownstreamTransportationActivityDataControllerServiceProxy,
  UpstreamTransportationActivityDataControllerServiceProxy,
  NetZeroUseOfSoldProductsActivityDataControllerServiceProxy,
  CapitalGoodsActivityDataControllerServiceProxy
} from 'shared/service-proxies/service-proxies';

import { EmissionCategoryComponent } from './emission-category/emission-category.component';
import { PassengerWaterTransportFormComponent } from './transport/passenger/passenger-water/passenger-water-transport-form/passenger-water-transport-form.component';
import { PassengerWaterListComponent } from './transport/passenger/passenger-water/passenger-water-list/passenger-water-list.component';
import { ExcellUplodDialogComponent } from './excell-uplod-dialog/excell-uplod-dialog.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { BusinessTravelListComponent } from './transport/passenger/business-travel/business-travel-list/business-travel-list.component';
import { BusinessTravelTransportFormComponent } from './transport/passenger/business-travel/business-travel-transport-form/business-travel-transport-form.component';
import { NewEmployeeComponent } from './transport/passenger/passenger-road/new-employee/new-employee.component';
import { MessagesModule } from 'primeng/messages';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { ExcelDownloadDialogComponent } from './excel-download-dialog/excel-download-dialog.component';
import { GuidanceVideoComponent } from './guidance-video/guidance-video.component';
import { InvestmentsListComponent } from './investments/investments-list/investments-list.component';
import { InvestmentsFormComponent } from './investments/investments-form/investments-form.component';
import { WasteGeneratedInOperationsListComponent } from './waste-generated-in-operations/waste-generated-in-operations-list/waste-generated-in-operations-list.component';
import { PurchasedGoodAndServicesFormComponent } from './purchased-good-and-services/purchased-good-and-services-form/purchased-good-and-services-form.component';
import { PurchasedGoodAndServicesListComponent } from './purchased-good-and-services/purchased-good-and-services-list/purchased-good-and-services-list.component';
import { SupplierSpecificMethodComponent } from './purchased-good-and-services/supplier-specific-method/supplier-specific-method.component';
import { AverageDataMethodComponent } from './purchased-good-and-services/average-data-method/average-data-method.component';


import { NetZeroBusinessTravelViewComponent } from './net-zero-business-travel/net-zero-business-travel-view/net-zero-business-travel-view.component';
import { NetZeroBusinessTravelFormComponent } from './net-zero-business-travel/net-zero-business-travel-form/net-zero-business-travel-form.component';
import { NetZeroBusinessTravelListComponent } from './net-zero-business-travel/net-zero-business-travel-list/net-zero-business-travel-list.component';
import { NetZeroEmployeeCommutingFormComponent } from './net-zero-employee-commuting/net-zero-employee-commuting-form/net-zero-employee-commuting-form.component';
import { NetZeroEmployeeCommutingListComponent } from './net-zero-employee-commuting/net-zero-employee-commuting-list/net-zero-employee-commuting-list.component';
import { NetZeroEmployeeCommutingViewComponent } from './net-zero-employee-commuting/net-zero-employee-commuting-view/net-zero-employee-commuting-view.component';
import { FuelEnergyActivityListComponent } from './fuel-energy-activity/fuel-energy-activity-list/fuel-energy-activity-list.component';
import { FuelEnergyActivityFormComponent } from './fuel-energy-activity/fuel-energy-activity-form/fuel-energy-activity-form.component';
import { EoltSoldProductsFormComponent } from './eolt-sold-products/eolt-sold-products-form/eolt-sold-products-form.component';
import { EoltSoldProductsListComponent } from './eolt-sold-products/eolt-sold-products-list/eolt-sold-products-list.component';
import { WasteGeneratedInOperationsFormComponent } from './waste-generated-in-operations/waste-generated-in-operations-form/waste-generated-in-operations-form.component';
import { UpstreamLeasedAssetsFormComponent } from './upstream-leased-assets/upstream-leased-assets-form/upstream-leased-assets-form.component';
import { UpstreamLeasedAssetsListComponent } from './upstream-leased-assets/upstream-leased-assets-list/upstream-leased-assets-list.component';
import { ProcessingOfSoldProductFormComponent } from './processing-of-sold-product/processing-of-sold-product-form/processing-of-sold-product-form.component';
import { ProcessingOfSoldProductListComponent } from './processing-of-sold-product/processing-of-sold-product-list/processing-of-sold-product-list.component';
import { NetZeroFranchisesListComponent } from './net-zero-franchises/net-zero-franchises-list/net-zero-franchises-list.component';
import { NetZeroFranchisesFormComponent } from './net-zero-franchises/net-zero-franchises-form/net-zero-franchises-form.component';
import { NetZeroPurchasedGoodAndServicesFormComponent } from './net-zero-purchased-good-and-services/net-zero-purchased-good-and-services-form/net-zero-purchased-good-and-services-form.component';
import { NetZeroPurchasedGoodAndServicesListComponent } from './net-zero-purchased-good-and-services/net-zero-purchased-good-and-services-list/net-zero-purchased-good-and-services-list.component';
import { DownstreamLeasedAssetsFormComponent } from './downstream-leased-assets/downstream-leased-assets-form/downstream-leased-assets-form.component';
import { DownstreamLeasedAssetsListComponent } from './downstream-leased-assets/downstream-leased-assets-list/downstream-leased-assets-list.component';
import { DownstreamLeasedAssetsViewComponent } from './downstream-leased-assets/downstream-leased-assets-view/downstream-leased-assets-view.component';
import { NetZeroDownstreamTransportationListComponent } from './net-zero-downstream-transportation/net-zero-downstream-transportation-list/net-zero-downstream-transportation-list.component';
import { NetZeroUpstreamTransportationListComponent } from './net-zero-upstream-transportation/net-zero-upstream-transportation-list/net-zero-upstream-transportation-list.component';
import { NetZeroDownstreamTransportationFormComponent } from './net-zero-downstream-transportation/net-zero-downstream-transportation-form/net-zero-downstream-transportation-form.component';
import { NetZeroUpstreamTransportationFormComponent } from './net-zero-upstream-transportation/net-zero-upstream-transportation-form/net-zero-upstream-transportation-form.component';
import { NetZeroUseOfSoldProductsListComponent } from './net-zero-use-of-sold-products/net-zero-use-of-sold-products-list/net-zero-use-of-sold-products-list.component';
import { NetZeroUseOfSoldProductsFormComponent } from './net-zero-use-of-sold-products/net-zero-use-of-sold-products-form/net-zero-use-of-sold-products-form.component';
import { CapitalGoodsFormComponent } from './capital-goods/capital-goods-form/capital-goods-form.component';
import { CapitalGoodsListComponent } from './capital-goods/capital-goods-list/capital-goods-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Emission',
    },
    children: [
      // {
      //   path: '',
      //   redirectTo: 'electricity-list',
      // },
      {
        path: 'electricity-list',
        component: ElectricityListComponent,
        data: {
          title: 'Electricity List',
        },
      },
      {
        path: 'electricity-add',
        component: ElectricityFormComponent,
        data: {
          title: 'Electricity Add',
        },
      },
      {
        path: 'electricity-edit/:id',
        component: ElectricityFormComponent,
        data: {
          title: 'Electricity Edit',
        },
      },
      {
        path: 'electricity-view/:id',
        component: ElectricityFormComponent,
        data: {
          title: 'Electricity View',
        },
      },

      {
        path: 'fire-extinguisher-list',
        component: FireExtinguisherListComponent,
        data: {
          title: 'Fire Extinguisher List',
        },
      },
      {
        path: 'fire-extinguisher-add',
        component: FireExtinguisherFormComponent,
        data: {
          title: 'Fire Extinguisher Add',
        },
      },
      {
        path: 'fire-extinguisher-edit',
        component: FireExtinguisherFormComponent,
        data: {
          title: 'Fire Extinguisher Edit',
        },
      },
      {
        path: 'fire-extinguisher-view',
        component: FireExtinguisherFormComponent,
        data: {
          title: 'Fire Extinguisher View',
        },
      },
      {
        path: 'generator-list',
        component: GeneratorListComponent,
        data: {
          title: 'Generator List',
        },
      },

      {
        path: 'generator-add',
        component: GeneratorFormComponent,
        data: {
          title: 'Generator Add',
        },
      },
      {
        path: 'generator-edit/:id',
        component: GeneratorFormComponent,
        data: {
          title: 'Generator Edit',
        },
      },
      {
        path: 'generator-view/:id',
        component: GeneratorFormComponent,
        data: {
          title: 'Generator View',
        },
      },


      {
        path: 'investments-list',
        component: InvestmentsListComponent,
        data: {
          title: 'Investments List',
        },
      },

      {
        path: 'investments-add',
        component: InvestmentsFormComponent,
        data: {
          title: 'Investments Add',
        },
      },
      {
        path: 'investments-edit/:id',
        component: InvestmentsFormComponent,
        data: {
          title: 'Investments Edit',
        },
      },
      {
        path: 'investments-view/:id',
        component: InvestmentsFormComponent,
        data: {
          title: 'Investments View',
        },
      },
      // {
      //   path: 'gas-biomass-list',
      //   component: GasBiomassListComponent,
      //   data: {
      //     title: 'GasBiomass List',
      //   },
      // },
      // {
      //   path: 'gas-biomass-add',
      //   component: GasBiomassFormComponent,
      //   data: {
      //     title: 'GasBiomass Add',
      //   },
      // },
      // {
      //   path: 'gas-biomass-edit/:id',
      //   component: GasBiomassFormComponent,
      //   data: {
      //     title: 'GasBiomass Edit',
      //   },
      // },
      // {
      //   path: 'gas-biomass-view/:id',
      //   component: GasBiomassViewComponent,
      //   data: {
      //     title: 'GasBiomass View',
      //   },
      // },
      {
        path: 'refrigerant-list',
        component: RefrigerantListComponent,
        data: {
          title: 'Refrigerant List',
        },
      },
      {
        path: 'refrigerant-add',
        component: RefrigerantFormComponent,
        data: {
          title: 'Refrigerant',
        },
      },
      {
        path: 'refrigerant-edit/:id',
        component: RefrigerantFormComponent,
        data: {
          title: 'Refrigerant Edit',
        },
      },
      {
        path: 'refrigerant-view/:id',
        component: RefrigerantFormComponent,
        data: {
          title: 'Refrigerant View',
        },
      },
      {
        path: 'welding-es-list',
        component: WeldingEsListComponent,
        data: {
          title: 'WeldingEs List',
        },
      },
      {
        path: 'welding-es-add',
        component: WeldingEsFormComponent,
        data: {
          title: 'WeldingEs',
        },
      },
      {
        path: 'welding-es-edit/:id',
        component: WeldingEsFormComponent,
        data: {
          title: 'WeldingEs Edit',
        },
      },
      {
        path: 'welding-es-view/:id',
        component: WeldingEsFormComponent,
        data: {
          title: 'WeldingEs View',
        },
      },
      {
        path: 'forklifts-list',
        component: ForkliftsListComponent,
        data: {
          title: 'Forklift List',
        },
      },
      {
        path: 'forklifts-add',
        component: ForkliftsFormComponent,
        data: {
          title: 'Forklift',
        },
      },
      {
        path: 'forklifts-edit/:id',
        component: ForkliftsFormComponent,
        data: {
          title: 'Forklift Edit',
        },
      },
      {
        path: 'forklifts-view/:id',
        component: ForkliftsFormComponent,
        data: {
          title: 'Forklifts View',
        },
      },
      {
        path: 'boilers-list',
        component: BoilerListComponent,
        data: {
          title: 'Boiler List',
        },
      },
      {
        path: 'boilers-add',
        component: BoilerFormComponent,
        data: {
          title: 'Boiler',
        },
      },
      {
        path: 'boilers-edit/:id',
        component: BoilerFormComponent,
        data: {
          title: 'Boiler Edit',
        },
      },
      {
        path: 'boilers-view/:id',
        component: BoilerFormComponent,
        data: {
          title: 'Boiler View',
        },
      },
      {
        path: 'waste-water-treatment-list',
        component: WasteWaterTreatmentListComponent,
        data: {
          title: 'Wastewater Treatment List',
        },
      },
      {
        path: 'waste-water-treatment-add',
        component: WasteWaterTreatmentFormComponent,
        data: {
          title: 'Wastewater Treatment Add',
        },
      },
      {
        path: 'waste-Water-treatment-edit/:id',
        component: WasteWaterTreatmentFormComponent,
        data: {
          title: 'Wastewater Treatment Edit',
        },
      },
      {
        path: 'waste-water-treatment-view/:id',
        component: WasteWaterTreatmentFormComponent,
        data: {
          title: 'Wastewater Treatment View',
        },
      },
      {
        path: 'municipal-water-list',
        component: MunicipalWaterListComponent,
        data: {
          title: 'Municipal Water List',
        },
      },
      {
        path: 'municipal-water-add',
        component: MunicipalWaterFormComponent,
        data: {
          title: 'Municipal Water Add',
        },
      },
      {
        path: 'municipal-water-edit/:id',
        component: MunicipalWaterFormComponent,
        data: {
          title: 'Municipal Water Edit',
        },
      },
      {
        path: 'municipal-water-view/:id',
        component: MunicipalWaterFormComponent,
        data: {
          title: 'Municipal Water View',
        },
      },
      {
        path: 'waste-disposal-list',
        component: WasteDisposalListComponent,
        data: {
          title: 'Waste Disposal List',
        },
      },
      {
        path: 'waste-disposal-add',
        component: WasteDisposalFormComponent,
        data: {
          title: 'WasteDisposal Add',
        },
      },
      {
        path: 'waste-disposal-edit/:id',
        component: WasteDisposalFormComponent,
        data: {
          title: 'Waste Disposal Edit',
        },
      },
      {
        path: 'waste-disposal-view/:id',
        component: WasteDisposalFormComponent,
        data: {
          title: 'Waste Disposal View',
        },
      },
      {
        path: 'cooking-gas-list',
        component: CookingGasListComponent,
        data: {
          title: 'Cooking Gas List',
        },
      },
      {
        path: 'cooking-gas-add',
        component: CookingGasFormComponent,
        data: {
          title: 'Cooking Gas Add',
        },
      },
      {
        path: 'cooking-gas-edit/:id',
        component: CookingGasFormComponent,
        data: {
          title: 'Cooking Gas Edit',
        },
      },
      {
        path: 'cooking-gas-view/:id',
        component: CookingGasFormComponent,
        data: {
          title: 'Cooking Gas View',
        },
      },
      {
        path: 'transport-list',
        component: TransportListComponent,
        data: {
          title: 'Transport List',
        },
      },
      {
        path: 'transport-add',
        component: TransportFormComponent,
        data: {
          title: 'Transport Add',
        },
      },
      {
        path: 'transport-edit/:id',
        component: TransportFormComponent,
        data: {
          title: 'Transport Edit',
        },
      },
      {
        path: 'transport-view/:id',
        component: TransportFormComponent,
        data: {
          title: 'Transport View',
        },
      },
      {
        path: 'freight-transport-add',
        component: FreightTransportFormComponent,
        data: {
          title: 'Freight Transport Add',
        },
      },
      {
        path: 'freight-transport-edit/:id',
        component: FreightTransportFormComponent,
        data: {
          title: 'Freight Transport Edit',
        },
      },
      {
        path: 'freight-transport-view/:id',
        component: FreightTransportFormComponent,
        data: {
          title: 'Freight Transport View',
        },
      },
      {
        path: 'passenger-air-add',
        component: PassengerAirTransportFormComponent,
        data: {
          title: 'Passenger Air Transport Add',
        },
      },
      {
        path: 'passenger-air-edit/:id',
        component: PassengerAirTransportFormComponent,
        data: {
          title: 'Passenger Air Transport Edit',
        },
      },
      {
        path: 'passenger-air-view/:id',
        component: PassengerAirTransportFormComponent,
        data: {
          title: 'Passenger Air Transport View',
        },
      },
      {
        path: 'passenger-offroad-add',
        component: PassengerOffroadTransportFormComponent,
        data: {
          title: 'Passenger Off-Road Transport Add',
        },
      },
      {
        path: 'passenger-offroad-edit/:id',
        component: PassengerOffroadTransportFormComponent,
        data: {
          title: 'Passenger Off-Road Transport Edit',
        },
      },
      {
        path: 'passenger-offroad-view/:id',
        component: PassengerOffroadTransportFormComponent,
        data: {
          title: 'Passenger Off-Road Transport View',
        },
      },
      {
        path: 'passenger-rail-add',
        component: PassengerRailTransportFormComponent,
        data: {
          title: 'Passenger Rail Transport Add',
        },
      },
      {
        path: 'passenger-rail-edit/:id',
        component: PassengerRailTransportFormComponent,
        data: {
          title: 'Passenger Rail Transport Edit',
        },
      },
      {
        path: 'passenger-rail-view/:id',
        component: PassengerRailTransportFormComponent,
        data: {
          title: 'Passenger Rail Transport View',
        },
      },
      {
        path: 'passenger-road-add',
        component: PassengerRoadTransportFormComponent,
        data: {
          title: 'Passenger Road Transport Add',
        },
      },
      {
        path: 'passenger-road-edit/:id',
        component: PassengerRoadTransportFormComponent,
        data: {
          title: 'Passenger Road Transport Edit',
        },
      },
      {
        path: 'passenger-road-view/:id',
        component: PassengerRoadTransportFormComponent,
        data: {
          title: 'Passenger Road Transport View',
        },
      },
      {
        path: 'business-travel-add',
        component: BusinessTravelTransportFormComponent,
        data: {
          title: 'Buseness Travel Transport Add',
        },
      },
      {
        path: 'business-travel-edit/:id',
        component: BusinessTravelTransportFormComponent,
        data: {
          title: 'Buseness Travel Transport Edit',
        },
      },
      {
        path: 'business-travel-view/:id',
        component: BusinessTravelTransportFormComponent,
        data: {
          title: 'Buseness Travel Transport View',
        },
      },
      {
        path: 'passenger-water-add',
        component: PassengerWaterTransportFormComponent,
        data: {
          title: 'Passenger Rail Transport Add',
        },
      },
      {
        path: 'passenger-water-edit/:id',
        component: PassengerWaterTransportFormComponent,
        data: {
          title: 'Passenger Rail Transport Edit',
        },
      },
      {
        path: 'passenger-water-view/:id',
        component: PassengerWaterTransportFormComponent,
        data: {
          title: 'Passenger Rail Transport View',
        },
      },
      {
        path: 'offroad-machinery-add',
        component: OffroadTransportFormComponent,
        data: {
          title: 'Off-Road Machinery Add',
        },
      },

      {
        path: 'freight-air-transport-add',
        component: AirTransportFormComponent,
        data: {
          title: 'Freight Air Transport Add',
        },
      },
      {
        path: 'freight-air-transport-edit/:id',
        component: AirTransportFormComponent,
        data: {
          title: 'Freight Air Transport Edit',
        },
      },
      {
        path: 'freight-air-transport-view/:id',
        component: AirTransportFormComponent,
        data: {
          title: 'Freight Air Transport View',
        },
      },

      {
        path: 'freight-offroad-transport-add',
        component: OffRoadTransportFormComponent,
        data: {
          title: 'Freight Off-Road Transport Add',
        },
      },

      {
        path: 'freight-offroad-transport-edit/:id',
        component: OffRoadTransportFormComponent,
        data: {
          title: 'Freight Off-Road Transport Edit',
        },
      },
      {
        path: 'freight-offroad-transport-view/:id',
        component: OffRoadTransportFormComponent,
        data: {
          title: 'Freight Off-Road Transport View',
        },
      },

      {
        path: 'freight-rail-transport-add',
        component: RailTransportFormComponent,
        data: {
          title: 'Freight Rail Transport Add',
        },
      },

      {
        path: 'freight-rail-transport-edit/:id',
        component: RailTransportFormComponent,
        data: {
          title: 'Freight Rail Transport Edit',
        },
      },
      {
        path: 'freight-rail-transport-view/:id',
        component: RailTransportFormComponent,
        data: {
          title: 'Freight Rail Transport View',
        },
      },

      {
        path: 'freight-road-transport-add',
        component: RoadTransportFormComponent,
        data: {
          title: 'Freight Road Transport Add',
        },
      },

      {
        path: 'freight-road-transport-edit/:id',
        component: RoadTransportFormComponent,
        data: {
          title: 'Freight Road Transport Edit',
        },
      },
      {
        path: 'freight-road-transport-view/:id',
        component: RoadTransportFormComponent,
        data: {
          title: 'Freight Road Transport View',
        },
      },

      {
        path: 'freight-water-transport-add',
        component: WaterTransportFormComponent,
        data: {
          title: 'Freight Water Transport Add',
        },
      },

      {
        path: 'freight-water-transport-edit/:id',
        component: WaterTransportFormComponent,
        data: {
          title: 'Freight Water Transport Edit',
        },
      },
      {
        path: 'freight-water-transport-view/:id',
        component: WaterTransportFormComponent,
        data: {
          title: 'Freight Water Transport View',
        },
      },
      {
        path: 'offroad-machinery-edit/:id',
        component: OffroadTransportFormComponent,
        data: {
          title: 'Off-Road Machinery Edit',
        },
      },
      {
        path: 'offroad-machinery-view/:id',
        component: OffroadTransportFormComponent,
        data: {
          title: 'Off-Road Machinery View',
        },
      },
      {
        path: 'es-category',
        component: EmissionCategoryComponent,
        data: {
          title: 'ES Category',
        },
      },

      {
        path: 'waste-generated-in-operations-list',
        component: WasteGeneratedInOperationsListComponent,
        data: {
          title: 'Waste Generated In Operations List',
        },
      },
      {
        path: 'waste-generated-in-operations-add',
        component: WasteGeneratedInOperationsFormComponent,
        data: {
          title: 'Waste Generated In Operations Add',
        },
      },
      {
        path: 'waste-generated-in-operations-edit',
        component: WasteGeneratedInOperationsFormComponent,
        data: {
          title: 'Waste Generated In Operations Edit',
        },
      },
      {
        path: 'waste-generated-in-operations-view',
        component: WasteGeneratedInOperationsFormComponent,
        data: {
          title: 'Waste Generated In Operations View',
        },
      },
      {
        path: 'purchase-good-and-services-list',
        component: NetZeroPurchasedGoodAndServicesListComponent,
        data: {
          title: 'Purchase Good And Services List',
        },
      },
      {
        path: 'purchase-good-and-services-add',
        component: NetZeroPurchasedGoodAndServicesFormComponent,
        data: {
          title: 'Purchase Good And Services Add',
        },
      },
      {
        path: 'purchase-good-and-services-edit/:id',
        component: NetZeroPurchasedGoodAndServicesFormComponent,
        data: {
          title: 'Purchase Good And Services Edit',
        },
      },
      {
        path: 'purchase-good-and-services-view/:id',
        component: NetZeroPurchasedGoodAndServicesFormComponent,
        data: {
          title: 'Purchase Good And Services View',
        }
      },
      {
        path: 'net-zero-business-travel-list',
        component: NetZeroBusinessTravelListComponent,
        data: {
          title: 'Generator List',
        },
      },

      {
        path: 'net-zero-business-travel-add',
        component: NetZeroBusinessTravelFormComponent,
        data: {
          title: 'Business Travel Add',
        },
      },
      {
        path: 'net-zero-business-travel-edit',
        component: NetZeroBusinessTravelFormComponent,
        data: {
          title: 'Business Travel Edit',
        },
      },
      {
        path: 'net-zero-business-travel-view',
        component: NetZeroBusinessTravelFormComponent,
        data: {
          title: 'Business Travel View',
        },
      },
      {
        path: 'net-zero-employee-commuting-list',
        component: NetZeroEmployeeCommutingListComponent,
        data: {
          title: 'Employee Commuting List',
        },
      },
      {
        path: 'net-zero-employee-commuting-add',
        component: NetZeroEmployeeCommutingFormComponent,
        data: {
          title: 'Employee Commuting Add',
        },
      },
      {
        path: 'net-zero-employee-commuting-edit',
        component: NetZeroEmployeeCommutingFormComponent,
        data: {
          title: 'Employee Commuting Edit',
        },
      },
      {
        path: 'net-zero-employee-commuting-view',
        component: NetZeroEmployeeCommutingFormComponent,
        data: {
          title: 'Employee Commuting View',
        },

      },
      {
        path: 'fuel-energy-activity-add',
        component: FuelEnergyActivityFormComponent,
        data: {
          title: 'FEA Add',
        },
      },
      {
        path: 'fuel-energy-activity-edit/:id',
        component: FuelEnergyActivityFormComponent,
        data: {
          title: 'FEA Edit',
        },
      },
      {
        path: 'fuel-energy-activity-view/:id',
        component: FuelEnergyActivityFormComponent,
        data: {
          title: 'FEA View',
        },
      },

      {
        path: 'fuel-energy-activity-list',
        component: FuelEnergyActivityListComponent,
        data: {
          title: 'EOLT sold products List',
        },
      },

      {
        path: 'eolt-sold-products-add',
        component: EoltSoldProductsFormComponent,
        data: {
          title: 'EOLT sold products Add',
        },
      },
      {
        path: 'eolt-sold-products-edit/:id',
        component: EoltSoldProductsFormComponent,
        data: {
          title: 'EOLT sold products Edit',
        },
      },
      {
        path: 'eolt-sold-products-view/:id',
        component: EoltSoldProductsFormComponent,
        data: {
          title: 'EOLT sold products View',
        },
      },

      {
        path: 'eolt-sold-products-list',
        component: EoltSoldProductsListComponent,
        data: {
          title: 'FEA List',
        },
      },

      //------


      {
        path: 'upstream-leased-assets-add',
        component: UpstreamLeasedAssetsFormComponent,
        data: {
          title: 'upstream-leased-assets-add',
        },
      },
      {
        path: 'upstream-leased-assets-edit/:id',
        component: UpstreamLeasedAssetsFormComponent,
        data: {
          title: 'upstream-leased-assets-edit',
        },
      },
      {
        path: 'upstream-leased-assets-view/:id',
        component: UpstreamLeasedAssetsFormComponent,
        data: {
          title: 'upstream-leased-assets-view',
        },
      },

      {
        path: 'upstream-leased-assets-list',
        component: UpstreamLeasedAssetsListComponent,
        data: {
          title: 'upstream-leased-assets-list',
        },
      },
      //---
      {
        path: 'processing-of-sold-product-add',
        component: ProcessingOfSoldProductFormComponent,
        data: {
          title: 'upstream-leased-assets-add',
        },
      },
      {
        path: 'processing-of-sold-product-edit/:id',
        component: ProcessingOfSoldProductFormComponent,
        data: {
          title: 'upstream-leased-assets-edit',
        },
      },
      {
        path: 'processing-of-sold-product-view/:id',
        component: ProcessingOfSoldProductFormComponent,
        data: {
          title: 'upstream-leased-assets-view',
        },
      },
      {
        path: 'processing-of-sold-product-list',
        component: ProcessingOfSoldProductListComponent,
        data: {
          title: 'upstream-leased-assets-list',
        }
      },
      {
        path: 'net-zero-franchises-list',
        component: NetZeroFranchisesListComponent,
        data: {
          title: 'NetZero Franchises List',
        },
      },
      {
        path: 'net-zero-franchises-add',
        component: NetZeroFranchisesFormComponent,
        data: {
          title: 'net-zero-franchises-add',
        },
      },
      {
        path: 'net-zero-franchises-edit',
        component: NetZeroFranchisesFormComponent,
        data: {
          title: 'net-zero-franchises-edit',
        },
      },
      {
        path: 'net-zero-franchises-view',
        component: NetZeroFranchisesFormComponent,
        data: {
          title: 'net-zero-franchises-view',
        },
      },
      {
        path: 'downstream-leased-assets-add',
        component: DownstreamLeasedAssetsFormComponent,
        data: {
          title: 'downstream leased assets add',
        },
      },
      {
        path: 'downstream-leased-assets-edit',
        component: DownstreamLeasedAssetsFormComponent,
        data: {
          title: 'downstream leased assets edit',
        },
      },
      {
        path: 'downstream-leased-assets-view',
        component: DownstreamLeasedAssetsFormComponent,
        data: {
          title: 'downstream leased assets add',
        },
      },
      {
        path: 'downstream-leased-assets-list',
        component: DownstreamLeasedAssetsListComponent,
        data: {
          title: 'downstream leased assets list',
        },
      },
      {
        path: 'downstream-transport-list',
        component: NetZeroDownstreamTransportationListComponent,
        data: {
          title: 'downstream-transport-list',
        },
      },
      {
        path: 'net-zero-downstream-transportation-add',
        component: NetZeroDownstreamTransportationFormComponent,
        data: {
          title: 'downstream-leased-assets-add',
        },
      },
      {
        path: 'net-zero-downstream-transportation-edit',
        component: NetZeroDownstreamTransportationFormComponent,
        data: {
          title: 'downstream-leased-assets-edit',
        },
      },
      {
        path: 'net-zero-downstream-transportation-view',
        component: NetZeroDownstreamTransportationFormComponent,
        data: {
          title: 'downstream-leased-assets-view',
        },
      },
      {
        path: 'upstream-transport-list',
        component: NetZeroUpstreamTransportationListComponent,
        data: {
          title: 'downstream-transport-list',
        },
      },
      {
        path: 'net-zero-upstream-transportation-add',
        component: NetZeroUpstreamTransportationFormComponent,
        data: {
          title: 'downstream-leased-assets-add',
        },
      },
      {
        path: 'net-zero-upstream-transportation-edit',
        component: NetZeroUpstreamTransportationFormComponent,
        data: {
          title: 'downstream-leased-assets-edit',
        },
      },
      {
        path: 'net-zero-upstream-transportation-view',
        component: NetZeroUpstreamTransportationFormComponent,
        data: {
          title: 'downstream-leased-assets-view',
        },
      },
      {
        path: 'use-of-sold-products-list',
        component: NetZeroUseOfSoldProductsListComponent,
        data: {
          title: 'Use of sold products List',
        },
      },
      {
        path: 'use-of-sold-products-add',
        component: NetZeroUseOfSoldProductsFormComponent,
        data: {
          title: 'Use of sold products Add',
        },
      },
      {
        path: 'use-of-sold-products-edit/:id',
        component: NetZeroUseOfSoldProductsFormComponent,
        data: {
          title: 'Use of sold products Edit',
        },
      },
      {
        path: 'use-of-sold-products-view/:id',
        component: NetZeroUseOfSoldProductsFormComponent,
        data: {
          title: 'Use of sold products View',
        }
      },



      {
        path: 'capital-goods-list',
        component: CapitalGoodsListComponent,
        data: {
          title: 'Capital Goods List',
        },
      },
      {
        path: 'capital-goods-add',
        component: CapitalGoodsFormComponent,
        data: {
          title: 'Capital Goods Add',
        },
      },
      {
        path: 'capital-goods-edit/:id',
        component: CapitalGoodsFormComponent,
        data: {
          title: 'Capital Goods Edit',
        },
      },
      {
        path: 'capital-goods-view/:id',
        component: CapitalGoodsFormComponent,
        data: {
          title: 'Capital Goods View',
        }
      },
    ],
  },
];

@NgModule({
  declarations: [
    ExcelDownloadDialogComponent,
    ElectricityListComponent,
    ElectricityFormComponent,
    FireExtinguisherListComponent,
    FireExtinguisherFormComponent,
    FireExtinguisherViewComponent,
    GeneratorFormComponent,
    GeneratorListComponent,
    RefrigerantListComponent,
    RefrigerantFormComponent,
    WeldingEsFormComponent,
    WeldingEsListComponent,
    ForkliftsFormComponent,
    ForkliftsListComponent,
    BoilerListComponent,
    BoilerFormComponent,
    WasteWaterTreatmentFormComponent,
    WasteWaterTreatmentListComponent,
    MunicipalWaterListComponent,
    MunicipalWaterFormComponent,
    WasteDisposalListComponent,
    WasteDisposalFormComponent,
    CookingGasListComponent,
    CookingGasFormComponent,
    TransportListComponent,
    TransportFormComponent,
    FreightTransportFormComponent,
    PassengerTransportFormComponent,
    AirTransportFormComponent,
    RoadTransportFormComponent,
    WaterTransportFormComponent,
    RailTransportFormComponent,
    OffRoadTransportFormComponent,
    PassengerRoadTransportFormComponent,
    PassengerOffroadTransportFormComponent,
    PassengerAirTransportFormComponent,
    PassengerRailTransportFormComponent,
    FreightAirListComponent,
    FreightRoadListComponent,
    FreightOffroadListComponent,
    FreightRailListComponent,
    FreightWaterListComponent,
    OffroadTransportFormComponent,
    OffroadMachineryFormComponent,
    PassengerTransportListComponent,
    OffroadMachineryListComponent,
    PassengerAirListComponent,
    PassengerOffroadListComponent,
    PassengerRailListComponent,
    PassengerRoadListComponent,
    OffroadTransportListComponent,
    EmissionListBaseComponent,
    EmissionCreateBaseComponent,
    FreightTransportListComponent,
    EmissionCategoryComponent,
    PassengerWaterTransportFormComponent,
    PassengerWaterListComponent,
    ExcellUplodDialogComponent,
    BusinessTravelListComponent,
    BusinessTravelTransportFormComponent,
    NewEmployeeComponent,
    GuidanceVideoComponent,
    WasteDisposalFormComponent,
    WasteGeneratedInOperationsFormComponent,
    WasteGeneratedInOperationsListComponent,
    NetZeroBusinessTravelViewComponent,
    NetZeroBusinessTravelFormComponent,
    NetZeroBusinessTravelListComponent,
    NetZeroEmployeeCommutingViewComponent,
    NetZeroEmployeeCommutingFormComponent,
    NetZeroEmployeeCommutingListComponent,
    InvestmentsFormComponent,
    InvestmentsListComponent,
    FuelEnergyActivityFormComponent,
    FuelEnergyActivityListComponent,
    EoltSoldProductsListComponent,
    EoltSoldProductsFormComponent,
    PurchasedGoodAndServicesFormComponent,
    PurchasedGoodAndServicesListComponent,
    SupplierSpecificMethodComponent,
    AverageDataMethodComponent,
    UpstreamLeasedAssetsFormComponent,
    UpstreamLeasedAssetsListComponent,
    ProcessingOfSoldProductFormComponent,
    ProcessingOfSoldProductListComponent,
    NetZeroFranchisesListComponent,
    NetZeroFranchisesFormComponent,
    NetZeroPurchasedGoodAndServicesFormComponent,
    NetZeroPurchasedGoodAndServicesListComponent,
    DownstreamLeasedAssetsFormComponent,
    DownstreamLeasedAssetsListComponent,
    DownstreamLeasedAssetsViewComponent,
    NetZeroDownstreamTransportationListComponent,
    NetZeroDownstreamTransportationFormComponent,
    NetZeroUpstreamTransportationListComponent,
    NetZeroUpstreamTransportationFormComponent,
    NetZeroUseOfSoldProductsListComponent,
    NetZeroUseOfSoldProductsFormComponent,
    CapitalGoodsFormComponent,
    CapitalGoodsListComponent
  ],
  providers: [
    EsAccessService,
    PassengerAirActivityDataControllerServiceProxy,
    EmissionBaseControllerServiceProxy,
    PassengerAirPortControllerServiceProxy,
    NetZeroBusinessTravelActivityDataControllerServiceProxy,
    InvestmentsActivityDataControllerServiceProxy,
    FuelEnergyRelatedActivitiesActivityDataControllerServiceProxy,
    NetZeroEmployeeCommutingActivityDataControllerServiceProxy,
    WasteGeneratedInOperationsActivityDataControllerServiceProxy,
    EndOfLifeTreatmentOfSoldProductsActivityDataControllerServiceProxy,
    UpstreamLeasedAssetsActivityDataControllerServiceProxy,
    ProcessingOfSoldProductsActivityDataControllerServiceProxy,
    FranchisesActivityDataControllerServiceProxy,
    PurchasedGoodsAndServicesActivityDataControllerServiceProxy,
    DownstreamLeasedAssetsActivityDataControllerServiceProxy,
    DownstreamTransportationActivityDataControllerServiceProxy,
    UpstreamTransportationActivityDataControllerServiceProxy,
    NetZeroUseOfSoldProductsActivityDataControllerServiceProxy,
    CapitalGoodsActivityDataControllerServiceProxy
  ],
  exports: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InputTextModule,
    ButtonModule,
    RippleModule,
    TableModule,
    TooltipModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    CommonModule,
    RippleModule,
    InputTextModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    SharedModule,
    TabViewModule,
    CheckboxModule,
    AutoCompleteModule,
    RadioButtonModule,
    UnitModule,
    ProjectModule,
    DialogModule,
    InputNumberModule,
    MessagesModule,
    TreeModule,


  ],
})
export class EmissionModule { }
