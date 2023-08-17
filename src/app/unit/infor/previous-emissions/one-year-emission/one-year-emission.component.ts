import { Component, Input, OnInit } from '@angular/core';
import { RecordStatus } from 'shared/AppService';
import { EmissionSource, PrevEmission, ProjectType, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-one-year-emission',
  templateUrl: './one-year-emission.component.html',
  styleUrls: ['./one-year-emission.component.css']
})
export class OneYearEmissionComponent implements OnInit {

  @Input() year: number;
  @Input() esList: EmissionSource[] = [];
  @Input() public projectType: ProjectType;
  @Input() selectedUnit: Unit;


  prevEmissionList: PrevEmission[] = [new PrevEmission()];


  constructor(private serviceProxy: ServiceProxy) { }

  async ngOnInit() {
    await this.getPrevioueEmissions();
  }

  add(){
    this.prevEmissionList = [new PrevEmission(), ...this.prevEmissionList];
  }

  async getPrevioueEmissions(){
    let filters = [ "status||$ne||"+RecordStatus.Deleted];

    if(this.selectedUnit && this.projectType && this.year){
      filters.push("unit.id||eq||"+this.selectedUnit.id);
      filters.push("projectType.id||eq||"+this.projectType.id);
      filters.push("year||eq||"+this.year);

      let res = await this.serviceProxy.getManyBasePrevEmissionControllerPrevEmission(
        undefined, 
        undefined, 
        filters, 
        undefined, 
        undefined, 
        ["unit","projectType",'emissionSource'], 
        1000, 
        0, 
        1, 
        0      
      ).toPromise();

      this.prevEmissionList = res.data;
    }
    
  }

}
