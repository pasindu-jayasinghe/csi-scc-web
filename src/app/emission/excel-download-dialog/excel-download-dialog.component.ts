import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { ActivityDataDownloadDto, EmissionBaseControllerServiceProxy, Project, Unit } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx'; 


@Component({
  selector: 'app-excel-download-dialog',
  templateUrl: './excel-download-dialog.component.html',
  styleUrls: ['./excel-download-dialog.component.css']
})
export class ExcelDownloadDialogComponent implements OnInit  {

  selectedUnit: Unit
  selectedProject: Project

  isAnyAdmin: boolean = false
  sourceName: any;
  
  constructor(
    private appService: AppService,
    public config: DynamicDialogConfig,
    public emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy,
    public ref: DynamicDialogRef, 
  ) {
    
  }

  async ngOnInit(): Promise<void> {
    this.isAnyAdmin = this.appService.isAnyAdmin()
    if (this.config.data) {
      if (this.config.data.sourceName) {
        this.sourceName = this.config.data.sourceName;
      }
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
  }


  onChangeProject(e:Project){
    this.selectedProject = e;
  }

  async download(){
    console.log("download")
    let req = new ActivityDataDownloadDto()
    req.esCode = this.sourceName
    req.projectId = this.selectedProject.id
    if (this.selectedUnit){
      req.optional = {unitIds: [this.selectedUnit.id]}
    }

    let res = await this.emissionBaseControllerServiceProxy.downloadActivityData(req).toPromise()
    console.log(res)

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res)
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    XLSX.writeFile(wb, this.sourceName + '_data.xlsx');
    res = []
    this.ref.close()
  }

}
