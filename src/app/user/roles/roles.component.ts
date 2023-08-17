import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';

import { Role, RoleControllerServiceProxy, Roles, ServiceProxy as AuthServiceProxy, UserAction, UserActions } from 'shared/service-proxies/auth-service-proxies';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  public roles = Roles
  public userActions_ = UserActions

  rows: number = 50;
  loading: boolean = false;
  roleList: Role[] = [];
  totalRecords: number;
  
  selectedRole: Role;
  creabeleRoleList: Role[] = [];
  userActionList: UserAction[] = [];
  allUserActionList: UserAction[] = [];


  isViewCreatbele: boolean = false;
  isViewUserAction: boolean = false;
  isCreateCreatbele: boolean = false;
  isCreateUserAction: boolean = false;

  creabeleHeader: string = "";
  userActionHeader: string = ""
  createHeader: string = "";
  userActionCreateHeader: string = "";

  createdCode: Roles[] = [];
  createdUserAction: UserAction[] = [];

  constructor(
    private authServiceProxy: AuthServiceProxy, 
    private roleControllerServiceProxy: RoleControllerServiceProxy,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    // this.load({})
    this.loadUserActions()
  }


  load(event: LazyLoadEvent) {
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber = event.first === 0 || event.first == undefined ? 1 :event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    let filter = [ "status||$ne||"+RecordStatus.Deleted];


    if(filter.length> 0){
      this.authServiceProxy.getManyBaseRoleControllerRole(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        100,
        0,
        0,
        0
      ).subscribe(res => {
        console.log(res.data);
        this.roleList = res.data;
        this.totalRecords = res.total;
        this.loading = false;
        // console.log(this.roleList);
      })  
    }
  }

  viewCreatbele(role: Role){
    this.selectedRole = role;
    this.isViewCreatbele = true;
    this.creabeleRoleList = role.creatableRoles.split(",").map(r => {
      return this.roleList.find(rr => rr.code === r);
    }).filter(a => a !== undefined) as Role[]
    this.creabeleHeader = "Creatable Roles of "+role.name
  }

  deleteCreatableRole(code: Roles){

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: async () => {
        if(this.selectedRole){
          try{
            let res = await this.roleControllerServiceProxy.removeCreatableRoles(this.selectedRole.id, code.toString()).toPromise();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Deteled successfully',
              closable: true,
            });
            this.creabeleRoleList = this.creabeleRoleList.filter(r => r.code as unknown as Roles !== code);
            this.load({});
          }catch(err){
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete',
              closable: true,
            });
          }
        }
      },
      reject: () => { },
    });
  }

  async saveCreatable(){
    try{
      let res = await this.roleControllerServiceProxy.addCreatableRoles(this.selectedRole.id, this.createdCode.map(c => c.toString())).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Deteled successfully',
        closable: true,
      });

      this.load({})
      this.isCreateCreatbele = false;
      this.createdCode = [Roles.NO_ACTION];
    }catch(err){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete',
        closable: true,
      });
    }
  }


  createCreatbele(role: Role){
    this.createdCode = [];
    this.selectedRole = role;
    this.isCreateCreatbele = true;
    this.createHeader = "Add creatable role for " + role.name
  }

  userActions(role: Role){
    this.selectedRole = role;
    this.userActionList = role.defaultUserActions;
    this.isViewUserAction = true;
    this.userActionHeader = "Default user actions of "+ role.name
  }

  deleteUserActions(ua: UserAction){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: async () => {
        if(this.selectedRole && ua.id){
          try{
            let res = await this.roleControllerServiceProxy.removeUserAction(this.selectedRole.id, ua.id).toPromise();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Deteled successfully',
              closable: true,
            });
            this.userActionList=    this.userActionList.filter(u => u.id !== ua.id);
            this.load({})
          }catch(err){
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete',
              closable: true,
            });
          }
        }
      },
      reject: () => { },
    });
  }

  addUserAction(){
    this.createdUserAction = [];
    this.isCreateUserAction = true;
    this.userActionCreateHeader = "Add default user action for " + this.selectedRole.name
  }

  async saveUserAction(){
    if(this.selectedRole && this.createdUserAction){
      try{
        let res = await this.roleControllerServiceProxy.addUserAction(this.selectedRole.id, this.createdUserAction.map(a => a.id.toString())).toPromise();
        if(res){          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Created successfully',
            closable: true,
          });
        }else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create',
            closable: true,
          }); 
        }
        this.isViewUserAction = false;
        this.isCreateUserAction = false;
        this.load({});
      }catch(err){
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create',
          closable: true,
        });
      }
    }
  }


  loadUserActions(){
    let filter = [ "status||$ne||"+RecordStatus.Deleted];
    this.authServiceProxy.getManyBaseUserActionControllerUserAction(
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
      this.allUserActionList = res.data;  
    })  
  }
}
