import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Project, ProjectControllerServiceProxy, ServiceProxy, Unit, UnitControllerServiceProxy, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  togglemenu: boolean = true;
  innerWidth = 0;

  isCSIUser: boolean = false;
  isAnyAdmin: boolean = false;



  activeProjects: number = 0;
  closedProjects: number = 0;
  orgs: number = 0;
  users: number = 0;


  indtituteadmin: boolean = false;
  userType: string = "countryAdmin";
  countryAdmin : boolean = false;
  data: any;
  activeprojects=["vv","df","d","d"];
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  chartOptions: any;
  searchBy: any = {
    text: null,
    sector: null,
    NDC: null,
    subNDC: null,
  };
  sectorList: string[] = [];
  subscription: Subscription;
  public i:number = 0;
  public id:string ='chart-container';
  public chartData: Object[];
  public marker: Object;
  public title: string;
  public items:any =[];
  data1: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; borderColor: string; }[]; };

  projectTypes: string[] = []
  projectType: any 
  unit: any;

  isAllData:boolean=false;
  constructor(
    private serviceProxy: ServiceProxy,
    private appService: AppService,
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private usersControllerServiceProxy: UsersControllerServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getProjectTypes()
    let user = await this.appService.getUser();
    if (user){
      this.unit = user.unit;      
    }

    this.isCSIUser = this.appService.isCSIUser();
    this.isAnyAdmin = this.appService.isAnyAdmin();

    if(this.unit && this.unit.id){
      this.getClosedAndActiveProjectsCount(this.unit.id);
      this.getParentChildUnits(this.unit.id);
      this.getUsers(this.unit.id);
    }
  }

  async getProjectTypes(){
    let types = await this.serviceProxy.getManyBaseProjectTypeControllerProjectType(
      undefined, undefined, undefined, undefined, 
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()

    types.data.map(type => {
      this.projectTypes.push(type.code)
    })
    this.projectType = this.projectTypes[0]
  }

  onUpdateUnit(e: Unit){
    this.unit = e;
    this.getClosedAndActiveProjectsCount(this.unit.id);
    this.getParentChildUnits(this.unit.id);
    this.getUsers(this.unit.id);
  }

  check() {

  }


  async getClosedAndActiveProjectsCount(unitId: number){
    try{
      if(this.isCSIUser){
        unitId = -1;
      }
      let res = await this.projectControllerServiceProxy.getClosedAndActiveProjectsCount(unitId).toPromise();
      this.activeProjects = res.active;
      this.closedProjects = res.closed;
    }catch(err){
      console.log(err);
    }
  }

  async getParentChildUnits(unitId: number){
    try{
      if(this.isCSIUser){
        unitId = -1;
      }
      let res = await this.unitControllerServiceProxy.getParentChildUnits(unitId).toPromise();
      this.orgs = res.parents;
    }catch(err){
      console.log(err);
    }
  }

  async getUsers(unitId: number){
    try{
      if(this.isCSIUser){
        unitId = -1;
      }
      let res = await this.usersControllerServiceProxy.getUsersCount(unitId.toString()).toPromise();
      this.users = res;
    }catch(err){
      console.log(err);
    }
  }

  
}
