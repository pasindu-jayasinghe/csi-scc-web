import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterPageComponent } from './register-page/register-page.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import {FileUploadModule} from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedModule } from 'shared/shared.module';
import { UnitModule } from 'app/unit/unit.module';





const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: 'infor',
    component: RegisterPageComponent,
    data: {
      title: 'Infor',
    },
  },
]


@NgModule({
  declarations: [
    RegisterPageComponent,    
  ],
  imports: [
    UnitModule,
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    InputMaskModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    FileUploadModule,
    HttpClientModule,
    DialogModule,
    ProgressSpinnerModule,
    SharedModule,
  ],
  exports:[RegisterPageComponent]
})
export class RegisterModule { }
