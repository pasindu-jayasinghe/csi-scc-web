import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestListComponent } from './request-list/request-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'shared/shared.module';
import { ReqeustsOtherComponent } from './requests-other/requests-other.component';
import { ReqeustDetailComponent } from './request-detail/request-detail.component';
import { ReqeustsVerifierComponent } from './requests-verifier/requests-verifier.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Evidence Requested',
    },
    children: [
      {
        path: 'request-list',
        component: ReqeustsOtherComponent,
        data: {
          title: 'Request List',
        },
      },
      {
        path: 'request-list-verifier',
        component: ReqeustsVerifierComponent,
        data: {
          title: 'Request List',
        },
      }
    ],
  }
]

@NgModule({
  declarations: [
    RequestListComponent,
    ReqeustDetailComponent,
    ReqeustsVerifierComponent,
    ReqeustsOtherComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    SharedModule,
    FormsModule,
    DropdownModule,
  ],
  providers: [
  ]
})
export class EvidenceRequestedModule { }
