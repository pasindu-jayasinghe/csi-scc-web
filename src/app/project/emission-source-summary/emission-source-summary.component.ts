import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivityDataService } from 'app/shared/activity-data/activity-data.service';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EquationComponent } from 'app/verification/equation/equation.component';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService, ProjectTypes } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { EmissionBaseControllerServiceProxy, EmissionSourceControllerServiceProxy, EvidenceRequestEsCode, ManyActivityDataDto, Project, ProjectEmissionFactorControllerServiceProxy, ProjectStatus, ServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-emission-source-summary',
  templateUrl: './emission-source-summary.component.html',
  styleUrls: ['./emission-source-summary.component.css']
})
export class EmissionSourceSummaryComponent implements OnInit {

  @Output() valueClicked = new EventEmitter<any>();
  // @Output() verifyClicked = new EventEmitter<any>();
  // @Output() rejectClicked = new EventEmitter<any>();
  public roles = Roles
public userActions = UserActions

  @Input() type: string
  @Input() title: string
  @Input() backRoute: string

  public projectId: any;
  public summaryType: string;
  public unitId: string;
  public emissionSourceId: any;
  public sourceDtails: any[] = [];
  public sourceType: string;
  public sourceName: string;
  public esCode: string;
  public project: Project;
  public isVerified: boolean = false;
  public parameters: any[];

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

  public card1: any[] = []


