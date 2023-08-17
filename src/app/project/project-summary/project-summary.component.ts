import { Component, EventEmitter, Input, DoCheck, OnInit, Output, SimpleChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivityDataService } from 'app/shared/activity-data/activity-data.service';
import { EmpcomCalculationService } from 'app/shared/empcom-calculation.service';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService, ProjectTypes } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';

import { ServiceProxy, ProjectControllerServiceProxy, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataReqDtoSourceName, ProjectEmissionFactorControllerServiceProxy, Project, ProjectStatus, EvidenceRequestControllerServiceProxy, EnableVerificationReqDto, ProjectEmissionSourceControllerServiceProxy, UnitControllerServiceProxy, UnitDetails, NumEmployeesControllerServiceProxy, EmissionSource } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-project-summary',
  templateUrl: './project-summary.component.html',
  styleUrls: ['./project-summary.component.css']
})
export class ProjectSummaryComponent implements OnInit, DoCheck {

  @Input() type: string
  @Input() title: string
  @Input() forwardRoute: string
  @Input() backRoute: string

  // @Output() verifyClicked = new EventEmitter<any>();
  // @Output() rejectClicked = new EventEmitter<any>();

  public roles = Roles
  public userActions = UserActions


  public isVerified: boolean = false;
  public isDisabled: boolean = false;

  public projectId: any;
  public summaryType: string;
  public unitId: number;
  public emissionSourceList: any[] = []

  public card1: any[] = []

  public card2: any[] = []

  public check: string = "emissionSource"
  public units: any[] = []
  public directPUnits: any[] = []
  public indirectPUnits: any[] = []
  public otherPUnits: any[] = []

  data: any;
  chartOptions: any;
  basicData: any;
  horizontalOptions: any;
  estdata: any;
  estOptions: any;
  elables: any[] = []
  edata: any[] = []
  perntage: any = []
  perntageu: any = []

  ulables: any[] = []
  udata: any[] = []

  public xldata: any[] = []
  fileName: string = 'emissionSource.xlsx';
  excellist: any[] = [];
  excelSubList: any[] = [];

  public months: any[]
  project: Project
  totalEmployees: UnitDetails;
  projectType: ProjectTypes;
  etEmissionsTotalsData: any = null;


  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public serviceProxy: ServiceProxy,
    public projectServiceProxy: ProjectControllerServiceProxy,
    public puemServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    public projectemissionSourceProxy:ProjectEmissionSourceControllerServiceProxy,
    public masterDataService: MasterDataService,
    private activityDataService: ActivityDataService,
    private emissionFactorServiceProxy: ProjectEmissionFactorControllerServiceProxy,
    private messageService: MessageService,
    private evidenceRequestControllerServiceProxy: EvidenceRequestControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private empCal:EmpcomCalculationService,
    public appService: AppService,
    private differs: KeyValueDiffers
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.appService.projectType.subscribe(p => {
      this.projectType = p;
      this.generateEmissionPieChart()
      this.generateEmissionBarChart()
      this.updateTotalEmissionChart();
    });

    if (this.type === undefined) this.type = "summary";
    if (this.title === undefined) this.title = "Project Summary - Emission"
    if (this.forwardRoute === undefined) this.forwardRoute = "emission-source-summary"
    if (this.backRoute === undefined) this.backRoute = "list"


    this.months = this.masterDataService.months

    await this.generateTabledata()

