import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  NetZeroBusinessTravelActivityDataControllerServiceProxy,
  NetZeroBusinessTravelActivityDataDtoMethod,
  DownstreamLeasedAssetsActivityDataActivityDataStatus,
  DownstreamLeasedAssetsActivityDataControllerServiceProxy,
  DownstreamLeasedAssetsActivityDataDto,
  DownstreamLeasedAssetsActivityDataDtoMethod,
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
  selector: 'app-downstream-leased-assets-list',
  templateUrl: './downstream-leased-assets-list.component.html',
  styleUrls: ['./downstream-leased-assets-list.component.css']
})
export class DownstreamLeasedAssetsListComponent extends EmissionListBaseComponent implements OnInit {

  rows: number = 10;
  loading: boolean;
  netZeroBusinessTravelData: any[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Generator

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
    protected serviceProxy: ServiceProxy,
    public wasteGeneratedInOperationsActivityDataControllerServiceProxy: DownstreamLeasedAssetsActivityDataControllerServiceProxy,
    private router: Router,
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
    // console.log(event);
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
      this.wasteGeneratedInOperationsActivityDataControllerServiceProxy
        .getAllDownstreamLeasedAssetsData(pageNumber,this.rows,
          this.selectedProject.id,this.selectedUnit.id
        ).subscribe((res:any) => {

         
        this.netZeroBusinessTravelData = res.data;
        this.totalRecords = res.total;
        this.loading = false;
      })
    } else {
      this.netZeroBusinessTravelData = []
      this.loading = false;
    }

  }


  edit(groupNumber: number) {
  
    this.router.navigate(['../downstream-leased-assets-edit'], {queryParams: { id: groupNumber }, relativeTo:this.activatedRoute });
  }

  view(groupNumber: number) {
    this.router.navigate(['../downstream-leased-assets-view'], { queryParams: { id: groupNumber } , relativeTo:this.activatedRoute });
  }

  new() {
    this.router.navigate(['../downstream-leased-assets-add'], {relativeTo:this.activatedRoute});
  }

  onTypeChange(event: any){
    this.onSearch()
  }

  onDeleteClick(groupnumber: string) {
    // this.delete(id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteWholeGroup(groupnumber);
      },
      reject: () => { },
    });
  }



  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Waste_generated_in_operations)

  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Waste_generated_in_operations)
  }



  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Waste_generated_in_operations,this);
  }
  
  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Waste_generated_in_operations, this);
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Waste_generated_in_operations);
  }
  async deleteWholeGroup(groupnumber:string) {
 
//@ts-ignore
    this.wasteGeneratedInOperationsActivityDataControllerServiceProxy.deleteWholeGroup(groupnumber)
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
      }, ()=> {
        let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.load(event);
      })
  }
}
