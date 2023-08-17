import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { Message, MessageService } from 'primeng/api';
import { ProjectControllerServiceProxy, ProjectTypeDto, ProjectUnitEmissionSourceControllerServiceProxy, ServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-target-vs-actual-chart',
  templateUrl: './target-vs-actual-chart.component.html',
  styleUrls: ['./target-vs-actual-chart.component.css']
})
export class TargetVsActualChartComponent implements OnInit, OnChanges {

  @Input() unitId: number
  @Input() projectType: any

  msgs1: Message[];

  basicData: any = {};
  basicOptions: any = {
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
  };

  data: number[] = [];
  real: number = 0;
  target:number = 0;

  generating: boolean = false
  nodata: boolean = false
  activeYear: string = ''

  constructor(
    private serviceproxy: ServiceProxy,
    private projectControllerServiceProxy: ProjectControllerServiceProxy,
    private projectAndSelectService: ProjectAndSelectService,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private messageService: MessageService,
    private puesControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
  ) { }

  ngOnInit(): void {
  }

  async ngOnChanges() {
    this.real = 0
    this.target = 0
    this.nodata = false
    if(!this.generating && this.projectType !== undefined){
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
    let projectUnits = await this.serviceproxy.getManyBaseProjectUnitControllerProjectUnit( // how to find active projects
      undefined, undefined, unitFilter, undefined,
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()
    let puIds = projectUnits.data.map(pu => { return pu.id })
    if (puIds.length > 0){
      let pt = new ProjectTypeDto()
      pt.unitIds = puIds
      pt.projectType = this.projectType
      let e = await this.puesControllerServiceProxy.getSumForProjectUnitsForOrgDashboard(pt).toPromise()
      this.real += e.sum.direct + e.sum.indirect + e.sum.other
      this.activeYear = e.activeYear
    }


    let unitDetail = await this.serviceproxy.getManyBaseUnitDetailsControllerUnitDetails(
      undefined, undefined, ['unit.id||$eq||' + this.unitId], undefined, undefined, undefined, 1000, 0, 1, 0
    ).toPromise()

    console.log(unitDetail)

    if(unitDetail.data && unitDetail.data.length > 0){
      let udId = unitDetail.data[0].id

      let numEmp = await this.serviceproxy.getManyBaseNumEmployeesControllerNumEmployee(
        undefined, undefined, ['unitDetail.id||$eq||'+ udId, 'year||$eq||'+this.activeYear], undefined, undefined, undefined, 1000, 0, 1, 0
      ).toPromise()

      console.log(numEmp)


      if( numEmp && numEmp.data && numEmp.data.length >0){
        this.target = numEmp.data[0].target;      
      }

    }
    this.data = [this.target, this.real]
    this.basicData = {
      labels: ['Target', 'Real'],
      datasets: [
        {
          backgroundColor: ['#42A5F5','#00FFFF'],
          data: this.data
        }
      ]
    };
    this.basicOptions = {
      ...this.basicOptions,
      plugins: {
        legend: {display: false},
        title: {
          display: true,
          text: 'Target Vs. actual emission for year ' + this.activeYear,
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
            size: 8
          }
        }
      }
    }
    this.generating = false
  }

  emptyVariables() {
    this.data = []
    this.real = 0
    this.target = 0;

    this.basicData = {
      ...this.basicData,
      datasets: [
        {
          backgroundColor: '#42A5F5',
          data: this.data
        }
      ]
    }
  }

}
