import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { WasteWaterTreatmentActivityData, ServiceProxy, Project, Unit, PuesDataReqDtoSourceName } from "../../../../shared/service-proxies/service-proxies";
import {Router, ActivatedRoute} from "@angular/router";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import { AppService, RecordStatus } from 'shared/AppService';
import { EmissionListBaseComponent } from 'app/emission/emission-list-base/emission-list-base.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-waste-water-treatment-list',
  templateUrl: './waste-water-treatment-list.component.html',
  styleUrls: ['./waste-water-treatment-list.component.css']
})
export class WasteWaterTreatmentListComponent extends EmissionListBaseComponent implements OnInit {

  loading: boolean;
  rows: number = 10;

  totalRecords: number;
  wasteWaterData: WasteWaterTreatmentActivityData[];
  esCode: PuesDataReqDtoSourceName = PuesDataReqDtoSourceName.Waste_water_treatment

  searchBy: any = {
    text: null,
    usertype: null,
  };

  constructor(
    protected messageService: MessageService,
    protected serviceProxy: ServiceProxy, private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute:ActivatedRoute,
    private confirmationService: ConfirmationService,
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
        .getManyBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(
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
          //this.wasteWaterData = res.data;
          let emission = res.data;
          emission = JSON.stringify(emission);
          emission = this.cleanString(emission);
          this.wasteWaterData = JSON.parse(emission);

          this.wasteWaterData = this.wasteWaterData.map(d => {
            let lagoon = this.masterDataService.anaerobicDeepLagoons.find(o => o.code === d.anaerobicDeepLagoon)
            if (lagoon){
              d.anaerobicDeepLagoon = lagoon.name
            } else {d.anaerobicDeepLagoon = ''}
            return d
          })

          this.totalRecords = res.total;
          this.loading = false;
          console.log('wasteWaterData--',this.wasteWaterData)
          console.log('total..',this.totalRecords)
      })
    }else {
      this.wasteWaterData = []
      this.loading = false;
    }
  
  }

  cleanString(str:string) {

    str = str.replace(/}",/gi, '},');
    str = str.replace(/:"{/gi , ':{');
    str = str.replace(/[\/\\]/g, '');
   return str;
 }



  edit(id: number) {
    this.router.navigate(['../waste-Water-treatment-edit', id], {queryParams: { id: id }, relativeTo:this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../waste-water-treatment-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });
  }

  new() {
    this.router.navigate(['../waste-water-treatment-add'], {relativeTo:this.activatedRoute});
  }

  onTypeChange(event: any){
    console.log('loading.....')
    this.onSearch()
    console.log('resualt.....',event)
  }

  onDeleteClick(id: number) {
   
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
    this.serviceProxy.deleteOneBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(id)
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
   super.changeAccess(PuesDataReqDtoSourceName.Waste_water_treatment)
  }



  onChangeProject(e:Project){
    this.selectedProject = e;
    this.load({});
   super.changeAccess(PuesDataReqDtoSourceName.Waste_water_treatment)
  }



  uploadExcell() {
    super.uploadExcell(PuesDataReqDtoSourceName.Waste_water_treatment,this);
  }
  
  downloadExcel(){
    super.downloadExcel(PuesDataReqDtoSourceName.Waste_water_treatment, this);
  }


  watchVideo(){
    super.watchVideo(PuesDataReqDtoSourceName.Waste_water_treatment);
  }
  

}
