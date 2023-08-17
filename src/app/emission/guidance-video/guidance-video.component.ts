import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-guidance-video',
  templateUrl: './guidance-video.component.html',
  styleUrls: ['./guidance-video.component.css']
})
export class GuidanceVideoComponent implements OnInit {
  sourceName: any;
  root: string = "https://sccv2.s3.ap-south-1.amazonaws.com/videos/";
  link:string = "";
  constructor(
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    if (this.config.data) {
      if (this.config.data.sourceName) {
        this.sourceName = this.config.data.sourceName;
        switch(this.sourceName){
          case PuesDataReqDtoSourceName.Electricity:{
            this.link =  this.root + "Electricity.mov";
            break
          }
          case PuesDataReqDtoSourceName.Generator:{
            this.link =  this.root + "Generator.mov";
            break
          } 
          case PuesDataReqDtoSourceName.Cooking_gas:{
            this.link =  this.root + "Cooking_gas.mov";
            break
          }
          case PuesDataReqDtoSourceName.Fire_extinguisher:{
            this.link =  this.root + "Fire_extinguisher.mov";
            break
          }
          case PuesDataReqDtoSourceName.Refrigerant:{ 
            this.link =  this.root + "Refrigerant.mov";
            break
          }
          case PuesDataReqDtoSourceName.Gas_biomass:{ 
            this.link =  this.root + "Gas_biomass.mov";
            break
          } 
          case PuesDataReqDtoSourceName.Welding_es:{ 
            this.link =  this.root + "Welding_es.mov";
            break         
          } 
          case PuesDataReqDtoSourceName.Forklifts:{
            this.link =  this.root + "Forklifts.mov";
            break
          }
          case PuesDataReqDtoSourceName.Boiler:{
            this.link = this.root + "Boiler.mov";
            break
          }
          case PuesDataReqDtoSourceName.Waste_water_treatment:{ 
            this.link =  this.root + "Waste_water_treatment.mov";
            break
          } 
          case PuesDataReqDtoSourceName.Municipal_water:{ 
            this.link =  this.root + "Municipal_water.mov";
            break
          } 
          case PuesDataReqDtoSourceName.Waste_disposal:{ 
            this.link =  this.root + "Waste_disposal.mov";
            break
          } 
          case PuesDataReqDtoSourceName.Freight_air: {
            this.link =  this.root + "Freight_air.mov";
            break
          }
          case PuesDataReqDtoSourceName.Freight_offroad: {
            this.link =  this.root + "Freight_offroad.mov";
            break
          }
          case PuesDataReqDtoSourceName.Freight_rail: {
            this.link =  this.root + "Freight_rail.mov";
            break
          }
          case PuesDataReqDtoSourceName.Freight_road: {
            this.link =  this.root + "Freight_road.mov";
            break
          }             
          case PuesDataReqDtoSourceName.Freight_water: {
            this.link =  this.root + "Freight_water.mov";
            break
          }
          case PuesDataReqDtoSourceName.Passenger_offroad: {
            this.link =  this.root + "Passenger_offroad.mov";
            break
          }
          case PuesDataReqDtoSourceName.Passenger_rail: {
            this.link =  this.root + "Passenger_rail.mov";
            break
          }
          case PuesDataReqDtoSourceName.Passenger_road: {
            this.link =  this.root + "Passenger_road.mov";
            break
          }            
          case PuesDataReqDtoSourceName.Passenger_water: {
            this.link =  this.root + "Passenger_water.mov";
            break
          }            
          case PuesDataReqDtoSourceName.Passenger_air: {
            this.link =  this.root + "Passenger_air.mov";
            break
          }            
          case PuesDataReqDtoSourceName.Cooking_gas:{ 
            this.link =  this.root + "Cooking_gas.mov";
            break
          } 
          case PuesDataReqDtoSourceName.Offroad_machinery_offroad: {
            this.link =  this.root + "Offroad_machinery_offroad.mov";
            break
          }
          case PuesDataReqDtoSourceName.T_n_d_loss: {
            this.link =  this.root + "T_n_d_loss.mov";
            break
          }
          case PuesDataReqDtoSourceName.Business_travel: {
            this.link =  this.root + "Business_travel.mov";
            break
          }
        }
      }
    }
  }

}
