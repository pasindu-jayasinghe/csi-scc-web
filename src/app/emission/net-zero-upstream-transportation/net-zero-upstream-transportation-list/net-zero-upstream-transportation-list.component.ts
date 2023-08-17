import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  UpstreamTransportationActivityDataControllerServiceProxy,
  Project,
  PuesDataReqDtoSourceName,
  ServiceProxy, Unit
} from "../../../../shared/service-proxies/service-proxies";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationService, LazyLoadEvent, MessageService } from "primeng/api";
import { AppService, RecordStatus } from 'shared/AppService';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-net-zero-upstream-transportation-list',
  templateUrl: './net-zero-upstream-transportation-list.component.html',
  styleUrls: ['./net-zero-upstream-transportation-list.component.css']
})
export class NetZeroUpstreamTransportationListComponent extends EmissionListBaseComponent implements OnInit {

  rows: number = 10;
  loading: boolean;
  netZeroUpstreamTransportationData: any[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Upstream_transportation_and_distribution

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
    public netZeroUpstreamTransportationActivityDataControllerServiceProxy: UpstreamTransportationActivityDataControllerServiceProxy,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    protected appService: AppService,
    private masterDataService: MasterDataService, protected dialogService: DialogService

  ) {
    super(appService, serviceProxy, dialogService, messageService);
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

    let filters = ["status||$ne||" + RecordStatus.Deleted];
    if (this.selectedProject) {
      filters.push("project.id||$eq||" + this.selectedProject.id);
    }
    if (this.selectedUnit && !this.isAuditor) {
      filters.push("unit.id||$eq||" + this.selectedUnit.id);
    }

    if (this.listLoadable()) {


      this.netZeroUpstreamTransportationActivityDataControllerServiceProxy
        .getAllUpstreamTransportationData(pageNumber, this.rows,
          this.selectedProject.id, this.selectedUnit.id
        ).subscribe((res: any) => {


          this.netZeroUpstreamTransportationData = res.data;
          this.totalRecords = res.total;
          this.loading = false;
        })
    } else {
      this.netZeroUpstreamTransportationData = []
      this.loading = false;
    }

  }


  edit(groupNumber: number) {
    this.router.navigate(['../net-zero-upstream-transportation-edit'], { queryParams: { id: groupNumber }, relativeTo: this.activatedRoute });
  }

  view(groupNumber: number) {
    this.router.navigate(['../net-zero-upstream-transportation-view'], { queryParams: { id: groupNumber }, relativeTo: this.activatedRoute });
  }

  new() {
    this.router.navigate(['../net-zero-upstream-transportation-add'], { relativeTo: this.activatedRoute });
  }

  onTypeChange(event: any) {
    this.onSearch()
  }

  onDeleteClick(groupnumber: string) {
    // this.delete(id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteWholeGroup(groupnumber);
      },
      reject: () => { },
    });
  }



  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Upstream_transportation_and_distribution)

  }


  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Upstream_transportation_and_distribution)
  }



  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Upstream_transportation_and_distribution, this);
  }

  downloadExcel() {
    super.downloadExcel(PuesDataReqDtoSourceName.Upstream_transportation_and_distribution, this);
  }

  watchVideo() {
    super.watchVideo(PuesDataReqDtoSourceName.Upstream_transportation_and_distribution);
  }
  async deleteWholeGroup(groupnumber: string) {

    //@ts-ignore
    this.netZeroUpstreamTransportationActivityDataControllerServiceProxy.deleteWholeGroup(groupnumber)
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      }, error => {
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
}
