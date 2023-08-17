import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionSource, EmissionSourceListOfProject, Methodology, NewPUES, NewPUESClasification, NewPUESTier, Project, ProjectControllerServiceProxy, ProjectEmissionSource, ProjectType, ProjectUnit, ProjectUnitEmissionSource, ProjectUnitEmissionSourceClasification, ProjectUnitEmissionSourceTier, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { MessageService } from "primeng/api";
import { AppService, RecordStatus } from 'shared/AppService';
import { SelectPuesDataComponent } from './select-pues-data/select-pues-data.component';
import * as moment from 'moment';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';

class EditProject{
  previousEs: number[];
  editedES: number[]; // keep ES id after edited

  previousPU: number[]; // keep unit id (not project unit id)
  editedPU: number[];  // keep unit id (not project unit id)   after edited
  projectUnits: {
    previousEs: number[];
    editedES: number[];
    unitId: number,
    projectUnitId: number
  }[]
}

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  creator: User;
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  editingData: EditProject;

  project: Project = new Project();
  year: number;

  selectedProjectEmissionSource: EmissionSource[] = [];
  
  methodologies: Methodology[] = []
  emissionSources: EmissionSource[] = []
  projectTypes: ProjectType[] = []
  units: Unit[] = [];


  header: string = "";
  unitClicked: boolean = false;
  asignedUnits: number[]=  []


  parentUnit: Unit;
  clickedUnit: Unit;
  clickedPU: ProjectUnit;
  assignedEmissionSources: EmissionSource[] = [];
  assignedProjectUnits: ProjectUnit[] = [];
  isForChild: boolean=false;
  projectUnits: ProjectUnit[] = []

  @ViewChild(SelectPuesDataComponent) selectPuesDataComponent:SelectPuesDataComponent;

  constructor(
    private projectServiceProxy: ProjectControllerServiceProxy,
    protected messageService: MessageService,
    private serviceProxy: ServiceProxy, 
    private route: ActivatedRoute,
    private router: Router,
    public appService: AppService
    ) { }


  fyFormat(date: moment.Moment):string{
    return date.format('M/d/yy')
  }

  private getNewPUESTierByValue(value: string): NewPUESTier{
    switch(value){
      case 'ONE':
          return NewPUESTier.ONE;
      case 'TWO':
          return NewPUESTier.TWO;
      case 'THREE':
          return NewPUESTier.THREE;
    }

    return NewPUESTier.ONE;
  }

  private getNewPUESClasificationByValue(value: string): NewPUESClasification{
    switch(value){
      case 'Direct':
          return NewPUESClasification.Direct;
      case 'Indirect':
          return NewPUESClasification.Indirect;
      case 'Other':
          return NewPUESClasification.Other;
    }

    return NewPUESClasification.Direct;
  }

  ngOnInit(): void {
    this.editingData = new EditProject();

    this.route.url.subscribe(r => {
      if(r[0].path === "view"){
        this.isView =true;
      }
    });

    this.route.queryParams.subscribe((params) => {
      if(params['id']){
        this.isNewEntry = false;
        this.editEntryId = params['id'];
        this.getProject(this.editEntryId);
      }else{
        this.setCreator();
      }
    });


    this.geyMethodologies();
    this.getProjectTypes();
    this.getEmissionSources();
    this.getUnits()
  }

  async setCreator(){
    let u = await this.appService.getUser();
    if(u){
      this.creator = u;
      this.project.enteredBy = this.creator;
    }
  }

  async save(){

    this.project.year = new Date(this.year).getFullYear().toString();    
    if(this.isNewEntry){ // add ============================================================================================================================================================
      this.project.projectEmissionSources = this.selectedProjectEmissionSource.map(es => {
        const pe = new ProjectEmissionSource();
        pe.emissionSource = es;      
        return pe;
      })
      
      this.serviceProxy.createOneBaseProjectControllerProject(this.project).subscribe(res =>{        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Saved successfully',
          closable: true,
        });       
        this.onBackClick();
      }, error => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save',
          closable: true,
        });
      })
    }else{ // edit ============================================================================================================================================================
      try{

        if(!this.project?.verifier.id){
          //@ts-ignore
          this.project.verifier = null;
        }

        // basic data ------------------------------------------------------------------------------------------------------------------------------
        

        let cloneProject = Object.assign({}, this.project);
        //@ts-ignore
        // cloneProject.projectUnits = null;
        const basicDataRes = await this.serviceProxy.updateOneBaseProjectControllerProject(this.editEntryId, cloneProject).toPromise();
        // -----------------------------------------------------------------------------------------------------------------------------------------

        // project ES ------------------------------------------------------------------------------------------------------------------------------
        const removesES: number[] = this.editingData.previousEs.filter(id => !this.editingData.editedES.includes(id))
        const addedES: number[] = this.editingData.editedES.filter(id => !this.editingData.previousEs.includes(id))

        const emissionSourceListOfProject = new EmissionSourceListOfProject();
        emissionSourceListOfProject.projetId = this.project.id;
        if(addedES.length > 0){
          emissionSourceListOfProject.emissionSourceIdList = addedES;
          const addedESRes =  await this.projectServiceProxy.addEmissionSourceOfProjectMultiple(emissionSourceListOfProject).toPromise();
        }
        if(removesES.length > 0){
          emissionSourceListOfProject.emissionSourceIdList = removesES;
          const removesESRes =  await this.projectServiceProxy.removeEmissionSourceOfProjectMultiple(emissionSourceListOfProject).toPromise();
        }
        // -----------------------------------------------------------------------------------------------------------------------------------------


        // Units -----------------------------------------------------------------------------------------------------------------------------------
        const removesU: number[] = this.editingData.previousPU.filter(id => !this.editingData.editedPU.includes(id))
        const addedU: number[] = this.editingData.editedPU.filter(id => !this.editingData.previousPU.includes(id))


        await Promise.all(removesU.map(async ruId => await this.removeProjectUnit(ruId)));

        let addedPuList = addedU.map(addedUid => {
          const pu = this.project.projectUnits.find(pu => pu.unit.id === addedUid);
          if(pu){
            const p = new Project();
            p.id = this.project.id;
            pu.project = p;
            return pu;
          }
          else {return null;}
        });
        const withNoNull = addedPuList.filter(u => u !== null) as ProjectUnit[];
        if(withNoNull.length > 0){
          await this.addProjectUnits(withNoNull);
        }
        // -----------------------------------------------------------------------------------------------------------------------------------------


        // Unit ES ---------------------------------------------------------------------------------------------------------------------------------

        console.log(this.editingData)
        // await Promise.all(this.editingData.projectUnits.map( async puEdit => {          
        //   const removesPUES: number[] = puEdit.previousEs.filter(id => !puEdit.editedES.includes(id));
        //   const addedPUES: number[] = puEdit.editedES.filter(id => !puEdit.previousEs.includes(id));

        //   const emissionSourceListOfProjectUnit = new EmissionSourceListOfProjectUnit();
        //   emissionSourceListOfProjectUnit.projetUnitId = puEdit.projectUnitId;

        //   if(addedPUES.length > 0){
        //     emissionSourceListOfProjectUnit.emissionSourceIds = addedPUES;

        //     let assignedProjectUnit = this.assignedProjectUnits.find(pu => pu.unit.id === puEdit.unitId);            
        //     if(assignedProjectUnit){
        //       emissionSourceListOfProjectUnit.emissionSourceList = assignedProjectUnit.projectUnitEmissionSources.map(pues => {
        //         let newPUES = new NewPUES();
        //         newPUES.esId = pues.emissionSource.id;
        //         if(pues.tier){
        //           newPUES.tier = this.getNewPUESTierByValue(pues.tier.toString());
        //         }
        //         if(pues.clasification){
        //           newPUES.clasification = this.getNewPUESClasificationByValue(pues.clasification.toString());
        //         }
        //         return newPUES;
        //       })
        //     }

        //     const addedPUESRes =  await this.projectServiceProxy.addEmissionSourceOfProjectUnitMultiple(emissionSourceListOfProjectUnit).toPromise();
        //   }

        //   if(removesPUES.length > 0){
        //     emissionSourceListOfProjectUnit.emissionSourceIds = removesPUES;
        //     // const removedPUESRes =  await this.projectServiceProxy.removeEmissionSourceOfProjectUnitMultiple(emissionSourceListOfProjectUnit).toPromise();
        //   }
        //   return 0;
        // }))

        // -----------------------------------------------------------------------------------------------------------------------------------------

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Saved successfully',
          closable: true,
        });
        this.getProject(this.editEntryId);
      }catch(err){
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save',
          closable: true,
        });
      }      
    }// ============================================================================================================================================================
  }

  addProjectUnits = async (addedPuList: ProjectUnit[]) => {
    await Promise.all(addedPuList.map(async pu => {
      return await this.serviceProxy.createOneBaseProjectUnitControllerProjectUnit(pu).toPromise();
    } ))
  }

  async removeProjectUnit(unitId: number){
    const pu = this.projectUnits.find(pu => pu.unit.id === unitId);
    if(pu){
      pu.status = RecordStatus.Deleted;
      await this.serviceProxy.updateOneBaseProjectUnitControllerProjectUnit(pu.id, pu).toPromise();
    }
  }

  reassign(){

    this.project.projectUnits = this.project.projectUnits.filter(pu => pu.unit.id !== this.clickedUnit.id)
    this.asignedUnits = this.asignedUnits.filter(a => a !== this.clickedUnit.id);

    this.editingData.editedPU = this.editingData.editedPU?.filter( u => u !== this.clickedUnit.id);
    this.editingData.projectUnits = this.editingData.projectUnits?.filter(u => u.unitId !== this.clickedUnit.id);
    this.assignedProjectUnits = this.assignedProjectUnits?.filter(pu => pu.unit.id !== this.clickedUnit.id);
    this.reArrageChart();
    this.unitClicked=false;
    this.clearDialogData();
  }

  private assighnESToSingleProjectUnit(unit: Unit){
    let pu = this.assignedProjectUnits.find(pu => pu.unit.id === this.clickedUnit.id);
    console.log(pu, unit.id, this.clickedUnit.id)
    if(!pu){
      pu = new ProjectUnit();
    }
    pu.unit = unit;
    pu.projectUnitEmissionSources = pu.projectUnitEmissionSources.filter(pu => this.assignedEmissionSources.includes(pu.emissionSource) && pu.tier && pu.clasification);
    
    this.project.projectUnits = this.project.projectUnits.filter(pu => pu.unit.id !== unit.id)
    this.project.projectUnits.push(pu);
    this.asignedUnits.push(unit.id);
  }

  async assign(){
    console.log(this.assignedProjectUnits) // todo: 

    if(this.isForChild){
      this.clickedUnit.childUnits.map(chu => {
        if (!this.isNewEntry) {
          this.editingData.editedPU.push(chu.id);
        }
        this.assighnESToSingleProjectUnit(chu);
        return 0;
      })      
      console.log(this.project.projectUnits)
    }else{
      if(!this.isNewEntry){
        this.editingData.editedPU.push(this.clickedUnit.id);
      }
      this.assighnESToSingleProjectUnit(this.clickedUnit);
    }

    this.reArrageChart();
    this.unitClicked=false;
    this.clearDialogData();
  }

  onChangePUESData(data: {
    clasification: ProjectUnitEmissionSourceClasification,
    tier: ProjectUnitEmissionSourceTier, 
    es: EmissionSource,
    mobile: boolean, 
    stationary: boolean
  }){    
    let addedPU = this.assignedProjectUnits.find(pu => pu.unit.id === this.clickedUnit.id);
    if(!addedPU){
      addedPU = new ProjectUnit();
      addedPU.unit= this.clickedUnit;
      const pues = new ProjectUnitEmissionSource();      
      pues.tier = data.tier;
      pues.mobile = data.mobile;
      pues.stationery = data.stationary;
      pues.clasification = data.clasification;
      pues.emissionSource = data.es;
      addedPU.projectUnitEmissionSources = [pues];
      this.assignedProjectUnits.push(addedPU);
    }else{
      let modifiedES = addedPU.projectUnitEmissionSources.find(pues => pues.emissionSource.id === data.es.id);
      if(modifiedES){
        modifiedES.clasification = data.clasification;
        modifiedES.tier = data.tier;
        modifiedES.mobile = data.mobile;
        modifiedES.stationery = data.stationary;
        modifiedES.emissionSource = data.es;
        addedPU.projectUnitEmissionSources.filter(pues => pues.emissionSource.id !== data.es.id).push(modifiedES);
      }else{
        const pues = new ProjectUnitEmissionSource();      
        pues.tier = data.tier;
        pues.clasification = data.clasification;
        pues.emissionSource = data.es;
        pues.mobile = data.mobile;
        pues.stationery = data.stationary;
        addedPU.projectUnitEmissionSources.push(pues);
      }

      this.assignedProjectUnits.filter(pu => pu.unit.id !== this.clickedUnit.id).push(addedPU);
    }

    this.onChagePUESData(data.es);
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

  getProjectTypes(){
    this.serviceProxy.getManyBaseProjectTypeControllerProjectType(
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
      this.projectTypes = res.data;
    })
  }

  geyMethodologies(){
    this.serviceProxy.getManyBaseMethodologyControllerMethodology(
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
      this.methodologies = res.data;
    })
  }

  editUnitEmissionSource(unitId: number){
    this.unitClicked=true;
  }

  async openUnitModel(e: any){
    let u = this.units.find(u=>u.id=== e.id);
    if(u){
      this.clickedUnit = u
      if(!this.isNewEntry){ // edit        
        const puId = this.projectUnits.find(pu => pu.unit.id === u?.id);
        if(puId){                
          let puesList = await this.getProjectUnitEmissionSources(puId.id, this.clickedUnit.id);        
          this.assignedEmissionSources =  puesList.map(pues => pues.emissionSource);       
          
          let assignedPU = new ProjectUnit();
          assignedPU.projectUnitEmissionSources = puesList;
          assignedPU.unit = this.clickedUnit;
          this.assignedProjectUnits = this.assignedProjectUnits.filter(pu => pu.unit.id !== this.clickedUnit.id);
          this.assignedProjectUnits.push(assignedPU);


          const edited = this.editingData.projectUnits.find(pu => pu.unitId === this.clickedUnit.id);          
          if(edited){          
            const editedSources = edited.editedES.map(esId => this.emissionSources.find(es => es.id == esId)).filter(a => a !== null) as EmissionSource[]; 
            this.assignedEmissionSources = [...this.assignedEmissionSources, ...editedSources]
          }
        }
      }else{ // new         
        const pu = this.project.projectUnits.find(pu => pu.unit.id === this.clickedUnit.id)     
        if(pu){          
          this.assignedEmissionSources = pu.projectUnitEmissionSources.map(pes => pes.emissionSource)                 
        }              
      }

      const puWithData = this.assignedProjectUnits.find(pu => pu.unit.id === this.clickedUnit.id);
      
      if(puWithData){
        this.clickedPU = puWithData;
      }


      if(!this.clickedPU){
        this.clickedPU = new ProjectUnit();
        this.clickedPU.unit = this.clickedUnit;    
      }
 
      this.clickedPU.projectUnitEmissionSources = [...this.clickedPU.projectUnitEmissionSources]


      const asignedClickedPu = this.assignedProjectUnits.find(pu => pu.unit.id === this.clickedUnit.id);
      
      this.clickedPU.projectUnitEmissionSources = this.selectedProjectEmissionSource.map(es => {
        let pues = new ProjectUnitEmissionSource();
        pues.emissionSource = es;
        if(asignedClickedPu){
          const puesInClicked = asignedClickedPu.projectUnitEmissionSources.find(e => e.emissionSource.id === es.id);
          if(puesInClicked){
            pues.tier = puesInClicked.tier;
            pues.clasification = puesInClicked.clasification;
          }
        }
        return pues;
      })   

      this.header =  this.clickedUnit ? this.clickedUnit?.name: "Unit Details"
      this.reloadPUES();
      this.unitClicked=true;
    }
  }

  reloadPUES(){
    let temp = this.selectedProjectEmissionSource;
    this.selectedProjectEmissionSource = [];
    this.selectedProjectEmissionSource = [...temp];
  }

  getPUESBYEsFromClickedPU(es: EmissionSource){    
    
    let pues = this.clickedPU?.projectUnitEmissionSources.find(pues => pues.emissionSource.id === es.id);
    if(!pues){
      pues = new  ProjectUnitEmissionSource();
    }    
    return pues;
  }

  getUnits(){
    
  }


  // start - creating chart ----------------------------------------
  onChangeUnit(){
    this.insertNode(this.parentUnit);
    let data = this.mapObject([this.parentUnit])
    this.nodes = data;  
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
  nodes: any = [];
  // end - creating chart ----------------------------------------

  reArrageChart(){
    this.getUnits();
  }

  getProject(id: number){
    this.serviceProxy.getOneBaseProjectControllerProject(id, undefined, undefined, 0)
    .subscribe(async res => {
      this.project = res;          
      await this.getProjectUnits(this.project.projectUnits.map(pu => pu.id));
      await this.setInitilValues();
      this.setEditData();
    })
  }


  async setInitilValues(){
    const d = new Date();
    if(!this.project.isFinancialYear){
      d.setFullYear(parseInt(this.project.year))
      //@ts-ignore
      this.year = d;
      this.selectedProjectEmissionSource = await this.getProjectEmissionSources(this.project.id);
    }
  }


  async getProjectEmissionSources(projectId: number): Promise<EmissionSource[]>{
    try{
      const res = await this.projectServiceProxy.getProjectEmissionSources(projectId).toPromise();
      return res;
    }catch(err){
      return [];
    }
  }

  async getProjectUnitEmissionSources(projectUnitId: number, unitId: number): Promise<ProjectUnitEmissionSource[]>{
    try{
      const pues = await this.projectServiceProxy.getProjectUnitEmissionSources(projectUnitId).toPromise();
      this.editingData.projectUnits = this.editingData.projectUnits.filter(u => u.unitId !== unitId);
      this.editingData.projectUnits.push({
        unitId: unitId,
        projectUnitId: projectUnitId,
        previousEs: pues.map(es => es.emissionSource.id),
        editedES: pues.map(es => es.emissionSource.id)
      });
      return pues;
    }catch(err){
      this.editingData.projectUnits = this.editingData.projectUnits.filter(u => u.unitId !== unitId);
      this.editingData.projectUnits.push({
        unitId: unitId,
        projectUnitId: projectUnitId,
        previousEs: [],
        editedES: []
      });
      return [];
    }
  }


  async getProjectUnits(ids: number[]){    
    try{
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
    }catch(err){
      this.projectUnits = [];
      this.asignedUnits = [];    
      this.reArrageChart()
    }
  }


  //start Edit -------------------------------------------------------------------------
  setEditData(){
    this.editingData.previousEs=this.selectedProjectEmissionSource.map(es => es.id);
    this.editingData.previousPU = [...this.asignedUnits];

    this.editingData.editedPU = [...this.asignedUnits];
    this.editingData.editedES = this.selectedProjectEmissionSource.map((es: {id: number}) => es.id);
    this.editingData.projectUnits = [];  
  }

  onChangeProjectES(e: any){
    this.editingData.editedES = e.checked.map((es: {id: number}) => es.id);
  }


  onChangeProjectUnitES(e: any){
    const editData = this.editingData.projectUnits?.find(u => u.unitId === this.clickedUnit.id);
    if(editData){ // clicked unit is alrady added, it need to be modified
      editData.editedES =  e.checked.map((es: {id: number}) => es.id);
      this.editingData.projectUnits = this.editingData.projectUnits.filter(u => u.unitId !== this.clickedUnit.id);
      this.editingData.projectUnits.push(editData);
    }
  }

  onChagePUESData(es: EmissionSource){
    const editData = this.editingData.projectUnits?.find(u => u.unitId === this.clickedUnit.id);
    if(editData){
      editData.editedES.push(es.id);
      this.editingData.projectUnits = this.editingData.projectUnits.filter(u => u.unitId !== this.clickedUnit.id);
      this.editingData.projectUnits.push(editData);
    }else{
      
    }
  }

  //end  Edit -------------------------------------------------------------------------


  onBackClick() {
    this.router.navigate(['../list'], {relativeTo:this.route});
  }


  clearDialogData(){
    this.isForChild =  false;
    this.assignedEmissionSources = [];
    //@ts-ignore
    this.clickedPU = undefined;
    // this.selectPuesDataComponent.clear();
  }

}
