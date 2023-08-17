import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { PassengerAirActivityData, PassengerAirPort, PassengerAirPortControllerServiceProxy, Project, PuesDataReqDtoSourceName, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-passenger-air-list',
  templateUrl: './passenger-air-list.component.html',
  styleUrls: ['./passenger-air-list.component.css']
})
export class PassengerAirListComponent extends EmissionListBaseComponent implements OnInit {

  loading: boolean;
  rows: number = 10;
  totalRecords: number;

  airData: PassengerAirActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Passenger_air;
  airports: PassengerAirPort[] = []

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
    private masterDataService: MasterDataService,protected dialogService: DialogService,
    private passengerAirPortControllerServiceProxy: PassengerAirPortControllerServiceProxy
  ) {
    super(appService, serviceProxy,dialogService,messageService);
    super.setChildReference(this);
      }

  async ngOnInit() {
    await super.ngOnInit();
    await this.loadAirports()
  }

  async loadAirports(){
    this.airports = (await this.serviceProxy.getManyBasePassengerAirPortControllerPassengerAirPort(
      undefined, undefined, undefined, undefined, undefined, undefined, 4000, 0, 1, 0
    ).toPromise()).data
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
        .getManyBasePassengerAirActivityDataControllerPassengerAirActivityData(
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
          this.airData = res.data;
          this.totalRecords = res.total;
          this.loading = false;
        })
    } else {
      this.airData = []
      this.loading = false;
    }

  }

  add(){
    this.router.navigate(['../passenger-air-add'], { relativeTo:this.activatedRoute  });
  }

  edit(id: number) {
    this.router.navigate(['../passenger-air-edit', id], { queryParams: { id: id}, relativeTo:this.activatedRoute  });
  }

  view(id: number) {
    this.router.navigate(['../passenger-air-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
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
    this.serviceProxy.deleteOneBasePassengerAirActivityDataControllerPassengerAirActivityData(id)
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
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_air)

  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_air)
  }
  
  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Passenger_air, this);
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Passenger_air);
  }
   
  getAirport(code: string){
    if (code && code.includes('(')){
      let c = code.match(/\(([^)]+)\)/)
      if (c) code = c[1].trim()
    } 
    return (this.airports.find(o => o.airport_code === code))?.city_name

    // return (await this.passengerAirPortControllerServiceProxy.getAirportByCode(code).toPromise()).city_name
  }




}
