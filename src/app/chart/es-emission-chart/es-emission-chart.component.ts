import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EmpcomCalculationService } from 'app/shared/empcom-calculation.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { AppService, ProjectTypes, RecordStatus } from 'shared/AppService';
import { ByProjectUnitIdsDto } from 'shared/service-proxies/service-proxies';
import { ProjectUnitEmissionSourceControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { ProjectType, ProjectTypeDto, ProjectUnitControllerServiceProxy, ServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-es-emission-chart',
  templateUrl: './es-emission-chart.component.html',
  styleUrls: ['./es-emission-chart.component.css']
})
export class EsEmissionChartComponent implements OnInit, OnChanges {

  @Input() unitId: number
  @Input() projectType: any
  @Input() isAll: boolean = false


  basicData: any;

  basicOptions: any;

  esData: any = {}
  labels: any[] = []
  dataSets: any[] = []
  data: any = {}
  years: any[] = []

  noData: boolean = false
  generating: boolean = false

  gloableProjectType: ProjectTypes;

  constructor(
    private serviceProxy: ServiceProxy,
    private puServiceProxy: ProjectUnitControllerServiceProxy,
    private projectAndSelectService: ProjectAndSelectService,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private appService: AppService,
    private empCal: EmpcomCalculationService,

  ) { }

  async ngOnChanges() {
    console.log("obchnge", this.unitId)

    this.noData = false
    if (!this.generating && this.projectType !== undefined) {
      await this.getESData()
    }
  }


  changeMainLoadingStatus(state: boolean) {
    this.appService.setEnableSpinner(state, '')
  }

  async ngOnInit(): Promise<void> {
    this.appService.projectType.subscribe(p => {
      this.emptyVariables()
      this.gloableProjectType = p;    
      if (!this.generating && this.projectType !== undefined) {
        this.getESData()
      }
    });
  }

  toTitleCase(str: string) {
    let a = str.toLowerCase().split(' ');
    for (var i = 0; i < a.length; i++) {
      a[i] = a[i].charAt(0).toUpperCase() + a[i].slice(1);
    }
    return a.join(' ');
  }

  async getESData() {
    // this.changeMainLoadingStatus(false);
    this.emptyVariables()
    if (this.projectType !== undefined) {
      this.generating = true
    } else {
      this.generating = false
    }
    let projectUnits = [];
    let res
    if (this.isAll) {
      res = (await this.serviceProxy.getManyBaseUnitControllerUnit(
        ["id"], undefined, ['id||$ne||-1'], undefined, undefined, undefined, 3000, 0, 1, 0
      ).toPromise()).data.map(u => { return u.id });
    } else {
      res = await this.unitControllerServiceProxy.getChildUnitIds(this.unitId).toPromise()
    }
    let unitIds: number[] = res
    unitIds.push(this.unitId)
    if (unitIds.length === 1) unitIds.push(this.unitId);


    try {
      let pt = new ProjectTypeDto()
      pt.unitIds = unitIds
      pt.projectType = this.projectType

      let res = await this.projectUnitEmissionSourceControllerServiceProxy.esEmissionChartData(pt).toPromise();
      if(res){
        this.esData = res.esData;
        this.years = res.years;
      }

      // projectUnits = await this.puServiceProxy.getProjectUnitByProjectType(pt).toPromise()
    } catch (error) {
      console.log("catch error", error)
    }

      let savedEs = this.appService.getEsList();
      if(savedEs && savedEs.length >0 ){
        this.labels = Object.keys(this.esData).map((d: string) => {
          let es =savedEs.find(e => e.code === d);
          if(this.gloableProjectType === ProjectTypes.GHG){
            return es?.name
          }else{
            return es?.sbtName
          }
        })
      }else{
        let res=  await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
          undefined,
          undefined,
          ['status||$ne||' + RecordStatus.Deleted],
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0
        ).toPromise();
        this.appService.setEsList(res.data);
        this.labels = Object.keys(this.esData).map((d: string) => {
          let es = res.data.find(e => e.code === d);
          if(this.gloableProjectType === ProjectTypes.GHG){
            return es?.name
          }else{
            return es?.sbtName
          }
        })
      }

      // this.labels = Object.keys(this.esData).map((d: string) => this.toTitleCase(d.replace('_', ' '))) // TODO: get es name as in the DB

      this.years.map(year => {
        this.dataSets.push({
          label: year,
          backgroundColor: this.randColor(),
          data: []
        })
      })

      for (const [key, value] of Object.entries(this.esData)) {
        const res = Array.from(this.esData[key].reduce(
          (m: any, { year, data }: any) => m.set(year, (m.get(year) || 0) + data), new Map
        ), ([year, data]) => ({ year, data }));
        this.esData[key] = res
        let y = Array.from(new Set(this.esData[key].map(({ year }: any) => year)));
        res.forEach(obj => {
          this.dataSets.forEach(data => {
            if (y.includes(data.label) && data.label === obj.year) {
              // data.data.push(obj.data) // uncomment this line and comment folloeing line to get minus values as well
              data.data.push((obj.data < 0 ? 0 : obj.data)) // removed minus values
            }
            if (!y.includes(data.label)) {
              data.data.push(0)
            }
          })
        })
      }

      // console.log("esssssss", this.esData.passenger_road)
      // console.log("eeeee", ss)


      // console.log("jjj",this.dataSets)
      this.basicData = {
        labels: this.labels,
        datasets: this.dataSets
      };

      this.basicOptions = {
        maxBarThickness: 70,
        indexAxis: 'y',
        tooltips: {
          mode: 'index',
          intersect: false
        },
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Total GHG Emission (tCO₂e)',
              font: {
                size: 12
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Emission Sources',
              font: {
                size: 12
              }
            }
          },

        },
        plugins: {
          title: {
            display: true,
            text: 'GHG emission for the source by inventory years',
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
                return value.toFixed(3);
              }
            },
            font: {
              weight: 'bold',
              size: 8
            }
          }
        }
      };

      // this.changeMainLoadingStatus(true);
    // } else {
    //   this.noData = true
    // }
    this.generating = false;

  }

  emptyVariables() {
    this.labels = []
    this.dataSets = []
    this.years = []
    for (const prop of Object.getOwnPropertyNames(this.esData)) {
      delete this.esData[prop];
    }
    for (const prop of Object.getOwnPropertyNames(this.data)) {
      delete this.data[prop];
    }

    this.basicData = {
      labels: this.labels,
      datasets: this.dataSets
    };


  }

  randColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  }
}

