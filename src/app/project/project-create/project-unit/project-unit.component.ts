import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService, RecordStatus, SavedData } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Project, ProjectControllerServiceProxy, ProjectUnit, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';
import { ProjectUnitEsComponent } from '../project-unit-es/project-unit-es.component';

@Component({
  selector: 'app-project-unit',
  templateUrl: './project-unit.component.html',
  styleUrls: ['./project-unit.component.css']
})
export class ProjectUnitComponent implements OnInit, OnChanges {
  @Input() isView: boolean = false;
  @Input() isNewEntry: boolean = true;
  @Input() editEntryId: number;
  @Input() project: Project;
  @Input() parentUnit: Unit;

  public roles = Roles
public userActions = UserActions

  units: Unit[] = [];
  asignedUnits: number[]=  []
  projectUnits: ProjectUnit[] = []

  parentUnits: Unit[] = [];

  nodes: any = [];
  constructor(
    private serviceProxy: ServiceProxy, 
    public dialogService: DialogService,
    public projectControllerServiceProxy: ProjectControllerServiceProxy,
    public appService: AppService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if(propName === 'parentUnit'){
        this.reArrageChart();
      }
    }
  }

  async ngOnInit() {
    this.getUnits();
    await this.setInitialValues();
  }

  async setInitialValues(){
    if(this.editEntryId){
      await this.getProject(this.editEntryId);
      await this.getProjectUnits(this.project.projectUnits.map(pu => pu.id));
    }
  }


  openUnitModel(e: any){
    const ref = this.dialogService.open(ProjectUnitEsComponent, {
      header: 'Select Emission Sources for Unit',
      width: '70%',
      data: {
        isView: this.isView,
        isNewEntry: this.isNewEntry,
        editEntryId: this.editEntryId,
        unit: this.units.find(u=>u.id=== e.id),
        projectUnit: this.projectUnits.find(pu => pu.unit.id === e.id),
        project: this.project
      },
    });

    ref.onClose.subscribe(r => {
      this.setInitialValues()
    })
  }

  // start - creating chart ----------------------------------------
  onChangeUnit(){
    this.insertNode(this.parentUnit);
    let data = this.mapObject([this.parentUnit])
    this.nodes = data;  

    // this.project.ownerUnit = this.parentUnit;
    this.setOwnerUnit();
  }
  
  insertNode(parentUnit: Unit){
    let subUnits = this.units.filter(u => u.parentUnit.id === parentUnit.id);
    parentUnit.childUnits = subUnits;
    parentUnit.childUnits.forEach(pu=>this.insertNode(pu));
  }

  mapObject(units: any[]): any {
    if(!units || units.length < 0) return [];
  
    return units.map((unit: any) => { 
      return {
        id: unit.id,
        cssClass: this.asignedUnits.includes(unit.id) ? 'asigned-unit': '',
        image: '',
        title: unit.name,
        name: unit.name,
        childs: this.mapObject(unit.childUnits)
      }
    });
  }
  // end - creating chart ----------------------------------------


  async getUnits(){
    let list: Unit[] = [];
    let data = localStorage.getItem(SavedData.units);
    if(data){
      let us = JSON.parse(data) as any[];
      let u: Unit[] = [];
      us.forEach(uu => {
        let nu = new Unit();
        nu.init(uu)
        u.push(nu);
      })
      list = u;
    }else{
      let res = await this.serviceProxy.getManyBaseUnitControllerUnit(
        undefined,
        undefined,
        [ "status||$ne||"+RecordStatus.Deleted, "parentUnit.id||$isnull"],
        undefined,
        undefined,
        ['country','industry'],
        3000,
        0,
        0,
        0
      ).toPromise();
      list = res.data;
      localStorage.setItem(SavedData.units, JSON.stringify(list));
    }

    this.units = list;
    let units = this.units.filter(u => u.parentUnit.id === undefined);
    this.parentUnits = units;
    if(!localStorage.getItem(SavedData.parentUnits)){
      localStorage.setItem(SavedData.parentUnits, JSON.stringify(this.parentUnits));
    }
    if(this.project.ownerUnit.id){
      let u = this.parentUnits.find(u => u.id === this.project.ownerUnit.id) 
      if(u){
        this.parentUnit = u;
        this.onChangeUnit();
      }
    }
  }

  reArrageChart(){
    this.getUnits();
  }

  async getProjectUnits(ids: number[]){    
    try{
      if(ids.length > 0){
        const res =  await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
          undefined,
          undefined,
          [ "id||$in||" + ids.join(",") , "status||$ne||"+RecordStatus.Deleted],      
          undefined,
          undefined,
          undefined,
          ids.length*2,
          0,
          0,
          0
        ).toPromise();
    
        this.projectUnits = res.data;
        this.asignedUnits = res.data.map(pu => pu.unit.id);    
        this.reArrageChart()
      }      
    }catch(err){
      this.projectUnits = [];
      this.asignedUnits = [];    
      this.reArrageChart()
    }
  }

  async getProject(id: number){
    this.project = await this.serviceProxy.getOneBaseProjectControllerProject(id, undefined, undefined, 0).toPromise();
  }

  async setOwnerUnit(){
    if(!this.project.ownerUnit.id){
      this.project.ownerUnit = this.parentUnit;
      await this.projectControllerServiceProxy.setOwnerUnit(this.editEntryId, this.parentUnit.id).toPromise();
    }
  }

}
