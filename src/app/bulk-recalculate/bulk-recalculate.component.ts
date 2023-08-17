import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Unit, Project, ServiceProxy, EmissionSource, EmissionBaseControllerServiceProxy, BulckCalculatio, EsList2, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-bulk-recalculate',
  templateUrl: './bulk-recalculate.component.html',
  styleUrls: ['./bulk-recalculate.component.css']
})
export class BulkRecalculateComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  selectedUnit: Unit;
  selectedProject: Project;
  isWithChildUnits: boolean = false;
  selectedEmissionSource: EmissionSource[] = [];


  emissionSources: EmissionSource[] = []

  constructor(
    protected messageService: MessageService,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.getEmissionSources();
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
  }


  onChangeProject(e:Project){
    this.selectedProject = e;
  }

  getEmissionSources(){
    this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe(res=>{
      this.emissionSources = res.data;
    })

  }

  async recalculate(){
    if(this.selectedProject && this.selectedProject.id &&
      this.selectedUnit && this.selectedUnit.id &&
      this.selectedEmissionSource.length > 0
    ){
      let req = new BulckCalculatio();
      req.esList = this.selectedEmissionSource.map(e => e.code as unknown as EsList2);
      req.projectId = this.selectedProject.id;
      req.unitIds = [this.selectedUnit.id];
      if(this.isWithChildUnits){
        let uIds = await this.unitControllerServiceProxy.getChildUnitIds(this.selectedUnit.id).toPromise();
        req.unitIds = [...req.unitIds, ...uIds]
      }
      this.emissionBaseControllerServiceProxy.bulkRecalculate(req).subscribe(res => {
        var wb = XLSX.utils.book_new();
        let keys = Object.keys(res)
        keys.forEach(key => {
          const wsIn: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res[key], {skipHeader: false});
          XLSX.utils.book_append_sheet(wb, wsIn, key);
        })
        let data = new Date();
        XLSX.writeFile(wb, this.selectedProject.name +"-recalculate-response-"+data.toDateString()+".xlsx");
      }, err => {
        console.log(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Failed to recalculate" });
      })
    }else{
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Missing fields` });
      console.log(this.selectedUnit);
      console.log(this.selectedProject);
      console.log(this.selectedEmissionSource);
      console.log(this.isWithChildUnits);
    }

  }


}
