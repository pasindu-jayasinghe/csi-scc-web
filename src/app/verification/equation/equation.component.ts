import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EquationLibControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css']
})
export class EquationComponent implements OnInit {
  
  public source:  string
  public equations: any[]

  constructor(
    private equationLibControllerServiceProxy: EquationLibControllerServiceProxy,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.config.data)
    this.source = this.config.data
    await this.getEquation()
  }

  async getEquation(){
    let equation = await this.equationLibControllerServiceProxy.getEquation(this.source).toPromise();
    this.equations = equation?.equations
  }



}
