import { Component, Input, OnInit } from '@angular/core';
import { PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';
import { IndexCode } from '../../transport-list/transport-list.component';

@Component({
  selector: 'app-freight-transport-list',
  templateUrl: './freight-transport-list.component.html',
  styleUrls: ['./freight-transport-list.component.css']
})
export class FreightTransportListComponent implements OnInit {

  @Input() index: number;
  @Input() indexCode: IndexCode;
  @Input() accessESList: PuesDataReqDtoSourceName[] = []
  @Input() isCSIUser: boolean = false;


  allTabs:string[] = [IndexCode.F_AIR,IndexCode.F_OFF_ROAD,IndexCode.F_RAIL,IndexCode.F_ROAD,IndexCode.F_WATER,] //  new item should be added to last


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
          case IndexCode.F_AIR:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Freight_air)
          case IndexCode.F_OFF_ROAD:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Freight_offroad)
          case IndexCode.F_RAIL:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Freight_rail)
          case IndexCode.F_ROAD:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Freight_road)
          case IndexCode.F_WATER:
            return this.accessESList.includes(this.puesDataReqDtoSourceName.Freight_water)
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
