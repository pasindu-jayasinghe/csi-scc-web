import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { RoleControllerServiceProxy, UserAction, ServiceProxy as AuthServiceProxy, Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';

@Component({
  selector: 'app-user-action',
  templateUrl: './user-action.component.html',
  styleUrls: ['./user-action.component.css']
})
export class UserActionComponent implements OnInit {
  public roles = Roles
  public userActions = UserActions

  rows: number = 10;
  loading: boolean;
  userActionList: UserAction[];
  totalRecords: number;

  constructor(
    private authServiceProxy: AuthServiceProxy, 
    private roleControllerServiceProxy: RoleControllerServiceProxy,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
  }


  load(event: LazyLoadEvent) {
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber = event.first === 0 || event.first == undefined ? 1 :event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    let filter = [ "status||$ne||"+RecordStatus.Deleted];


    if(filter.length> 0){
      this.authServiceProxy.getManyBaseUserActionControllerUserAction(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        this.rows,
        0,
        pageNumber,
        0
      ).subscribe(res => {
        this.userActionList = res.data;
        this.totalRecords = res.total;
        this.loading = false;

      })  
    }
  }


  saveFunction(){
    
  }

}
