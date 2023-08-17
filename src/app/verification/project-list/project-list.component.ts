import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Project, ProjectStatus, ServiceProxy, User } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-project-list-verification',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public roles = Roles
public userActions = UserActions  
  rows: number = 10;
  loading: boolean;
  projectDataList: Project[];
  totalRecords: number;

  private logeduser: User;

    constructor(
        private serviceProxy: ServiceProxy,
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public appService: AppService
    ) { }

  async ngOnInit() {
    let u = await this.appService.getUser();
    console.log(u)
    if (u) {
      this.logeduser = u;
    }
    console.log(this.logeduser)
  }

  async getloggedUser(){
    let u = await this.appService.getUser();
    if (u) {
      this.logeduser = u;
    }
  }

  async load(event: LazyLoadEvent) {
    await this.getloggedUser()
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber = event.first === 0 || event.first == undefined ? 1
      :event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    let filterText = [     
       "status||$ne||"+RecordStatus.Deleted, 
       "projectStatus||$in||"+[ProjectStatus.Verification_Pending, ProjectStatus.Evidence_Pending, ProjectStatus.Verified, ProjectStatus.Unverified],
       'projectStatus||$ne||Initial'
    ]

    if(this.logeduser){
      filterText.push( "verifier.id||$eq||"+this.logeduser.id)
    }

    if(this.appService.isOnlyForcalPoint()){
      let ids = this.appService.getAllowedFtProjectIds();
      if(ids.length > 0){
        filterText.push("id||$in||"+ids.join(","))
      }
    }

    this.serviceProxy.getManyBaseProjectControllerProject(
      undefined,
      undefined,
      filterText,
      undefined,
      undefined,
      ['verifier'],
      this.rows,
      0,
      pageNumber,
      0
    ).subscribe(res => {
      this.projectDataList = res.data;
      this.totalRecords = res.total;
      this.loading = false;

      this.projectDataList.map(async project => {
        if (project.enteredBy && project.enteredBy.id){
          console.log(project.enteredBy.id )
          project.enteredBy = await this.serviceProxy.getOneBaseUsersControllerUser(project.enteredBy.id, undefined, undefined, undefined).toPromise()
        }
      })

      console.log(this.projectDataList)
    })
  }

  view(id: number) {
    this.router.navigate(['../emission-source-list'], { queryParams: { id: id }, relativeTo: this.activatedRoute});
  }

}
