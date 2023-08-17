import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { EmissionSource, Project, ProjectStatus, PuesDataReqDtoSourceName, ServiceProxy } from 'shared/service-proxies/service-proxies';
import {environment} from '../../environments/environment'

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.css']
})
export class MigrationComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  projects: Project[] = []
  esList: EmissionSource[] = []

  selectProject: Project;
  es: EmissionSource;

  uploadedExcellFile: any;
  uploadedAirportFile: any

  private readonly baseUrl: string="";

  constructor(private serviceProxy: ServiceProxy, public appService: AppService,private http: HttpClient,protected messageService: MessageService,) { 
    this.baseUrl = environment.baseUrlAPI
  }

  ngOnInit() {
    this.getProjects();
    this.getEmissionSources();
  }


  getProjects() {
    let filter = [ "status||$ne||"+RecordStatus.Deleted, "projectStatus||$ne||"+ProjectStatus.Initial];
    if(this.appService.isOnlyForcalPoint()){
      let ids = this.appService.getAllowedFtProjectIds();
      if(ids.length > 0){
        filter.push("id||$in||"+ids.join(","))
      }
    }
    this.serviceProxy.getManyBaseProjectControllerProject(
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe(res => {
      this.projects = res.data;
    })

  }

  onAddFile(event: {index: number, file: File}){
    this.uploadedExcellFile = event.file;
  }

  onRemoveFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedExcellFile = null;
  }

  onAddAirportFile(event: {index: number, file: File}){
    this.uploadedAirportFile = event.file;
  }

  onRemoveAirportFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedAirportFile = null;
  }

  async getEmissionSources(){
    try{
      let filters = [ "status||$ne||"+RecordStatus.Deleted];
      let res = await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
        undefined, 
        undefined, 
        filters, 
        undefined, 
        undefined, 
        undefined, 
        1000, 
        0, 
        1, 
        0
      ).toPromise();
      this.esList = res.data;
    }catch(err){
      this.esList = []
    }
  }
  async upload(){
    if ((this.es.code === PuesDataReqDtoSourceName.Passenger_air.toString()) 
        || (this.es.code === PuesDataReqDtoSourceName.Freight_road.toString())){
      const formDataair = new FormData();
      formDataair.append('file', this.uploadedAirportFile);
      this.http.post(this.baseUrl + '/emission-base/upload-airports', formDataair)
      .subscribe(res => console.log("uploaded")
      ,error => console.log(error))
    }

    if(this.es && this.selectProject){
      let user = await this.appService.getUser();
      if(user){
        console.log(user)
        const formData = new FormData();
        formData.append('file', this.uploadedExcellFile);
        this.http.post(this.baseUrl +'/emission-base/add-from-excell?projectId='+this.selectProject.id+'&esId='+this.es.id+'&userId='+user.id, formData)
        .subscribe((res: any)=>{
          let r = res as any[]
          if(r && r.length >0){
            let notSaved= r.filter((dd: { status: any; }) => !dd.status).map(ddd => ddd.id)
            if(notSaved.length > 0){
              this.messageService.add({ severity: 'error', summary: 'Following are not saved, Plz check the log', detail: notSaved.join(",") });
              console.log(notSaved);
            }else{
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: this.uploadedExcellFile.name + 'is uploaded and unit list is created successfully',
                closable: true,
              });
            }
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Not saved' });
          }
        },error=> {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
        })
      }
    }
  }

  async uploadAirport(){
    const formData = new FormData();
    formData.append('file', this.uploadedExcellFile);
    this.http.post(this.baseUrl + '/emission-base/upload-airports', formData)
    .subscribe(res => console.log("uploaded")
    ,error => console.log(error))
  }

}
