import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { EmissionSourceListComponent } from './emission-source-list/emission-source-list.component';
import { EmissionSourceDetailComponent } from './emission-source-detail/emission-source-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { NgxOrgChartModule } from 'ngx-org-chart';
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
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { EvidenceRequestComponent } from './evidence-request/evidence-request.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProjectModule } from 'app/project/project.module';
import { EquationComponent } from './equation/equation.component';
import { EquationLibControllerServiceProxy, EvidenceRequestControllerServiceProxy } from 'shared/service-proxies/service-proxies';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Verification',
    },
    children: [
      {
        path: 'project-list',
        component: ProjectListComponent,
        data: {
          title: 'Project List',
        },
      },
      {
        path: 'emission-source-list',
        component: EmissionSourceListComponent,
        data: {
          title: 'Emision Sources',
        },
      },
      {
        path: 'emission-source-detail',
        component: EmissionSourceDetailComponent,
        data: {
          title: 'Emision Source Detail',
        },
      }
    ],
  }
]

@NgModule({
  declarations: [
    ProjectListComponent,
    EmissionSourceListComponent,
    EmissionSourceDetailComponent,
    EvidenceRequestComponent,
    EquationComponent
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
    OverlayPanelModule,
    ProjectModule
  ],
  providers: [EquationLibControllerServiceProxy, EvidenceRequestControllerServiceProxy]
})
export class VerificationModule { }
