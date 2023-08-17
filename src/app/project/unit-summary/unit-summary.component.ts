import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivityDataService } from 'app/shared/activity-data/activity-data.service';
import { MasterDataService } from 'app/shared/master-data.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ByUnitIdsDto, EmissionBaseControllerServiceProxy, EvidenceRequest, EvidenceRequestEsCode, ManyActivityDataDto, Parameter, ProjectUnitControllerServiceProxy, ProjectUnitEmissionSourceControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-unit-summary',
  templateUrl: './unit-summary.component.html',
  styleUrls: ['./unit-summary.component.css']
})
export class UnitSummaryComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  public projectId: number
  public unitId: number
  public emissionSources: string[] = []
  public dataList: any[] = []
  public userIds: any[] = []
  public parameters: any[];
  public unitName: string = ''

  public months: any = {
    0: 'Jan',
    1: 'Feb',
    2: 'March',
    3: 'Apr',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
    12: 'All'
  }

  public cols: any[] = []

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public serviceProxy: ServiceProxy,
    private activityDataService: ActivityDataService,
    private masterDataService: MasterDataService,
    private emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy,
    private projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    public appService: AppService
  ) { }

  public card1 = [
    { title: "Admin", value: "Admin user" },
    { title: "Parent Unit", value: "Parent Unit" },
    { title: "Total Emission", value: "1000 tCO2e" },
    { title: "Sector", value: "Transport" }
  ]

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.projectId = params['projectId'];
      this.unitId = params['id'];
      let emission = params['emission'];

      this.setCardOne(this.unitId, emission);

      let _users = await this.serviceProxy.getManyBaseUsersControllerUser(
        ["id"], undefined, ['unit.id||$eq||'+this.unitId], undefined, undefined, undefined, 1000, 0, 1, 0
      ).toPromise();
      _users.data.map((u: any) => this.userIds.push(u.id)) // TODO: can be removed

  
      // let d = this.projectUnitEmissionSourceControllerServiceProxy.pUESListBYProjectAndUYnit(this.unitId, this.projectId).toPromise();

      let projectUnit = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined, undefined, ['project.id||$eq||'+this.projectId, 'unit.id||$eq||'+ this.unitId], 
        undefined, undefined, undefined, 1, 0, 1, 0
      ).toPromise();


      if(projectUnit.data && projectUnit.data.length>0){
        let pues = await this.serviceProxy.getManyBaseProjectUnitEmissionSourceControllerProjectUnitEmissionSource(
          undefined, undefined, ['projectUnit.id||$eq||'+projectUnit.data[0].id], 
          undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise();


        pues.data.forEach((data: any) => {
          this.emissionSources.push(data.emissionSource.code)
        });

        this.cols.push({ field: 'parameter', header: 'Parameter' })


        this.emissionSources.forEach( source => {          
          this.getActivitydata(source)
        })
      }





    })
  }

  async setCardOne(unitId: number, emission: string){
    console.log("setCardOne", unitId, emission);
    let unit  = await this.serviceProxy.getOneBaseUnitControllerUnit(unitId, undefined, undefined, undefined).toPromise();
    this.unitName = unit.name
    this.card1 = [
    //  { title: "Admin", value: "Admin user" },
     { title: "Parent Unit", value: unit.parentUnit?.id? unit.parentUnit?.name : '-' },
     { title: "Total Emission", value: emission + " tCO2e" },
    //  { title: "Sector", value: "Transport" }
   ]
  }

  async getActivitydata(sourceName: string){
    console.log("getActivitydata");
    let req = new ManyActivityDataDto();
    req.projectId = this.projectId;

    //@ts-ignore
    req.es = sourceName;
    let ress = await this.emissionBaseControllerServiceProxy.getManyActivityData(req).toPromise(); // TODO: replace with getManyActivityDataForEsList
    this.modifyActivityData({source: sourceName, data: ress},  sourceName)
  }

  async modifyActivityData(data: any, code: string) {
    let parameters = await this.serviceProxy.getManyBaseParameterControllerParameter( // TODO: replace by getManyParamtersByESList
      undefined,
      undefined, 
      ['source.code||$eq||'+code],
      undefined, 
      undefined, 
      ["source"], 
      1000, 
      0,
      1, 
      0
    ).toPromise();
    this.cols = []
    if (data.data){
      let obj2 = this.groupByKey(data.data, 'month')
      let obj3: any = {}
      let total = 0
      Object.keys(this.months).forEach(m => {
        Object.keys(obj2).forEach((o) => {
          if (m === o) {
            obj3[m] = obj2[o]
            total += obj2[o][0]['e_sc']
          } else if (m !== o && obj3[m] === undefined) {
            obj3[m] = 0
          }
        })
      })
      let obj: any = { unit: data.source.replace('_', ' '), data: [obj3], total: total.toFixed(3) }
        this.cols.push({ field: 'parameter', header: 'Parameter' })
        Object.keys(obj.data[0]).map((key) => {
          if (!['unit'].includes(key)) {
            this.cols.push({ field: key, header: this.months[key] })
          }
        })
        obj['columns'] = this.cols
        obj['parameters'] = parameters.data
      this.dataList.push(obj)
    }

  }

  groupByKey(array: any[], key: string | number) {
    return array
      .reduce((hash: { [x: string]: any; }, obj: { [x: string]: string | number; }) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  }

  onBackClick(){
    this.router.navigate(['../project-summary'], 
              { queryParams: { id: this.projectId},relativeTo: this.activatedRoute  });
  }

  getValue(arr: any, code: any){
    if (arr !== 0){
      let unitname = code+ "_unit"
      let unit = ''
      if (arr[0][unitname] !== undefined && arr[0][unitname] !== null ){
        let para_unit = this.masterDataService.parameterUnits[arr[0][unitname]  as keyof typeof this.masterDataService.parameterUnits]
        unit = para_unit? para_unit.label : arr[0][unitname]

      }

      if (arr[0][code] !== null && arr[0][code] !== undefined){
        return 1*arr[0][code]?.toFixed(4) + ' ' + unit
      } else {
        return '-'
      }
    }
    return '-'
  }

}
