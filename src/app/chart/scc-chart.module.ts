import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectEmissionChartComponent } from './project-emission-chart/project-emission-chart.component';
import { EsEmissionChartComponent } from './es-emission-chart/es-emission-chart.component';
import { ChartModule } from 'primeng/chart';
import { ProjectUnitEmissionSourceControllerServiceProxy, ProjectUnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { TargetVsActualChartComponent } from './target-vs-actual-chart/target-vs-actual-chart.component';
import { OrgEmissionChartComponent } from './org-emission-chart/org-emission-chart.component';
import { OrgEmissionYearWiseChartComponent } from './org-emission-year-wise-chart/org-emission-year-wise-chart.component';
import { EsEmissionPieChartComponent } from './es-emission-pie-chart/es-emission-pie-chart.component';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';



@NgModule({
  declarations: [ProjectEmissionChartComponent, EsEmissionChartComponent, TargetVsActualChartComponent, OrgEmissionChartComponent, OrgEmissionYearWiseChartComponent, EsEmissionPieChartComponent],
  imports: [
    CommonModule,
    ChartModule,
    MessagesModule,
    MessageModule
  ],
  exports: [
    ProjectEmissionChartComponent, 
    EsEmissionChartComponent, 
    OrgEmissionChartComponent, 
    OrgEmissionYearWiseChartComponent,
    TargetVsActualChartComponent,
    EsEmissionPieChartComponent
  ],
  providers: [ProjectUnitEmissionSourceControllerServiceProxy, ProjectUnitControllerServiceProxy],
})
export class SCCChartModule { }