  public ref: DynamicDialogRef;
  projectType: ProjectTypes;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    private activityDataService: ActivityDataService,
    private emissionFactorServiceProxy: ProjectEmissionFactorControllerServiceProxy,
    private projectAndSelectService: ProjectAndSelectService,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private masterDataService: MasterDataService,
    private emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy,
    public appService: AppService
  ) {
    let name = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    this.appService.projectType.subscribe(p => this.projectType = p)
    if (this.type === undefined) this.type = "summary";
    if (this.title === undefined) this.title = "Project Summary - Emission"
    if (this.backRoute === undefined) this.backRoute = "project-summary"
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.projectId = params['projectId'];
      this.emissionSourceId = params['id'];
      if (params['type']) this.summaryType = params['type']
      if (params['unitId']) this.unitId = params['unitId']

      this.project = await this.serviceProxy.getOneBaseProjectControllerProject(this.projectId, undefined, undefined, undefined).toPromise();
      if ([ProjectStatus.Verified, ProjectStatus.Unverified].includes(this.project.projectStatus)) {
        this.isVerified = true;
      }

      this.serviceProxy['getOneBaseEmissionSourceControllerEmissionSource'](
        this.emissionSourceId, undefined, undefined, undefined
      ).subscribe(async res => {
        this.esCode = res.code
        this.sourceType = this.formatSourceName(res.code)
        if(this.projectType === ProjectTypes.GHG){
          this.sourceName = res.name
        }else{
          this.sourceName = res.sbtName
        }

        this.getEmissionFactors([this.esCode], this.projectId)

        let func: any = 'getManyBase' + this.sourceType + 'Controller' + this.sourceType

        let childUnits;
        if (this.summaryType && this.summaryType === 'org-summary' && this.unitId){
          childUnits = await this.unitControllerServiceProxy.getChildUnitIds(parseInt(this.unitId)).toPromise()
          childUnits.push(parseInt(this.unitId))
        }

        let req = new ManyActivityDataDto();
        req.projectId = this.projectId;
        if (childUnits !== undefined) {
          req.unitIds =childUnits;
        }
        //@ts-ignore
        req.es = res.code;
        let ress = await this.emissionBaseControllerServiceProxy.getManyActivityData(req).toPromise();
        this.modifyActivityData(ress, res.code)
      })

    })
  }

  async modifyActivityData(data: any, code: string) {
    console.log("modifyActivityData");

    let parameters = await this.serviceProxy.getManyBaseParameterControllerParameter(
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
    this.parameters  = parameters.data;
    await Promise.all(
      data.map(async (_data: any) => {
        return {
          unit: _data.unit.id,
          unitName: _data.unit.name,
          data: _data
        }
      })
    ).then(res => {
      let arr2: any[] = []
      let arr = this.groupByKey(res, 'unit')
      Object.keys(arr).filter(key => { //get unit by unit
        let emission: any[] = []
        let total = 0
        // console.log(arr[key])
        arr[key].map((ele: any, idx: number) => {
          emission.push(ele.data);
        })
        let obj2 = this.groupByKey(emission, 'month')
        
        let obj3: any = {}
        Object.keys(this.months).forEach(m => {
          Object.keys(obj2).forEach((o) => {
            if (m === o){
              obj3[m] = obj2[o]
              // total += obj2[o][0]['e_sc']
              total += obj2[o].reduce((accumulator: any, object: any) => {
                return accumulator + object.e_sc;
              }, 0);
            } else if (m !== o && obj3[m] === undefined) {
              obj3[m] = 0
            }
          })
        })
        // console.log(arr[key][0].unitName, total)
        arr2.push({ unit: arr[key][0].unitName,data: [obj3], total: total.toFixed(4)})
      })
      arr2 = arr2.map((arr) => {
        this.cols = []
        // this.cols.push({ field: 'parameter', header: 'Parameter' })
        Object.keys(this.months).forEach(key => {
          this.cols.push({ field: key, header: this.months[key] })
        })
        arr['columns'] = this.cols
        return arr
      })
      this.sourceDtails = arr2


    })

  }

  groupByKey(array: any[], key: string | number) {
    return array
      .reduce((hash: { [x: string]: any; }, obj: { [x: string]: string | number; }) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  }

  load(event: LazyLoadEvent) { }

  onBackClick() {
    this.router.navigate(['../'+this.backRoute],
      { queryParams: { id: this.projectId }, relativeTo: this.activatedRoute });
  }

  // async verify() {
  //   this.isVerified = true;
  //   this.verifyClicked.emit(this.project)
  // }

  // reject() {
  //   this.isVerified = true;
  //   this.rejectClicked.emit(this.project)
  // }

  formatSourceName(name: string) {
    return ((name.replace("_", " "))
      .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))
      .replace(" ", "") + 'ActivityData'
  }

  onValueClick(data: any, unit: any) {
    if (data !== 0){
      this.valueClicked.emit({ data: data[0], unit: unit, type: this.esCode , name: this.sourceName})
    }
  }
  
  onEmissionClick(source: string) {
    if (this.type === 'verification'){
      this.ref = this.dialogService.open(EquationComponent, {
        header: 'Equation for ' + source.replace('_', ' ') + ' calculation',
        width: '50%',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
        baseZIndex: 10000,
        data: source,
        closable: true
      });
    }
  }
  async getEmissionFactors(esCodes: string[], projectId: number) {
    let efs =  await this.emissionFactorServiceProxy.getEmissionFactors(esCodes, projectId).toPromise()
    console.log(efs)
    efs.forEach(ef => {
      if (ef.data !== undefined){
        ef.data = ef.data.filter((v: any,i: any,a: any[])=>a.findIndex((v2: any)=>['code','countryCode', 'id', 'year'].every(k=>v2[k] ===v[k]))===i)
        ef.data.map(async (_data: any) => {
          let industry
          if (_data.industry) industry = await this.serviceProxy.getManyBaseIndustryControllerIndustry(
            undefined, undefined, ['code||$eq||'+_data.industry], undefined, undefined, undefined, 1000, 0, 1, 0
          ).toPromise()
          if (_data.factorType === "common") this.card1.push({title: _data.name, value: _data.value})
          if (_data.factorType === "fuelSpecific") {
            this.card1.push({ title: "Net calorific value of " + _data.code.toLowerCase(), value: _data.ncv + " " + _data.unit_ncv})
            this.card1.push({ title: "Density of " + _data.code.toLowerCase(), value: _data.density + " " + _data.unit_density })
          }
          if (_data.factorType === "fuelFactor") {
            let source 
            if (_data.source === "M") source = "mobile combution"
            if (_data.source === "S") source = "stationary combution"
            this.card1.push({ title: "Emission factor for CO₂ of " + source + " of " + _data.name.toLowerCase() + (industry? " in " + industry?.data[0].name.toLowerCase() + " industry ": ""), value: _data.co2_default + " " +  _data.unit })
            this.card1.push({ title: "Emission factor for CH₄ of "+ source + " of " + _data.name.toLowerCase() + (industry? " in " + industry?.data[0].name.toLowerCase() + " industry ": ""), value: _data.ch4_default + " " +  _data.unit })
            this.card1.push({ title: "Emission factor for N₂O of " + source + " of " + _data.name.toLowerCase() + (industry? " in " + industry?.data[0].name.toLowerCase() + " industry ": ""), value: _data.n20_default + " " +  _data.unit})
          }
          if (_data.factorType === "fuelPrice"){
            this.card1.push({ title: "Fuel price of " + _data.code.toLowerCase() + " for year " + _data.year, value: _data.price + " " + _data.currency  })
          }
          if (_data.factorType === "transport") {
            this.card1.push({ title: "Emission factor for " + (_data.name.split("_").join(" ")).toLowerCase(), value: _data.kgco2ePKm + ' kgCO₂ePKm' })
          }
          if (_data.factorType === "freightWater") {
            this.card1.push({ title: "Emission factor of " + _data.activity + " for " + _data.type + " of " + _data.size, value: _data.kgco2e +  ' kg₂COe'})
          }
          if (_data.factorType === "defra"){
            let value
            if (_data.disposalMethod === 'Re-use') {value = _data['reUse']}
            else if (_data.disposalMethod === 'Open loop') {value = _data['openLoop']}
            else if (_data.disposalMethod === 'Closed-loop') {value = _data['closedLoop']}
            else if (_data.disposalMethod === 'Combusion') {value = _data['combution']}
            else if (_data.disposalMethod === 'Composting') {value = _data['composting']}
            else if (_data.disposalMethod === 'Landfill') {value = _data['landFill']}
            else if (_data.disposalMethod === 'Anaerobic digestion') {value = _data['AnaeriobicDigestions']}
            this.card1.push({ title: "Emission factor for " + (_data.code.split("_").join(" ")).toLowerCase() + " of " + _data.disposalMethod , value: value })
          }
        })
      }
    })
  }

  async evidenceCss(data: any, para: any) {
    if (data !== 0 ){
      if (data.activityDataStatus === "Evidence Pending") {
        return 'evidence-pending'
      } else if (data.activityDataStatus === "Evidence Approved") {
        return 'evidence-approved'
      } else {
        return ''
      }
    }else {
      return ''
    }
  }

  getValue(arr: any){ //,code:any
    // if (arr !== 0 ){
    //   let unitname = code+ "_unit"
    //   let unit = ''
    //   if (arr[0][unitname] !== undefined && arr[0][unitname] !== null ){
    //     let para_unit = this.masterDataService.parameterUnits[arr[0][unitname]  as keyof typeof this.masterDataService.parameterUnits]
    //     unit = para_unit? para_unit.label : arr[0][unitname]

    //   }

    //   // console.log(code, arr[0]);
    //   if (arr[0][code] !== null && arr[0][code] !== undefined){
    //     return 1*arr[0][code]?.toFixed(4) + ' ' + unit
    //   } else {
    //     return '-'
    //   }
    // }

    if (arr !== 0) {
      let emission = 0
      arr.forEach((o: any) => {
        emission += o.e_sc
      })
      if (emission > 0) {
        return emission.toFixed(4)
      } else {
        return '-'
      }
    }
    return '-'
  }

  setCursor(type?: string){
    if (type === 'eqn'){
      if (this.type === 'verification'){
        return 'pointer'
      } else {
        return ''
      }
    } else  {
      return ''
    }
  }

}
