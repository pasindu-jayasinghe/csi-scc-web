import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConditionalFuelListReqDto, Fuel, FuelFactorControllerServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';
import { boilerFuels, cookingFuels } from './nav';

@Component({
  selector: 'app-fuel-select',
  templateUrl: './fuel-select.component.html',
  styleUrls: ['./fuel-select.component.css']
})
export class FuelSelectComponent implements OnInit, OnChanges {


  @Input() year: number;
  @Input() countryCode: string;
  @Input() es: PuesDataReqDtoSourceName;
  @Input() isView: boolean = false;
  @Input() fuel: string;


  @Input() data: any | undefined;

  @Output() onUpdateFuel = new EventEmitter<string>();



  fuels: Fuel[] = [];

  constructor(private fuelFactorControllerServiceProxy: FuelFactorControllerServiceProxy) { }


  ngOnChanges(changes: SimpleChanges): void {
    
    for (const propName in changes) {
      if(propName === 'fuel'){
        const fuel = changes[propName].currentValue as string;
        this.fuel = fuel;
      }

      if(propName === 'year'){
        const year = changes[propName].currentValue as number;
        this.year = year;
      }

      if(propName === 'countryCode'){
        const countryCode = changes[propName].currentValue as string;
        this.countryCode = countryCode;
      }

      if(propName === 'es'){
        const es = changes[propName].currentValue as PuesDataReqDtoSourceName;
        this.es = es;
      }
    }

    this.getFuels();
    console.log(this.toString());
  }

  ngOnInit(): void {
  }

  onChangeFuel($event: any) {
    if(this.fuel){
      this.onUpdateFuel.emit(this.fuel);
      console.log("FUel----",this.fuel)
    }
  }

  toString(){
    console.log(this.year, this.countryCode, this.es, this.isView, this.fuel, this.data)
  }


  async getFuels(){
    if(this.countryCode && this.year && this.es){

      const key = this.countryCode+"-"+this.year+"-"+this.es;

      let f = localStorage.getItem(key);
      // let f = undefined;
      if(f){
        this.fuels = JSON.parse(f) as Fuel[];
      }else{
        let req = new ConditionalFuelListReqDto();
        req.countryCode = this.countryCode;
        req.es =this.es.toString();
        req.year = this.year.toString();
        const res = await this.fuelFactorControllerServiceProxy.conditionalFuelListReq(req).toPromise();
        this.fuels = res.fuels;
  
        if(this.es !== PuesDataReqDtoSourceName.Cooking_gas && this.es !== PuesDataReqDtoSourceName.Boiler){
          localStorage.setItem(key, JSON.stringify(this.fuels))
        }        
      }




      switch(this.es){
        case PuesDataReqDtoSourceName.Cooking_gas:
          if(this.data){
            switch(this.data.id){
              case 1:
                console.log("1", this.fuels)
                this.fuels =this.fuels.filter(f => cookingFuels['1'].includes(f.code));
                break;
              case 2:
                console.log("2", this.fuels)
                this.fuels =this.fuels.filter(f => cookingFuels['2'].includes(f.code));
                break;
            }
          }
          break
        case PuesDataReqDtoSourceName.Boiler:
          if(this.data){
            switch(this.data.id){
              case 1:
                this.fuels =this.fuels.filter(f => boilerFuels['1'].includes(f.code));
                break;
              case 2:
                this.fuels =this.fuels.filter(f => boilerFuels['2'].includes(f.code));
                break;
            }
          }
          break;
      }

    }else{
      this.fuels = [];
    }
  }

}
