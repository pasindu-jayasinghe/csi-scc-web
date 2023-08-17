import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

import { AppService, RecordStatus } from 'shared/AppService';
import { LoginProfile, LoginProfileControllerServiceProxy, Role, RoleControllerServiceProxy, Roles, ServiceProxy as AuthServiceProxy, UserAction, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';


@Component({
  selector: 'app-user-actions-of-user',
  templateUrl: './user-actions-of-user.component.html',
  styleUrls: ['./user-actions-of-user.component.css']
})
export class UserActionsOfUserComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  selectedUnit: Unit;
  selectedUser: User;

  userRoles: Role[] = []
  userList: User[] = []

  userActionList: UserAction[] = [];
  allUserActionList: UserAction[] = [];
  selectedUserActionList: UserAction[] = [];
  defaultUserActionCode: string[] = [];

  lp:LoginProfile;

  constructor(
    private authServiceProxy: AuthServiceProxy, 
    private serviceProxy: ServiceProxy,
    private roleControllerServiceProxy: RoleControllerServiceProxy,
    private loginProfileControllerServiceProxy: LoginProfileControllerServiceProxy, 
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    public appService: AppService
  ) { }
  ngOnInit(): void {
    this.loadUserActions();
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.getUsers();
  }

  async getUsers(){
    try{
      const res =  await this.serviceProxy.getManyBaseUsersControllerUser(
        undefined,
        undefined,
        [ "unit.id||$eq||" + this.selectedUnit.id , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        undefined,
        100,
        0,
        0,
        0
      ).toPromise();
      this.userList = res.data;
    }catch(err){
      this.userList = [];
    }
  }

  async onUpdateUser(data: any){
    try{
      let lp = await this.loginProfileControllerServiceProxy.getById(this.selectedUser.loginProfile).toPromise();
      if(lp){
        this.lp = lp;
        this.userRoles = lp.roles.map(r => r);
        this.selectedUserActionList  = lp.userActions;
        this.userActionList = this.allUserActionList.filter(ua => !this.selectedUserActionList.map(a => a.code).includes(ua.code))
        this.loadDefaultActions();
      }
    }catch(err){

    }
  }


  loadUserActions() {
    let filter = [ "status||$ne||"+RecordStatus.Deleted];
    if(filter.length> 0){
      this.authServiceProxy.getManyBaseUserActionControllerUserAction(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        200,
        0,
        0,
        0
      ).subscribe(res => {
        this.userActionList = res.data;
        this.allUserActionList = this.userActionList;
      })  
    }
  }

  async loadDefaultActions(){
    if(this.selectedUser && this.selectedUser.id){
      const res =  await this.authServiceProxy.getManyBaseRoleControllerRole(
        undefined,
        undefined,
        [ "code||$in||" + this.userRoles.map(r => r.code).join(",") , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        undefined,
        100,
        0,
        0,
        0
      ).toPromise();
      let actions= res.data.map(r => r.defaultUserActions);
      let actionCodes: any[] = [];
      actions.map(a => actionCodes = [...actionCodes, ...a.map(aa => aa.code) ]);
      let unique = [...new Set(actionCodes)];
      this.defaultUserActionCode = unique;      
    }
  }


  allowDefaluts(){
    this.selectedUserActionList = [...this.selectedUserActionList, ...this.allUserActionList.filter(ua => this.defaultUserActionCode.includes(ua.code))]
    let unique = [...new Set(this.selectedUserActionList.map(a => a.code))];
    this.selectedUserActionList = unique.map(u => this.selectedUserActionList.find(s => s.code === u)).filter(d => d !== undefined) as UserAction[];
    this.userActionList = this.allUserActionList.filter(ua => !this.selectedUserActionList.map(ab => ab.code).includes(ua.code))
  }


  async save(){
    this.lp.userActions = this.selectedUserActionList;
    try{
      //@ts-ignore
      this.lp.password = undefined
      await this.loginProfileControllerServiceProxy.updateOneLoginProfile(this.lp).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Assigned successfully',
        closable: true,
      });
    }catch(err){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to assign',
        closable: true,
      });
    }
  }

}
