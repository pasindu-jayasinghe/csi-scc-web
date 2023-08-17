import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReportComponent } from './progress-report/progress-report.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
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
import { ProgressDetailComponent } from './progress-detail/progress-detail.component';
import { EmissionSourceControllerServiceProxy, ProjectEmissionFactorControllerServiceProxy } from 'shared/service-proxies/service-proxies';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Progress Report',
    },
    component: ProgressReportComponent
  }
]

@NgModule({
  declarations: [
    ProgressReportComponent,
    ProgressDetailComponent
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
    SharedModule,
  ],
  providers: [ProjectEmissionFactorControllerServiceProxy]
})
export class ProgressReportModule { }
