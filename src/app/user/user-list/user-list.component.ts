import { ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { LoginProfileControllerServiceProxy, Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import { AppService, RecordStatus } from 'shared/AppService';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public roles = Roles
  public userActions = UserActions
  rows: number = 10;
  loading: boolean;
  userList: User[];
  totalRecords: number;


  isCSIUser: boolean =false;
  logedUnit: Unit;

  isAnyAdmin: boolean = false;
  selectedUnit: Unit;


  constructor(
    private serviceProxy: ServiceProxy, 
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private router: Router,
    protected messageService: MessageService,
    private activatedRoute:ActivatedRoute,
    private loginProfileControllerServiceProxy: LoginProfileControllerServiceProxy,
    public appService: AppService

  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  
  async ngOnInit() {
    this.isAnyAdmin = this.appService.isAnyAdmin();
    this.isCSIUser = this.appService.isCSIUser();
    let u = await this.appService.getLogedUnit();
    if(u){
      this.logedUnit = u;
    }
    this.load({})
  }

  load(event: LazyLoadEvent) {


    this.loading = true;
    this.totalRecords = 0;

    // let pageNumber = event.first === 0 || event.first == undefined ? 1
    //   :event.first / (event.rows == undefined ? 1 : event.rows) + 1;

    let pageNumber = event.first === 0 || event.first == undefined ? 1
      :event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;



    let filter = [ "status||$ne||"+RecordStatus.Deleted];

    if(!this.isCSIUser && this.logedUnit){
      if(this.isAnyAdmin){
        if(this.selectedUnit){
          filter.push( "unit.id||$eq||"+this.selectedUnit.id)
        }else{
          filter.push( "unit.id||$eq||"+this.logedUnit.id)
        }
      }else{
        filter.push( "unit.id||$eq||"+this.logedUnit.id)
      }
    }

    if(this.isCSIUser && this.selectedUnit){
      filter.push( "unit.id||$eq||"+this.selectedUnit.id)
    }

    if(filter.length> 1){
      this.serviceProxy.getManyBaseUsersControllerUser(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        ['unit'],
        this.rows,
        0,
        pageNumber,
        0
      ).subscribe(res => {
        this.userList = res.data;
        this.totalRecords = res.total;
        this.loading = false;
      })  
    }
    
  }

  new(){
    this.router.navigate(['../create'], {relativeTo:this.activatedRoute});
  }

  edit(id: number) {
    this.router.navigate(['../edit'], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../view'], { queryParams: { id: id } , relativeTo:this.activatedRoute });
  }

  onDeleteClick(id: number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the user?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(id);
      },
      reject: () => { },
    });
  }

  delete(id: number){
    const u = this.userList.find(lp => lp.id  === id);
    
    if(u){
      this.deleteLoginProfile(u.loginProfile);
      u.status = RecordStatus.Deleted;
      this.serviceProxy.updateOneBaseUsersControllerUser(id, u)
        .subscribe(res => {
          this.load({rows: this.rows, first: 0});
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Deteled successfully',
            closable: true,
          });
        })
    }    
  }

  deleteLoginProfile(id: string){    
    //@ts-ignore
    this.loginProfileControllerServiceProxy.remove(id)
    .subscribe(res => {
      console.log(res)
    })
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.load({});
  }

}
