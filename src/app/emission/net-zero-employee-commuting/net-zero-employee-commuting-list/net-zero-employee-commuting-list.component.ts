import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  NetZeroBusinessTravelActivityDataControllerServiceProxy,
  NetZeroBusinessTravelActivityDataDtoMethod,
  NetZeroEmployeeCommutingActivityDataActivityDataStatus,
  NetZeroEmployeeCommutingActivityDataControllerServiceProxy,
  NetZeroEmployeeCommutingActivityDataDto,
  NetZeroEmployeeCommutingActivityDataDtoMethod,
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
  selector: 'app-net-zero-employee-commuting-list',
  templateUrl: './net-zero-employee-commuting-list.component.html',
  styleUrls: ['./net-zero-employee-commuting-list.component.css']
})
export class NetZeroEmployeeCommutingListComponent extends EmissionListBaseComponent implements OnInit {

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
  methods_net_zero_employee_commuting: { name: string; id: number; value: string; }[];


  constructor(
    protected messageService: MessageService,
    protected serviceProxy: ServiceProxy,
    public netZeroEmployeeCommutingActivityDataControllerServiceProxy: NetZeroEmployeeCommutingActivityDataControllerServiceProxy,
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
    this. methods_net_zero_employee_commuting=this.masterDataService.methods_net_zero_employee_commuting;

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
      this.netZeroEmployeeCommutingActivityDataControllerServiceProxy
        .getAllEmployeeCommutingData(pageNumber,this.rows,
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
    this.router.navigate(['../net-zero-employee-commuting-edit'], {queryParams: { id: groupNumber }, relativeTo:this.activatedRoute });
  }

  view(groupNumber: number) {
    this.router.navigate(['../net-zero-employee-commuting-view'], { queryParams: { id: groupNumber } , relativeTo:this.activatedRoute });
  }

  new() {
    this.router.navigate(['../net-zero-employee-commuting-add'], {relativeTo:this.activatedRoute});
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
   super.changeAccess(PuesDataReqDtoSourceName.Net_zero_employee_commuting)

  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Net_zero_employee_commuting)
  }
  selectMethodName(name:string):string|undefined{

    return this.methods_net_zero_employee_commuting.find(a=>a.value==name)?.name
   }


  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Net_zero_employee_commuting,this);
  }
  
  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Net_zero_employee_commuting, this);
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Net_zero_employee_commuting);
  }
  async deleteWholeGroup(groupnumber:string) {
 
//@ts-ignore
    this.netZeroEmployeeCommutingActivityDataControllerServiceProxy.deleteWholeGroup(groupnumber)
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
