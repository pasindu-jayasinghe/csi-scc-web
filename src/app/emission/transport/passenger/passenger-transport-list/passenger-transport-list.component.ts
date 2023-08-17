import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';
import { IndexCode } from '../../transport-list/transport-list.component';

@Component({
  selector: 'app-passenger-transport-list',
  templateUrl: './passenger-transport-list.component.html',
  styleUrls: ['./passenger-transport-list.component.css']
})
export class PassengerTransportListComponent implements OnInit {
  
  @Input() index: number;
  @Input() indexCode: IndexCode;
  @Input() accessESList: PuesDataReqDtoSourceName[] = []
  @Input() isCSIUser: boolean = false;


  allTabs:string[] = ['AIR','OFF_ROAD','RAIL','EMP_COM','WATER','BT'] //  new item should be added to last

  public get puesDataReqDtoSourceName(): typeof PuesDataReqDtoSourceName {
    return PuesDataReqDtoSourceName; 
  }
  
  constructor() { }

  ngOnInit(): void {
    // console.log( "iii 1 ", this.index)
    // console.log( "iii 1 ", this.indexCode)

    this.allTabs = this.allTabs.filter(tab => {
      if(this.isCSIUser){
        return true;
      }else{
        switch(tab){
          case IndexCode.AIR:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Passenger_air)
          case IndexCode.OFF_ROAD:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Passenger_offroad)
          case IndexCode.RAIL:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Passenger_rail)
          case IndexCode.EMP_COM:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Passenger_road)
          case IndexCode.WATER:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Passenger_water)
          case IndexCode.BT:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Business_travel)
          default:
            return false;
        }
      }
    })
    if(this.indexCode){
      this.index = this.allTabs.indexOf(this.indexCode)
    }
    // console.log( "iii",   this.allTabs);
    // console.log( "iii", this.index)
  }

}
