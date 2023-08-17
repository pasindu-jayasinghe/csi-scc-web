import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { LazyLoadEvent } from 'primeng/api';
import { ServiceProxy, User } from 'shared/service-proxies/service-proxies';
import { AuditControllerServiceProxy, Audit as audit } from 'shared/service-proxies/audit-service-proxies';
import { Role, ServiceProxy as AuthServiceProxy } from 'shared/service-proxies/auth-service-proxies';

import { AppService, RecordStatus } from 'shared/AppService';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css'],
})
export class AuditComponent implements OnInit {
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  Date =new Date();
  searchText: string;
  userTypeList: Role[] = [];
  actions: string[]= []
  
  searchBy: any = {
    text: null,
    usertype: null,
    action: null,
    editedOn: null,
    from: null,
    to: null
  };

  first = 0;
  activities: audit[];
  dateList: Date[] = [];
  loggedusers: User[];
  institutionId: number;

  constructor(
    private auditserviceproxy: AuditControllerServiceProxy,
    private authServiceProxy: AuthServiceProxy,
    private cdr: ChangeDetectorRef,
    private appService: AppService
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    this.loadUserTypes()
    let loggedUser = await this.appService.getUser();
    if(loggedUser){
      this.loggedusers = [loggedUser]
      this.institutionId = loggedUser.unit.id
    }
  }

  loadUserTypes(){
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
        this.userTypeList = res.data;
      })  
    }  
  }



  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  getTyserTypes(str: string){
    if(str){
      let types = str.split(",")
      return this.userTypeList.filter(u => types.includes(u.code)).map(a => a.name).join(",");
    }
    return "";
  }


  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;


    let usertype = this.searchBy.usertype ? this.searchBy.usertype : '';
    let action = this.searchBy.activity ? this.searchBy.activity : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let from = this.searchBy.from
      ? moment(this.searchBy.from).format('YYYY-MM-DD H:mm')
      : '';

    let to = this.searchBy.to
      ? moment(this.searchBy.to).format('YYYY-MM-DD H:mm')
      : moment(new Date()).format('YYYY-MM-DD H:mm');
    let editedOn = from + " to " + to;


    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

      this.auditserviceproxy
        .getAuditDetails(
          pageNumber,
          this.rows,
          usertype,
          action,
          editedOn,
          filtertext,
          -1
        )

        .subscribe((a) => {
          this.activities = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;         
        });
  };
}
