import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { EmissionSource, Project, Report, ServiceProxy, Uncertainty, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-uncertainty',
  templateUrl: './uncertainty.component.html',
  styleUrls: ['./uncertainty.component.css']
})
export class UncertaintyComponent implements OnInit {

  @Input() selectedUnit: Unit;
  @Input() selectedProject: Project;
  @Input() parentId: number;
  @Input() reportData: Report;

  public roles = Roles
public userActions = UserActions

  emissionSources: EmissionSource[];
  uncertainties: Uncertainty[] = [new Uncertainty()];

  
  constructor(
    private serviceProxy :ServiceProxy,
    private messageService: MessageService,
    public appService: AppService
  ) { }

  async ngOnInit() {
    await this.getEmissionSources();
    await this.getUncertainties();
  }


  async getEmissionSources(){
    let filters = [ "status||$ne||"+RecordStatus.Deleted];
    if(this.selectedProject && this.selectedUnit){
      filters.push("project.id||$eq||"+this.selectedProject.id);
      filters.push("unit.id||$eq||"+this.selectedUnit.id);

      let pu = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined, undefined, filters, undefined, undefined, undefined, 1000, 0, 1, 0).toPromise()

      if (pu) {
        let filter = [ "status||$ne||"+RecordStatus.Deleted, "projectUnit.id||$eq||"+pu.data[0].id]
        let pues = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        this.emissionSources = pues.data.map((p: any)=> p.emissionSource);
      }
      
    }
  }

  add(){
    this.uncertainties = [new Uncertainty(), ...this.uncertainties];
  }

  async getUncertainties(){
    try{
      let res = await this.serviceProxy.getManyBaseUncertaintyControllerUncertainty(
        undefined,
        undefined,
        ['report.id||$eq||' +this.reportData.id],
        undefined,
        undefined,
        ['report','emissionSource'],
        1000,
        0,
        0,
        0
      ).toPromise();
      this.uncertainties = res.data;
    }catch(err){
      this.uncertainties = [];
    }
  }

}
