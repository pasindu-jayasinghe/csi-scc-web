import { Injectable } from '@angular/core';
import { EvidenceRequestEsCode, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class ActivityDataService {

  constructor(
    private serviceProxy: ServiceProxy
  ) { }

  async getManyActivityData(filter: string[], source: string){
    let data;
    switch(source){
      case EvidenceRequestEsCode.Boiler.toString():
        data = await this.serviceProxy.getManyBaseBoilerActivityDataControllerBoilerActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Electricity.toString():
        data = await this.serviceProxy.getManyBaseElectricityActivityDataControllerElectricityActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Fire_extinguisher.toString():
        data = await this.serviceProxy.getManyBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Forklifts.toString():
        data = await this.serviceProxy.getManyBaseForkliftsActivityDataControllerForkliftsActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Generator.toString():
        data = await this.serviceProxy.getManyBaseGeneratorActivityDataControllerGeneratorActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Refrigerant.toString():
        data = await this.serviceProxy.getManyBaseRefrigerantActivityDataControllerRefrigerantActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;

      case EvidenceRequestEsCode.Waste_disposal.toString():
        data = await this.serviceProxy.getManyBaseWasteDisposalActivityDataControllerWasteDisposalActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
         break;

      case EvidenceRequestEsCode.Cooking_gas.toString():
        data = await this.serviceProxy.getManyBaseCookingGasActivityDataControllerCookingGasActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Welding_es.toString():
        data = await this.serviceProxy.getManyBaseWeldingEsActivityDataControllerWeldingEsActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Welding_es.toString():
        data = await this.serviceProxy.getManyBaseWeldingEsActivityDataControllerWeldingEsActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Freight_air.toString():
        data = await this.serviceProxy.getManyBaseFreightAirActivityDataControllerFreightAirActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Freight_offroad.toString():
        data = await this.serviceProxy.getManyBaseFreightOffroadActivityDataControllerFreightOffroadActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Freight_rail.toString():
        data = await this.serviceProxy.getManyBaseFreightRailActivityDataControllerFreightRailActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Freight_road.toString():
        data = await this.serviceProxy.getManyBaseFreightRoadActivityDataControllerFreightRoadActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Freight_water.toString():
        data = await this.serviceProxy.getManyBaseFreightWaterActivityDataControllerFreightWaterActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Passenger_air.toString():
        data = await this.serviceProxy.getManyBasePassengerAirActivityDataControllerPassengerAirActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Passenger_offroad.toString():
        data = await this.serviceProxy.getManyBasePassengerOffroadActivityDataControllerPassengerOffroadActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Passenger_rail.toString():
        data = await this.serviceProxy.getManyBasePassengerRailActivityDataControllerPassengerRailActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Passenger_road.toString():
        data = await this.serviceProxy.getManyBasePassengerRoadActivityDataControllerPassengerRoadActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Passenger_water.toString():
        data = await this.serviceProxy.getManyBasePassengerWaterControllerPassengerWaterActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Waste_water_treatment.toString():
        data = await this.serviceProxy.getManyBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Offroad_machinery_offroad.toString():
        data = await this.serviceProxy.getManyBaseOffroadMachineryOffroadActivityDataControllerOffroadMachineryOffroadActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
      case EvidenceRequestEsCode.Municipal_water.toString():
        data = await this.serviceProxy.getManyBaseMunicipalWaterActivityDataControllerMunicipalWaterActivityData(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        break;
    }

    return data

  }

  async getOneActivityData(data_id: any, source: string,){
    let activityData
    switch (source) {
      case EvidenceRequestEsCode.Electricity.toString():
        activityData = await this.serviceProxy.
          getOneBaseElectricityActivityDataControllerElectricityActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Fire_extinguisher.toString():
        activityData = await this.serviceProxy.
          getOneBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Forklifts.toString():
        activityData = await this.serviceProxy.
          getOneBaseForkliftsActivityDataControllerForkliftsActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      // case EvidenceRequestEsCode.Gas_biomass.toString():
      //   activityData = await this.serviceProxy.
      //     getOneBaseGasBiomassActivityDataControllerGasBiomassActivityData(
      //       data_id, undefined, undefined, undefined)
      //     .toPromise();
      //   break;

      case EvidenceRequestEsCode.Generator.toString():
        activityData = await this.serviceProxy.
          getOneBaseGeneratorActivityDataControllerGeneratorActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Refrigerant.toString():
        activityData = await this.serviceProxy.
          getOneBaseRefrigerantActivityDataControllerRefrigerantActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Welding_es.toString():
        activityData = await this.serviceProxy.
          getOneBaseWeldingEsActivityDataControllerWeldingEsActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Boiler.toString():
        activityData = await this.serviceProxy.
          getOneBaseBoilerActivityDataControllerBoilerActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Waste_water_treatment.toString():
        activityData = await this.serviceProxy.
          getOneBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Municipal_water.toString():
        activityData = await this.serviceProxy.
          getOneBaseMunicipalWaterActivityDataControllerMunicipalWaterActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Waste_disposal.toString():
        activityData = await this.serviceProxy.
          getOneBaseWasteDisposalActivityDataControllerWasteDisposalActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Cooking_gas.toString():
        activityData = await this.serviceProxy.
          getOneBaseCookingGasActivityDataControllerCookingGasActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;
      // case EvidenceRequestEsCode.Gas_biomass.toString():
      //   activityData = await this.serviceProxy.
      //     getOneBaseGasBiomassActivityDataControllerGasBiomassActivityData(
      //       data_id, undefined, undefined, undefined)
      //     .toPromise();
      //   break;

      case EvidenceRequestEsCode.Generator.toString():
        activityData = await this.serviceProxy.
          getOneBaseGeneratorActivityDataControllerGeneratorActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Refrigerant.toString():
        activityData = await this.serviceProxy.
          getOneBaseRefrigerantActivityDataControllerRefrigerantActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Welding_es.toString():
        activityData = await this.serviceProxy.
          getOneBaseWeldingEsActivityDataControllerWeldingEsActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Freight_air.toString():
        activityData = await this.serviceProxy.
          getOneBaseFreightAirActivityDataControllerFreightAirActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Freight_offroad.toString():
        activityData = await this.serviceProxy.
          getOneBaseFreightOffroadActivityDataControllerFreightOffroadActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Freight_rail.toString():
        activityData = await this.serviceProxy.
          getOneBaseFreightRailActivityDataControllerFreightRailActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Freight_road.toString():
        activityData = await this.serviceProxy.
          getOneBaseFreightRoadActivityDataControllerFreightRoadActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Freight_water.toString():
        activityData = await this.serviceProxy.
          getOneBaseFreightWaterActivityDataControllerFreightWaterActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;
        case EvidenceRequestEsCode.Passenger_air.toString():
        activityData = await this.serviceProxy.
          getOneBasePassengerAirActivityDataControllerPassengerAirActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Passenger_offroad.toString():
        activityData = await this.serviceProxy.
          getOneBasePassengerOffroadActivityDataControllerPassengerOffroadActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Passenger_rail.toString():
        activityData = await this.serviceProxy.
          getOneBasePassengerRailActivityDataControllerPassengerRailActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Passenger_road.toString():
        activityData = await this.serviceProxy.
          getOneBasePassengerRoadActivityDataControllerPassengerRoadActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Passenger_water.toString():
        activityData = await this.serviceProxy.
          getOneBasePassengerWaterControllerPassengerWaterActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;

      case EvidenceRequestEsCode.Offroad_machinery_offroad.toString():
        activityData = await this.serviceProxy.
          getOneBaseOffroadMachineryOffroadActivityDataControllerOffroadMachineryOffroadActivityData(
            data_id, undefined, undefined, undefined)
          .toPromise();
        break;
    }
    return activityData
  }

  async updateOneActivityData(data_id: any, data: any, source: string,){
    let es
    let res
    switch (source) {
      case EvidenceRequestEsCode.Electricity.toString():
        es = EvidenceRequestEsCode.Electricity
        res = await this.serviceProxy.updateOneBaseElectricityActivityDataControllerElectricityActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Fire_extinguisher.toString():
        es = EvidenceRequestEsCode.Fire_extinguisher
        res = await this.serviceProxy.updateOneBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Forklifts.toString():
        es = EvidenceRequestEsCode.Forklifts
        res = await this.serviceProxy.updateOneBaseForkliftsActivityDataControllerForkliftsActivityData(data_id, data).toPromise();
        break;

      // case EvidenceRequestEsCode.Gas_biomass.toString():
      //   es = EvidenceRequestEsCode.Gas_biomass
      //   res = await this.serviceProxy.updateOneBaseGasBiomassActivityDataControllerGasBiomassActivityData(data_id, data).toPromise();
      //   break;

      case EvidenceRequestEsCode.Generator.toString():
        es = EvidenceRequestEsCode.Generator
        res = await this.serviceProxy.updateOneBaseGeneratorActivityDataControllerGeneratorActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Refrigerant.toString():
        es = EvidenceRequestEsCode.Refrigerant
        res = await this.serviceProxy.updateOneBaseRefrigerantActivityDataControllerRefrigerantActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Welding_es.toString():
        es = EvidenceRequestEsCode.Welding_es
        res = await this.serviceProxy.updateOneBaseWeldingEsActivityDataControllerWeldingEsActivityData(data_id, data).toPromise();
       break;

      case EvidenceRequestEsCode.Boiler.toString():
        es = EvidenceRequestEsCode.Boiler
        res = await this.serviceProxy.updateOneBaseBoilerActivityDataControllerBoilerActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Waste_water_treatment.toString():
        es = EvidenceRequestEsCode.Waste_water_treatment
        res = await this.serviceProxy.updateOneBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(data_id, data).toPromise();
       break;

      case EvidenceRequestEsCode.Municipal_water.toString():
        es = EvidenceRequestEsCode.Municipal_water
        res = await this.serviceProxy.updateOneBaseMunicipalWaterActivityDataControllerMunicipalWaterActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Waste_disposal.toString():
        es = EvidenceRequestEsCode.Waste_disposal
        res = await this.serviceProxy.updateOneBaseWasteDisposalActivityDataControllerWasteDisposalActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Cooking_gas.toString():
        es = EvidenceRequestEsCode.Cooking_gas
        res = await this.serviceProxy.updateOneBaseCookingGasActivityDataControllerCookingGasActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Freight_air.toString():
        es = EvidenceRequestEsCode.Freight_air
        res = await this.serviceProxy.updateOneBaseFreightAirActivityDataControllerFreightAirActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Freight_offroad.toString():
        es = EvidenceRequestEsCode.Freight_offroad
        res = await this.serviceProxy.updateOneBaseFreightOffroadActivityDataControllerFreightOffroadActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Freight_rail.toString():
        es = EvidenceRequestEsCode.Freight_rail
        res = await this.serviceProxy.updateOneBaseFreightRailActivityDataControllerFreightRailActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Freight_road.toString():
        es = EvidenceRequestEsCode.Freight_road
        res = await this.serviceProxy.updateOneBaseFreightRoadActivityDataControllerFreightRoadActivityData(data_id, data).toPromise();
       break;

      case EvidenceRequestEsCode.Freight_water.toString():
        es = EvidenceRequestEsCode.Freight_water
        res = await this.serviceProxy.updateOneBaseFreightWaterActivityDataControllerFreightWaterActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Passenger_air.toString():
        es = EvidenceRequestEsCode.Passenger_air
        res = await this.serviceProxy.updateOneBasePassengerAirActivityDataControllerPassengerAirActivityData(data_id, data).toPromise();
       break;

      case EvidenceRequestEsCode.Passenger_offroad.toString():
        es = EvidenceRequestEsCode.Passenger_offroad
        res = await this.serviceProxy.updateOneBasePassengerOffroadActivityDataControllerPassengerOffroadActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Passenger_rail.toString():
        es = EvidenceRequestEsCode.Passenger_rail
        res = await this.serviceProxy.updateOneBasePassengerRailActivityDataControllerPassengerRailActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Passenger_road.toString():
        es = EvidenceRequestEsCode.Passenger_road
        res = await this.serviceProxy.updateOneBasePassengerRoadActivityDataControllerPassengerRoadActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Passenger_water.toString():
        es = EvidenceRequestEsCode.Passenger_water
        res = await this.serviceProxy.updateOneBasePassengerWaterControllerPassengerWaterActivityData(data_id, data).toPromise();
        break;

      case EvidenceRequestEsCode.Offroad_machinery_offroad.toString():
        es = EvidenceRequestEsCode.Passenger_water
        res = await this.serviceProxy.updateOneBaseOffroadMachineryOffroadActivityDataControllerOffroadMachineryOffroadActivityData(data_id, data).toPromise();
        break;
      default:
        es = EvidenceRequestEsCode.Electricity
        res = []
    }

    return {
      es: es, res: res
    }
  }
}
