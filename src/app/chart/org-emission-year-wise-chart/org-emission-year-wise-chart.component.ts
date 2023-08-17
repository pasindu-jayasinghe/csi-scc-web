import { Component, Input, OnInit } from '@angular/core';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ProjectControllerServiceProxy, ProjectTypeDto, ProjectUnitEmissionSourceControllerServiceProxy, ServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-org-emission-year-wise-chart',
  templateUrl: './org-emission-year-wise-chart.component.html',
  styleUrls: ['./org-emission-year-wise-chart.component.css']
})
export class OrgEmissionYearWiseChartComponent implements OnInit {

  @Input() unitId: number
  @Input() projectType: any

  basicData: any;
  basicOptions: any;

  data: any = {}
  labels: string[] = []
  _data: any[] = []

  generating: boolean = false

  constructor(
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private projectAndSelectService: ProjectAndSelectService,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private puesControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy
  ) { }

  ngOnInit(): void {
  }

  async ngOnChanges() {
    if (this.projectType !== undefined && !this.generating){
      await this.getData()
    }
  }

  async getData() {
    this.emptyVariables()

    this.generating = true
    let res = await this.unitControllerServiceProxy.getChildUnits(this.unitId).toPromise()
    let unitIds = res.map(u => {return (u.id).toString()})
    unitIds.push(this.unitId.toString())
    // let emissions =  await this.projectControllerServiceProxy.getOrgEmissions(unitIds, this.projectType).toPromise()
    let unitFilter = ['unit.id||$in||' + unitIds]
    let projectUnits = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit( 
      undefined, undefined, unitFilter, undefined,
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()
    let puIds = projectUnits.data.map(pu => { return pu.id })
    if (puIds.length > 0){
      let pt = new ProjectTypeDto()
      pt.unitIds = puIds
      pt.projectType = this.projectType
      let e = await this.puesControllerServiceProxy.getSumForProjectUnits(pt).toPromise()
      e.forEach((ele: any) => {
        if (Object.keys(this.data).includes((ele.year))){
          this.data[ele.year] += ele.directEmission + ele.indirectEmission + ele.otherEmission
        } else {
          this.labels.push(ele.year)
          this.data[ele.year] = ele.directEmission + ele.indirectEmission + ele.otherEmission
        }
      })
    }


    this._data = []
    this.labels.forEach(l => {
      this._data.push(this.data[l])
    })

    this.basicData = {
      labels: this.labels,
      datasets: [
        {
          backgroundColor: ['#42A5F5','#808000','#00FF00','#008000'],
          data: this._data
        },
      ]
    };
    this.basicOptions = {
      maxBarThickness: 70,
      indexAxis: 'x',
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Years',
            font: {
              size: 12
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'GHG Emission (tCO₂e) ',
            font: {
              size: 12
            }
          }
        },
        
      },
      plugins: {
        legend: {display: false},
        title: {
          display: true,
          text: 'GHG emission: Over Years',
          font: {
            size: 24
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: function(value: number, context: { dataIndex: string; }) {
            if (value === 0){
              return ''
            }else {
              return value.toFixed(3);
            }
          },
          font: {
            weight: 'bold',
            size: 14
          }
        }
      }
    };
    this.generating = false
  }

  emptyVariables() {
    this.labels = []
    for (const prop of Object.getOwnPropertyNames(this.data)) {
      delete this.data[prop];
    }
    this._data = []

    this.basicData = {
      ...this.basicData,
      datasets: [
        {
          backgroundColor: ['#42A5F5','#808000','#00FF00','#008000'],
          data: this._data
        },
      ]
    };
  }

}
