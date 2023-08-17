import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitComponent } from './unit/unit.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'shared/shared.module';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { CardModule } from 'primeng/card';
import { AddUnitComponent } from './add-unit/add-unit.component';
import { AddUnitMultipleComponent } from './add-unit-multiple/add-unit-multiple.component';
import { InforComponent } from './infor/infor.component';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { PreviousEmissionsComponent } from './infor/previous-emissions/previous-emissions.component';
import { OneYearEmissionComponent } from './infor/previous-emissions/one-year-emission/one-year-emission.component';
import { OneYearEmissioItemComponent } from './infor/previous-emissions/one-year-emission/one-year-emissio-item/one-year-emissio-item.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { InputNumberModule } from 'primeng/inputnumber';
import { EmployeeUploadComponent } from './infor/employee-upload/employee-upload.component';
import { MessagesModule } from 'primeng/messages';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Unit',
    },
    children: [
      {
        path: 'list',
        component: UnitComponent,
        data: {
          title: 'Unit List',
        },
      },{
        path: 'hierarchy',
        component: HierarchyComponent,
        data: {
          title: 'Hierarchy',
        },
      },
      {
        path: 'infor',
        component: InforComponent,
        data: {
          title: 'Unit Infor',
        },
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
]

@NgModule({
  declarations: [
    UnitComponent,
    HierarchyComponent,
    AddUnitComponent,
    AddUnitMultipleComponent,
    InforComponent,
    PreviousEmissionsComponent,
    OneYearEmissionComponent,
    OneYearEmissioItemComponent,
    EmployeeUploadComponent
    
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    RippleModule,
    InputTextModule,
    DialogModule,
    TableModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    SharedModule,
    NgxOrgChartModule,
    CardModule,
    InputMaskModule,
    CalendarModule,
    TabViewModule,
    InputNumberModule,
    MessagesModule
  ],
  exports:[]
})
export class UnitModule { }
