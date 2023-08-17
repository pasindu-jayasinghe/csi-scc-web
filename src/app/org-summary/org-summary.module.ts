import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgSummaryComponent } from './org-summary/org-summary.component';
// import { ProjectEmissionChartComponent } from './project-emission-chart/project-emission-chart.component';
// import { EsEmissionChartComponent } from '../chart/es-emission-chart/es-emission-chart.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectUnitControllerServiceProxy, ProjectUnitEmissionSourceControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { SCCChartModule } from 'app/chart/scc-chart.module';
import { UnitModule } from 'app/unit/unit.module';
import { SharedModule } from 'shared/shared.module';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Organisational Summary',
    },
    component: OrgSummaryComponent
  }
]

@NgModule({
  declarations: [
    OrgSummaryComponent,
    // ProjectEmissionChartComponent,
    // EsEmissionChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    InputTextModule,
    DialogModule,
    CheckboxModule,
    NgxOrgChartModule,
    ToggleButtonModule,
    CalendarModule,
    TableModule,
    ButtonModule,
    RadioButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ChartModule,
    SCCChartModule,
    SharedModule,
  ],
  providers: [ProjectUnitEmissionSourceControllerServiceProxy, ProjectUnitControllerServiceProxy],
  // exports: [ProjectEmissionChartComponent, EsEmissionChartComponent]
})
export class OrgSummaryModule { }
