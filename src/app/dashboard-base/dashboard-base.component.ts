import { Component, OnInit } from '@angular/core';
import { EsAccessService } from 'app/es-access-controle/es-access.service';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService } from 'primeng/api';
import { AppService, ProjectTypes, RecordStatus } from 'shared/AppService';
import { Role, Roles, ServiceProxy, UserAction, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';

import { MenuItem, sideMenu } from './nav';






@Component({
  selector: 'app-dashboard-base',
  templateUrl: './dashboard-base.component.html',
  styleUrls: ['./dashboard-base.component.css']
})
export class DashboardBaseComponent implements OnInit {



  title = 'SCC ';
  togglemenu: boolean = true;
  innerWidth = 0;


  userName: string = "";
  userRole: string = "";
  unitName: string = "";
  roles: Role[] = [];
  sideMenu: MenuItem[] = [];

  currentRoless: Roles[] = [];
  currentActions: UserActions[] = [];

  accessESList: PuesDataReqDtoSourceName[] = []

  isCSIUser: boolean =false;
  isAuditor: boolean =false;
  transportEsList: PuesDataReqDtoSourceName[] = []

  projectTypes: ProjectTypes[] = []
  projectType: ProjectTypes;


  constructor(
    private confirmationService: ConfirmationService,
    private appService: AppService, 
    private authServiceProxy: ServiceProxy,
    protected esAccessService: EsAccessService,
    private masterDatService: MasterDataService
  ) {}

  async ngOnInit() {

    this.appService.projectType.subscribe(p => this.projectType = p);
    this.projectTypes =  Object.values(ProjectTypes);

    this.transportEsList = this.masterDatService.transportESList;
    this.userName = `${this.appService.getUserName()}`;
    if(this.userName == 'null' || this.userName == "" || this.userName == null || this.userName == undefined){
      this.appService.logout();
    }
    this.getRoles();
    this.currentActions = this.appService.getUserActions()
    this.isCSIUser = this.appService.isCSIUser();
    this.isAuditor = this.appService.isCSIUser();
    let u = await this.appService.getLogedUnit();
    if(u){
      this.unitName = u.name;
    }
    if(!this.isCSIUser){
      this.accessESList =  await this.esAccessService.getESList();
    }
    this.sideMenu = sideMenu;
  }

  getEsName(name: string, isES: boolean){
    if(isES){
      let splited = name.split(",");
      if(this.projectType == ProjectTypes.GHG){
        return splited[0];
      }else if(splited.length >1){
        return splited[1]
      }else{
        return splited[0];
      }
    }
    return name;
  }


  onChangeProjectType(type: ProjectTypes){
    this.appService.setProjectType(type);
  }

  async getRoles(){
    const roles = this.appService.getRoles();
    this.currentRoless = roles;
    if(roles.length> 0){
      const res = await this.authServiceProxy.getManyBaseRoleControllerRole(
        undefined,
        undefined,
        [ "status||$ne||"+RecordStatus.Deleted],
        undefined,
        undefined,
        undefined,
        100,
        0,
        0,
        0
      ).toPromise();
      this.roles = res.data;
      const rr = this.roles.filter(role => roles.includes(role.code as unknown as Roles));
      if(rr){
        this.userRole = rr.map(r => r.name).join(",");
      }
    }
  }

  logout(){
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.appService.logout();
      },
      reject: () => { },
    });
  }

  hasSideMenuAccess( requireAnyRoles: Roles[], requireAnyActions: UserActions[], isEs: boolean = false, es: PuesDataReqDtoSourceName | null = null): boolean{
    if(isEs){
      if(this.isCSIUser){
        return true;
      } else if (this.isAuditor) {
          return true;
      } else{
        if(es){
          return this.accessESList.includes(es);
        }else{
          return this.transportEsList.some(tes => this.accessESList.includes(tes));
        }
      }
    }else{
      let roleAccess = false
      let actionAccess = false
      if(requireAnyRoles.length ==0){
        // return true;
        roleAccess = true
        if (requireAnyActions.length === 0){
          actionAccess = true 
        } else {
          actionAccess = requireAnyActions.some(ra => this.currentActions.includes(ra))
        }
      } else {
        if (requireAnyActions.length === 0){
          actionAccess = true 
        } else {
          actionAccess = requireAnyActions.some(ra => this.currentActions.includes(ra))
        }
        roleAccess = requireAnyRoles.some(rr => this.currentRoless.includes(rr));
      }
      return roleAccess && actionAccess
      // return requireAnyRoles.some(rr => this.currentRoless.includes(rr));
    }
  }

}
