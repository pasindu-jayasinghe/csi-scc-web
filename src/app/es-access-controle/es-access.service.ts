import { Injectable } from '@angular/core';
import { AppService, RecordStatus } from 'shared/AppService';
import { EmissionSource } from 'shared/service-proxies/service-proxies';
import { ByProjectUnitIdsDto } from 'shared/service-proxies/service-proxies';
import { ProjectUnitEmissionSourceControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { ProjectStatus } from 'shared/service-proxies/service-proxies';
import { PuesDataReqDtoSourceName, ServiceProxy as CommaonServiceProxy } from 'shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class EsAccessService {

  constructor(
    private commaonServiceProxy: CommaonServiceProxy,
    private appService: AppService, 
    private projectUnitEmissionSourceController: ProjectUnitEmissionSourceControllerServiceProxy

  ) { }


  async getProjectUnitsByUnit(unitId: number){
    try{
      let res = await this.commaonServiceProxy.getManyBaseProjectUnitControllerProjectUnit(
        ['id'],
        undefined,
        [ "unit.id||$eq||" + unitId , "status||$ne||"+RecordStatus.Deleted, "project.status||$ne||"+RecordStatus.Deleted,"project.projectStatus||$ne||"+ProjectStatus.Initial],      
        undefined,
        undefined,
        ['unit', "project"],
        1000,
        0,
        0,
        0
      ).toPromise();
      return res.data;
    }catch(err){
      console.log(err);
      return [];
    }
  }

  private async getPUESList(puIds: number[]){
    try{    
      let req = new ByProjectUnitIdsDto();
      req.projectUnitIds = puIds;
      let data = await this.projectUnitEmissionSourceController.getProjectUnitESListByProjectUntIds(req).toPromise();  // TODO: take more time
      data = data.map((d: any)=> {
        let e = new EmissionSource();
        e.id=d.emissionSource_id;
        e.name = d.emissionSource_name;
        e.status = d.emissionSource_status;
        e.code = d.emissionSource_code;
        return e;
      })
      return data;
    }catch(err){
      console.log(err);
      return [];
    }
  }

  async getCreatedProjects(unitId: number){
    try{
      let filters = [ "ownerUnit.id||$eq||" + unitId , "status||$ne||"+RecordStatus.Deleted, "projectStatus||$ne||"+ProjectStatus.Initial];
      if(this.appService.isOnlyForcalPoint()){
        let ids = this.appService.getAllowedFtProjectIds();
        if(ids.length > 0){
          filters.push("id||$in||"+ids.join(","))
        }
      }
      let res = await this.commaonServiceProxy.getManyBaseProjectControllerProject(
        ['id'],
        undefined,
        filters,
        undefined,
        undefined,
        ['ownerUnit'],
        1000,
        0,
        0,
        0
      ).toPromise();
      return res.data.map(p=>p.id);
    }catch(err){
      console.log(err);
      return [];
    }
  }

  async getprojectEmissionSourcesList(projectIds: number[]){
    try{
      let res = await this.commaonServiceProxy.getManyBaseProjectEmissionSourceControllerProjectEmissionSource(
        ['emissionSource'],
        undefined,
        [ "project.id||$in||" + projectIds.join(",") , "status||$ne||"+RecordStatus.Deleted, "project.projectStatus||$ne||"+ProjectStatus.Initial,"project.status||$ne||"+RecordStatus.Deleted,],      
        undefined,
        undefined,
        ['project'],
        1000,
        0,
        0,
        0
      ).toPromise();

      return res.data.map(pes => pes.emissionSource);
    }catch(err){
      console.log(err);
      return [];
    }
  }

  async getESList(){

    let allEsList: PuesDataReqDtoSourceName[] = []


    const isAdmin =  this.appService.isAnyAdmin();
    const unit = await this.appService.getLogedUnit();
    
    if(unit){
      let puidList = await this.getProjectUnitsByUnit(unit.id);
      if(puidList.length>0){
        let esList = await this.getPUESList(puidList.map(pu=> pu.id));
        allEsList = [...allEsList, ...esList.map((e: { code: string })=>e.code as unknown as PuesDataReqDtoSourceName)]
      }
    }

    if(isAdmin && unit){
      let projectIds = await this.getCreatedProjects(unit.id);
      if(projectIds.length>0){
        let pEsList =  await this.getprojectEmissionSourcesList(projectIds);
        allEsList = [...allEsList, ...pEsList.map(e=>e.code as unknown as PuesDataReqDtoSourceName) ]
      }
    }

    let esList: PuesDataReqDtoSourceName[] = []


    allEsList.forEach(es => {
      if(es){
        if(!esList.includes(es)){
          esList.push(es);
        }
      }
    })

    return esList;

  }
}
