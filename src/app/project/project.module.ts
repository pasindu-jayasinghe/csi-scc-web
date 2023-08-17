import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CalendarModule } from 'primeng/calendar';
import { ProjectListComponent } from './project-list/project-list.component';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EmissionBaseControllerServiceProxy, NumEmployeesControllerServiceProxy, ProjectControllerServiceProxy, ProjectEmissionFactorControllerServiceProxy, ProjectUnitControllerServiceProxy, ProjectUnitEmissionSourceControllerServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { ProjectSummaryComponent } from './project-summary/project-summary.component';
import { EmissionSourceSummaryComponent } from './emission-source-summary/emission-source-summary.component';
import { UnitSummaryComponent } from './unit-summary/unit-summary.component';
import { ChartModule } from 'primeng/chart';
import { SelectPuesDataComponent } from './project-add/select-pues-data/select-pues-data.component';
import { ProjectCreateComponent } from './project-create/project-create/project-create.component';
import { ProjectBasicDataComponent } from './project-create/project-basic-data/project-basic-data.component';
import { ProjectEsComponent } from './project-create/project-es/project-es.component';
import { ProjectUnitEsComponent } from './project-create/project-unit-es/project-unit-es.component';
import { ProjectUnitComponent } from './project-create/project-unit/project-unit.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProjectUnitEsDataComponent } from './project-create/project-unit-es-data/project-unit-es-data.component';
import { SharedModule } from 'shared/shared.module';
import { MethodologyAddComponent } from './methodology/methodology-add/methodology-add.component';
import { MethodologyListComponent } from './methodology/methodology-list/methodology-list.component';
import { RippleModule } from 'primeng/ripple';
import { LoginProfileControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Project',
    },
    children: [
      {
        path: 'create',
        component: ProjectCreateComponent,
        data: {
          title: 'Project create',
        },
      },
      {
        path: 'list',
        component: ProjectListComponent,
        data: {
          title: 'Project List',
        },
      },
      {
        path: 'edit',
        component: ProjectCreateComponent,
        data: {
          title: 'Project Edit',
        },
      },
      {
        path: 'view',
        component: ProjectCreateComponent,
        data: {
          title: 'Project View',
        },
      },
      {
        path: 'project-summary',
        component: ProjectSummaryComponent,
        data: {
          title: 'Project Summary',
        },
      },
      {
        path: 'emission-source-summary',
        component: EmissionSourceSummaryComponent,
        data: {
          title: 'Emission Source Summary',
        },
      },
      {
        path: 'unit-summary',
        component: UnitSummaryComponent,
        data: {
          title: 'Emission Source Summary',
        },
      },
    ]
  },
  {
    path: '',
    data: {
      title: 'Methodology',
    },
    children: [
      {
        path: 'methodology-add',
        component: MethodologyAddComponent,
        data: {
          title: 'Methodology List',
        },
      },
      {
        path: 'methodology-list',
        component: MethodologyListComponent,
        data: {
          title: 'Methodology List',
        },
      },
      {
        path: 'methodology-edit/:id',
        component: MethodologyAddComponent,
        data: {
          title: 'Methodology Edit',
        },
      },
      {
        path: 'methodology-view/:id',
        component: MethodologyAddComponent,
        data: {
          title: 'Methodology View',
        },

      },

    ]
  },
  {
    path: '',
    data: {
      title: 'Project',
    },
    children: [
      {
        path: 'list',
        component: ProjectListComponent,
        data: {
          title: 'Unit List',
        },
      }
    ]
  },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
]


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectSummaryComponent,
    EmissionSourceSummaryComponent,
    UnitSummaryComponent,
    SelectPuesDataComponent,
    ProjectCreateComponent,
    ProjectBasicDataComponent,
    ProjectEsComponent,
    ProjectUnitEsComponent,
    ProjectUnitComponent,
    ProjectUnitEsDataComponent,
    MethodologyAddComponent,
    MethodologyListComponent,
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
    DynamicDialogModule,
    SharedModule,
    RippleModule,
    
  ],
  providers:[ProjectControllerServiceProxy, ProjectUnitEmissionSourceControllerServiceProxy, LoginProfileControllerServiceProxy,
            ProjectEmissionFactorControllerServiceProxy, UnitControllerServiceProxy, EmissionBaseControllerServiceProxy, ProjectUnitControllerServiceProxy],
  exports: [ProjectSummaryComponent, EmissionSourceSummaryComponent]
})
export class ProjectModule { }
