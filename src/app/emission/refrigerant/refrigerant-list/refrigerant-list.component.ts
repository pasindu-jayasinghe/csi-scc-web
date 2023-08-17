import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {  Project, PuesDataReqDtoSourceName, RefrigerantActivityData, ServiceProxy, Unit} from "../../../../shared/service-proxies/service-proxies";
import {Router, ActivatedRoute} from "@angular/router";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import { AppService, RecordStatus } from 'shared/AppService';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-refrigerant-list',
  templateUrl: './refrigerant-list.component.html',
  styleUrls: ['./refrigerant-list.component.css']
})
export class RefrigerantListComponent extends EmissionListBaseComponent implements OnInit {

  rows: number = 10;
  loading: boolean;
  refrigerantData: RefrigerantActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Refrigerant
  // customers: User[];

  totalRecords: number;

  searchText: string = '';
  searchEmailText: string;
  searchLastText: string;


  searchBy: any = {
    text: null,
    usertype: null,
  };


  constructor(
    protected serviceProxy: ServiceProxy, private router: Router,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private activatedRoute:ActivatedRoute,
    protected messageService: MessageService,
    protected appService: AppService,
    private masterDataService: MasterDataService,protected dialogService: DialogService

  ) {
    super(appService, serviceProxy,dialogService,messageService);
    super.setChildReference(this);
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
      this.serviceProxy
        .getManyBaseRefrigerantActivityDataControllerRefrigerantActivityData(
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
          this.refrigerantData = res.data;
          this.totalRecords = res.total;
          this.loading = false;
          console.log('refrigerantData--',this.refrigerantData)
          console.log('total..',this.totalRecords)
      })
    }   else {
      this.refrigerantData = []
      this.loading = false;
    }  
  }


  edit(id: number) {
    this.router.navigate(['../refrigerant-edit', id], {queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  view(id: number) {
    this.router.navigate(['../refrigerant-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  new() {
    this.router.navigate(['../refrigerant-add'], {relativeTo:this.activatedRoute});
  }

  onTypeChange(event: any){
    console.log('loading.....')
    this.onSearch()
    console.log('resualt.....',event)
  }

  onDeleteClick(id: number) {
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

  delete(id: number) {
    this.serviceProxy.deleteOneBaseRefrigerantActivityDataControllerRefrigerantActivityData(id)
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
    super.changeAccess(PuesDataReqDtoSourceName.Refrigerant)
  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
    super.changeAccess(PuesDataReqDtoSourceName.Refrigerant)
  }



  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Refrigerant,this);
  }
  
  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Refrigerant, this);
  }

  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Refrigerant);
  }

}
 