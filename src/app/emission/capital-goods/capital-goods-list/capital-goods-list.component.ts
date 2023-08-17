import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  CapitalGoodsActivityDataControllerServiceProxy,
  EndOfLifeTreatmentOfSoldProductsActivityDataControllerServiceProxy,
  FuelEnergyRelatedActivitiesActivityDataControllerServiceProxy,
  InvestmentsActivityData,
  InvestmentsActivityDataControllerServiceProxy,
  Project,
  PuesDataReqDtoSourceName,
  ServiceProxy, Unit
} from "../../../../shared/service-proxies/service-proxies";
import {Router, ActivatedRoute} from "@angular/router";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import { AppService, RecordStatus } from 'shared/AppService';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-capital-goods-list',
  templateUrl: './capital-goods-list.component.html',
  styleUrls: ['./capital-goods-list.component.css']
})
export class CapitalGoodsListComponent extends EmissionListBaseComponent implements OnInit {

  rows: number = 10;
  loading: boolean;
  // eoltSoldProductData: InvestmentsActivityData[];
    eoltSoldProductData: any[];

  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Capital_goods

  totalRecords: number;

  searchText: string = '';
  searchEmailText: string;
  searchLastText: string;


  searchBy: any = {
    text: null,
    usertype: null,
  };


  constructor(
    protected messageService: MessageService,
    protected serviceProxy: ServiceProxy, private router: Router,
    public capitalGoodsService:CapitalGoodsActivityDataControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    protected appService: AppService,
    private masterDataService: MasterDataService,protected dialogService: DialogService

  ) {
    super(appService, serviceProxy,dialogService,messageService);
    super.setChildReference(this);
      }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }


  async ngOnInit() {
    await super.ngOnInit();
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

    let filters = [ "status||$ne||"+RecordStatus.Deleted];
    if(this.selectedProject){
      filters.push("project.id||$eq||"+this.selectedProject.id);
    }
    if(this.selectedUnit && !this.isAuditor){
      filters.push("unit.id||$eq||"+this.selectedUnit.id);
    }

    if(this.listLoadable()){
      this.capitalGoodsService
      .getAllEoltSoldProductsData(pageNumber,this.rows,
        this.selectedProject.id,this.selectedUnit.id
      ).subscribe((res:any) => {

       
      this.eoltSoldProductData = res.data;

      console.log("kkkk",this.eoltSoldProductData)
      this.totalRecords = res.total;
      this.loading = false;
    })
    } else {
      this.eoltSoldProductData = []
      this.loading = false;
    }

  }


  edit(id: number) {
    this.router.navigate(['../capital-goods-edit', id], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../capital-goods-view', id], { queryParams: { id: id } , relativeTo:this.activatedRoute });
  }

  new() {
    this.router.navigate(['../capital-goods-add'], {relativeTo:this.activatedRoute});
  }

  onTypeChange(event: any){
    this.onSearch()
  }

  onDeleteClick(id: string) {
    // this.delete(id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(id);
      },
      reject: () => { },
    });
  }

  delete(id: string) {
    this.capitalGoodsService.deleteAllEntry(id)
    .subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'has deleted successfully',
        closable: true,
      });
    },error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred, please try again',
        closable: true,
      });
      
    },()=>this.onSearch())
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Capital_goods)

  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Capital_goods)
  }



  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Capital_goods,this);
  }
  
  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Capital_goods, this);
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Capital_goods);
  }

}
