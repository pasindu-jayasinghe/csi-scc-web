import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { delay } from 'rxjs/operators';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ByUnitIdsDto, EmissionSource, Project, ProjectUnit, ProjectUnitControllerServiceProxy, ProjectUnitEmissionSource, ServiceProxy, Unit, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-project-unit-es',
  templateUrl: './project-unit-es.component.html',
  styleUrls: ['./project-unit-es.component.css']
})
export class ProjectUnitEsComponent implements OnInit {
  @Input() isView: boolean = false;
  @Input() isNewEntry: boolean = true;
  @Input() editEntryId: number;
  @Input() project: Project;

  loading: boolean = false;

  public roles = Roles
public userActions = UserActions


  childUnit: boolean = false;
  thisUnit: boolean =true;

  esAddedToThis: boolean = false;

  unit:Unit;
  currentProjectUnit: ProjectUnit;
  assigningProjectUnits: ProjectUnit[] = []

  currentProjectUnitId: number;
  assigningProjectUnitIds: number[] = []
  
  emissionSources: EmissionSource[] = [];
  assignedEmissionSources: EmissionSource[] = [];
  puesList: ProjectUnitEmissionSource[] = []

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private serviceProxy: ServiceProxy, 
    private unitControllerServiceProxy: UnitControllerServiceProxy, 
    private projectUnitControllerServiceProxy: ProjectUnitControllerServiceProxy,
    public appService: AppService
  ) { }

  async ngOnInit() {
    this.listenToLoading();
    if(this.config.data){
      this.unit = this.config.data.unit;
      this.currentProjectUnit = this.config.data.projectUnit;
      this.currentProjectUnitId = this.currentProjectUnit?.id;
      this.isView = this.config.data.isView;
      this.isNewEntry = this.config.data.isNewEntry;
      this.editEntryId = this.config.data.editEntryId;
      this.project = this.config.data.project;
    }

    if(this.currentProjectUnit){
      this.assigningProjectUnits.push(this.currentProjectUnit);
      this.assigningProjectUnitIds.push(this.currentProjectUnitId);
      await this.getPUES();
    }
    await this.getProjectES();
  }


  async getProjectES(){
    const res = await this.serviceProxy.getManyBaseProjectEmissionSourceControllerProjectEmissionSource(
      undefined,
      undefined,
      [ "project.id||$eq||" + this.editEntryId , "status||$ne||"+RecordStatus.Deleted],      
      undefined,
      undefined,
      ['project'],
      100,
      0,
      0,
      0
    ).toPromise()
    this.emissionSources = res.data.map(pes => pes.emissionSource);
  }

  async getPUES(){
    try{
      const res = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
        undefined,
        undefined,
        [ "projectUnit.id||$eq||" + this.currentProjectUnit.id , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        ['emissionSource','projectUnit','assignedESList','assignedESList.user'],
        100,
        0,
        0,
        0
      ).toPromise();

      this.puesList = res.data;
      this.assignedEmissionSources = this.puesList.map(pu => pu.emissionSource);      
    }catch(err){
     this.puesList = [] 
    }
  }

  async onAssigneFirstESToUnit(e: any){
    this.esAddedToThis = true;
    if(this.thisUnit){
      let pu = await this.addProjectUnit(this.unit);
      this.assigningProjectUnits.push(pu);    
      this.assigningProjectUnitIds.push(pu.id);
    }
    
    if(this.childUnit){
      let childUnits = await this.getChildUnits(this.unit.id);
      await Promise.all(childUnits.map(async cu=> {
        let puc = await this.addProjectUnit(cu);
        this.assigningProjectUnits.push(puc);
        this.assigningProjectUnitIds.push(puc.id);
      }))
    }

    this.reLoadList()
  }

  reLoadList(){
    let temp = this.emissionSources
    this.emissionSources = [];
    this.emissionSources = [...temp]
  }

  async reassign(){
    await Promise.all(this.assigningProjectUnits.map(async pu => {
      pu.status = RecordStatus.Deleted;
      await this.serviceProxy.updateOneBaseProjectUnitControllerProjectUnit(pu.id, pu).toPromise();
    }));
    this.ref.close();
  }


  async addProjectUnit(unit: Unit){
    let pu = new ProjectUnit();
    pu.unit = unit;
    pu.project = this.project;
    let savedPu = await this.serviceProxy.createOneBaseProjectUnitControllerProjectUnit(pu).toPromise();
    return savedPu;
  }

  async getChildUnits(unitId: number){
    return await this.unitControllerServiceProxy.getChildUnits(unitId).toPromise();
  }

  async getChildUnitIds(unitId: number){
    return await this.unitControllerServiceProxy.getChildUnitIds(unitId).toPromise();
  }

  async onChangeChildCheck(){  
    if(this.childUnit){
      let childUnitIds = await this.getChildUnitIds(this.unit.id);


      let req = new ByUnitIdsDto();
      req.projectId = this.project.id;
      req.unitIds = childUnitIds;
      let res = await this.projectUnitControllerServiceProxy.getProjectUnitsByUntIdsAndProject(req).toPromise();
      

      this.assigningProjectUnits = this.assigningProjectUnits.filter(u => !res.includes(u))
      this.assigningProjectUnits = [...this.assigningProjectUnits, ...res];
      this.assigningProjectUnitIds = this.assigningProjectUnits.map(pu => pu.id);  //  TODO: remove
    }else{
      this.assigningProjectUnits = [this.currentProjectUnit];
      this.assigningProjectUnitIds = [this.currentProjectUnitId]; //  TODO: remove
    }
  }

  listenToLoading(): void {
    this.appService.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
