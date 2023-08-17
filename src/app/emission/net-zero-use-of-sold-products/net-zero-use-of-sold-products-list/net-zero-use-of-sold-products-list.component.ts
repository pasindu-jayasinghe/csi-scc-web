import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { NetZeroUseOfSoldProductActivityData, NetZeroUseOfSoldProductsActivityDataControllerServiceProxy, Project, PuesDataReqDtoSourceName, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-net-zero-use-of-sold-products-list',
  templateUrl: './net-zero-use-of-sold-products-list.component.html',
  styleUrls: ['./net-zero-use-of-sold-products-list.component.css']
})
export class NetZeroUseOfSoldProductsListComponent extends EmissionListBaseComponent implements OnInit {

  loading: boolean;
  rows: number = 10;
  totalRecords: number;
  soldData: NetZeroUseOfSoldProductActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Use_of_sold_products;

  searchBy: any = {
    text: null,
    usertype: null,
  };
  methods: { id: number; name: string; code: string; }[];


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
    private netZeroUseOfSoldProductsActivityDataControllerServiceProxy: NetZeroUseOfSoldProductsActivityDataControllerServiceProxy

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
    this.methods = this.masterDataService.use_of_sold_products_method
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
      this.netZeroUseOfSoldProductsActivityDataControllerServiceProxy
        .getAllUseOfSoldProductsData(pageNumber, this.rows,
          this.selectedProject.id, this.selectedUnit.id
        ).subscribe((res: any) => {
          this.soldData = res.data;
          this.totalRecords = res.total;
          this.loading = false;
        })
    } else {
      this.soldData = []
      this.loading = false;
    }
  }

  edit(id: number) {
    console.log(id)
    this.router.navigate(['../use-of-sold-products-edit', id], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../use-of-sold-products-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  new() {
    this.router.navigate(['../use-of-sold-products-add'], {relativeTo:this.activatedRoute});
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
    this.netZeroUseOfSoldProductsActivityDataControllerServiceProxy.deleteWholeGroup(groupnumber)
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
    super.changeAccess(PuesDataReqDtoSourceName.Use_of_sold_products)
  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Use_of_sold_products)
  }

  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Use_of_sold_products, this);
  }

  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Use_of_sold_products, this);
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Use_of_sold_products);
  }

  getMethod(method: string){
    return (this.methods.find(o => o.code === method))?.name
  }


}
