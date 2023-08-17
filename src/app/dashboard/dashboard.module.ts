import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CASADashboardComponent } from './ca-sa-dashboard/ca-sa-dashboard.component';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import {NgxOrgChartModule} from "ngx-org-chart";
import { RouterModule, Routes } from '@angular/router';

import {
  NbLayoutDirectionService,
  NbMenuModule,
  NbOverlay,
  NbOverlayModule,
  NbOverlayService,
  NbPositionBuilderService,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
  NbToastrService,
  NbLayoutModule
} from '@nebular/theme';
import { AccordionModule } from 'primeng/accordion';
import { EsAccessService } from 'app/es-access-controle/es-access.service';
import { SCCChartModule } from 'app/chart/scc-chart.module';
import { InforComponent } from 'app/unit/infor/infor.component';
import { MigrationComponent } from 'app/migration/migration.component';
import { UnitModule } from '../unit/unit.module';
import { SharedModule } from 'shared/shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ProjectControllerServiceProxy, UnitControllerServiceProxy, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { AuthGuard } from 'app/auth/auth.guard';
import { BulkRecalculateComponent } from 'app/bulk-recalculate/bulk-recalculate.component';
import { AuditComponent } from 'app/audit/audit.component';
import { AuditControllerServiceProxy } from 'shared/service-proxies/audit-service-proxies';
import { CalendarModule } from 'primeng/calendar';
// import { OrgSummaryModule } from '../org-summary/org-summary.module';
// import { ProjectEmissionChartComponent } from 'app/org-summary/project-emission-chart/project-emission-chart.component';
// import { EsEmissionChartComponent } from 'app/chart/es-emission-chart/es-emission-chart.component';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'bulk-recalculate',
    component: BulkRecalculateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'infor',
    component: InforComponent,
    canActivate:[]
  },
  {
    path: 'migration',
    component: MigrationComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'audit',
    component: AuditComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'emission',
    loadChildren: () => import('../emission/emission.module').then((m) => m.EmissionModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'unit',
    loadChildren: () => import('../unit/unit.module').then((m) => m.UnitModule),
    canActivate: [],
    data: {}
  },
  {
    path: 'register',
    loadChildren: () => import('../register/register.module').then((m) => m.RegisterModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'project',
    loadChildren: () => import('../project/project.module').then((m) => m.ProjectModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'emission-factor',
    loadChildren: () => import('../ef-management/emission-factors.module').then((m) => m.EmissionFactorsModule),
  },
  {
    path: 'verification',
    loadChildren: () => import('../verification/verification.module').then((m) => m.VerificationModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'evidence-requested',
    loadChildren: () => import('../evidence-requested/evidence-requested.module').then((m) => m.EvidenceRequestedModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'summary',
    loadChildren: () => import('../org-summary/org-summary.module').then((m) => m.OrgSummaryModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'es-access',
    loadChildren: () => import('../es-access-controle/es-access-controle.module').then((m) => m.EsAccessControleModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'report',
    loadChildren: () => import('../report/report.module').then((m) => m.ReportModule),
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'progress-report',
    loadChildren: () => import('../progress-report/progress-report.module').then((m) => m.ProgressReportModule),
    canActivate: [AuthGuard],
    data: {}
  },
]

@NgModule({
  declarations: [DashboardComponent, CASADashboardComponent,AuditComponent],
  imports: [    
    RouterModule.forChild(routes),
    CommonModule,
    ChartModule,
    TableModule,
    ChartModule,
    DropdownModule,
    FormsModule,
    NgxOrgChartModule,
    NbLayoutModule,
    SCCChartModule,
    AccordionModule,
    SharedModule,
    CheckboxModule,
    CalendarModule
  ],
  providers: [EsAccessService,ProjectControllerServiceProxy, UnitControllerServiceProxy,UsersControllerServiceProxy,AuditControllerServiceProxy],
})
export class DashboardModule { }
