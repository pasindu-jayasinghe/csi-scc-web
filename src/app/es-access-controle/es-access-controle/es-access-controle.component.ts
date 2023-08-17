import { Component, OnInit } from '@angular/core';
import { AppService,   RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Project, ProjectStatus, ProjectUnit, ProjectUnitEmissionSource, ServiceProxy, Unit, User, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-es-access-controle',
  templateUrl: './es-access-controle.component.html',
  styleUrls: ['./es-access-controle.component.css']
})
export class EsAccessControleComponent implements OnInit {
  public roles = Roles
  public userActions = UserActions

  projects: Project[] = [];
  units: Unit[] = [];
  users: User[] = [];
  puList: ProjectUnit[]=[];
  puesList: ProjectUnitEmissionSource[] = [];

  project: Project;
  unit: Unit;
  user: User;

  constructor(private serviceProxy: ServiceProxy, public appService: AppService, private UsersControllerServiceProxy: UsersControllerServiceProxy) { }

  logedUnit: Unit;
  isCSIUser: boolean = false;
  async ngOnInit() {
    this.isCSIUser =this.appService.isCSIUser();
    let u = await this.appService.getLogedUnit();
    if(u){
      this.logedUnit = u;
    }
    await this.getProjects();
  }

  reset(){
    //@ts-ignore
    this.project = null;
    //@ts-ignore
    this.unit = null;
    //@ts-ignore
    this.user = null;

    this.puesList = [];
  }


  async getProjects(){ 
    let filter = ["status||$ne||"+RecordStatus.Deleted,"projectStatus||$ne||"+ProjectStatus.Initial];
    if(!this.isCSIUser){
      filter.push("ownerUnit.id||$eq||"+this.logedUnit.id,  'projectStatus||$ne||Initial')
    }

    if(this.appService.isOnlyForcalPoint()){
      let ids = this.appService.getAllowedFtProjectIds();
      if(ids.length > 0){
        filter.push("id||$in||"+ids.join(","))
      }
    }
    const res = await this.serviceProxy.getManyBaseProjectControllerProject(
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      ['ownerUnit'],
      1000,
      0,
      0,
      0
    ).toPromise();
    this.projects = res.data    
  }

  async getUnits(){
    this.puList = await this.getProjectUnits(this.project.projectUnits.map(pu => pu.id));
    // console.log(this.puList);
    this.units = this.puList.map(pu => pu.unit)
  }

  async getProjectUnits(ids: number[]){    
    try{
      const res =  await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined,
        undefined,
        [ "id||$in||" + ids.join(",") , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        undefined,
        ids.length*2,
        0,
        0,
        0
      ).toPromise();
  
      return res.data;
    }catch(err){
      return [];
    }
  }

  changeUnit(){
    this.getUsers();   
    if(this.user){
      this.getPUESList(); 
    }
  }


  async getUsers(){


    try{
      let res = await this.UsersControllerServiceProxy.getUsersByRole(this.unit.id.toString(), Roles.DEO.toString()).toPromise()

      // const res =  await this.serviceProxy.getManyBaseUsersControllerUser(
      //   undefined,
      //   undefined,
      //   [ "unit.id||$eq||" + this.unit.id , "status||$ne||"+RecordStatus.Deleted],      
      //   undefined,
      //   undefined,
      //   ['unit'],
      //   100,
      //   0,
      //   0,
      //   0
      // ).toPromise();
  
      this.users = res;
    }catch(err){
      this.users = [];
    }
  }

  async getPUESList(){
   
    let pu = this.puList.find(pu => pu.unit.id == this.unit.id);
    if(pu){
      // console.log(pu);
      try{
        const res = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
          undefined,
          undefined,
          [ "projectUnit.id||$eq||" + pu.id , "status||$ne||"+RecordStatus.Deleted],      
          undefined,
          undefined,
          ['emissionSource','projectUnit','assignedESList','assignedESList.user'],
          100,
          0,
          0,
          0
        ).toPromise();

        this.puesList = res.data;
        // console.log(this.puesList);
      }catch(err){
       this.puesList = [] 
      }
    }
  }

}
