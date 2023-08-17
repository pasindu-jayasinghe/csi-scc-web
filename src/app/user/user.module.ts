import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UserDetailsFormComponent } from './user-details-form/user-details-form.component';
import {  UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { LoginProfileControllerServiceProxy, RoleControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputMaskModule } from 'primeng/inputmask';
import { UnitModule } from 'app/unit/unit.module';
import { ProjectModule } from 'app/project/project.module';
import { SharedModule } from 'shared/shared.module';
import { ImportExportUserComponent } from './import-export-user/import-export-user.component';
import { CheckboxModule } from 'primeng/checkbox';
import { RolesComponent } from './roles/roles.component';
import { DialogModule } from 'primeng/dialog';
import { UserActionComponent } from './user-action/user-action.component';
import { UserActionsOfUserComponent } from './user-actions-of-user/user-actions-of-user.component';
import {PickListModule} from 'primeng/picklist';
import { AllowUnitComponent } from './allow-unit/allow-unit.component';
import { AllowProjectsComponent } from './allow-projects/allow-projects.component';


const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  {
    path: 'list',
    data: {
      title: 'User List',
    },
    component: UserListComponent
  },
  {
    path: 'create',
    data: {
      title: 'User Add',
    },
    component: UserFormComponent
  },
  {
    path: 'edit',
    data: {
      title: 'User Edit',
    },
    component: UserFormComponent
  },
  {
    path: 'view',
    data: {
      title: 'User View',
    },
    component: UserFormComponent
  },
  {
    path: 'setting',
    data: {
      title: 'Account Setting',
    },
    component: AccountSettingComponent
  },
  {
    path: 'import-export',
    data: {
      title: 'User Import/Export',
    },
    component: ImportExportUserComponent
  },
  {
    path: 'roles',
    data: {
      title: 'User Roles',
    },
    component: RolesComponent
  },
  {
    path: 'user-action',
    data: {
      title: 'User Action',
    },
    component: UserActionComponent
  },
  {
    path: 'user-actions-of-user',
    data: {
      title: 'User Action of User',
    },
    component: UserActionsOfUserComponent
  }

]
@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    UserDetailsFormComponent,
    AccountSettingComponent,
    ImportExportUserComponent,
    RolesComponent,
    UserActionComponent,
    UserActionsOfUserComponent,
    AllowUnitComponent,
    AllowUnitComponent,
    AllowProjectsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToastModule,
    DropdownModule,
    ConfirmDialogModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TableModule,
    TooltipModule,
    FormsModule,
    MultiSelectModule,
    InputMaskModule,
    SharedModule,
    CheckboxModule,
    DialogModule,
    PickListModule
  ],
  providers: [UsersControllerServiceProxy, LoginProfileControllerServiceProxy,RoleControllerServiceProxy ]
})
export class UserModule { }
