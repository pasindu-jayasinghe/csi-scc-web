import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDataComponent } from './report-data/report-data.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import {  MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { MitigationComponent } from './mitigation/mitigation.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { NextStepsComponent } from './next-steps/next-steps.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProjectModule } from 'app/project/project.module';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ReportCsiSideComponent } from './report-csi-side/report-csi-side.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportControllerServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { AccordionModule, AccordionTab } from 'primeng/accordion';
import { ReportEsDatasourceComponent } from 'app/report/report-es-datasource/report-es-datasource.component';
import { ReportBasicInfoComponent } from './report-basic-info/report-basic-info.component';
import { ReportEsExcludedComponent } from './report-es-excluded/report-es-excluded.component';
import { UncertaintyComponent } from './uncertainty/uncertainty.component';
import { UncertaintyItemComponent } from './uncertainty/uncertainty-item/uncertainty-item.component';
import { CapproachDesComponent } from './capproach-des/capproach-des.component';

const routes: Routes = [  
  { path: '', redirectTo: 'data', pathMatch: 'full' },
  {
    path: 'data',
    component: ReportDataComponent,
    data: {
      title: 'Data',
    }
  },
    {
      path: 'mitigation',
      component: MitigationComponent,
      data: {
        title: 'Mitigation',
      },
    },
    {
      path: 'recommendation',
      component: RecommendationComponent,
      data: {
        title: 'Recommendation',
      },
    },
    {
      path: 'next-steps',
      component: NextStepsComponent,
      data: {
        title: 'Next-Steps',
      },
    },

]


@NgModule({
  declarations: [
    ReportDataComponent,
    MitigationComponent,
    RecommendationComponent,
    NextStepsComponent,
    ReportCsiSideComponent,
    ReportListComponent,
    ReportBasicInfoComponent,
    ReportEsDatasourceComponent,
    ReportEsExcludedComponent,
    UncertaintyComponent,
    UncertaintyItemComponent,
    CapproachDesComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TableModule,
    TooltipModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule,
    AutoCompleteModule,
    ProjectModule,
    DialogModule,
    CardModule,
    TabViewModule,
    AccordionModule,
  ],
  providers: [ReportControllerServiceProxy, UnitControllerServiceProxy]
})
export class ReportModule { }
