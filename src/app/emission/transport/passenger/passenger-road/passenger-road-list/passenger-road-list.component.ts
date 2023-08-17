import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { PassengerRoadActivityData, Project, PuesDataReqDtoSourceName, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-passenger-road-list',
  templateUrl: './passenger-road-list.component.html',
  styleUrls: ['./passenger-road-list.component.css']
})
export class PassengerRoadListComponent extends EmissionListBaseComponent implements OnInit {

  loading: boolean;
  rows: number = 10;
  totalRecords: number;

  roadData: PassengerRoadActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Passenger_road;

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
        .getManyBasePassengerRoadActivityDataControllerPassengerRoadActivityData(
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
          this.roadData = res.data;
          this.totalRecords = res.total;
          this.loading = false;
          console.log('roadData--', this.roadData)
          console.log('total..', this.totalRecords)
        }) 
    }  else {
      this.roadData = []
      this.loading = false;
    }   

  }

  add() {
    this.router.navigate(['../passenger-road-add'], {  relativeTo:this.activatedRoute  });
 }

  edit(id: number) {
    this.router.navigate(['../passenger-road-edit', id], { queryParams: { id: id, type: 'ROAD' }, relativeTo:this.activatedRoute  });
  }

  view(id: number) {
    this.router.navigate(['../passenger-road-view', id], { queryParams: { id: id, type: 'ROAD' }, relativeTo:this.activatedRoute  });
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
    this.serviceProxy.deleteOneBasePassengerRoadActivityDataControllerPassengerRoadActivityData(id)
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
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_road)
  }



  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_road)
  }



  getMethod(method: string){
    let m = this.masterDataService.passenger_onroad_methods.find(o => o.code === method)
    return m?.name
  }

  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Passenger_road,this);
  }
  
  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Passenger_road, this);
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Passenger_road);
  }
}
