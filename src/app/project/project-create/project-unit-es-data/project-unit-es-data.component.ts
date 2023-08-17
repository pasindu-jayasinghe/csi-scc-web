import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService, ProjectTypes, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { EmissionSourceOfProjectUnitScope, ListOfEmissionSourceOfProjectUnit, ProjectUnitEmissionSourceScope } from 'shared/service-proxies/service-proxies';
import { EmissionSource, EmissionSourceOfProjectUnit, EmissionSourceOfProjectUnitClasification, EmissionSourceOfProjectUnitTier, ProjectControllerServiceProxy, ProjectUnit, ProjectUnitEmissionSource, ProjectUnitEmissionSourceClasification, ProjectUnitEmissionSourceTier, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-project-unit-es-data',
  templateUrl: './project-unit-es-data.component.html',
  styleUrls: ['./project-unit-es-data.component.css']
})
export class ProjectUnitEsDataComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() isView: boolean = false;
  @Input() isNewEntry: boolean = true;
  @Input() editEntryId: number;
  @Input() es: EmissionSource;
  @Input() assignedEmissionSources: EmissionSource[];
  @Input() projectUnits: ProjectUnit[];
  @Input() assigningProjectUnitIds: number[];

  @Output() onAssigneFirstESToUnit = new EventEmitter<any>();

  public roles = Roles
public userActions = UserActions

  pues: ProjectUnitEmissionSource = new ProjectUnitEmissionSource();

  public clasifications: ProjectUnitEmissionSourceClasification[] = [ProjectUnitEmissionSourceClasification.Direct, ProjectUnitEmissionSourceClasification.Indirect,ProjectUnitEmissionSourceClasification.Any, ProjectUnitEmissionSourceClasification.Other];
  public tiers: ProjectUnitEmissionSourceTier[] = [ProjectUnitEmissionSourceTier.ONE, ProjectUnitEmissionSourceTier.TWO, ProjectUnitEmissionSourceTier.THREE];
  public scopes: ProjectUnitEmissionSourceScope[] = [ProjectUnitEmissionSourceScope.ONE, ProjectUnitEmissionSourceScope.TWO,ProjectUnitEmissionSourceScope.THREE]

  public clasification: ProjectUnitEmissionSourceClasification;
  public tier: ProjectUnitEmissionSourceTier;
  mobile: boolean[]= [];
  stationary: boolean[]= [];

  assigned: boolean[] = [];
  projectType: ProjectTypes;


  constructor(
    private projectServiceProxy: ProjectControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    public appService: AppService
  ) { }

  async ngOnInit() {
    this.appService.projectType.subscribe(p => this.projectType = p);
    const assigned = this.assignedEmissionSources.find(e => e.id === this.es.id);
    if(assigned){
      this.assigned= [true];
      if(this.projectUnits.length !== 0){ // TODO: assigningProjectUnitIds
        await this.getPuesByEsAndPU();
      }
    }

  }

  getName(es: EmissionSource){
    if(this.projectType === ProjectTypes.GHG){
      return es.name
    }else{
      return es.sbtName
    }
  }

  async getPuesByEsAndPU(){
    const res = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
      undefined,
      undefined,
      [ "emissionSource.id||$eq||" + this.es.id , "projectUnit.id||$eq||" + this.projectUnits[0].id , "status||$ne||"+RecordStatus.Deleted],      // assigningProjectUnitIds
      undefined,
      undefined,
      ['emissionSource','projectUnit'],
      1,
      0,
      0,
      0
    ).toPromise();
    this.pues = res.data[0];
    console.log(this.pues);
    this.mobile = this.pues.mobile ? [true]: [];
    this.stationary = this.pues.stationery ? [true]: [];
  }

  async onChangeEs(e: {checked: boolean[]}){
    if(e.checked.length > 0 && this.projectUnits.length == 0){ // TODO: assigningProjectUnitIds
      this.onAssigneFirstESToUnit.emit({});
    }

    if(e.checked.length === 0){
      await this.removePUES();
    }else{
      await this.addPUES();
    }
  }

  async change(){    
    this.pues.mobile = this.mobile.length != 0;
    this.pues.stationery = this.stationary.length != 0;
    await this.addPUES();
  }

  async removePUES(){
    await Promise.all(this.projectUnits.map(async pu => { // TODO: assigningProjectUnitIds
      let body = new EmissionSourceOfProjectUnit();
      body.projetUnitId = pu.id;
      body.emissionSourceId = this.es.id;
      await this.projectServiceProxy.removeEmissionSourceOfProjectUnit(body).toPromise();
      return "";
    }))
  }

  async addPUES(){
    if(this.isValidPUES()){

      let listObj = new ListOfEmissionSourceOfProjectUnit();
    
      await Promise.all(this.projectUnits.map(async pu => { // TODO:  assigningProjectUnitIds
        let body = new EmissionSourceOfProjectUnit();
        body.projetUnitId = pu.id;
        body.emissionSourceId = this.es.id;
  
        if(this.pues.clasification){
          body.clasification = this.getEmissionSourceOfProjectUnitClasification(this.pues.clasification.toString());
        }
        if(this.pues.tier){
          body.tier = this.egtEmissionSourceOfProjectUnitTier(this.pues.tier.toString());
        }  
        
        body.mobile = this.pues.mobile;
        body.stationery = this.pues.stationery;
        body.scope=this.pues.scope as unknown as EmissionSourceOfProjectUnitScope;

        listObj.list.push(body);
        
        // await this.projectServiceProxy.addEmissionSourceOfProjectUnit(body).toPromise();
        return "";
      }))
      await this.projectServiceProxy.addEmissionSourceOfProjectUnitMultiple(listObj).toPromise();
    }    
  }


  private egtEmissionSourceOfProjectUnitTier(value: string): EmissionSourceOfProjectUnitTier{
    switch(value){
      case 'ONE':
          return EmissionSourceOfProjectUnitTier.ONE;
      case 'TWO':
          return EmissionSourceOfProjectUnitTier.TWO;
      case 'THREE':
          return EmissionSourceOfProjectUnitTier.THREE;
    }

    return EmissionSourceOfProjectUnitTier.ONE;
  }

  private getEmissionSourceOfProjectUnitClasification(value: string): EmissionSourceOfProjectUnitClasification{
    switch(value){
      case 'Direct':
          return EmissionSourceOfProjectUnitClasification.Direct;
      case 'Indirect':
          return EmissionSourceOfProjectUnitClasification.Indirect;
      case 'Other':
          return EmissionSourceOfProjectUnitClasification.Other;
      case 'Any':
        return EmissionSourceOfProjectUnitClasification.Any;
    }

    return EmissionSourceOfProjectUnitClasification.Direct;
  }

  isValidPUES(){
    let v = this.pues.clasification && this.pues.tier && !(this.mobile.length == 0 && this.stationary.length == 0);
    return v;
  }


}
