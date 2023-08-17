import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { PassengerRailActivityData, Project, PuesDataReqDtoSourceName, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-passenger-rail-list',
  templateUrl: './passenger-rail-list.component.html',
  styleUrls: ['./passenger-rail-list.component.css']
})
export class PassengerRailListComponent extends EmissionListBaseComponent implements OnInit {

  loading: boolean;
  rows: number = 10;
  totalRecords: number;

  railData: PassengerRailActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Passenger_rail

  searchBy: any = {
    text: null,
    usertype: null,
  };

  constructor(
    protected messageService: MessageService,
    protected serviceProxy: ServiceProxy,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute, // {relativeTo:this.activatedRoute}
    private confirmationService: ConfirmationService,
    protected appService: AppService,
    private masterDataService: MasterDataService,protected dialogService: DialogService
  ) {
    super(appService, serviceProxy,dialogService,messageService);
    super.setChildReference(this);
       }


  async ngOnInit() {
    await super.ngOnInit();
  }

  load(event: LazyLoadEvent) {
    console.log(event);
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
        .getManyBasePassengerRailActivityDataControllerPassengerRailActivityData(
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
        ).subscribe((res: any) => {
          this.railData = res.data;
          this.totalRecords = res.total;
          this.loading = false;
          console.log('railData--', this.railData)
          console.log('total..', this.totalRecords)
        })
    }   else {
      this.railData = []
      this.loading = false;
    }  

  }

  add(){
    this.router.navigate(['../passenger-rail-add'], { relativeTo:this.activatedRoute  });
  }

  edit(id: number) {
    this.router.navigate(['../passenger-rail-edit', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  view(id: number) {
    this.router.navigate(['../passenger-rail-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.load(event);
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
    this.serviceProxy.deleteOneBasePassengerRailActivityDataControllerPassengerRailActivityData(id)
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
      }, () => this.onSearch())
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_rail)
  }



  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_rail)
  }
  
  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Passenger_rail, this);
  }


  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Passenger_rail);
  }
}
