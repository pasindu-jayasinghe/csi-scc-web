import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { environment } from 'environments/environment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Project, ProjectStatus, PuesDataReqDtoSourceName, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';

@Component({
  selector: 'app-org-summary',
  templateUrl: './org-summary.component.html',
  styleUrls: ['./org-summary.component.css']
})
export class OrgSummaryComponent extends EmissionListBaseComponent implements OnInit {
  public roles = Roles
public userActions = UserActions

  public card1: any[]
  projectDataList: Project[];
  totalRecords: number;
  rows: number = 10;

  projectTypes: any[] = []
  projectType: any 
  unit:Unit
  logoPath: any;

  public baseUrl:any = environment.baseUrlAPI;

  constructor(
    protected serviceProxy: ServiceProxy,
    protected appService: AppService,
    private router: Router,
    private activatedRoute:ActivatedRoute ,
    private projectAndSelectService: ProjectAndSelectService,
    protected dialogService: DialogService,
    protected messageService: MessageService
  ){
    super(appService, serviceProxy,dialogService,messageService);
  }

  async ngOnInit(): Promise<void> {
    let user = await this.appService.getUser();
    if (user){
      if (!this.isCSIUser){
        this.unit = user.unit
      }
    }
    await super.ngOnInit();
    console.log("unit---", this.unit)

    await this.getProjectTypes()


    await this.getUnitData()
    this.load({})
  }

  async getUnitData(){
    await this.getCard1Details()
    await this.getLogo()
  }

  async getProjectTypes(){
    let types = await this.serviceProxy.getManyBaseProjectTypeControllerProjectType(
      undefined, undefined, undefined, undefined, 
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()

    // this.projectTypes = types.data

    types.data.map(type => {
      this.projectTypes.push(type.code)
    })
    this.projectType = this.projectTypes[0]
  }

  async getCard1Details(){
    let unitFilter = ['unit.id||$eq||'+this.unit.id]

    let users = await this.serviceProxy.getManyBaseUsersControllerUser(
      undefined, undefined, unitFilter, undefined,
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()

    let activeProjects = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(  // how to find active projects
      undefined, undefined, unitFilter, undefined, 
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()
   
    let completedProjects = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit( // how to find active projects
      undefined, undefined, unitFilter, undefined, 
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()

    let regUnits = this.unit.childUnits.length
    let regUsers = users.data.length
    let projects = activeProjects.data.length
    
    this.card1 = [
      {title: "Name", value: this.unit.name},
      {title: "Units Registered", value: this.unit.childUnits.length.toString()},
      {title: "Users Registered", value: users.data.length.toString()},
      {title: "Active Projects", value: activeProjects.data.length.toString()},
      {title: "Project Completed", value: completedProjects.data.length.toString()}
    ]

  }

  async getLogo(){
    console.log("unit", this.unit)
    let unitFilter = ['unit.id||$eq||'+this.unit.id]
    let unitDetail = await this.serviceProxy.getManyBaseUnitDetailsControllerUnitDetails(
      undefined, undefined, unitFilter, 
      undefined, undefined, undefined, 1000, 0, 1, 0
    ).toPromise()

    if(unitDetail.total > 0){
      this.logoPath = this.baseUrl + unitDetail.data[0].logopath;
    }
  }

  load(event: LazyLoadEvent) {
    this.totalRecords = 0;

    if(this.unit){
      let pageNumber = event.first === 0 || event.first == undefined ? 1 :event.first / (event.rows == undefined ? 1 : event.rows) + 1;
      this.rows = event.rows == undefined ? 10 : event.rows;

      let filters = ["status||$ne||" + RecordStatus.Deleted, 
                      "projectStatus||$ne||" + ProjectStatus.Initial,
                      "ownerUnit.id||$eq||" + this.unit.id,  'projectStatus||$ne||Initial']

      if(this.appService.isOnlyForcalPoint()){
        let ids = this.appService.getAllowedFtProjectIds();
        if(ids.length > 0){
          filters.push("id||$in||"+ids.join(","))
        }
      }

      this.serviceProxy.getManyBaseProjectControllerProject(
        undefined,
        undefined,
        filters,
        undefined,
        undefined,
        ["ownerUnit"],
        this.rows,
        0,
        pageNumber,
        0
      ).subscribe(res => {
        this.projectDataList = res.data;
        this.totalRecords = res.total;
      })
    }
  }

  async click(id: number){
    if(this.appService.hasUserActionAccessTo(this.userActions.PROJECT_SUMMARY)){
      this.router.navigate(['../project/project-summary'], { queryParams: {  type: 'org-summary', id: id, unitId: this.unit.id }, relativeTo: this.activatedRoute});
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Don\'t have access to see project summary',
        detail: "",
        closable: true,
      });
    }
  }

  export(){
    
  }

  async onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.unit = this.selectedUnit;
    await this.getUnitData()
    this.load({});
  //  super.changeAccess(PuesDataReqDtoSourceName.Passenger_air)

  }

}
