import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ProjectUnitEmissionSourceControllerServiceProxy, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-es-emission-pie-chart',
  templateUrl: './es-emission-pie-chart.component.html',
  styleUrls: ['./es-emission-pie-chart.component.css']
})
export class EsEmissionPieChartComponent implements OnInit, OnChanges {

  @Input() unitId: number
  @Input() projectType: any

  basedata: any;
  chartOptions: any;

  labels: string[] = []
  data: number[] = []
  percentage:any[] = []

  generating: boolean = false
  nodata: boolean = false
  
  constructor(
    private projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private projectAndSelectService: ProjectAndSelectService,
    private unitControllerServiceProxy: UnitControllerServiceProxy
  ) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.projectType !== undefined && !this.generating){
      await this.getChartData()
    }
  }

  async ngOnInit(): Promise<void> {
    
  }

  async getChartData(){
    this.emptyVariables()
    this.generating = true
    this.nodata = false
    let res = await this.unitControllerServiceProxy.getChildUnits(this.unitId).toPromise()
    let unitIds = res.map(u => { return (u.id).toString() })
    unitIds.push(this.unitId.toString())
    if (unitIds.length === 1) unitIds.push(this.unitId.toString())
    let emission = await this.projectUnitEmissionSourceControllerServiceProxy.getOrgEmissionSourceEmissions(unitIds, this.projectType).toPromise()

    emission.emissions.forEach((ele: { name: string; emission: number; }) => {
      this.labels.push(ele.name)
      this.data.push(ele.emission)

      
     
    })

    let sum: number = 0;
      this.data.forEach((a: number) => sum += a);
    
      this.data.forEach( (value) => {
        this.percentage.push( value/sum*100 );
      }); 


    if (this.data.length !== 0){
      let backgroundColor: string[] = []
      let hoverColor: string[] = []
  
      this.labels.forEach(l => {
        backgroundColor.push(this.randColor()); 
        hoverColor.push(this.randColor())
      })
  
      this.basedata = {
        labels: this.labels,
        
        datasets: [
          {
            data: this.percentage ,
            backgroundColor: backgroundColor,
            hoverBackgroundColor: hoverColor
          }
        ],
     

      };
  
      this.chartOptions = {
        plugins: {
          legend: {
            labels: {
              color: '#495057'
            }
          },
          title: {
            display: true,
            text: 'GHG emission percentage by emission source for year ' + emission.activeYear,
            font: {
              size: 24
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'center',
            formatter: function(value: number, context: { dataIndex: string; }) {
              if (value === 0 || isNaN(value)){
                return ''
              }else {
                return value.toFixed(3) + "%";
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
              label: (item: { parsed: string; }) => (parseFloat(item.parsed) === 0 || isNaN(parseFloat(item.parsed))) ? '0%' : (parseFloat(item.parsed).toFixed(3) + '%')
            },
          }

        }
      }
    } else {
      this.nodata = true
    }

    this.generating = false
  }

  emptyVariables(){
    // for (const prop of Object.getOwnPropertyNames(this.basedata)) {
    //   delete this.basedata[prop];
    // }
    this.labels = []
    this.data= []
    this.percentage = []

    this.basedata = {
      ...this.basedata,
      datasets: [
        {
          data: this.percentage
        }
      ]
    }
  }

  randColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  }

}
