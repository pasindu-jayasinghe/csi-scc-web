import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService, RecordStatus } from 'shared/AppService';
import { PurchasedGoodsAndServicesActivityData, PuesDataReqDtoSourceName, Unit, Project, ServiceProxy, PurchasedGoodsAndServicesActivityDataControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-net-zero-purchased-good-and-services-list',
  templateUrl: './net-zero-purchased-good-and-services-list.component.html',
  styleUrls: ['./net-zero-purchased-good-and-services-list.component.css']
})
export class NetZeroPurchasedGoodAndServicesListComponent extends EmissionListBaseComponent implements OnInit {

  loading: boolean;
  rows: number = 10;

  totalRecords: number;

  purchaseData: PurchasedGoodsAndServicesActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Purchased_goods_and_services;
 


  searchBy: any = {
    text: null,
    usertype: null,
  };


  constructor(
    protected messageService: MessageService,
    protected serviceProxy: ServiceProxy, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute:ActivatedRoute, // {relativeTo:this.activatedRoute}
    private confirmationService: ConfirmationService,
    protected appService: AppService,
    private masterDataService: MasterDataService,
    protected dialogService: DialogService,
    private purchasedGoodsAndServicesActivityDataControllerServiceProxy: PurchasedGoodsAndServicesActivityDataControllerServiceProxy

  ) {
    super(appService, serviceProxy,dialogService,messageService);
    super.setChildReference(this);
    super.setChildReference(this);
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    await super.ngOnInit();
    this.load({})
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.load(event);
  }

  load(event: LazyLoadEvent) {
    super.setSortText(event);
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber = (event.first === 0 || event.first == undefined) ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    if (this.listLoadable()) {
      this.purchasedGoodsAndServicesActivityDataControllerServiceProxy
        .getAllPurchaseGoodAndServicesData(pageNumber, this.rows,
          this.selectedProject.id, this.selectedUnit.id
        ).subscribe((res: any) => {
          this.purchaseData = res.data;
          this.totalRecords = res.total;
          this.loading = false;
        })
    } else {
      this.purchaseData = []
      this.loading = false;
    }
  }

  edit(id: number) {
    this.router.navigate(['../purchase-good-and-services-edit', id], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../purchase-good-and-services-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  new() {
    this.router.navigate(['../purchase-good-and-services-add'], {relativeTo:this.activatedRoute});
  }

  onTypeChange(event: any){
    this.onSearch()
  }

  onDeleteClick(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteWholeGroup(id);
      },
      reject: () => { },
    });
  }

  async deleteWholeGroup(groupnumber: string) {
    this.purchasedGoodsAndServicesActivityDataControllerServiceProxy.deleteWholeGroup(groupnumber)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      }, (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, () => {
        let event: any = {};
        event.rows = this.rows;
        event.first = 0;

        this.load(event);
      })
  }


  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Purchased_goods_and_services)
  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Purchased_goods_and_services)
  }

  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Purchased_goods_and_services, this);
  }

  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Purchased_goods_and_services, this);
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Purchased_goods_and_services);
  }

}
