import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FranchisesActivityDataControllerServiceProxy,
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
  selector: 'app-net-zero-franchises-list',
  templateUrl: './net-zero-franchises-list.component.html',
  styleUrls: ['./net-zero-franchises-list.component.css']
})
export class NetZeroFranchisesListComponent extends EmissionListBaseComponent implements OnInit {

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
  methods_franchise: { name: string; id: number; value: string; }[];


  constructor(
    protected messageService: MessageService,
    protected serviceProxy: ServiceProxy,
    public netZeroFranchisesActivityDataControllerServiceProxy: FranchisesActivityDataControllerServiceProxy,
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
    this.methods_franchise = this.masterDataService.methods_franchise

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


      this.netZeroFranchisesActivityDataControllerServiceProxy
        .getAllFranchisesData(pageNumber, this.rows,
          this.selectedProject.id, this.selectedUnit.id
        ).subscribe((res: any) => {


          this.netZeroBusinessTravelData = res.data;
          this.totalRecords = res.total;
          this.loading = false;
        })
    } else {
      this.netZeroBusinessTravelData = []
      this.loading = false;
    }

  }

  getMethodName(value: string){
    let m = this.methods_franchise.find(o => o.value === value)
    return m?.name
  }



  edit(groupNumber: number) {
    this.router.navigate(['../net-zero-franchises-edit'], { queryParams: { id: groupNumber }, relativeTo: this.activatedRoute });
  }

  view(groupNumber: number) {
    this.router.navigate(['../net-zero-franchises-view'], { queryParams: { id: groupNumber }, relativeTo: this.activatedRoute });
  }

  new() {
    this.router.navigate(['../net-zero-franchises-add'], { relativeTo: this.activatedRoute });
  }

  onTypeChange(event: any) {
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



  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Franchises)

  }


  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Franchises)
  }



  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Franchises, this);
  }

  downloadExcel() {
    super.downloadExcel(PuesDataReqDtoSourceName.Franchises, this);
  }

  watchVideo() {
    super.watchVideo(PuesDataReqDtoSourceName.Franchises);
  }
  async deleteWholeGroup(groupnumber: string) {

    //@ts-ignore
    this.netZeroFranchisesActivityDataControllerServiceProxy.deleteWholeGroup(groupnumber)
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