    this.project = await this.serviceProxy.getOneBaseProjectControllerProject(this.projectId, undefined, undefined, undefined).toPromise();


  }

  async enableVerification(){
    if ([ProjectStatus.Verified, ProjectStatus.Unverified, ProjectStatus.Closed].includes(this.project.projectStatus)) {
      this.isVerified = true
      // this.isDisabled = true
    } else {
      let esCodes = this.emissionSourceList.map(m => {return m.es.code})
  
      let req = new EnableVerificationReqDto()
      req.esCodes = esCodes
      req.projectId = this.project.id
      let res = await this.evidenceRequestControllerServiceProxy.enableVerification(req).toPromise()
      console.log("enableVerification", res)
      this.isDisabled = !res.isEnables
      console.log("mmmmmmmm---",this.emissionSourceList)

    }

  }

  randColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  }


  generateEmissionPieChart() {

    this.getElabels();
    let backgroundColor: string[] = []
    let hoverColor: string[] = []

    this.elables.forEach(l => {
      backgroundColor.push(this.randColor());
      hoverColor.push(this.randColor())
    })

    this.data = {
      labels: this.elables,
      datasets: [
        {
          data: this.perntage,
          backgroundColor: backgroundColor,
          hoverBackgroundColor: hoverColor
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          },
          position: 'bottom',
        },
        datalabels: {
          anchor: 'center',
          align: 'center',
          formatter: function (value: number, context: { dataIndex: string; }) {
            if (value === 0) {
              return ''
            } else {
              return value + "%";
            }
          },
          font: {
            weight: 'bold',
            size: 14
          },
          display: 'auto'
        },
        tooltip: {
          enabled: true,
          intersect: false,
          mode: 'nearest',
          callbacks: {
            title: (context: any) => { return context[0]?.label || '' },
            label: (item: { parsed: string; }) => parseFloat(item.parsed).toFixed(3) + '%'
          },
        }
      }
    }
  }

  generateEmissionBarChart() {
    this.getElabels();
    this.basicData = {
      labels: this.elables,
      datasets: [
        {
          label: 'Emission',
          backgroundColor: '#42A5F5',
          data: this.edata
        }
      ]
    };
    this.horizontalOptions = {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          },
          display: false
        },
        datalabels: {
          anchor: 'end',
          align: 'right',
          formatter: function (value: number, context: { dataIndex: string; }) {
            if (value === 0) {
              return ''
            } else {
              return (typeof value === 'string') ? parseFloat(value).toFixed(4) : value.toFixed(4);
            }
          },
          font: {
            weight: 'bold',
            size: 14
          }
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      },
      maxBarThickness: 10,
    };
  }

  generateUnitPieChart() {
    let backgroundColor: string[] = []
    let hoverColor: string[] = []

    this.ulables.forEach(l => {
      backgroundColor.push(this.randColor());
      hoverColor.push(this.randColor())
    })

    this.data = {
      labels: this.ulables,
      datasets: [
        {
          data: this.perntageu,
          backgroundColor: backgroundColor,
          hoverBackgroundColor: hoverColor
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          },
          position: 'bottom',
        },
        datalabels: {
          anchor: 'center',
          align: 'center',
          formatter: function (value: number, context: { dataIndex: string; }) {
            if (value === 0) {
              return ''
            } else {
              return value + "%";
            }
          },
          font: {
            weight: 'bold',
            size: 14
          },
          display: 'auto'
        },
        tooltip: {
          enabled: true,
          intersect: false,
          mode: 'nearest',
          callbacks: {
            title: (context: any) => { return context[0]?.label || '' },
            label: (item: { parsed: string; }) => parseFloat(item.parsed).toFixed(3) + '%'
          },
        }
      }
    }
  }

  generateUnitBarChart() {
    this.basicData = {
      labels: this.ulables,
      datasets: [
        {
          label: 'Emission',
          backgroundColor: '#42A5F5',
          data: this.udata
        }
      ]
    };
    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          },
          display: false
        },
        datalabels: {
          anchor: 'end',
          align: 'right',
          display: false,
          formatter: function (value: number, context: { dataIndex: string; }) {
            if (value === 0) {
              return ''
            } else {
              return value.toFixed(4);
            }
          },
          font: {
            weight: 'bold',
            size: 14
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      },
      maxBarThickness: 10,
    };
  }

  updateTotalEmissionChart(){
    if(this.etEmissionsTotalsData){
      let res = this.etEmissionsTotalsData;
      let emissions = []
      let directtotal = []
      let indirecttotal = []
      let othertotal = []
      for (let emission of res) {
        if(this.projectType === ProjectTypes.GHG){
          emissions.push(emission.emissionSourseName)
        }else{
          emissions.push(emission.sbtSourseName)
        }
        directtotal.push(emission.directEmission ? emission.directEmission : 0)
        indirecttotal.push(emission.indirectEmission ? emission.indirectEmission : 0)
        othertotal.push(emission.otherEmission ? emission.otherEmission : 0)
      }
      this.estdata = {
        labels: emissions,
        datasets: [
          {
            label: 'Direct',
            backgroundColor: '#42A5F5',
            data: directtotal
          },
          {
            label: 'Indirect',
            backgroundColor: '#FFA726',
            data: indirecttotal
          },
          {
            label: 'Other',
            backgroundColor: '#2596be',
            data: othertotal
          }
        ]
      };
    }
  }

  generateTotalEmissionChart() {
    this.projectemissionSourceProxy.etEmissionsTotals(this.projectId).subscribe(res => {
      this.etEmissionsTotalsData = res;
      this.updateTotalEmissionChart();
    }, err => {
    })

    this.estOptions = {
      indexAxis: 'y',
      maxBarThickness: 20,
      tooltips: {
        mode: 'index',
        intersect: false
      },
     
     
     

     
      responsive: true,
      scales: {
        x: {
          // stacked: true,
          title: {
            display: true,
            text: 'Financial Year',
            font: {
              size: 12
            }
          }
        },
        y: {
          // stacked: true,
          title: {
            display: true,
            text: 'Total GHG Emission (tCO₂e)',
            font: {
              size: 12
            }
          }
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'GHG emissions for the inventory',
          font: {
            size: 24
          }
        },
        legend: {
          labels: {
            color: '#495057'
          },
          position: 'bottom',
        },
        datalabels: {
          anchor: 'end',
          align: 'right',
          formatter: function (value: number, context: { dataIndex: string; }) {
            if (value === 0) {
              return ''
            } else {
              return value.toFixed(4);
            }
          },
          font: {
            weight: 'bold',
            size: 14
          }
        },

      }
    }
  }

  async generateTabledata() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.projectId = params['id'];
      if (params['type']) this.summaryType = params['type']
      if (params['unitId']) this.unitId = params['unitId']

      let project = await this.serviceProxy.getOneBaseProjectControllerProject(this.projectId, undefined, undefined, undefined).toPromise();
      this.card1 = [
        { title: "Unit Name", value: project.ownerUnit.name },
        { title: "Year", value: project.year },
        { title: "Project Name", value: project.name },
        { title: "Project Type", value: project.projectType.name },
        { title: "Methodology", value: project.methodology.name },
        { title: "Number of Units Assigned", value: project.projectUnits.length },
        { title: "Emission Sources Assigned ", value: project.projectEmissionSources.length },
        { title: "Status ", value: project.projectStatus }
      ]

      this.card2 = [
        { title: "Direct Emission", value: project.directEmission.toFixed(4) + ' tCO₂e' },
        { title: "Indirect Emission", value: project.indirectEmission.toFixed(4) + ' tCO₂e' },
        { title: "Other Emission", value: project.otherEmission.toFixed(4) + ' tCO₂e' },
        { title: "Total Emission", value: (project.directEmission + project.indirectEmission + project.otherEmission).toFixed(4) + ' tCO₂e' }
      ]

      // this.units = projectUnits.data.map(pu => pu.unit)
      this.units = await this.puemServiceProxy.getPUESAndUnit(project.id).toPromise()
