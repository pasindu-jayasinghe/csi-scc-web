import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Methodology, Project, ProjectControllerServiceProxy, ProjectStatus, ProjectType, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  project: Project = new Project();

  constructor( 
    private projectControllerServiceProxy: ProjectControllerServiceProxy, 
    private route: ActivatedRoute,
    private serviceProxy: ServiceProxy,
    private router: Router,
    public appService: AppService
  ){

  }

  async ngOnInit() {
    await this.setInitialValues();
  }

  onSaveBasicProject(project: Project){
    this.project = project;
    if(this.project.id){
      this.editEntryId = this.project.id;
      this.isNewEntry = false;
    }
  }

  async setInitialValues(){
    this.route.url.subscribe(r => {
      if(r[0].path === "view"){
        this.isView =true;
      }
    });

    this.route.queryParams.subscribe((params) => {
      if(params['id']){
        this.isNewEntry = false;
        this.editEntryId = params['id'];        
        this.getProject(this.editEntryId);
      }
    });
  }

  async getProject(id: number){
    this.project = await this.serviceProxy.getOneBaseProjectControllerProject(id, undefined, undefined, 0).toPromise();
  }

  save(){
    this.projectControllerServiceProxy.changeStatus(this.editEntryId, ProjectStatus.New.toString()).toPromise();
    this.router.navigate(['../list'], {relativeTo:this.route});
  }

  onBackClick(){
    this.router.navigate(['../list'], {relativeTo:this.route});
  }

  onChangeOwnerUnit(unit: Unit){
    this.project.ownerUnit = unit;
  }
  
}
