import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  ElectricityActivityData,
  Project,
  PuesDataReqDtoSourceName,
  ServiceProxy,
  Unit,
} from "../../../../shared/service-proxies/service-proxies";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, LazyLoadEvent, MessageService, SortEvent} from "primeng/api";
import { AppService, RecordStatus } from 'shared/AppService';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';
import { EvidenceRequestComponent } from 'app/verification/evidence-request/evidence-request.component';

@Component({
  selector: 'app-electricity-list',
  templateUrl: './electricity-list.component.html',
  styleUrls: ['./electricity-list.component.css']
})
export class ElectricityListComponent extends EmissionListBaseComponent implements OnInit {


  loading: boolean;
  rows: number = 10;

  totalRecords: number;

  electricityData: ElectricityActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Electricity;
 


  searchBy: any = {
    text: null,
    usertype: null,
  };


  constructor(
    protected messageService: MessageService,
    protected serviceProxy: ServiceProxy, private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute:ActivatedRoute, // {relativeTo:this.activatedRoute}
    private confirmationService: ConfirmationService,
    protected appService: AppService,
    private masterDataService: MasterDataService,protected dialogService: DialogService

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
    console.log(this.isAuditor)
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
      this.serviceProxy
        .getManyBaseElectricityActivityDataControllerElectricityActivityData(
          undefined,
          undefined,
          filters,
          undefined,
          this.orderText,
          ['unit','project'],
          this.rows,
          0,
          pageNumber,
          0
        ).subscribe((res:any) => {
        this.electricityData = res.data;
        console.log("kkkk",this.electricityData)

        this.totalRecords = res.total;
        this.loading = false;
      }) 
    } else {
      this.electricityData = []
      this.loading = false;
    }
  }

  edit(id: number) {
    this.router.navigate(['../electricity-edit', id], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../electricity-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  new() {
    this.router.navigate(['../electricity-add'], {relativeTo:this.activatedRoute});
  }

  onTypeChange(event: any){
    console.log('loading.....')
    this.onSearch()
    console.log('resualt.....',event)
  }

  onDeleteClick(id: number) {
    // this.delete(id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseElectricityActivityDataControllerElectricityActivityData(id)
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
   super.changeAccess(PuesDataReqDtoSourceName.Electricity)
  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Electricity)
  }



  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Electricity, this);
  }

  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Electricity, this);
  }


  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Electricity);
  }


}
