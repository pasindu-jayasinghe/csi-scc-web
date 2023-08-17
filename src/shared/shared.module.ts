import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectSelectComponent } from 'app/project/project-select/project-select.component';
import { UnitSelectComponent } from 'app/unit/unit-select/unit-select.component';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FuelSelectComponent } from './fuel-select/fuel-select.component';
import { FuelFactorControllerServiceProxy } from './service-proxies/es-service-proxies';



@NgModule({
  declarations: [
    FileUploaderComponent,
    ProjectSelectComponent,
    UnitSelectComponent,
    FuelSelectComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  providers: [FuelFactorControllerServiceProxy],
  exports: [
    FileUploaderComponent,
    ProjectSelectComponent,
    UnitSelectComponent,
    FuelSelectComponent
  ]
})
export class SharedModule { }
