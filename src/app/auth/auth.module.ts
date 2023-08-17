import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {InputTextModule} from "primeng/inputtext";
import { ToastModule } from 'primeng/toast';
import { OtpComponent } from './otp/otp.component';
import { ResetComponent } from './reset/reset.component';
import { AuthControllerServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { UnitControllerServiceProxy, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { ContractComponent } from './login/contract/contract.component';
import { InforComponent } from './login/infor/infor.component';
import { UnitModule } from 'app/unit/unit.module';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent
  },
  {
    path: 'otp',
    component: OtpComponent
  },
  {
    path: 'reset',
    component: ResetComponent
  }
]

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    OtpComponent,
    ResetComponent,
    ContractComponent,
    InforComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        PasswordModule,
        DividerModule,
        InputTextModule,
        ToastModule,
        UnitModule
    ],
    providers: [AuthControllerServiceProxy, UsersControllerServiceProxy, UnitControllerServiceProxy]
})
export class AuthModule { }
