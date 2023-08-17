import { Injectable } from '@angular/core';
import { NumEmployeesControllerServiceProxy, ServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class EmpcomCalculationService {

  constructor(

    public serviceProxy: ServiceProxy,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private numempServiceProxy: NumEmployeesControllerServiceProxy

  ) { }

async getEmployeeEmission(projectId:number,p_road_e:number,unitId:any){
  let pUnitId = 0;
  if(unitId == undefined){
  let project = await this.serviceProxy.getOneBaseProjectControllerProject(
    projectId,
    undefined,
    undefined,
    0
  ).toPromise();
  pUnitId = project.ownerUnit.id;

  }
  else{
    pUnitId = unitId
  }

  let childUnits = await this.unitControllerServiceProxy.getChildUnits(pUnitId).toPromise()

  let unitIds = childUnits.map(u => { return (u.id).toString() })

  unitIds.push(pUnitId.toString())

  let filter_ce = ["unit.id||$in||" + unitIds];
  filter_ce.push("project.id||$eq||" + projectId);

  const employees = await this.serviceProxy.getManyBasePassengerRoadActivityDataControllerPassengerRoadActivityData(
    undefined,
    undefined,
    filter_ce,
    undefined,
    undefined,
    undefined,
    10000,
    0,
    0,
    0
  ).toPromise();


  let uniqemp = [
    ...new Map(employees.data.map((item) => [item["employeeName"], item])).values(),
  ];

  let c_num_emp = uniqemp.length;

  const t_num_emp = await this.numempServiceProxy.getTotalEmployees(projectId).toPromise()

  let p_road_emission = 0;

  if (c_num_emp !== 0 && c_num_emp !== undefined) {
    p_road_emission = p_road_e* t_num_emp / c_num_emp;

  }

  console.log("==employeecom-summry==", {
    p_road_e: p_road_e,
    t_num_emp: t_num_emp,
    c_num_emp: c_num_emp,
    p_road_t_e: p_road_emission.toFixed(4)

  })
  


  return p_road_emission.toFixed(4);



}
  

}
