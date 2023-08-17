import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsAccessControleComponent } from './es-access-controle/es-access-controle.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectControllerServiceProxy, ProjectUnitEmissionSourceControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EsAccessSingleComponent } from './es-access-single/es-access-single.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'ES Access',
    },
    component: EsAccessControleComponent
  },
]

@NgModule({
  declarations: [
    EsAccessControleComponent,
    EsAccessSingleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DialogModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
  ],
  providers: [ProjectControllerServiceProxy, ProjectUnitEmissionSourceControllerServiceProxy]
})
export class EsAccessControleModule { }