console.log(this.units);
      await Promise.all(
        this.units.map(async _unit => {
          return _unit
        })
      ).then(res => {
        this.units.map(_unit => {
          this.ulables.push(_unit.unit_name)
          this.udata.push((_unit.total < 0 ? 0 : _unit.total)) //remove the conditional check to get minus values
        })
      })


      let sumu: number = 0;
      this.udata.forEach(a => sumu += +a);
      console.log('uu', this.udata);

      console.log(sumu);

      for (let a of this.udata) {
        this.perntageu.push((a / sumu * 100).toFixed(3))
      }

      this.projectServiceProxy.getProjectEmissionSources(this.projectId)
        .subscribe(async res => {
          let sourceList = res
          await Promise.all(
            sourceList.map(async (source: any) => {
              return source
            })
          ).then(async res => {
            this.emissionSourceList = res
            console.log("lllllll",this.emissionSourceList)

            this.emissionSourceList.map(source => {

              let name= "";
              if(this.projectType === ProjectTypes.GHG){
                name = source.es.name.charAt(0).toUpperCase() + source.es.name.slice(1)
              }else{
                name = source.es.sbtName? source.es.sbtName : ''
              }
              this.elables.push(name)
              this.edata.push((source.total < 0 ? 0 : source.total)) //remove the conditional check to get minus values
            })

            if (this.type === 'verification') await this.enableVerification()

            console.log('edata-----', this.edata)
            let sum: number = 0;
            this.edata.forEach(a => sum += +a);
            console.log(sum);

            for (let a of this.edata) {
              this.perntage.push((a / sum * 100).toFixed(3))
            }

            console.log("pppp", this.perntage)
            this.generateEmissionPieChart()
            this.generateEmissionBarChart()
            this.generateTotalEmissionChart()
          })
        })

    })

  }

  ngDoCheck(): void {
    
  }

  getElabels(){
    this.elables = [];
    this.emissionSourceList.map(source => {
      let name= "";
      if(this.projectType === ProjectTypes.GHG){
        name = source.es.name.charAt(0).toUpperCase() + source.es.name.slice(1)
      }else{
        name = source.es.sbtName? source.es.sbtName : ''
      }
      this.elables.push(name)
    }) 
  }

  getName(es: EmissionSource){
    if(this.projectType === ProjectTypes.GHG){
      return es.name
    }else{
      return es.sbtName
    }
  }
  
  load(event: LazyLoadEvent) { }

  view(id: number) {
    this.router.navigate(['../' + this.forwardRoute],
      {
        queryParams: { id: id, projectId: this.projectId, type: this.summaryType, unitId: this.unitId },
        state: { user: 1 },
        relativeTo: this.activatedRoute
      });
  }

  viewUnit(id: number, emission: number) {
    this.router.navigate(['../unit-summary'],
      {
        queryParams: { id: id, projectId: this.projectId, emission: emission },
        relativeTo: this.activatedRoute
      });
  }

  onBackClick() {
    console.log(this.summaryType)
    if (this.summaryType === 'org-summary') {
      this.router.navigate(['../../summary'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['../' + this.backRoute], { relativeTo: this.activatedRoute });
    }
  }

  async downloadExcel() {
    let classifications = [
      { name: "Direct", var: "direct" },
      { name: "Indirect", var: "indirect" },
      { name: "Other", var: "other" }
    ]


    // console.log("cdklmldfmlkmkl ",this.emissionSourceList);

    classifications.forEach(cl => {
      this.emissionSourceList.forEach(source => {

        if (source[cl.var] !== 0) {
          let obj: excelData =
          {
            Category: '',
            Emission_Source: '',
            Emission: ''
          }
          obj.Category = cl.name;
          obj.Emission_Source = source.es.name;
          obj.Emission = source[cl.var];

          // console.log(obj);
          this.excellist.push(obj);
        }
      })
    })
    // console.log(this.excellist);
    await this.getActivityDataDetails()

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.card1, { skipHeader: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.utils.sheet_add_json(ws, this.excellist, { skipHeader: false, origin: "A" + (this.card1.length + 3) });

    // console.log(this.excelSubList);
    this.excelSubList.forEach(_data => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      let len = 1
      _data.data.forEach((ele: any) => {
        XLSX.utils.sheet_add_json(ws, [{ title: ele.unit }], { skipHeader: true, origin: "A" + len });
        XLSX.utils.sheet_add_json(ws, ele.data, { skipHeader: false, origin: "A" + ++len });
        len = len + ele.data.length + 2
      })
      XLSX.utils.book_append_sheet(wb, ws, _data.sheet);
      XLSX.utils.sheet_add_json(ws, [{ title: "Emission Factors" }], { skipHeader: true, origin: "A" + (len + 3) });
      XLSX.utils.sheet_add_json(ws, _data.ef, { skipHeader: false, origin: "A" + (len + 4) });
    })

    XLSX.writeFile(wb, this.fileName);
    this.excellist = []
    this.excelSubList = []
  }

  async getActivityDataDetails() {
    return await Promise.all(
      this.emissionSourceList.map(async (source) => {
        let filter = ['project.id||$eq||' + this.projectId];
        let data = await this.activityDataService.getManyActivityData(filter, source.es.code);;
        if (data !== undefined && data.data.length > 0) {
          this.excelSubList.push(await this.organiseActivityData(data, source.es.code))
        }
      })
    )
  }

  async organiseActivityData(data: any, source: PuesDataReqDtoSourceName) {
    let filter = ['source.code||$eq||' + source]
    let parametres = await this.serviceProxy.getManyBaseParameterControllerParameter(
      undefined, undefined, filter, undefined, undefined, ['source'], 1000, 0, 1, 0
    ).toPromise()
    let ad: any[] = []
    let ef: any[] = await this.getEmissionFactors([source.toString()], this.projectId)
    type ExtractStringPropertyNames<T> = {
      [K in keyof T]: T[K] extends string ? K : never
    }[keyof T]

    type STRING_KEYS = ExtractStringPropertyNames<execlActivityData>;

    let unitData: { unit: any; unitName: any; data: any; }[] = []

    data.data.forEach((_data: any) => {
      unitData.push({
        unit: _data.unit.id,
        unitName: _data.unit.name,
        data: _data
      })
    })


    let res = this.groupByKey(unitData, 'unit')
    Object.keys(res).forEach((key, idx) => {
      let units = {}
      let unitName = res[key][0].unitName
      let temp: { 'Data/Month': string; January: number; February: number; March: number; April: number; May: number; June: number; July: number; August: number; September: number; October: number; November: number; December: number; All: number; }[] = []
      // parametres.data.forEach(para => {
        let obj = {
          'Data/Month': '',
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0,
          All: 0,
        }

        res[key].forEach((_data: any) => {
          let month = this.months.find(o => o.value === _data.data.month)
          const key: STRING_KEYS = month.name;
          // obj['Data/Month'] = para.name
          // obj[key] = _data.data[para.code]
          obj['Data/Month'] = "Monthly Emission (tCO₂e)"
          obj[key] += _data.data.e_sc
        })

        // data.data.forEach((_data: any) => {
        //   let month = this.months.find(o => o.value === _data.month)
        //   const key: STRING_KEYS = month.name;
        //   obj['Data/Month'] = para.name
        //   obj[key] = _data[para.code]
        // })
        temp.push(obj)
      // })
      ad.push({ unit: unitName, data: temp })
    })
    return {
      sheet: source,
      data: ad,
      ef: ef
    }
  }

  async getEmissionFactors(esCodes: string[], projectId: number) {
    let factors: any[] = []
    let efs = await this.emissionFactorServiceProxy.getEmissionFactors(esCodes, projectId).toPromise()
    efs.forEach(ef => {
      if (ef.data !== undefined) {
        ef.data.map((_data: any) => {
          if (_data.factorType === "common") factors.push({ "Emission Factor": _data.name, Value: _data.value })
          if (_data.factorType === "fuelSpecific") {
            factors.push({ "Emission Factor": "Net calorific value of " + _data.code.toLowerCase(), Value: _data.ncv })
            factors.push({ "Emission Factor": "Density of " + _data.code.toLowerCase(), Value: _data.density })
          }
          if (_data.factorType === "fuelFactor") {
            let source
            if (_data.source === "M") source = "mobile combution"
            if (_data.source === "S") source = "stationary combution"
            factors.push({ "Emission Factor": "Emission factor for CO₂ of " + source + " of " + _data.name, Value: _data.co2_default })
            factors.push({ "Emission Factor": "Emission factor for CH₄ of " + source + " of " + _data.name, Value: _data.ch4_default })
            factors.push({ "Emission Factor": "Emission factor for N₂O of " + source + " of " + _data.name, Value: _data.n20_default })
          }
          if (_data.factorType === "fuelPrice") {
            factors.push({ "Emission Factor": "Fuel price of " + _data.code.toLowerCase() + " for year " + _data.year, Value: _data.price })
          }
          if (_data.factorType === "transport") {
            // this.card1.push({ title: "Emission factor for " + (_data.name.split("_").join(" ")).toLowerCase(), value: _data.kgco2ePKm })
            factors.push({ "Emission Factor": "Emission factor for " + (_data.name.split("_").join(" ")).toLowerCase(), value: _data.kgco2ePKm })
          }
          if (_data.factorType === "freightWater") {
            // this.card1.push({ title: "Emission factor of " + _data.activity + " for " + _data.type + " of " + _data.size, value: _data.kgco2e })
            factors.push({ "Emission Factor": "Emission factor of " + _data.activity + " for " + _data.type + " of " + _data.size, value: _data.kgco2e })
          }
          if (_data.factorType === "defra") {
            let value
            if (_data.disposalMethod === 'Re-use') { value = _data['reUse'] }
            else if (_data.disposalMethod === 'Open loop') { value = _data['openLoop'] }
            else if (_data.disposalMethod === 'Closed-loop') { value = _data['closedLoop'] }
            else if (_data.disposalMethod === 'Combusion') { value = _data['combution'] }
            else if (_data.disposalMethod === 'Composting') { value = _data['composting'] }
            else if (_data.disposalMethod === 'Landfill') { value = _data['landFill'] }
            else if (_data.disposalMethod === 'Anaerobic digestion') { value = _data['AnaeriobicDigestions'] }
            // this.card1.push({ title: "Emission factor for " + (_data.code.split("_").join(" ")).toLowerCase() + " of " + _data.disposalMethod , value: value })
            factors.push({ "Emission Factor": "Emission factor for " + (_data.code.split("_").join(" ")).toLowerCase() + " of " + _data.disposalMethod, value: value })
          }
        })
      }
    })
    return factors
  }

  groupByKey(array: any[], key: string | number) {
    return array
      .reduce((hash: { [x: string]: any; }, obj: { [x: string]: string | number; }) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  }

  async verify() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to verify the project?',
      header: 'Verification Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.project.projectStatus = ProjectStatus.Verified;

        this.serviceProxy.updateOneBaseProjectControllerProject(this.project.id, this.project)
          .subscribe(res => {
            if (res) {
              console.log('Project verified successfully')
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project verified successfully',
                closable: true,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Verification failed',
                closable: true,
              });
            }
          })
      },
      reject: () => { },
    })
  }

  reject() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject the project?',
      header: 'Reject Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.project.projectStatus = ProjectStatus.Unverified
        console.log(this.project.comment)
        if (!this.project.comment) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please add a comment before reject the project',
            closable: true,
          });
        } else {
          this.serviceProxy.updateOneBaseProjectControllerProject(this.project.id, this.project)
            .subscribe(res => {
              if (res) {
                console.log('Project rejected successfully')
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Project rejected successfully',
                  closable: true,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Verification failed',
                  closable: true,
                });
              }
            })
        }
      },
      reject: () => { },
    })
  }
}


export interface excelData {
  Category: any,
  Emission_Source: any,
  Emission: any
}

export interface execlActivityData {
  'Data/Month': any,
  January: number,
  February: number,
  March: number,
  April: number,
  May: number,
  June: number,
  July: number,
  August: number,
  September: number,
  October: number,
  November: number,
  December: number,
  All: number,
}


