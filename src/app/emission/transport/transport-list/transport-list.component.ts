import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import {Router, ActivatedRoute} from "@angular/router";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import { EsAccessService } from 'app/es-access-controle/es-access.service';
import { PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';
import { AppService, ProjectTypes } from 'shared/AppService';
import { MasterDataService } from 'app/shared/master-data.service';

export enum IndexCode{
  AIR="AIR",
  OFF_ROAD="OFF_ROAD",
  RAIL="RAIL",
  EMP_COM="EMP_COM",
  WATER="WATER",
  BT="BT",

  F_AIR="F_AIR",
  F_OFF_ROAD="F_OFF_ROAD",
  F_RAIL="F_RAIL",
  F_ROAD="F_ROAD",
  F_WATER="F_WATER",
}

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.css']
})
export class TransportListComponent implements OnInit {

  addFreight: boolean = false
  addPassenger: boolean = false
  addOffroad: boolean = false

  index: number = 0
  subIndex: number = 0
  subPassgerIndexCode: IndexCode = IndexCode.AIR

 
  loading: boolean;
  rows: number = 10;

  totalRecords: number;
  // freightData: FreightTransportActivityData[];

  searchBy: any = {
    text: null,
    usertype: null,
  };

  isCSIUser: boolean =false;
  accessESList: PuesDataReqDtoSourceName[] = []

  freightESList: PuesDataReqDtoSourceName[] = [];
  passengerESList: PuesDataReqDtoSourceName[] = []
  offroadESList: PuesDataReqDtoSourceName[] = []

  freight: boolean = false;
  passenger: boolean = false;
  offroad: boolean = false;
  projectType: ProjectTypes;

  constructor(
    protected messageService: MessageService,
    private serviceProxy: ServiceProxy, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute:ActivatedRoute,
    private confirmationService: ConfirmationService,
    private esAccessService: EsAccessService,
    public appService: AppService,
    private masterDataService: MasterDataService
  ) {
    this.appService.projectType.subscribe(p => this.projectType = p);
    const indexes = this.router.getCurrentNavigation()?.extras.state
    if (indexes) {
      console.log("iiiiii",indexes)
      this.index = indexes['mainTabIndex']

      this.subPassgerIndexCode = indexes["subTabIndexCode"]

      this.subIndex = indexes['subTabIndex']
    }
  }

  public get projectTypesEnum(): typeof ProjectTypes {
    return ProjectTypes; 
  }

  public get puesDataReqDtoSourceName(): typeof PuesDataReqDtoSourceName {
    return PuesDataReqDtoSourceName; 
  }

  hasFreightAccess(){
    return this.accessESList.some(es => this.freightESList.includes(es));
  }
  hasPassengerAccess(){
    return this.accessESList.some(es => this.passengerESList.includes(es));
  }
  hasOffroadAccess(){
    return this.accessESList.some(es => this.offroadESList.includes(es));
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit() {

    this.freightESList = this.masterDataService.freightESList;
    this.passengerESList = this.masterDataService.passengerESList;
    this.offroadESList = this.masterDataService.offroadESList;

    this.isCSIUser = this.appService.isCSIUser();
    if(!this.isCSIUser){
      this.accessESList =  await this.esAccessService.getESList();

      this.freight = this.hasFreightAccess();
      this.passenger = this.hasPassengerAccess();
      this.offroad = this.hasOffroadAccess();
      console.log(this.freight, this.passenger, this.offroad);
    }
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
  }


  cleanString(str:string) {

    str = str.replace(/}",/gi, '},');
    str = str.replace(/:"{/gi, ':{');
    str = str.replace(/[\/\\]/g, '');
    return str;
  }



  editFreight(id: number) {
    this.router.navigate(['../freight-transport-edit', id], { queryParams: { id: id }, relativeTo: this.activatedRoute });
  }

  viewFreight(id: number) {
    this.router.navigate(['../freight-transport-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  newFreight() {
    this.router.navigate(['../freight-transport-add'], {relativeTo:this.activatedRoute});
  }

  editPassenger(id: number) {
    this.router.navigate(['../passenger-transport-edit', id], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  viewPassenger(id: number) {
    this.router.navigate(['../passenger-transport-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  onTypeChange(event: any){
    console.log('loading.....')
    this.onSearch()
    console.log('result.....',event)
  }

  onDeleteClickFreight(id: number) {
   
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteFreight(id);
      },
      reject: () => { },
    });
  }

  onDeleteClickPassenger(id: number) {
   
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deletePassenger(id);
      },
      reject: () => { },
    });
  }


  deleteFreight(id: number) {
    // this.serviceProxy.deleteOneBaseFreightTransportActivityDataControllerFreightTransportActivityData(id)
    // .subscribe(res => {
    //   this.messageService.add({
    //     severity: 'success',
    //     summary: 'Success',
    //     detail: 'has deleted successfully',
    //     closable: true,
    //   });
    // },error => {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'An error occurred, please try again',
    //     closable: true,
    //   });
      
    // },()=>this.onSearch())
    
  }


  deletePassenger(id: number) {
    // this.serviceProxy.deleteOneBaseFreightTransportActivityDataControllerFreightTransportActivityData(id)
    // .subscribe(res => {
    //   this.messageService.add({
    //     severity: 'success',
    //     summary: 'Success',
    //     detail: 'has deleted successfully',
    //     closable: true,
    //   });
    // },error => {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'An error occurred, please try again',
    //     closable: true,
    //   });
      
    // },()=>this.onSearch())
    
  }

  


        



              

}
