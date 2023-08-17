import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AppService, RecordStatus } from 'shared/AppService';
import { LoginProfile, Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Project, ProjectControllerServiceProxy, ProjectStatus, ServiceProxy, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-allow-projects',
  templateUrl: './allow-projects.component.html',
  styleUrls: ['./allow-projects.component.css']
})
export class AllowProjectsComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  loginProfile: LoginProfile;

  projects: {id: number, name: string}[] = [];
  selectedProjects: number[] = [];

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private userControllerServiceProxy: UsersControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    public appService: AppService
  ) { }


  async ngOnInit() {
    this.loadProjects();
    this.loginProfile = this.config.data.loginProfile;
    await this.laodAllowed();
  }

  async loadProjects(){
    let filter = [  "status||$ne||"+RecordStatus.Deleted, "projectStatus||$ne||"+ProjectStatus.Initial];
    if(this.appService.isOnlyForcalPoint()){
      let ids = this.appService.getAllowedFtProjectIds();
      if(ids.length > 0){
        filter.push("id||$in||"+ids.join(","))
      }
    }
    let res= await this.serviceProxy.getManyBaseProjectControllerProject(
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
    ).toPromise();

    this.projects = res.data;
  }

  async laodAllowed(){
    try{
      let res = await this.userControllerServiceProxy.getAllowedFPProjects(this.loginProfile.userName).toPromise();
      // this.projects = [...this.projects, ...res]
      this.selectedProjects = [...this.selectedProjects, ...res.map((u: { id: any; }) => u.id)]
    }catch(err){
      console.log(err);
    }
  }

  clear(){
    this.selectedProjects = [];
  }

  selectAll(){
    this.selectedProjects = this.projects.map(u => u.id);
  }

  async save(){
    try{
      let data: string[] = [];
      if(this.selectedProjects.length > 0){
        data = this.selectedProjects.map(a => a.toString());
      }
      let res = await this.userControllerServiceProxy.saveAllowedFPProjects(this.loginProfile.userName, data).toPromise()
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'has updated successfully',
        closable: true,
      });
    }catch(err){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred, please try again',
        closable: true,
      });
    }
  }

}
