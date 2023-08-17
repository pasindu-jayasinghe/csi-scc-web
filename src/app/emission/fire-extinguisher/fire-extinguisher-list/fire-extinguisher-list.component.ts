import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { FireExtinguisherActivityData, Project, PuesDataReqDtoSourceName, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-fire-extinguisher-list',
  templateUrl: './fire-extinguisher-list.component.html',
  styleUrls: ['./fire-extinguisher-list.component.css']
})
export class FireExtinguisherListComponent extends EmissionListBaseComponent implements OnInit {
  rows: number = 10;
  loading: boolean;
  fireExtinguishers: FireExtinguisherActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Fire_extinguisher;
  // customers: User[];

  totalRecords: number;

  searchText: string = '';
  searchEmailText: string;
  searchLastText: string;

  types: {name:string, id: number, code: string}[]


  searchBy: any = {
    text: null,
    usertype: null,
  };


  constructor(
    protected messageService: MessageService,
    protected serviceProxy: ServiceProxy, private router: Router,
    private activatedRoute:ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    protected appService: AppService,
    private masterDataService: MasterDataService,protected dialogService: DialogService
  ) {
    super(appService, serviceProxy,dialogService,messageService);
    super.setChildReference(this);
  }

  async ngOnInit() {
    this.types = this.masterDataService.fireExtinguisherTypes
    await super.ngOnInit();
  }


  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.load(event);
  }

  load(event: LazyLoadEvent) {
    console.log('loadelecData===', event);
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
        .getManyBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(
          undefined,
          undefined,
          filters,
          undefined,
          ['id,DESC'],
          ['unit','project'],
          this.rows,
          0,
          pageNumber,
          0
        ).subscribe((res:any) => {
        this.fireExtinguishers = res.data;
        this.totalRecords = res.total;
        this.loading = false;
        console.log('fire-extinguisher',res)
        console.log('total..',this.totalRecords)
      })
    } else {
      this.fireExtinguishers = []
      this.loading = false;
    }

  }


  edit(id: number) {
    this.router.navigate(['../fire-extinguisher-edit'],  {queryParams: { id: id }, relativeTo:this.activatedRoute});
  }

  view(id: number) {
    this.router.navigate(['../fire-extinguisher-view'], {queryParams: { id: id }, relativeTo:this.activatedRoute});
  }

  new() {
    this.router.navigate(['../fire-extinguisher-add'],  {relativeTo:this.activatedRoute});
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
    this.serviceProxy.deleteOneBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(id)
    .subscribe(res => {
      this.onSearch();
    },error => {
      
    })
    // this.router.navigate(['/emission/electricity-list']);
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Fire_extinguisher)

  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Fire_extinguisher)
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Fire_extinguisher);
  }


  getTypeName(code: string){
    let type = this.masterDataService.fireExtinguisherTypes.find(o => o.code === code)
    return type?.name
  }


  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Fire_extinguisher,this);
  }

  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Fire_extinguisher, this);
  }

}
