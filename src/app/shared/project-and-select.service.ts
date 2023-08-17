import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppService, RecordStatus, SavedData } from 'shared/AppService';
import { Project, ProjectStatus, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class ProjectAndSelectService {

  private unitBbj = new Subject<{ units: Unit[] }>();
  private projectBbj = new Subject<{ projects: Project[] }>();


  private isCSIUser: boolean = false;
  private isAuditor: boolean = false;
  private isOnlyFp: boolean = false;
  private logedUnit: Unit;
  private logeduser: User;
  constructor(private serviceProxy: ServiceProxy, public appService: AppService) { }


  /**
   * This should be call when initialzing the unit dropdown
   */
  async init(){
    let units: Unit[] = [];
    this.unitBbj.next({units:[...units]})
    let projects: Project[] = [];
    this.projectBbj.next({projects:[...projects]}) 
    this.isCSIUser =  this.appService.isCSIUser();
    this.isAuditor = this.appService.isAuditor();
    this.isOnlyFp  = this.appService.isOnlyForcalPoint();
    if(!this.isCSIUser){
      let u = await this.appService.getLogedUnit();
      if(u){
        this.logedUnit = u;
      }
    }
    let user = await this.appService.getUser();
    if (user) {
      this.logeduser = user;
    }
    this.getUnits();
    console.log(this.isAuditor)
    if (this.isAuditor) {this.getProjects()}
  }

  getUnitListener() {
    let data = localStorage.getItem(SavedData.units);
    if(data){
      let u = JSON.parse(data) as Unit[];
      this.unitBbj.next({units: [...u]});
      return this.unitBbj.asObservable();
    }else{
      return this.unitBbj.asObservable();
    }
  }

  getProjectListener(withoutUnit: boolean = false) {
    if(withoutUnit){
      this.getProjects();
    }
    return this.projectBbj.asObservable();
  }

  /**
   * This should be called whend changig the selected unit
   * 
   * Then only the projecte, assigned to that unit will be loaded
   * 
   * @param unit 
   */
  onChangeUnit(unit: Unit){
    this.getProjects(unit);
  }
  

  async getProjects(unit: Unit | undefined = undefined){
    let filters: string[]  = [ ];
    if(unit && !this.isAuditor){
      filters = ["status||$ne||"+RecordStatus.Deleted,"project.status||$ne||"+RecordStatus.Deleted,"project.projectStatus||$ne||"+ProjectStatus.Initial]
      filters.push("unit.id||$eq||"+unit.id);
    }
    if (this.isAuditor){
      filters = [ "status||$ne||"+RecordStatus.Deleted,"projectStatus||$ne||"+ProjectStatus.Initial];
      filters.push("projectStatus||$in||"+[ProjectStatus.Verification_Pending, ProjectStatus.Evidence_Pending, ProjectStatus.Verified, ProjectStatus.Unverified])
      if(this.logeduser){
        filters.push( "verifier.id||$eq||"+this.logeduser.id)
      }
    }
    try{
      if(this.isOnlyFp){ // for forcal point
        let ids = this.appService.getAllowedFtProjectIds();
        if(ids.length > 0){
          filters = [ "id||$in||"+ids.join(","),"status||$ne||"+RecordStatus.Deleted,"projectStatus||$ne||"+ProjectStatus.Initial];
          const res = await this.serviceProxy.getManyBaseProjectControllerProject(
            undefined,
            undefined,
            filters,
            undefined,
            undefined,
            undefined,
            100,
            0,
            0,
            0
          ).toPromise()
          this.projectBbj.next({projects:[...res.data]}) 
        }        
      }else if((unit || this.isCSIUser) && !this.isAuditor){ // not auditor and 
        if(unit){
          const res = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
            undefined,
            undefined,
            filters,      
            undefined,
            undefined,
            ['unit','project'],
            100,
            0,
            0,
            0
          ).toPromise();
  
          let pIds = Array.from(new Set(res.data.map(item => item.project.id)));      
          let projects = res.data
            .filter(pu => pIds.includes(pu.project.id) && pu.project.status == RecordStatus.Active && pu.project.projectStatus !== ProjectStatus.Initial)
            .map(item => item.project);
            this.projectBbj.next({projects:[...projects]})
        }else{      
          filters = [ "status||$ne||"+RecordStatus.Deleted,"projectStatus||$ne||"+ProjectStatus.Initial];
          const res = await this.serviceProxy.getManyBaseProjectControllerProject(
            undefined,
            undefined,
            filters,
            undefined,
            undefined,
            undefined,
            100,
            0,
            0,
            0
          ).toPromise()
          this.projectBbj.next({projects:[...res.data]}) 
        }
      } else if(this.isAuditor){ // for auditor and clients
        filters = [ ...filters ,...["status||$ne||"+RecordStatus.Deleted,"projectStatus||$ne||"+ProjectStatus.Initial]]
        const res = await this.serviceProxy.getManyBaseProjectControllerProject(
          undefined,
          undefined,
          filters,
          undefined,
          undefined,
          ['verifier'],
          100,
          0,
          0,
          0
        ).toPromise()
        let pIds = Array.from(new Set(res.data.map(item => item.id)));
        let projects = res.data
          .filter(pu => pIds.includes(pu.id) && pu.status == RecordStatus.Active && pu.projectStatus !== ProjectStatus.Initial)
          this.projectBbj.next({projects:[...projects]})
      }
    }catch(err){
      console.log("err -- ", err);
      let projects: Project[] = [];
      this.projectBbj.next({projects:[...projects]}) 
    }
  }

  async getUnits(){
    let data = localStorage.getItem(SavedData.units);
    if(data){
      let us = JSON.parse(data) as any[];
      let u: Unit[] = [];
      us.forEach(uu => {
        let nu = new Unit();
        nu.init(uu)
        u.push(nu);
      })
      setTimeout(() => {
        this.unitBbj.next({units: [...u]});
      }, 0)
    }else{
      try{
        if(this.isCSIUser || this.appService.isFM()){
          let res = await this.serviceProxy.getManyBaseUnitControllerUnit(
            undefined,
            undefined,
            [ "status||$ne||"+RecordStatus.Deleted],
            undefined,
            undefined,
            ['country','industry'],
            3000,
            0,
            0,
            0
          ).toPromise();
    
          let units = res.data;
          if(this.isCSIUser){
            let u  = [...units];
            localStorage.setItem(SavedData.units, JSON.stringify(u))
            this.unitBbj.next({units: [...u]});
          }
        }else if(this.appService.isOnlyOperationalAdmin()){
          let ids = this.appService.getAllowedUnitIds()
          if(ids.length > 0){
            let res = await this.serviceProxy.getManyBaseUnitControllerUnit(
              undefined,
              undefined,
              [ "id||$in||"+ids.join(","), "status||$ne||"+RecordStatus.Deleted],
              undefined,
              undefined,
              ['country','industry'],
              3000,
              0,
              0,
              0
            ).toPromise();
      
            let units = res.data;
            if(this.isCSIUser){
              let u  = [...units];
              localStorage.setItem(SavedData.units, JSON.stringify(u))
              this.unitBbj.next({units: [...u]});
            }
          }
        }else{
          if(this.appService.isORGAdmin()){
            let childUnits = this.logedUnit.childUnits;
            let u = [...[this.logedUnit, ...childUnits]]
            localStorage.setItem(SavedData.units, JSON.stringify(u))
            this.unitBbj.next({units: [...u]});
          }else{
            let childUnits = await this.getChildUnits(this.logedUnit.id);
            let u = [...[this.logedUnit, ...childUnits]]
            localStorage.setItem(SavedData.units, JSON.stringify(u))
            this.unitBbj.next({units: [...u]});
          }
          
          
        }
      }catch(err){
        let units: Unit[] = [];
        this.unitBbj.next({units:[...units]})
      }
    }
  }
  /**
   * This gets all the child units for a given unit
   * @param unitId 
   * @returns 
   */
  async getChildUnits(unitId: number) {
    let res
    let childs = [unitId]
    let newChilds: Unit[] = []
    let allChilds = []
    do {
      newChilds = []
      for await (const child of childs){
        res = await this.serviceProxy.getManyBaseUnitControllerUnit(undefined, undefined, ['parentUnit.id||$eq||'+child],
        undefined, undefined, ['unit'], 3000, 0, 1, 0).toPromise()
        newChilds.push(...res.data)
      }
      allChilds.push(...newChilds)
      childs = newChilds.map(o => {return o.id})
    } while (childs.length > 0);
    return allChilds
  }

}
