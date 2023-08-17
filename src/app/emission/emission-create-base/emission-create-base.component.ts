import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService } from 'primeng/api';
import { AppService, ProjectTypes, RecordStatus, SavedData } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ServiceProxy, Unit, Project, User, ProjectUnitEmissionSource, PuesDataReqDtoSourceName, ProjectUnitEmissionSourceControllerServiceProxy, ProjectStatus, EmissionBaseControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-emission-create-base',
  templateUrl: './emission-create-base.component.html',
  styleUrls: ['./emission-create-base.component.css']
})
export class EmissionCreateBaseComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  creatable: boolean = false;
  editable: boolean = false;
  viewable: boolean = true;
  deletable: boolean = false;

  projectType: ProjectTypes;

  constructor(
    protected appService: AppService,
    protected serviceProxy: ServiceProxy,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    protected messageService: MessageService,

  ) { }

  public get projectTypesEnum(): typeof ProjectTypes {
    return ProjectTypes; 
  }

  isAnyAdmin: boolean = false;
  selectedUnit: Unit;
  selectedProject: Project;
  isCSIUser: boolean =false;
  isAuditor: boolean = false;

  logedUser: User;
  puesAssigned: boolean = true; // This variable is unsed to chceck PUES is assigned and project status is Data Entry
  isDuplicated: boolean = false


  public get sourceName(): typeof PuesDataReqDtoSourceName {
    return PuesDataReqDtoSourceName; 
  }

  async ngOnInit() {
    this.appService.projectType.subscribe(p => this.projectType = p);
    let selectedProjectString = localStorage.getItem(SavedData.SelectedProject);
    if(selectedProjectString){
      let sp = new Project();
      sp.init(JSON.parse(selectedProjectString));
      this.selectedProject =sp;
      // console.log("selectedProject", this.selectedProject)
    }
    
    this.puesAssigned = true;
    this.isCSIUser = this.appService.isCSIUser();
    this.isAuditor = this.appService.isAuditor();
    let u = await this.appService.getUser();
    if(u){
      this.logedUser = u;
    }

    if(!this.isAnyAdmin){
      let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
    }
    this.setAccess();    
  }

  setAccess(){
    if(this.isAnyAdmin){
      this.viewable = true;
      let hasActions = this.checkActions()
      this.creatable = hasActions.add;
      this.editable = hasActions.edit;
      this.deletable = hasActions.delete;
    }
  }

  async changeAccess(sourceName: PuesDataReqDtoSourceName){
    if(this.selectedProject && this.selectedUnit){
      let pu = await this.getPU();
      if(pu){
        let puesIds = pu.projectUnitEmissionSources.map(pues => pues.id);
        let pues = await this.getPUES(puesIds, sourceName);
        if(pues){
          let assigned = await this.getAssignedES(pues);
          let hasActions = this.checkActions()
          if(assigned){
            this.editable = (assigned.edit && hasActions.edit);
            this.deletable = (assigned.delete && hasActions.delete);
            this.creatable = (assigned.add && hasActions.add);
          } else {
            this.editable = hasActions.edit
            this.deletable = hasActions.delete
            this.creatable = hasActions.add
          }
        }
      }
    }
  }

  checkActions(){
    return {
      add: this.appService.hasUserActionAccessTo(UserActions.DATA_ENTER),
      edit: this.appService.hasUserActionAccessTo(UserActions.DATA_EDIT),
      delete: this.appService.hasUserActionAccessTo(UserActions.DATA_DELETE)
    }
  }

  async getPU(){
    try{
      const res = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined,
        undefined,
        [ "unit.id||$eq||" + this.selectedUnit.id, "project.id||$eq||" + this.selectedProject.id , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        ['unit','project'],
        1,
        0,
        0,
        0
      ).toPromise();
      if(res.data.length>0){
        return res.data[0];
      }
      return null;
    }catch(err){
      console.log(err);
      return null;
    }
  }

  async getPUES(ids: number[], sourceName: PuesDataReqDtoSourceName){
    const res = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
      undefined,
      undefined,
      ["id||$in||"+ids.join(","),"emissionSource.code||$eq||"+sourceName, "status||$ne||"+RecordStatus.Deleted],      
      undefined,
      undefined,
      ['emissionSource'],
      1,
      0,
      0,
      0
    ).toPromise();

    if(res.data.length >0){
      return res.data[0];
    }

    return null;
  }

  async getAssignedES(pues: ProjectUnitEmissionSource){
    try{
      const res = await this.serviceProxy.getManyBaseAssignedESsControllerAssignedES(
        undefined,
        undefined,
        [ "user.id||$in||" + this.logedUser.id, "pues.id||$eq||" + pues.id , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        ['user','pues'],
        1,
        0,
        0,
        0
      ).toPromise();
      if(res.data.length > 0){
        return res.data[0]
      }
      return null;
    }catch(err){
      console.log(err);
      return null;
    }
  }


  async hasPUES(unitId: number, project: Project, sourceName: PuesDataReqDtoSourceName){
    
    let res = await this.projectUnitEmissionSourceControllerServiceProxy.hasPUES(unitId,project.id,sourceName.toString()).toPromise();
    this.puesAssigned = res;
    if(!res){
      this.messageService.add({
        severity: 'warn',
        summary: 'Warnning',
        detail: 'This Emission source is not assigned to selected unit and project',
        closable: true,
      });
    }else{
      if(project.projectStatus !== ProjectStatus.DataEntry && !this.isAuditor){
        this.puesAssigned = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Warnning',
          detail: 'This project is not in Data Entry mode',
          closable: true,
        });

        if(project.projectStatus === ProjectStatus.Payment_Pending){
          this.messageService.add({
            severity: 'warn',
            summary: 'Warnning',
            detail: 'Payment id not complited for this project',
            closable: true,
          });
  
        }
      }
    }
    return res;
  }

  async validateMonth(source: string, projectId: number, unitId: number, year: string, month: number, dto?: any){
    this.isDuplicated = false

    // Month validation is removed to enter multiple data for all emission source. The implementations in emission 
    // sources are not removed and month validation can be activated for all emission sources by uncommenting following 
    // lines and commenting the above line. If month validation is required for few emission sources, there will be
    // a modification in all emission sources.

    // if (dto !== undefined){
    //   if (dto.month !== month){
    //     this.isDuplicated = await this.appService.validateMonth(source, projectId, unitId, year, month)
    //   } else {
    //     this.isDuplicated = false
    //   }
    // } else {
    //   this.isDuplicated = await this.appService.validateMonth(source, projectId, unitId, year, month)
    // }

    // if (this.isDuplicated){
    //   this.messageService.add({
    //     severity: 'warn',
    //     summary: 'Warnning',
    //     detail: 'This project has an entry for selected month',
    //     closable: true,
    //   });
    // }
  }

  async setCountry(){
    try{
      if(!this.selectedUnit.country || !this.selectedUnit.country.id){
        let res = await this.serviceProxy.getOneBaseUnitControllerUnit(this.selectedUnit.id, ['country'],undefined,undefined).toPromise();
        this.selectedUnit.country = res.country;
      }
    }catch(err){
      console.log(err);
    }
  }

}
