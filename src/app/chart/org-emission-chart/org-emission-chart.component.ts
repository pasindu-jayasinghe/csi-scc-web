import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ProjectControllerServiceProxy, ProjectTypeDto, ProjectUnitEmissionSourceControllerServiceProxy, ServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-org-emission-chart',
  templateUrl: './org-emission-chart.component.html',
  styleUrls: ['./org-emission-chart.component.css']
})
export class OrgEmissionChartComponent implements OnInit, OnChanges {

  @Input() unitId: number
  @Input() projectType: any

  basicData: any;
  basicOptions: any;

  data: number[] = []

  direct: number = 0
  indirect: number = 0 
  other: number = 0

  generating: boolean = false
  activeYear:string = ''

  constructor(
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private puesControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private serviceProxy: ServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
  }

  async ngOnChanges() {
    if (!this.generating && this.projectType !== undefined){
      await this.getData()
    }
  }

  /**
   * Chart logic => get all childs of selected unit -> get total emission for those project units for the latest year. 
   * latest year get from the all the projects of these project units.
   */
  async getData() {
    this.emptyVariables()
    this.generating = true

    let res = await this.unitControllerServiceProxy.getChildUnits(this.unitId).toPromise()
    let unitIds = res.map(u => { return (u.id) })
    unitIds.push(this.unitId)
    // let emissions =  await this.projectControllerServiceProxy.getOrgEmissions(unitIds, this.projectType).toPromise()
    let unitFilter = ['unit.id||$in||' + unitIds]
    let projectUnits = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit( // how to find active projects
      undefined, undefined, unitFilter, undefined,
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()
    let puIds = projectUnits.data.map(pu => { return pu.id })
    if (puIds.length > 0){
      let pt = new ProjectTypeDto()
      pt.unitIds = puIds
      pt.projectType = this.projectType
      let e = await this.puesControllerServiceProxy.getSumForProjectUnitsForOrgDashboard(pt).toPromise()
  
      this.direct = e.sum.direct
      this.indirect = e.sum.indirect
      this.other = e.sum.other

      this.activeYear = e.activeYear
    }

    this.basicData = {
      labels: ['Direct', 'Indirect', 'Other'],
      datasets: [
        {
          backgroundColor: ['#42A5F5','#00FFFF','#008080'],
          data: [this.direct, this.indirect, this.other]
        }
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
            text: '',
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
          text: 'Organization GHG emission for year ' + this.activeYear,
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
    this.data = []
    this.direct = 0
    this.indirect = 0
    this.other = 0

    this.basicData = {
      ...this.basicData,
      datasets: [
        {
          backgroundColor: ['#42A5F5','#00FFFF','#008080'],
          data: [this.direct, this.indirect, this.other]
        }
      ]
    };
  }

}
