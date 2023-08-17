import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuelFactorsComponent } from './fuel-factors/fuel-factors.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { FuelFactorFormComponent } from './fuel-factor-form/fuel-factor-form.component';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { BiologicalTreatmentSolidWasteComponent } from './biological-treatment-solid-waste/biological-treatment-solid-waste.component';
import { WasteIncinerationComponent } from './waste-incineration/waste-incineration.component';
import { OpenBurningOfWasteComponent } from './open-burning-of-waste/open-burning-of-waste.component';
import { DomesticWwTreatmentDischargeComponent } from './domestic-ww-treatment-discharge/domestic-ww-treatment-discharge.component';
import { IndustrialWwTreatmentDischargeComponent } from './industrial-ww-treatment-discharge/industrial-ww-treatment-discharge.component';
import { DefraComponent } from './defra/defra.component';
import { SolidWasteDispoasalComponent } from './solid-waste-dispoasal/solid-waste-dispoasal.component';
import { DividerModule } from 'primeng/divider';
import { TransportFactorComponent } from './transport-factor/transport-factor.component';
import { FreightWaterFacComponent } from './freight-water-fac/freight-water-fac.component';
import { CommonEfSingleComponent } from './common-ef/common-ef-single/common-ef-single.component';
import { CommonEmissionFactorControllerServiceProxy, EmissionFacBaseControllerServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { CementProductionComponent } from './IPPU/mineral-industry/cement-production/cement-production.component';
import { CommonEfComponent } from './common-ef/common-ef.component';
import { IncinerationComponent } from './incineration/incineration.component';
import { FreightRailFacComponent } from './freight-rail-fac/freight-rail-fac.component';
import { MunicipalWaterTariffComponent } from './municipal-water-tariff/municipal-water-tariff.component';
import { ExcellUploadEfComponent } from './excell-upload-ef/excell-upload-ef.component';
import { NetzeroEfComponent } from './netzero-ef/netzero-ef.component';
import { NetzeroEfSingleComponent } from './netzero-ef/netzero-ef-single/netzero-ef-single.component';





const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Fuel-Factors',
    },
    children: [
      // {
      //   path: '',
      //   redirectTo: 'electricity-list',
      // },

      {
        path: 'netzero-factors',
        component: NetzeroEfComponent,
        data: {
          title: 'netzero-factors',
        },
      },
      {
        path: 'common-factors',
        component: CommonEfComponent,
        data: {
          title: 'common-factors',
        },
      },
      {
        path: 'fuel-factors',
        component: FuelFactorsComponent,
        data: {
          title: 'fuelfactor',
        },
      },


      {
        path: 'transport-factors',
        component: TransportFactorComponent,
        data: {
          title: 'fuelfactor',
        },
      },

      {
        path: 'freightwater-factors',
        component: FreightWaterFacComponent,
        data: {
          title: 'fuelfactor',
        },
      },
      {
        path: 'freightRail-factors',
        component: FreightRailFacComponent,
        data: {
          title: 'freightRail',
        },
      },
      {
        path: 'biological-treatment-solid-waste',
        component: BiologicalTreatmentSolidWasteComponent,
        data: {
          title: 'fuelfactor',
        },
      },
      {
        path: 'waste-incineration',
        component: WasteIncinerationComponent,
        data: {
          title: 'fuelfactor',
        },

        
      },

      {
        path: 'open-burning-of-waste',
        component: OpenBurningOfWasteComponent,
        data: {
          title: 'fuelfactor',
        },

        
      },

      {
        path: 'domestic-ww-treatment-discharge',
        component: DomesticWwTreatmentDischargeComponent,
        data: {
          title: 'fuelfactor',
        },

        
      },

      {
        path: 'industrial-ww-treatment-discharge',
        component: IndustrialWwTreatmentDischargeComponent,
        data: {
          title: 'fuelfactor',
        },

        
      },

      {
        path: 'solid-waste-disposal',
        component: SolidWasteDispoasalComponent,
        data: {
          title: 'fuelfactor',
        },

        
      },
      

      {
        path: 'defra',
        component: DefraComponent,
        data: {
          title: 'fuelfactor',
        },

        
      },
      {
        path: 'fuel-factors-add',
        component: FuelFactorFormComponent,
        data: {
          title: 'fuelfactor',
        },
      },

      {
        path: 'cement-production',
        component: CementProductionComponent,
        data: {
          title: 'fuelfactor',
        },
      },

      {
        path: 'incineration',
        component: IncinerationComponent,
        data: {
          title: 'fuelfactor',
        },    
      },

      {
        path: 'municipal-water-tariff',
        component: MunicipalWaterTariffComponent,
        data: {
          title: 'municipal-water-tariff',
        },
      },

      
      // {
      //   path: 'electricity-add',
      //   component: ElectricityFormComponent,
      //   data: {
      //     title: 'Electricity Add',
      //   },
      // },
      // {
      //   path: 'electricity-edit/:id',
      //   component: ElectricityFormComponent,
      //   data: {
      //     title: 'Electricity Edit',
      //   },
      // },
      // {
      //   path: 'electricity-view/:id',
      //   component: ElectricityFormComponent,
      //   data: {
      //     title: 'Electricity View',
      //   },
      // },
      // {
      //   path: 'fire-extinguisher-list',
      //   component: FireExtinguisherListComponent,
      //   data: {
      //     title: 'Fire Extinguisher List',
      //   },
      // },
      // {
      //   path: 'fire-extinguisher-add',
      //   component: FireExtinguisherFormComponent,
      //   data: {
      //     title: 'Fire Extinguisher Add',
      //   },
      // },
      // {
      //   path: 'fire-extinguisher-edit',
      //   component: FireExtinguisherFormComponent,
      //   data: {
      //     title: 'Fire Extinguisher Edit',
      //   },
      // },
      // {
      //   path: 'fire-extinguisher-view',
      //   component: FireExtinguisherViewComponent,
      //   data: {
      //     title: 'Fire Extinguisher View',
      //   },
      // },
      // {
      //   path: 'generator-list',
      //   component: GeneratorListComponent,
      //   data: {
      //     title: 'Generator List',
      //   },
      // },

      // {
      //   path: 'generator-add',
      //   component: GeneratorFormComponent,
      //   data: {
      //     title: 'Generator Add',
      //   },
      // },
      // {
      //   path: 'generator-edit/:id',
      //   component: GeneratorFormComponent,
      //   data: {
      //     title: 'Generator Edit',
      //   },
    //  },
    ]
  }

]

@NgModule({
  declarations: [
    FuelFactorsComponent,
    FuelFactorFormComponent,
    BiologicalTreatmentSolidWasteComponent,
    WasteIncinerationComponent,
    OpenBurningOfWasteComponent,
    DomesticWwTreatmentDischargeComponent,
    IndustrialWwTreatmentDischargeComponent,
    DefraComponent,
    SolidWasteDispoasalComponent,
    TransportFactorComponent,
    FreightWaterFacComponent,
    CommonEfSingleComponent,
    CementProductionComponent,
    CommonEfComponent,
    IncinerationComponent,
    FreightRailFacComponent,
    MunicipalWaterTariffComponent,
    ExcellUploadEfComponent,
    NetzeroEfComponent,
    NetzeroEfSingleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    ToastModule,
    DropdownModule,

    FormsModule,
    ConfirmDialogModule,
    SharedModule,
    DialogModule,
    CardModule,
    DialogModule,
    CalendarModule,
    TabViewModule,
    DividerModule
  ],
  providers: [CommonEmissionFactorControllerServiceProxy,EmissionFacBaseControllerServiceProxy ]

})

export class EmissionFactorsModule { }
