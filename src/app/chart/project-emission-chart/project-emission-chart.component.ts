import { getLocaleDateFormat } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { AppService } from 'shared/AppService';
import { ByUnitIdsDto } from 'shared/service-proxies/service-proxies';
import { ProjectType, ProjectTypeDto, ProjectUnitControllerServiceProxy, ProjectUnitEmissionSourceClasification, ProjectUnitEmissionSourceControllerServiceProxy, ServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-project-emission-chart',
  templateUrl: './project-emission-chart.component.html',
  styleUrls: ['./project-emission-chart.component.css']
})
export class ProjectEmissionChartComponent implements OnInit {

  @Input() unitId: number
  @Input() projectType: any
  @Input() isAll: boolean = false;



  stackedData: any;

  stackedOptions: any;
  projectEmissions: any = {}
  generating: boolean = false

  public labels: any[] = []
  public directData: any[] = []
  public indirectData:any[] = []
  public otherData: any[] = []

  constructor(
    private puesServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private projectAndSelectService: ProjectAndSelectService,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private projectUnitControllerServiceProxy: ProjectUnitControllerServiceProxy,
    private appService: AppService
  ) { }

  async ngOnInit(): Promise<void> {
  }

  changeMainLoadingStatus(state: boolean){
    this.appService.setEnableSpinner(state,'')
  }

  async getProjectData(){ // TODO: move to back-end
    // this.changeMainLoadingStatus(false);
    this.emptyVariables()
    this.generating = true

    let unitFilter;
    let puIds:number[] = [];

    if (this.isAll){
      unitFilter = ['unit.id||$ne||-1']
      let projectUnits = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
          ["id"], undefined, unitFilter, undefined, 
          undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
      puIds = projectUnits.data.map((pu: { id: number }) => {return pu.id})
    } else {
      let unitIds = await this.unitControllerServiceProxy.getChildUnitIds(this.unitId).toPromise()
      unitIds.push(this.unitId)
      let req = new ByUnitIdsDto();
      req.unitIds = unitIds;
      let res = await this.projectUnitControllerServiceProxy.getProjectUnitsByUntIds(req).toPromise();
      puIds = res.map(r => r.id)
    }
  
    let pt = new ProjectTypeDto()
    pt.unitIds = puIds
    pt.projectType = this.projectType
    let res = await this.puesServiceProxy.getSumForProjectUnits(pt).toPromise(); // TODO: change with get meny

    res.map((ele: any) => {
      if (ele.year && Object.keys(this.projectEmissions).includes(ele.year.toString())) {
        this.projectEmissions[ele.year].push({ type: "direct", data: ele.directEmission })
        this.projectEmissions[ele.year].push({ type: "indirect", data: ele.indirectEmission })
        this.projectEmissions[ele.year].push({ type: "other", data: ele.otherEmission})
      } else {
        this.projectEmissions[ele.year] = [{ type: "direct", data: ele.directEmission }]
        this.projectEmissions[ele.year].push({ type: "indirect", data: ele.indirectEmission  })
        this.projectEmissions[ele.year].push({ type: "other", data: ele.otherEmission })
      }
    })
    // Promise.all(
      
    // ).then(_ => {
      Object.fromEntries(Object.entries(this.projectEmissions).sort())

      for (const [key, value] of Object.entries(this.projectEmissions)) {
        this.labels.push(key)
        let direct = 0; let indirect = 0; let other = 0;
        this.projectEmissions[key].forEach((p: { type: string; data: number; }) => {
          if (p.type === "direct") {
            direct += p.data
          } else if (p.type === "indirect") {
            indirect += p.data
          } else {
            other += p.data
          }
        })
        this.directData.push(direct)
        this.indirectData.push(indirect)
        this.otherData.push(other)
      }


      this.stackedData = {
        labels: this.labels,
        datasets: [{
          type: 'bar',
          label: 'Direct',
          backgroundColor: '#42A5F5',
          data: this.directData
        }, {
          type: 'bar',
          label: 'Indirect',
          backgroundColor: '#66BB6A',
          data: this.indirectData
        },
        {
          type: 'bar',
          label: 'Other',
          backgroundColor: '#EAE509',
          data: this.otherData
        }]
      };

      this.stackedOptions = {
        maxBarThickness: 70,
        tooltips: {
          mode: 'index',
          intersect: false
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Financial Year',
              font: {
                size: 12
              }
            }
          },
          y: {
            stacked: true,
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
            anchor: 'center',
            align: 'center',
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
    // })

  }

  emptyVariables(){
    for (const prop of Object.getOwnPropertyNames(this.projectEmissions)) {
      delete this.projectEmissions[prop];
    }
    this.labels = []
    this.directData= []
    this.indirectData = []
    this.otherData = []

    this.stackedData = {
      ...this.stackedData,
      datasets: [{
        type: 'bar',
        label: 'Direct',
        backgroundColor: '#42A5F5',
        data: this.directData
      }, {
        type: 'bar',
        label: 'Indirect',
        backgroundColor: '#66BB6A',
        data: this.indirectData
      },
      {
        type: 'bar',
        label: 'Other',
        backgroundColor: '#EAE509',
        data: this.otherData
      }]
    };
  }

  async ngOnChanges(){
    if (!this.generating && this.unitId !== undefined && this.projectType !== undefined){
      this.emptyVariables()
      await this.getProjectData()
    }
  }



  

}
