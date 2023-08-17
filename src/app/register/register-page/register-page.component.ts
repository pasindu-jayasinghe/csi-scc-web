import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { ServiceProxy, Unit, UnitDetails, UnitDetailsControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  uploadedFiles: any[] = [];

  units:Unit[] = [];
  unitDetail:UnitDetails = new UnitDetails();
  private readonly baseUrl: string="";
  readonly imageUrl: string="";
  private readonly bbb: string="";
  addMultipleDialog: boolean=false;
  uploadedImgFile: any;



  isCSIUser: boolean = false;
  constructor(
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    private http: HttpClient,
    public appService: AppService,
    private router: Router,
  )
  {  
    this.baseUrl = environment.baseUrlAPI
    this.imageUrl = environment.baseUrlAPI
    this.bbb = this.baseUrl+"/unit-details/upload-img"
  }


  async ngOnInit() {

    this.isCSIUser = this.appService.isCSIUser();
    if(!this.isCSIUser){
      let u = await this.appService.getLogedUnit();
      if(u){
        let ud = await this.getUnitTedatils(u.id);
        if(ud){
          this.unitDetail = ud;
        }
        this.unitDetail.unit = u;      
      }
    }
  }

  async onUpdateUnit(unit:Unit){
    let ud = await this.getUnitTedatils(unit.id);
    if(ud){
      this.unitDetail = ud;
    }
    this.unitDetail.unit = unit;
  }

  saveForm(formData: NgForm | null) {

    if(this.unitDetail.id){
      this.serviceProxy.updateOneBaseUnitDetailsControllerUnitDetails(this.unitDetail.id, this.unitDetail)
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has updated successfully',
          closable: true,
        });
      })
    }else{
      this.unitDetail.logopath = ''
      this.serviceProxy.createOneBaseUnitDetailsControllerUnitDetails(this.unitDetail)
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          this.onUpload(res.id);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred, please try again',
            closable: true,
          });
          console.log('Error', error);
        },
        () => {
        }
      );
    }    
  }

  addMultiple(){
    this.addMultipleDialog = true;
  }

  onAddFile(event: {index: number, file: File}){
    this.uploadedImgFile = event.file;
    if(this.unitDetail.id){
      this.onUpload(this.unitDetail.id);
    }
  }

  onRemoveFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedImgFile = null;
    if(this.unitDetail.id && this.unitDetail.logopath){
      //@ts-ignore
      this.unitDetail.logopath = '';
      this.saveForm(null);
    }
  }

  onBackClick() {
    this.router.navigate(['app']);
  }


  onUpload(Uid:number) {
    if(this.uploadedImgFile){
      const formData = new FormData();
      formData.append('file', this.uploadedImgFile);
      this.http.post(this.baseUrl +'/unit-details/upload-img/'+Uid, formData).subscribe(res=>{
        this.addMultipleDialog=false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Img uploaded successfully',
          closable: true,
        });
      },error=> {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
      })
    }   
  }

  async getUnitTedatils(unitId: number){
    let filters = [ "status||$ne||"+RecordStatus.Deleted,  "unit.id||$eq||"+unitId];
    let res = await this.serviceProxy.getManyBaseUnitDetailsControllerUnitDetails(
      undefined,
      undefined,
      filters,      
      undefined,
      undefined,
      ['unit'],
      1,
      0,
      0,
      0
    ).toPromise();
    if(res.total === 1){
      return res.data[0];
    }else{
      return null;
    }
  }

  getLogo(){
    if(!this.unitDetail.id){
      return [] as {id: number, path: string , documentType: string}[]
    }else{
      return [ {
        id: this.unitDetail.id,
        path:this.unitDetail.logopath,
        documentType: "IMAGE"
      }]
    }
  }
}
