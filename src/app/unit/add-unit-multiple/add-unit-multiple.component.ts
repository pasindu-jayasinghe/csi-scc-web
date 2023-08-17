import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ServiceProxy } from 'shared/service-proxies/service-proxies';
import {environment} from '../../../environments/environment'


@Component({
  selector: 'app-add-unit-multiple',
  templateUrl: './add-unit-multiple.component.html',
  styleUrls: ['./add-unit-multiple.component.css']
})
export class AddUnitMultipleComponent implements OnInit {

  public isCreatignMultipleUnits: boolean= false;
  uploadedExcellFile: any;
  private readonly baseUrl: string="";

  public roles = Roles
public userActions = UserActions

  constructor(
    private serviceProxy: ServiceProxy,
    private http: HttpClient,
    protected messageService: MessageService,
    public ref: DynamicDialogRef,
    public appService: AppService
  ) {
    this.baseUrl = environment.baseUrlAPI
  }

  ngOnInit(): void {
  }


  onUpload(e: any){
    this.isCreatignMultipleUnits=true;
    const formData = new FormData();
    formData.append('file', this.uploadedExcellFile);
    this.http.post(this.baseUrl +'/unit/add-from-excell/', formData).subscribe((res: any)=>{
      console.log(res);
      this.isCreatignMultipleUnits=false;
      if(res.status){
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.uploadedExcellFile.name + 'is uploaded and unit list is created successfully',
          closable: true,
        });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
      this.ref.close();
    },error=> {
      this.isCreatignMultipleUnits=false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
      this.ref.close();
    })
  }

  onAddFile(event: {index: number, file: File}){
    this.uploadedExcellFile = event.file;
  }

  onRemoveFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedExcellFile = null;
  }
}
