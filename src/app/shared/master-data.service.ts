import { Injectable } from '@angular/core';
import { ProjectUnitEmissionSourceTier, PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';
import { of as observableOf, Observable, observable } from "rxjs";


export enum SourceType {
  MOBILE = 'M',
  STATIOANRY = 'S'
}



@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  public parameterUnits = {
    KWH: { label: "kWh", code: 'KWH' },
    KG: { label: "kg", code: 'KG' },
    KM: { label: "km", code: 'KM' },
    PKM: { label: "Passenger.km", code: 'PKM' },
    VKM: { label: "Vehicle.km", code: 'VKM' },
    T: { label: "Mt", code: 'T' },
    L: { label: "L", code: 'L' },
    G: { label: "g", code: 'G' },
    M3: { label: "m³", code: 'M3' },
    LKR: { label: "LKR", code: 'LKR' },
    TCO2Y: { label: "tCO₂e/year", code: 'TCO2Y' },
    TYR: { label: "t/yr", code: "TYR" },
    M3T: { label: "m³/t", code: "M3T" },
    KGCODM3: { label: "kgCOD/m³", code: "KGCODM3" },
    KGCODYR: { label: "kgCOD/yr", code: "KGCODYR" },
    KGCH4YR: { label: "kgCH₄/yr", code: "KGCH4YR" },
    KWHNETCV: { label: "kWh (NetCV)", code: 'KWHNETCV' },
    KWHGROSSCV: { label: "kWh (GrossCV)", code: 'KWHGROSSCV' },
    NM: { label: "Nm", code: 'NM' },
    PORT: { label: "port", code: 'PORT' },
    KML: { label: "km/l", code: 'KML' },
    KGCO2EKG: { label: "kg CO₂e/kg", code: 'KGCO2EKG' },
    KGCO2ET: { label: "kg CO₂e/tonne", code: 'KGCO2ET' },
    TCO2: { label: "tCO₂e", code: 'TCO2' },
    M2: { label: "m²", code: 'M2' },
    KGCO2EM2Y: { label: "kg CO₂e /m² /year", code: 'KGCO2EM2Y' },
    KGCO2EBAY: { label: "kg CO₂e /building or asset type /year", code: 'KGCO2EBAY' },
    PRS: { label: "%", code: 'PRS' },
    PIECE: { label: "Piece", code: 'PIECE' },
    KGCO2EPIECE: { label: "kg CO₂e/piece", code: 'KGCO2EPIECE' },
    KGCO2EDOLLAR: { label: "kg CO₂e/$", code: 'KGCO2EDOLLAR' },
    KGCO2EM3: { label: "kg CO₂e /m³ ", code: 'KGCO2EM3' },
    USD: { label: "$", code: 'USD' },
    EEIO_EF: { label: "kg CO₂e/$", code: 'KGCO2E$' },
    TCO2EM3: { label: "kgCO₂e /m3", code: 'TCO2EM3' },
    KGCO2E: { label: "kgCO₂e", code: 'KGCO2E' },
    KGCO2ETKM: { label: "kg CO₂e/tonne/km", code: 'KGCO2ETKM' },
    UNIT: { label: 'Unit', code: 'UNIT' },
    KGCO2EUNIT: { label: 'kg CO2e/unit', code: 'KGCO2EUNIT' },
    TEU: { label: 'TEU', code: 'TEU' },
    KGCO2ETEUKM: { label: 'kg CO2e/TEU/km', code: 'KGCO2ETEUKM' },
    KGCO2EUSE: { label: 'kg CO2e/USE', code: 'KGCO2EUSE' },
    QTY: { label: "Qty", code: 'QTY' },
    TCO2EQTY: { label: "tCO₂e/qty", code: 'TCO2EQTY' },
    TCO2EM2: { label: "tCO₂e/m²", code: 'TCO2EM2' },



  }



  private _months: { name: string, value: number }[] = []
  private _gWP_RGs: { name: string, id: number }[] = []
  private _refActivityTypes: { name: string, id: number, code: string }[] = []
  private _investActivityTypes: { name: string, id: number, code: string }[] = []

  private _fuelEnergyActivityTypes: { name: string, id: number, code: string }[] = []
  private _processingOfSoldProductActivityTypes: { name: string, id: number, code: string }[] = []

  private _upstreamTransportctivityTypes: { name: string, id: number, code: string }[] = []



  private _anaerobicDeepLagoons: { name: string, id: number, code: string }[] = []
  private _treatment_methodmethods_waste_generated_in_operations: { name: string, id: number, code: string }[] = []
  private _fuel: { name: string, id: number, code: string }[] = []
  private _fuelType1: { name: string, id: number, code: string }[] = []
  private _fuelTypeFreightWater: { name: string, id: number, code: string }[] = []
  private _fuelTypeBoilers: { name: string, id: number, boilerId: number, code: string }[] = []
  private _railFuelType: { name: string, id: number, code: string }[] = []
  private _purposes: { name: string, id: number }[] = []
  private _units: { name: string, id: number }[] = []
  private _sources: { name: string, id: number, code: SourceType }[] = []
  private _countries: { name: string, id: number, code: string }[] = []
  private _emsources: { name: string, id: number }[] = []
  private _strokes: { name: string, id: number, code: string }[] = []
  private _units_Marine: { name: string, id: number }[] = []
  private _ef_units: { name: string, id: number }[] = []

  private _consumption_units: { name: string, id: number, code: string }[] = []

  private _unit_ncv: { name: string, id: number }[] = []
  private _unit_density: { name: string, id: number }[] = []


  private _industries: { name: string, id: number }[] = []
  private _tieres: { name: string, id: number, code: ProjectUnitEmissionSourceTier }[] = []
  private _currencies: { name: string, id: number, code: string }[] = []
  private _wasteTypes: { name: string, id: number }[] = []
  private _disposalMethods: { name: string, id: number }[] = []
  private _cookingEmissionSources: { name: string, id: number }[] = []
  private _cookingGasTypes: { name: string, id: number, sourceId: number, code: string; }[] = []
  private _disposalWasteTypes: { name: string, id: number, wasteId: number, code: string; }[] = [];
  private _waste_type_waste_generated_in_operations: { name: string, id: number, wasteId: number, code: string; }[] = []
  private _disposal_type_waste_generated_in_operations: { name: string; id: number }[] = []


  private _capital_goods_types: { name: string; id: number }[] = []
  private _capital_goods_categories: { name: string, id: number, typeId: number, code: string; }[] = []


  private _boilerTypes: { name: string, id: number }[] = []
  private _fireExtinguisherTypes: { name: string, id: number, code: string }[] = []
  private _suppressionTypes: { name: string, id: number, code: string }[] = []

  private _municipal_water_categories: { name: string, id: number, code: string }[] = []

  //Transport
  private _domesticInternationals: { name: string, id: number, code: string }[] = []
  private _freightModes: { name: string, id: number }[] = []
  private _ownership_freightTransport: { name: string, id: number }[] = []
  private _depatureCountry_freightTransport: { name: string, id: number }[] = []
  private _departureAirport_freightTransport: { name: string, id: number }[] = []
  private _destinationCountry_freightTransport: { name: string, id: number }[] = []
  private _destinationAirport_freightTransport: { name: string, id: number }[] = []
  private _transient_freightTransport: { name: string, id: number }[] = []
  private _distanceTravelledUnits_freightTransport: { name: string, id: number }[] = []
  private _methods_freightTransport: { name: string, id: number }[] = []
  private _freightTypes_freightTransport: { name: string, id: number }[] = []
  private _departurePort_freightTransport: { name: string, id: number }[] = []
  private _destinationPort_freightTransport: { name: string, id: number }[] = []
  private _departureStation_freightTransport: { name: string, id: number }[] = []
  private _destinationStation_freightTransport: { name: string, id: number }[] = []
  private _vehicleModel_freightTransport: { name: string, id: number }[] = []
  private _activity_freightTransport: { name: string, id: number }[] = []
  private _size_freightTransport: { name: string, id: number }[] = []
  private _type_water_freightTransport: { name: string, id: number }[] = []
  private _options_freightTransport: { name: string, id: number, code: string }[] = []
  private _cargoType_road_freightTransport: { code: string, name: string, id: number }[] = []
  private _cargoType_shared: { code: string, name: string, id: number }[] = []


  //Smart Net Zero

  private _methods_netZeroBusinessTravel: { name: string, id: number; value: string }[] = []
  private _methods_franchise: { name: string, id: number; value: string }[] = []

  private _methods_net_zero_employee_commuting: { name: string, id: number; value: string }[] = []
  private _methods_waste_generated_in_operations: { name: string, id: number; value: string }[] = []
  private _solid_water_waste_generated_in_operations: { name: string, id: number; value: string }[] = []

  private _activities_upstreamLeasedAssets: { name: string, id: number; value: string }[] = []
  private _methods_downstream_leased_assets: { name: string, id: number; value: string }[] = []


  private _passengerModes: { name: string, id: number, code: string }[] = []
  private _railActivities: { name: string, id: number, code: string }[] = []
  private _railTypes: { name: string, id: number, code: string }[] = []
  private _passenger_onroad_methods: { id: number, name: string, code: string }[] = []
  private _noEmission_transport_modes: { id: number, name: string, code: string }[] = []
  private _private_transport_modes: { id: number, name: string, code: string }[] = []
  private _public_transport_modes: { id: number, name: string, code: string }[] = []
  private _options_passenger_air: { id: number, name: string, code: string }[] = []
  private _class_passenger_air: { id: number, name: string, code: string }[] = []
  private _p_water_vehicle_model: { name: string, id: number, code: string }[] = []

  private _fuelFacTypes: { code: string, id: number }[] = []

  //IPCC Waste Disposal
  private _gasTypes: { name: string, id: number }[] = []
  private _wasteBasis: { name: string, id: number }[] = []
  private _biologicalTreatments: { name: string, id: number }[] = []
  private _wasteCategories: { name: string, id: number }[] = []
  private _wdApproach: { name: string, id: number }[] = []
  private _climateZone: { name: string, id: number }[] = []

  private WasteTypes: { wcat: string, name: string, id: number }[] = []
  private _fwTypes: { activity: string, name: string, id: number, code: string }[] = []
  private _fwSizes: { type: string, name: string, id: number, code: string }[] = []


  private MSWTypes: { gasTypes: string, name: string, id: number }[] = []
  private _treatmentTypeDischarge: { name: string, id: number }[] = []

  private _industrialSectors: { name: string, id: number }[] = []//activities

  private _activities: { name: string, id: number, code: string }[] = []

  private _orgBoundaries: { name: string, code: string }[] = []
  private _controlApproaches: { name: string, code: string }[] = []

  //netzero
  private _investeesector: { name: string, id: number, code: string }[] = []

  private _operatingsector: { name: string, id: number, code: string }[] = []
  private _constructsector: { name: string, id: number, code: string }[] = []

  private _fuel_eq1: { name: string, id: number, code: string }[] = []
  private _fuel_lifecycle: { name: string, id: number, code: string }[] = []
  private _building_types: { name: string, id: number, code: string }[] = []
  private _purchase_methods: { id: number; name: string; }[]
  private _supplier_specific_products: { id: number; name: string; code: string }[]
  private _hybrid_material_type: { id: number; name: string; code: string }[]
  private _hybrid_vehicle_type: { id: number; name: string; code: string }[]
  private _average_product_type: { id: number; name: string; code: string }[]
  private _spend_product_type: { id: number; name: string; code: string }[]
  private _units_purchase_good_and_services: any
  private _units_use_of_sold_products: any
  private _use_of_sold_products_method: { id: number; name: string; code: string }[]
  private _intermediate_products: { id: number; name: string; code: string }[]
  private _ghg_types: { id: number; name: string; code: string }[]
  private _fuel_upstream_leased: { name: string, id: number, code: string }[] = []



  // units
  private _boilers_units: any
  private _fire_extinguisher_units: any
  private _generator_units: any
  private _refrigerant_units: any
  private _welding_units: any
  private _forklifts_units: any
  private _waste_water_units: any
  private _municipal_water_units: any
  private _fuel_energy_activity_units: any

  private _electricity_units: any
  private _waste_disposal_units: any
  private _cooking_gas_units: any
  private _road_freight_units: any
  private _air_freight_units: any
  private _water_freight_units: any
  private _rail_freight_units: any
  private _passenger_road_units: any

  private _passenger_offroad_units: any
  private _passenger_rail_units: any
  private _passenger_water_units: any
  private _offroad_freight_units: any
  private _offroad_machinery_units: any
  private _supplier_units: any
  private _eoltsold_products_units: any
  private _capital_goods_units:any


  private _revenue_units: { name: string; id: number, code: string, factor: number }[] = []


  private _freightESList: PuesDataReqDtoSourceName[] = [];
  private _passengerESList: PuesDataReqDtoSourceName[] = [];
  private _offroadESList: PuesDataReqDtoSourceName[] = []
  private _transportESList: PuesDataReqDtoSourceName[] = [];

  private _net_zero_business_travel_units: any
  private _waste_generated_in_operations_units: any

  private _net_zero_business_travel_types: any
  private _net_zero_business_travel_transport_modes_distance: { id: number; name: string; code: string; }[] = [];
  private _net_zero_business_travel_transport_modes_amount: { id: number; name: string; code: string; }[] = [];

  private _net_zero_employee_commuting_units: any
  private _net_zero_employee_commuting_types: any
  private _net_zero_employee_commuting_transport_modes: { id: number; name: string; code: string; }[] = [];

  private _investments_units: any
  private _upstream_lead_asset_units: any
  private _sold_intermediate_type: any

  private _net_zero_franchises_units: any;
  private _downstreamTransportationUnits: any;



  constructor() {



    this.fuel_upstream = [
      { id: 1, name: "Diesel", code: "DIESEL_UPSTREAM" },
      { id: 2, name: "Petrol", code: "PETROL_UPSTREAM" },
      { id: 2, name: "Electricity", code: "ELECTRICITY_UPSTREAM" },
      { id: 2, name: "Steam", code: "STEAM_UPSTREAM" },
      { id: 2, name: "Heating", code: "HEATING_UPSTREAM" },
      { id: 2, name: "Cooling", code: "COOLING_UPSTREAM" },
    ],

    this.fuel_upstream_leased = [

      { id: 1, name: "Electricity", code: "ELECTRICITY" },
      { id: 2, name: "Steam", code: "STEAM" },
      { id: 3, name: "Heating", code: "HEATING" },
      { id: 4, name: "Cooling", code: "COOLING" },
    ],



      this.sold_intermediate_type
      = [
        { id: 1, name: "Tea Packets", code: "TEA_PACKETS" },
        { id: 2, name: "Fabric", code: "FABRIC" },
        { id: 3, name: "Clothes", code: "CLOTHES" },

      ],


      this.fuel_lifecycle = [
        { id: 1, name: "Diesel", code: "DIESEL_LC" },//LC - Life Cycle Emission Factors
        { id: 2, name: "Petrol", code: "PETROL_LC" },
        { id: 2, name: "Electricity", code: "ELECTRICITY_LC" },
        { id: 2, name: "Steam", code: "STEAM_LC" },
        { id: 2, name: "Heating", code: "HEATING_LC" },
        { id: 2, name: "Cooling", code: "COOLING_LC" },

      ]





    this.building_types = [
      { id: 1, name: " Food Outlet", code: "FOOD_OUTLET" },//
      { id: 2, name: "Clothing Outlet", code: "CLOTHING_OUTLET" },

    ]

    this.ivesteesectors = [
      { id: 1, name: "Telecommunication", code: "TELECOMMUNICATION" },
      { id: 2, name: "Apparel", code: "APPAREL" },
      { id: 2, name: "Energy Generation", code: "ENERGY_GENERATION" },
      { id: 2, name: "Food And Beverage", code: "FOOD_AND_BEVERAGE" },
    ],



      this.operatingsectors = [
        { id: 1, name: "Residential", code: "RESIDENTIAL" },
        { id: 2, name: "Commercial", code: "COMMERCIAL" },
        { id: 2, name: "Health Care Structures", code: "HEALTH_CARE_STRUCTURES" },


      ],

      this.constructsectors = [
        { id: 1, name: "Power Generation And Supply", code: "POWER_GENERATION_AND_SUPPLY" },
        { id: 2, name: "Paper Mills", code: "PAPER_MILLS" },


      ]




    this.months = [
      { value: 12, name: "All" },
      { value: 0, name: "January" },
      { value: 1, name: "February" },
      { value: 2, name: "March" },
      { value: 3, name: "April" },
      { value: 4, name: "May" },
      { value: 5, name: "June" },
      { value: 6, name: "July" },
      { value: 7, name: "August" },
      { value: 8, name: "September" },
      { value: 9, name: "October" },
      { value: 10, name: "November" },
      { value: 11, name: "December" },
    ],



      this.gWP_RGs = [
        { id: 1, name: "R22" },
        { id: 2, name: "R407C" },
        { id: 3, name: "R410A" },
        { id: 4, name: "R134a" }]

    this.refActivityTypes = [
      { id: 1, name: "Emissions from Installation", code: "INSTALL" },
      { id: 2, name: "Emissions from Operation", code: "OPERATION" },
      { id: 3, name: "Emissions from Disposal", code: "DISPOSAL" },
      { id: 4, name: "Emission based on refilling", code: "REFILL" }]

    this.investActivityTypes = [
      { id: 1, name: "investment-specific-method-equity-investmentsn", code: "investment-specific-method-equity-investments" },
      { id: 2, name: "average-data-method-equity-investments", code: "average-data-method-equity-investments" },
      { id: 3, name: "project-specific-method-project-finance-and-debt-investments", code: "project-specific-method-project-finance-and-debt-investments" },
      { id: 4, name: "average-data-method-project-finance-and-debt-investments", code: "average-data-method-project-finance-and-debt-investments" },
      { id: 5, name: "projected-total-lifetime-emissions-project-finance-and-debt-investments", code: "projected-total-lifetime-emissions-project-finance-and-debt-investments" },

    ]

    this.fuelEnergyActivityTypes = [
      { id: 1, name: "upstream emissions of purchased fuels", code: "upstream-emissions-of-purchased-fuels" },
      { id: 2, name: "upstream emissions of purchased electricity", code: "upstream-emissions-of-purchased-electricity" },
      { id: 3, name: "emissions from transmission and distribution losses", code: "emissions-from-transmission-and-distribution-losses" },
      { id: 4, name: "life cycle emissions from power that is purchased and sold", code: "life-cycle-emissions-from-power-hat-is-purchased-and-sold" },

    ]




    this.processingOfSoldProductActivityTypes = [
      { id: 1, name: "Site specific method CO2", code: "site_specific_method_cO2" },
      { id: 2, name: "average data method", code: "average_data_method" },


    ]



    this.upstreamTransportctivityTypes = [
      { id: 1, name: "fuel based method", code: "fuel_based_method" },
      { id: 2, name: "distance based method", code: "distance_based_method" },
      { id: 2, name: "spend based method", code: "spend_based_method" },
      { id: 2, name: "site specific method", code: "site_specific_method" },
      { id: 2, name: "average data method", code: "average_data_method" },


    ]
    /* Fuel tyes */

    this.fuel = [
      { id: 1, name: "LAD", code: "DIESEL" },
      { id: 2, name: "LSD", code: "S_DIESEL" },
      { id: 3, name: "Petrol 92", code: "PETROL" },
      { id: 4, name: "Petrol 95", code: "PETROL_95" }]

    this.fuelType1 = [
      { id: 1, name: "LAD", code: "DIESEL" },
      { id: 2, name: "LSD", code: "S_DIESEL" },
      { id: 3, name: "Petrol 92", code: "PETROL" },
      { id: 4, name: "Petrol 95", code: "PETROL_95" },
      { id: 5, name: "Coal", code: "COAL" }]

    this.fuelTypeFreightWater = [
      { id: 1, name: "LAD", code: "DIESEL" },
      { id: 2, name: "LSD", code: "S_DIESEL" },
      { id: 3, name: "Petrol 92", code: "PETROL" },
      { id: 4, name: "Petrol 95", code: "PETROL_95" },
      { id: 5, name: "Marine Gas Oil", code: "MARINE_GAS_OIL" },
      { id: 6, name: "Marine Fuel Oil", code: "	MARINE_FUEL_OIL" }
    ]

    this.fuelTypeBoilers = [
      { id: 1, name: "Residual Fuel Oil", boilerId: 1, code: "RESIDUAL_FUEL_OIL" },
      { id: 2, name: "Wood/Wood Waste", boilerId: 2, code: "WOOD_WOOD_WASTE" },
      { id: 3, name: "Sulphite lyes (black liquor)", boilerId: 2, code: "SULPHITE_LYES_BLACK_LIQUOR" },
      { id: 4, name: "Other Primary Solid Biomass", boilerId: 2, code: "OTHER_PRIMARY_SOLID_BIOMASS" },
      { id: 5, name: "Charcoal", boilerId: 2, code: "CHARCOAL" },
      { id: 6, name: "Wood Chips", boilerId: 2, code: "WOOD_CHIPS" },
      { id: 7, name: "Saw Dust", boilerId: 2, code: "SAW_DUST" },
      { id: 8, name: "Marine Gas Oil", boilerId: 1, code: "MARINE_GAS_OIL" },
    ]

    this.railFuelType = [
      { id: 1, name: "LAD", code: "DIESEL" },
      { id: 2, name: "LSD", code: "S_DIESEL" },
      { id: 3, name: "Petrol 92", code: "PETROL" },
      { id: 4, name: "Petrol 95", code: "PETROL_95" },
      { id: 5, name: "Coal", code: "COAL" }
    ]

    /* End fuel types */

    this.anaerobicDeepLagoons = [
      { id: 1, name: "Sea, River and lake discharge", code: "mcf_Sea_River" },
      { id: 2, name: "Aerobic treatment plant with well managed", code: "mcf_A_T_P_Well_Managed" },
      { id: 3, name: "Aerobic treatment plant without well managed", code: "mcf_A_T_P_Not_Well_Managed" },
      { id: 4, name: "Anaerobic digester for sludge", code: "mcf_A_D_Sludge" },
      { id: 5, name: "Anaerobic Reactor", code: "mcf_Anaerobic_Reactor" },
      { id: 6, name: "Anaerobic shallow lagoon", code: "mcf_Anaerobic_Shallow_Lagoon" },
      { id: 7, name: "Anaerobic deep lagoon", code: "mcf_Anaerobic_Deep_Lagoon" },]

    this.treatment_method_waste_generated_in_operations = [
      { id: 1, name: "Sea, River and lake discharge", code: "mcf_Sea_River" },
      { id: 2, name: "Aerobic treatment plant with well managed", code: "mcf_A_T_P_Well_Managed" },
      { id: 3, name: "Aerobic treatment plant without well managed", code: "mcf_A_T_P_Not_Well_Managed" },
      { id: 4, name: "Anaerobic digester for sludge", code: "mcf_A_D_Sludge" },
      { id: 5, name: "Anaerobic Reactor", code: "mcf_Anaerobic_Reactor" },
      { id: 6, name: "Anaerobic shallow lagoon", code: "mcf_Anaerobic_Shallow_Lagoon" },
      { id: 7, name: "Anaerobic deep lagoon", code: "mcf_Anaerobic_Deep_Lagoon" },]

    this.waste_type_waste_generated_in_operations = [
      { id: 1, name: "Average construction", wasteId: 1, code: "AVERAGE_CONSTRUCTION" },
      { id: 2, name: "tyres", wasteId: 1, code: "TYRES" },
      { id: 3, name: "Wood", wasteId: 1, code: "WOOD" },

      { id: 4, name: "Average construction", wasteId: 2, code: "AVERAGE_CONSTRUCTION" },
      { id: 5, name: "Tyres", wasteId: 2, code: "TYRES" },
      { id: 6, name: "Wood", wasteId: 2, code: "WOOD" },
      { id: 7, name: "Glass", wasteId: 2, code: "GLASS" },
      { id: 8, name: "Municipal waste", wasteId: 2, code: "MUNICIPAL_WASTE" },
      { id: 9, name: "WEEE", wasteId: 2, code: "WEEE" },
      { id: 10, name: "WEEE - Fridges and freezers", wasteId: 2, code: "WEEE_FRIDGES_AND_FREEZERS" },
      { id: 11, name: "batteries", wasteId: 2, code: "BATTERIES" },
      { id: 12, name: "Plastics", wasteId: 2, code: "PLASTICS" },

      { id: 13, name: "Average construction", wasteId: 3, code: "AVERAGE_CONSTRUCTION" },
      { id: 14, name: "Soils", wasteId: 3, code: "SOILS" },
      { id: 15, name: "Tyres", wasteId: 3, code: "TYRES" },
      { id: 16, name: "Wood", wasteId: 3, code: "WOOD" },
      { id: 17, name: "Books", wasteId: 3, code: "BOOKS" },
      { id: 18, name: "Glass", wasteId: 3, code: "GLASS" },
      { id: 19, name: "Clothing", wasteId: 3, code: "CLOTHING" },
      { id: 20, name: "Municipal waste", wasteId: 3, code: "MUNICIPAL_WASTE" },
      { id: 21, name: "Commercial and industrial waste", wasteId: 3, code: "COMMERCIAL_AND_INDUSTRIAL_WASTE" },
      { id: 22, name: "Metal", wasteId: 3, code: "METAL" },
      { id: 23, name: "Plastics", wasteId: 3, code: "PLASTICS" },
      { id: 24, name: "Paper and Board", wasteId: 3, code: "PAPER_AND_BOARD" },

      { id: 25, name: "Wood", wasteId: 4, code: "WOOD" },
      { id: 26, name: "Books", wasteId: 4, code: "BOOKS" },
      { id: 27, name: "Glass", wasteId: 4, code: "GLASS" },
      { id: 28, name: "Clothing", wasteId: 4, code: "CLOTHING" },
      { id: 29, name: "Municipal waste", wasteId: 4, code: "MUNICIPAL_WASTE" },
      { id: 30, name: "Organic: Food and drink waste", wasteId: 4, code: "ORGANIC_FOOD_AND_DRINK_WASTE" },
      { id: 31, name: "Organic: Garden waste", wasteId: 4, code: "ORGANIC_GARDEN_WASTE" },
      { id: 32, name: "Organic: Mixed food and garden waste", wasteId: 4, code: "ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE" },
      { id: 33, name: "Commercial and industrial waste", wasteId: 4, code: "COMMERCIAL_AND_INDUSTRIAL_WASTE" },
      { id: 34, name: "WEEE", wasteId: 4, code: "WEEE" },
      { id: 35, name: "Metal", wasteId: 4, code: "METAL" },
      { id: 36, name: "Plastics", wasteId: 4, code: "PLASTICS" },

      { id: 37, name: "Wood", wasteId: 5, code: "WOOD" },
      { id: 38, name: "Books", wasteId: 5, code: "BOOKS" },
      { id: 39, name: "Organic: Food and drink waste", wasteId: 5, code: "ORGANIC_FOOD_AND_DRINK_WASTE" },
      { id: 40, name: "Organic: Garden waste", wasteId: 5, code: "ORGANIC_GARDEN_WASTE" },
      { id: 41, name: "Organic: Mixed food and garden waste", wasteId: 5, code: "ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE" },
      { id: 42, name: "Paper and Board", wasteId: 5, code: "PAPER_AND_BOARD" },

      { id: 43, name: "Soils", wasteId: 6, code: "SOILS" },
      { id: 44, name: "Books", wasteId: 6, code: "BOOKS" },
      { id: 45, name: "Glass", wasteId: 6, code: "GLASS" },
      { id: 46, name: "Clothing", wasteId: 6, code: "CLOTHING" },
      { id: 47, name: "Municipal waste", wasteId: 6, code: "MUNICIPAL_WASTE" },
      { id: 48, name: "Organic: Food and drink waste", wasteId: 6, code: "ORGANIC_FOOD_AND_DRINK_WASTE" },
      { id: 49, name: "Organic: Garden waste", wasteId: 6, code: "ORGANIC_GARDEN_WASTE" },
      { id: 50, name: "Organic: Mixed food and garden waste", wasteId: 6, code: "ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE" },
      { id: 51, name: "WEEE", wasteId: 6, code: "WEEE" },
      { id: 52, name: "WEEE - Fridges and freezers", wasteId: 6, code: "WEEE_FRIDGES_AND_FREEZERS" },
      { id: 53, name: "Batteries", wasteId: 6, code: "BATTERIES" },
      { id: 54, name: "Metal", wasteId: 6, code: "METAL" },
      { id: 55, name: "Plastics", wasteId: 6, code: "PLASTICS" },
      { id: 56, name: "Paper and Board", wasteId: 6, code: "PAPER_AND_BOARD" },

      { id: 57, name: "Municipal waste", wasteId: 7, code: "MUNICIPAL_WASTE" },
      { id: 58, name: "Organic: Food and drink waste", wasteId: 7, code: "ORGANIC_FOOD_AND_DRINK_WASTE" },
      { id: 59, name: "Organic: Garden waste", wasteId: 7, code: "ORGANIC_GARDEN_WASTE" },
      { id: 60, name: "Organic: Mixed food and garden waste", wasteId: 7, code: "ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE" },
      { id: 61, name: "Commercial and industrial waste", wasteId: 7, code: "COMMERCIAL_AND_INDUSTRIAL_WASTE" },

      { id: 62, name: "Waste", wasteId: 8, code: "WASTE" },

      { id: 63, name: "Paper/Cardboard", wasteId: 9, code: "PAPER_CARDBOARD" },
      { id: 64, name: "Textile", wasteId: 9, code: "TEXTILE" },
      { id: 65, name: "Food waste", wasteId: 9, code: "FOOD_WASTE" },
      { id: 66, name: "Wood", wasteId: 9, code: "WOOD" },
      { id: 67, name: "Garden and park waste", wasteId: 9, code: "GARDEN_AND_PARK_WASTE" },
      { id: 68, name: "Nappies", wasteId: 9, code: "NAPPIES" },
      { id: 69, name: "Rubber and leather", wasteId: 9, code: "RUBBER_AND_LEATHER" },
      { id: 70, name: "Plastics", wasteId: 9, code: "PLASTICS" },
      { id: 71, name: "Other wastes", wasteId: 9, code: "OTHER_WASTES" },
      { id: 72, name: "Domestic", wasteId: 9, code: "DOMESTIC" },
      { id: 73, name: "Industrial", wasteId: 9, code: "INDUSTRIAL" },

      { id: 74, name: "Aggregates", wasteId: 2, code: "AGGREGATES" },
      { id: 75, name: "Asphalt", wasteId: 2, code: "ASPHALT" },
      { id: 76, name: "Bricks", wasteId: 2, code: "BRICKS" },
      { id: 77, name: "Concrete", wasteId: 2, code: "CONCRETE" },
      { id: 78, name: "WEEE - large", wasteId: 2, code: "WEEE_LARGE" },
      { id: 79, name: "WEEE - mixed", wasteId: 2, code: "WEEE_MIXED" },
      { id: 80, name: "WEEE - small", wasteId: 2, code: "WEEE_SMALL" },
      { id: 81, name: "Metal: aluminium cans and foil (excl. forming)", wasteId: 2, code: "METAL_ALUMINIUMCANS_FOIL" },
      { id: 82, name: "Metal: mixed cans", wasteId: 2, code: "METAL_MIXED_CANS" },
      { id: 83, name: "Metal: scrap metal", wasteId: 2, code: "METAL_SCRAP_METAL" },
      { id: 84, name: "Metal: steel cans", wasteId: 2, code: "METAL_STEEL_CANS" },
      { id: 85, name: "Plastics: average plastics", wasteId: 2, code: "PLASTICS_AVERAGE_PLASTICS" },
      { id: 86, name: "Plastics: average plastic film", wasteId: 2, code: "PLASTICS_AVERAGE_PLASTIC_FILM" },
      { id: 87, name: "Plastics: average plastic rigid", wasteId: 2, code: "PLASTICS_AVERAGE_PLASTIC_RIGID" },
      { id: 88, name: "Plastics: HDPE (incl. forming)", wasteId: 2, code: "PLASTICS_HDPE" },
      { id: 89, name: "Plastics: LDPE and LLDPE (incl. forming)", wasteId: 2, code: "PLASTICS_LDPE_LLDPE" },
      { id: 90, name: "Plastics: PET (incl. forming)", wasteId: 2, code: "PLASTICS_PET" },
      { id: 91, name: "Plastics: PP (incl. forming)", wasteId: 2, code: "PLASTICS_PP" },
      { id: 92, name: "Plastics: PS (incl. forming)", wasteId: 2, code: "PLASTICS_PS" },
      { id: 93, name: "Plastics: PVC (incl. forming)", wasteId: 2, code: "PLASTICS_PVC" },
      { id: 94, name: "Aggregates", wasteId: 3, code: "AGGREGATES" },
      { id: 95, name: "Insulation", wasteId: 3, code: "INSULATION" },
      { id: 96, name: "Mineral oil", wasteId: 3, code: "MINERAL_OIL" },
      { id: 97, name: "Plasterboard", wasteId: 3, code: "PLASTERBOARD" },
      { id: 98, name: "Asphalt", wasteId: 3, code: "ASPHALT" },
      { id: 99, name: "Concrete", wasteId: 3, code: "CONCRETE" },
      { id: 100, name: "Metal: aluminium cans and foil (excl. forming)", wasteId: 3, code: "METAL_ALUMINIUMCANS_FOIL" },
      { id: 101, name: "Metal: mixed cans", wasteId: 3, code: "METAL_MIXED_CANS" },
      { id: 102, name: "Metal: scrap metal", wasteId: 3, code: "METAL_SCRAP_METAL" },
      { id: 103, name: "Metal: steel cans", wasteId: 3, code: "METAL_STEEL_CANS" },
      { id: 104, name: "Plastics: average plastics", wasteId: 3, code: "PLASTICS_AVERAGE_PLASTICS" },
      { id: 105, name: "Plastics: average plastic film", wasteId: 3, code: "PLASTICS_AVERAGE_PLASTIC_FILM" },
      { id: 106, name: "Plastics: average plastic rigid", wasteId: 3, code: "PLASTICS_AVERAGE_PLASTIC_RIGID" },
      { id: 107, name: "Plastics: HDPE (incl. forming)", wasteId: 3, code: "PLASTICS_HDPE" },
      { id: 108, name: "Plastics: LDPE and LLDPE (incl. forming)", wasteId: 3, code: "PLASTICS_LDPE_LLDPE" },
      { id: 109, name: "Plastics: PET (incl. forming)", wasteId: 3, code: "PLASTICS_PET" },
      { id: 110, name: "Plastics: PP (incl. forming)", wasteId: 3, code: "PLASTICS_PP" },
      { id: 111, name: "Plastics: PS (incl. forming)", wasteId: 3, code: "PLASTICS_PS" },
      { id: 112, name: "Plastics: PVC (incl. forming)", wasteId: 3, code: "PLASTICS_PVC" },
      { id: 113, name: "Paper and board: board", wasteId: 3, code: "PAPER_BOARD_BOARD" },
      { id: 114, name: "Paper and board: mixed", wasteId: 3, code: "PAPER_BOARD_MIXED" },
      { id: 115, name: "Paper and board: paper", wasteId: 3, code: "PAPER_BOARD_PAPER" },

      { id: 116, name: "Average construction", wasteId: 4, code: "AVERAGE_CONSTRUCTION" },
      { id: 117, name: "Mineral oil", wasteId: 4, code: "MINERAL_OIL" },
      { id: 118, name: "Household residual waste", wasteId: 4, code: "HOUSEHOLD_RESIDUAL_WASTE" },
      { id: 119, name: "WEEE - large", wasteId: 4, code: "WEEE_LARGE" },
      { id: 120, name: "WEEE - mixed", wasteId: 4, code: "WEEE_MIXED" },
      { id: 121, name: "WEEE - small", wasteId: 4, code: "WEEE_SMALL" },
      { id: 122, name: "Metal: aluminium cans and foil (excl. forming)", wasteId: 4, code: "METAL_ALUMINIUMCANS_FOIL" },
      { id: 123, name: "Metal: mixed cans", wasteId: 4, code: "METAL_MIXED_CANS" },
      { id: 124, name: "Metal: scrap metal", wasteId: 4, code: "METAL_SCRAP_METAL" },
      { id: 125, name: "Metal: steel cans", wasteId: 4, code: "METAL_STEEL_CANS" },
      { id: 126, name: "Plastics: average plastics", wasteId: 4, code: "PLASTICS_AVERAGE_PLASTICS" },
      { id: 127, name: "Plastics: average plastic film", wasteId: 4, code: "PLASTICS_AVERAGE_PLASTIC_FILM" },
      { id: 128, name: "Plastics: average plastic rigid", wasteId: 4, code: "PLASTICS_AVERAGE_PLASTIC_RIGID" },
      { id: 129, name: "Plastics: HDPE (incl. forming)", wasteId: 4, code: "PLASTICS_HDPE" },
      { id: 130, name: "Plastics: LDPE and LLDPE (incl. forming)", wasteId: 4, code: "PLASTICS_LDPE_LLDPE" },
      { id: 131, name: "Plastics: PET (incl. forming)", wasteId: 4, code: "PLASTICS_PET" },
      { id: 132, name: "Plastics: PP (incl. forming)", wasteId: 4, code: "PLASTICS_PP" },
      { id: 133, name: "Plastics: PS (incl. forming)", wasteId: 4, code: "PLASTICS_PS" },
      { id: 134, name: "Plastics: PVC (incl. forming)", wasteId: 4, code: "PLASTICS_PVC" },
      { id: 135, name: "Paper and board: board", wasteId: 4, code: "PAPER_BOARD_BOARD" },
      { id: 136, name: "Paper and board: mixed", wasteId: 4, code: "PAPER_BOARD_MIXED" },
      { id: 137, name: "Paper and board: paper", wasteId: 4, code: "PAPER_BOARD_PAPER" },

      { id: 138, name: "Paper and board: board", wasteId: 5, code: "PAPER_BOARD_BOARD" },
      { id: 139, name: "Paper and board: mixed", wasteId: 5, code: "PAPER_BOARD_MIXED" },
      { id: 140, name: "Paper and board: paper", wasteId: 5, code: "PAPER_BOARD_PAPER" },

      { id: 141, name: "Aggregates", wasteId: 6, code: "AGGREGATES" },
      { id: 142, name: "Asbestos", wasteId: 6, code: "ASPHALT" },
      { id: 143, name: "Asphalt", wasteId: 6, code: "ASPHALT" },
      { id: 144, name: "Bricks", wasteId: 6, code: "BRICKS" },
      { id: 145, name: "Concrete", wasteId: 6, code: "CONCRETE" },
      { id: 146, name: "Insulation", wasteId: 6, code: "INSULATION" },
      { id: 147, name: "Plasterboard", wasteId: 6, code: "PLASTERBOARD" },
      { id: 148, name: "Household residual waste", wasteId: 6, code: "HOUSEHOLD_RESIDUAL_WASTE" },
      { id: 149, name: "WEEE - large", wasteId: 6, code: "WEEE_LARGE" },
      { id: 150, name: "WEEE - mixed", wasteId: 6, code: "WEEE_MIXED" },
      { id: 151, name: "WEEE - small", wasteId: 6, code: "WEEE_SMALL" },
      { id: 152, name: "Metal: aluminium cans and foil (excl. forming)", wasteId: 6, code: "METAL_ALUMINIUMCANS_FOIL" },
      { id: 153, name: "Metal: mixed cans", wasteId: 6, code: "METAL_MIXED_CANS" },
      { id: 154, name: "Metal: scrap metal", wasteId: 6, code: "METAL_SCRAP_METAL" },
      { id: 155, name: "Metal: steel cans", wasteId: 6, code: "METAL_STEEL_CANS" },
      { id: 156, name: "Plastics: average plastics", wasteId: 6, code: "PLASTICS_AVERAGE_PLASTICS" },
      { id: 157, name: "Plastics: average plastic film", wasteId: 6, code: "PLASTICS_AVERAGE_PLASTIC_FILM" },
      { id: 158, name: "Plastics: average plastic rigid", wasteId: 6, code: "PLASTICS_AVERAGE_PLASTIC_RIGID" },
      { id: 159, name: "Plastics: HDPE (incl. forming)", wasteId: 6, code: "PLASTICS_HDPE" },
      { id: 160, name: "Plastics: LDPE and LLDPE (incl. forming)", wasteId: 6, code: "PLASTICS_LDPE_LLDPE" },
      { id: 161, name: "Plastics: PET (incl. forming)", wasteId: 6, code: "PLASTICS_PET" },
      { id: 162, name: "Plastics: PP (incl. forming)", wasteId: 6, code: "PLASTICS_PP" },
      { id: 163, name: "Plastics: PS (incl. forming)", wasteId: 6, code: "PLASTICS_PS" },
      { id: 164, name: "Plastics: PVC (incl. forming)", wasteId: 6, code: "PLASTICS_PVC" },
      { id: 165, name: "Paper and board: board", wasteId: 6, code: "PAPER_BOARD_BOARD" },
      { id: 166, name: "Paper and board: mixed", wasteId: 6, code: "PAPER_BOARD_MIXED" },
      { id: 167, name: "Paper and board: paper", wasteId: 6, code: "PAPER_BOARD_PAPER" },]

    this.purposes = [
      { id: 1, name: "purpose 1" },
      { id: 2, name: "purpose 2" }]



    this.units = [
      { id: 1, name: "l" },
      { id: 2, name: "m3" },
      { id: 2, name: "LKR" }]



    this.sources = [
      { id: 1, name: "Stationary", code: SourceType.STATIOANRY },
      { id: 2, name: "Mobile", code: SourceType.MOBILE },
    ]

    this.tieres = [
      { id: 1, name: "Tier1", code: ProjectUnitEmissionSourceTier.ONE },
      { id: 2, name: "Tier2", code: ProjectUnitEmissionSourceTier.ONE },
      { id: 2, name: "Tier3", code: ProjectUnitEmissionSourceTier.ONE },
    ]

    this.industries = [
      { id: 1, name: "Energy" },
      { id: 2, name: "Manufacturing and Construction" },
      { id: 2, name: "Commercial/Institutional" },
      { id: 2, name: "Residential and Agriculture/Foresty/Fishing" },
    ]

    this.countries = [
      { id: 1, name: "SriLanka", code: "LK" },
      { id: 2, name: "India", code: "IND" },

    ]

    this.emsources = [
      { id: 1, name: "Freight Transport" },
      { id: 2, name: "Passenger Transport" },
      { id: 3, name: "Freight Water" },
      { id: 4, name: "Off-Road" },


    ]


    this.strokes = [
      { id: 1, name: "Two Stroke", code: "TWO" },
      { id: 2, name: "Four Stroke", code: "FOUR" },


    ]

    this.units_Marine = [
      { id: 1, name: "tonnes" },
      { id: 2, name: "litters" },
      { id: 3, name: "kWh (Net CV)" },
      { id: 4, name: "kWh (Gross CV)" },

    ]

    this.currencies = [
      { id: 1, name: "USD($)", code: "USD" },
      { id: 2, name: "EUR(€)", code: "EUR" },
      { id: 3, name: "LKR(Rs)", code: "LKR" },
      { id: 4, name: "INR(₹)", code: "INR" }]

    this.wasteTypes = [
      { id: 1, name: "1" },
      { id: 2, name: "2" }]

    this.disposalMethods = [
      { id: 1, name: "Re-use" },
      { id: 2, name: "Open loop" },
      { id: 3, name: "Closed-loop" },
      { id: 4, name: "Combusion" },
      { id: 5, name: "Composting" },
      { id: 6, name: "Landfill" },
      { id: 7, name: "Anaerobic digestion" },
      { id: 8, name: "Piggery Feeding" },
      { id: 9, name: "Incineration" },
    ]
    this.disposal_type_waste_generated_in_operations = [
      { id: 1, name: "Re-use" },
      { id: 2, name: "Open loop" },
      { id: 3, name: "Closed-loop" },
      { id: 4, name: "Combusion" },
      { id: 5, name: "Composting" },
      { id: 6, name: "Landfill" },
      { id: 7, name: "Anaerobic digestion" },
      { id: 8, name: "Piggery Feeding" },
      { id: 9, name: "Incineration" },
    ]

    //capital goods
    this.capital_goods_types = [
      { id: 1, name: "Equipment" },
      { id: 2, name: "Machinery" },
      { id: 3, name: "Buildings" },
      { id: 4, name: "Vehicles" },
    ]


    this.capital_goods_categories = [
      { id: 1, name: "Category1", typeId: 1, code: "EMBEDDED_EQUIPMENT_CATEGORY1" },
      { id: 2, name: "Category2", typeId: 1, code: "EMBEDDED_EQUIPMENT_CATEGORY2" },
      { id: 3, name: "Category3", typeId: 1, code: "EMBEDDED_EQUIPMENT_CATEGORY3" },

      { id: 4, name: "Category1", typeId: 2, code: "EMBEDDED_MACHINERY_CATEGORY1" },
      { id: 5, name: "Category2", typeId: 2, code: "EMBEDDED_MACHINERY_CATEGORY2" },
      { id: 6, name: "Category3", typeId: 2, code: "EMBEDDED_MACHINERY_CATEGORY3" },

      { id: 4, name: "Warehouse", typeId: 3, code: "EMBEDDED_BUILDINGS_WAREHOUSE" },
      { id: 5, name: "Office", typeId: 3, code: "EMBEDDED_BUILDINGS_OFFICE" },
      { id: 6, name: "Factories", typeId: 3, code: "EMBEDDED_BUILDINGS_FACTORIES" },


      { id: 7, name: "Passenger Cars", typeId: 4, code: "EMBEDDED_VEHICLES_PASSENGER_CARS" },
      { id: 8, name: "Vans", typeId: 4, code: "EMBEDDED_VEHICLES_VANS" },
      { id: 9, name: "Bus", typeId: 4, code: "EMBEDDED_VEHICLES_BUS" },
      { id: 10, name: "Motorcycles", typeId: 4, code: "EMBEDDED_VEHICLES_MOTORCYCLES" },
      { id: 11, name: "ThreeWheel", typeId: 4, code: "EMBEDDED_VEHICLES_THREEWHEEL" },
      { id: 12, name: "Trucks", typeId: 4, code: "EMBEDDED_VEHICLES_TRUCKS" },


    ]



    this.cookingEmissionSources = [
      { id: 1, name: "Biogas" },
      { id: 2, name: "LP Gas" }]

    this.cookingGasTypes = [
      { id: 1, name: "Landfill Gas", sourceId: 1, code: "LANDFILLGAS" },
      { id: 2, name: "Sludge Gas", sourceId: 1, code: "SLUDGEGAS" },
      { id: 3, name: "Other Biogas", sourceId: 1, code: "OTHERBIOGAS" },
      { id: 4, name: "LP Gas", sourceId: 2, code: "LP_GAS" },
      // { id: 5, name: "Manufacturing Industries and construction", sourceId: 2, code: "MANUFACTURING_INDUSTRIES_AND_CONSTRUCTION" },
      // { id: 6, name: "Commercial/ Institutional", sourceId: 2 , code: "COMMERCIAL_INSTITUTIONAL"},
      // { id: 7, name: "Residential and Agriculture/Forestry/Fishing/Fishing Farm", sourceId: 2 , code: "RESIDENTIAL_AND_AGRICULTURE_FORESTRY_FISHING_FISHING_FARM"},
    ]


    this.disposalWasteTypes = [
      { id: 1, name: "Average construction", wasteId: 1, code: "AVERAGE_CONSTRUCTION" },
      { id: 2, name: "tyres", wasteId: 1, code: "TYRES" },
      { id: 3, name: "Wood", wasteId: 1, code: "WOOD" },

      { id: 4, name: "Average construction", wasteId: 2, code: "AVERAGE_CONSTRUCTION" },
      { id: 5, name: "Tyres", wasteId: 2, code: "TYRES" },
      { id: 6, name: "Wood", wasteId: 2, code: "WOOD" },
      { id: 7, name: "Glass", wasteId: 2, code: "GLASS" },
      { id: 8, name: "Municipal waste", wasteId: 2, code: "MUNICIPAL_WASTE" },
      { id: 9, name: "WEEE", wasteId: 2, code: "WEEE" },
      { id: 10, name: "WEEE - Fridges and freezers", wasteId: 2, code: "WEEE_FRIDGES_AND_FREEZERS" },
      { id: 11, name: "batteries", wasteId: 2, code: "BATTERIES" },
      { id: 12, name: "Plastics", wasteId: 2, code: "PLASTICS" },

      { id: 13, name: "Average construction", wasteId: 3, code: "AVERAGE_CONSTRUCTION" },
      { id: 14, name: "Soils", wasteId: 3, code: "SOILS" },
      { id: 15, name: "Tyres", wasteId: 3, code: "TYRES" },
      { id: 16, name: "Wood", wasteId: 3, code: "WOOD" },
      { id: 17, name: "Books", wasteId: 3, code: "BOOKS" },
      { id: 18, name: "Glass", wasteId: 3, code: "GLASS" },
      { id: 19, name: "Clothing", wasteId: 3, code: "CLOTHING" },
      { id: 20, name: "Municipal waste", wasteId: 3, code: "MUNICIPAL_WASTE" },
      { id: 21, name: "Commercial and industrial waste", wasteId: 3, code: "COMMERCIAL_AND_INDUSTRIAL_WASTE" },
      { id: 22, name: "Metal", wasteId: 3, code: "METAL" },
      { id: 23, name: "Plastics", wasteId: 3, code: "PLASTICS" },
      { id: 24, name: "Paper and Board", wasteId: 3, code: "PAPER_AND_BOARD" },

      { id: 25, name: "Wood", wasteId: 4, code: "WOOD" },
      { id: 26, name: "Books", wasteId: 4, code: "BOOKS" },
      { id: 27, name: "Glass", wasteId: 4, code: "GLASS" },
      { id: 28, name: "Clothing", wasteId: 4, code: "CLOTHING" },
      { id: 29, name: "Municipal waste", wasteId: 4, code: "MUNICIPAL_WASTE" },
      { id: 30, name: "Organic: Food and drink waste", wasteId: 4, code: "ORGANIC_FOOD_AND_DRINK_WASTE" },
      { id: 31, name: "Organic: Garden waste", wasteId: 4, code: "ORGANIC_GARDEN_WASTE" },
      { id: 32, name: "Organic: Mixed food and garden waste", wasteId: 4, code: "ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE" },
      { id: 33, name: "Commercial and industrial waste", wasteId: 4, code: "COMMERCIAL_AND_INDUSTRIAL_WASTE" },
      { id: 34, name: "WEEE", wasteId: 4, code: "WEEE" },
      { id: 35, name: "Metal", wasteId: 4, code: "METAL" },
      { id: 36, name: "Plastics", wasteId: 4, code: "PLASTICS" },

      { id: 37, name: "Wood", wasteId: 5, code: "WOOD" },
      { id: 38, name: "Books", wasteId: 5, code: "BOOKS" },
      { id: 39, name: "Organic: Food and drink waste", wasteId: 5, code: "ORGANIC_FOOD_AND_DRINK_WASTE" },
      { id: 40, name: "Organic: Garden waste", wasteId: 5, code: "ORGANIC_GARDEN_WASTE" },
      { id: 41, name: "Organic: Mixed food and garden waste", wasteId: 5, code: "ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE" },
      { id: 42, name: "Paper and Board", wasteId: 5, code: "PAPER_AND_BOARD" },

      { id: 43, name: "Soils", wasteId: 6, code: "SOILS" },
      { id: 44, name: "Books", wasteId: 6, code: "BOOKS" },
      { id: 45, name: "Glass", wasteId: 6, code: "GLASS" },
      { id: 46, name: "Clothing", wasteId: 6, code: "CLOTHING" },
      { id: 47, name: "Municipal waste", wasteId: 6, code: "MUNICIPAL_WASTE" },
      { id: 48, name: "Organic: Food and drink waste", wasteId: 6, code: "ORGANIC_FOOD_AND_DRINK_WASTE" },
      { id: 49, name: "Organic: Garden waste", wasteId: 6, code: "ORGANIC_GARDEN_WASTE" },
      { id: 50, name: "Organic: Mixed food and garden waste", wasteId: 6, code: "ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE" },
      { id: 51, name: "WEEE", wasteId: 6, code: "WEEE" },
      { id: 52, name: "WEEE - Fridges and freezers", wasteId: 6, code: "WEEE_FRIDGES_AND_FREEZERS" },
      { id: 53, name: "Batteries", wasteId: 6, code: "BATTERIES" },
      { id: 54, name: "Metal", wasteId: 6, code: "METAL" },
      { id: 55, name: "Plastics", wasteId: 6, code: "PLASTICS" },
      { id: 56, name: "Paper and Board", wasteId: 6, code: "PAPER_AND_BOARD" },

      { id: 57, name: "Municipal waste", wasteId: 7, code: "MUNICIPAL_WASTE" },
      { id: 58, name: "Organic: Food and drink waste", wasteId: 7, code: "ORGANIC_FOOD_AND_DRINK_WASTE" },
      { id: 59, name: "Organic: Garden waste", wasteId: 7, code: "ORGANIC_GARDEN_WASTE" },
      { id: 60, name: "Organic: Mixed food and garden waste", wasteId: 7, code: "ORGANIC_MIXED_FOOD_AND_GARDEN_WASTE" },
      { id: 61, name: "Commercial and industrial waste", wasteId: 7, code: "COMMERCIAL_AND_INDUSTRIAL_WASTE" },

      { id: 62, name: "Waste", wasteId: 8, code: "WASTE" },

      { id: 63, name: "Paper/Cardboard", wasteId: 9, code: "PAPER_CARDBOARD" },
      { id: 64, name: "Textile", wasteId: 9, code: "TEXTILE" },
      { id: 65, name: "Food waste", wasteId: 9, code: "FOOD_WASTE" },
      { id: 66, name: "Wood", wasteId: 9, code: "WOOD" },
      { id: 67, name: "Garden and park waste", wasteId: 9, code: "GARDEN_AND_PARK_WASTE" },
      { id: 68, name: "Nappies", wasteId: 9, code: "NAPPIES" },
      { id: 69, name: "Rubber and leather", wasteId: 9, code: "RUBBER_AND_LEATHER" },
      { id: 70, name: "Plastics", wasteId: 9, code: "PLASTICS" },
      { id: 71, name: "Other wastes", wasteId: 9, code: "OTHER_WASTES" },
      { id: 72, name: "Domestic", wasteId: 9, code: "DOMESTIC" },
      { id: 73, name: "Industrial", wasteId: 9, code: "INDUSTRIAL" },

      { id: 74, name: "Aggregates", wasteId: 2, code: "AGGREGATES" },
      { id: 75, name: "Asphalt", wasteId: 2, code: "ASPHALT" },
      { id: 76, name: "Bricks", wasteId: 2, code: "BRICKS" },
      { id: 77, name: "Concrete", wasteId: 2, code: "CONCRETE" },
      { id: 78, name: "WEEE - large", wasteId: 2, code: "WEEE_LARGE" },
      { id: 79, name: "WEEE - mixed", wasteId: 2, code: "WEEE_MIXED" },
      { id: 80, name: "WEEE - small", wasteId: 2, code: "WEEE_SMALL" },
      { id: 81, name: "Metal: aluminium cans and foil (excl. forming)", wasteId: 2, code: "METAL_ALUMINIUMCANS_FOIL" },
      { id: 82, name: "Metal: mixed cans", wasteId: 2, code: "METAL_MIXED_CANS" },
      { id: 83, name: "Metal: scrap metal", wasteId: 2, code: "METAL_SCRAP_METAL" },
      { id: 84, name: "Metal: steel cans", wasteId: 2, code: "METAL_STEEL_CANS" },
      { id: 85, name: "Plastics: average plastics", wasteId: 2, code: "PLASTICS_AVERAGE_PLASTICS" },
      { id: 86, name: "Plastics: average plastic film", wasteId: 2, code: "PLASTICS_AVERAGE_PLASTIC_FILM" },
      { id: 87, name: "Plastics: average plastic rigid", wasteId: 2, code: "PLASTICS_AVERAGE_PLASTIC_RIGID" },
      { id: 88, name: "Plastics: HDPE (incl. forming)", wasteId: 2, code: "PLASTICS_HDPE" },
      { id: 89, name: "Plastics: LDPE and LLDPE (incl. forming)", wasteId: 2, code: "PLASTICS_LDPE_LLDPE" },
      { id: 90, name: "Plastics: PET (incl. forming)", wasteId: 2, code: "PLASTICS_PET" },
      { id: 91, name: "Plastics: PP (incl. forming)", wasteId: 2, code: "PLASTICS_PP" },
      { id: 92, name: "Plastics: PS (incl. forming)", wasteId: 2, code: "PLASTICS_PS" },
      { id: 93, name: "Plastics: PVC (incl. forming)", wasteId: 2, code: "PLASTICS_PVC" },
      { id: 94, name: "Aggregates", wasteId: 3, code: "AGGREGATES" },
      { id: 95, name: "Insulation", wasteId: 3, code: "INSULATION" },
      { id: 96, name: "Mineral oil", wasteId: 3, code: "MINERAL_OIL" },
      { id: 97, name: "Plasterboard", wasteId: 3, code: "PLASTERBOARD" },
      { id: 98, name: "Asphalt", wasteId: 3, code: "ASPHALT" },
      { id: 99, name: "Concrete", wasteId: 3, code: "CONCRETE" },
      { id: 100, name: "Metal: aluminium cans and foil (excl. forming)", wasteId: 3, code: "METAL_ALUMINIUMCANS_FOIL" },
      { id: 101, name: "Metal: mixed cans", wasteId: 3, code: "METAL_MIXED_CANS" },
      { id: 102, name: "Metal: scrap metal", wasteId: 3, code: "METAL_SCRAP_METAL" },
      { id: 103, name: "Metal: steel cans", wasteId: 3, code: "METAL_STEEL_CANS" },
      { id: 104, name: "Plastics: average plastics", wasteId: 3, code: "PLASTICS_AVERAGE_PLASTICS" },
      { id: 105, name: "Plastics: average plastic film", wasteId: 3, code: "PLASTICS_AVERAGE_PLASTIC_FILM" },
      { id: 106, name: "Plastics: average plastic rigid", wasteId: 3, code: "PLASTICS_AVERAGE_PLASTIC_RIGID" },
      { id: 107, name: "Plastics: HDPE (incl. forming)", wasteId: 3, code: "PLASTICS_HDPE" },
      { id: 108, name: "Plastics: LDPE and LLDPE (incl. forming)", wasteId: 3, code: "PLASTICS_LDPE_LLDPE" },
      { id: 109, name: "Plastics: PET (incl. forming)", wasteId: 3, code: "PLASTICS_PET" },
      { id: 110, name: "Plastics: PP (incl. forming)", wasteId: 3, code: "PLASTICS_PP" },
      { id: 111, name: "Plastics: PS (incl. forming)", wasteId: 3, code: "PLASTICS_PS" },
      { id: 112, name: "Plastics: PVC (incl. forming)", wasteId: 3, code: "PLASTICS_PVC" },
      { id: 113, name: "Paper and board: board", wasteId: 3, code: "PAPER_BOARD_BOARD" },
      { id: 114, name: "Paper and board: mixed", wasteId: 3, code: "PAPER_BOARD_MIXED" },
      { id: 115, name: "Paper and board: paper", wasteId: 3, code: "PAPER_BOARD_PAPER" },

      { id: 116, name: "Average construction", wasteId: 4, code: "AVERAGE_CONSTRUCTION" },
      { id: 117, name: "Mineral oil", wasteId: 4, code: "MINERAL_OIL" },
      { id: 118, name: "Household residual waste", wasteId: 4, code: "HOUSEHOLD_RESIDUAL_WASTE" },
      { id: 119, name: "WEEE - large", wasteId: 4, code: "WEEE_LARGE" },
      { id: 120, name: "WEEE - mixed", wasteId: 4, code: "WEEE_MIXED" },
      { id: 121, name: "WEEE - small", wasteId: 4, code: "WEEE_SMALL" },
      { id: 122, name: "Metal: aluminium cans and foil (excl. forming)", wasteId: 4, code: "METAL_ALUMINIUMCANS_FOIL" },
      { id: 123, name: "Metal: mixed cans", wasteId: 4, code: "METAL_MIXED_CANS" },
      { id: 124, name: "Metal: scrap metal", wasteId: 4, code: "METAL_SCRAP_METAL" },
      { id: 125, name: "Metal: steel cans", wasteId: 4, code: "METAL_STEEL_CANS" },
      { id: 126, name: "Plastics: average plastics", wasteId: 4, code: "PLASTICS_AVERAGE_PLASTICS" },
      { id: 127, name: "Plastics: average plastic film", wasteId: 4, code: "PLASTICS_AVERAGE_PLASTIC_FILM" },
      { id: 128, name: "Plastics: average plastic rigid", wasteId: 4, code: "PLASTICS_AVERAGE_PLASTIC_RIGID" },
      { id: 129, name: "Plastics: HDPE (incl. forming)", wasteId: 4, code: "PLASTICS_HDPE" },
      { id: 130, name: "Plastics: LDPE and LLDPE (incl. forming)", wasteId: 4, code: "PLASTICS_LDPE_LLDPE" },
      { id: 131, name: "Plastics: PET (incl. forming)", wasteId: 4, code: "PLASTICS_PET" },
      { id: 132, name: "Plastics: PP (incl. forming)", wasteId: 4, code: "PLASTICS_PP" },
      { id: 133, name: "Plastics: PS (incl. forming)", wasteId: 4, code: "PLASTICS_PS" },
      { id: 134, name: "Plastics: PVC (incl. forming)", wasteId: 4, code: "PLASTICS_PVC" },
      { id: 135, name: "Paper and board: board", wasteId: 4, code: "PAPER_BOARD_BOARD" },
      { id: 136, name: "Paper and board: mixed", wasteId: 4, code: "PAPER_BOARD_MIXED" },
      { id: 137, name: "Paper and board: paper", wasteId: 4, code: "PAPER_BOARD_PAPER" },

      { id: 138, name: "Paper and board: board", wasteId: 5, code: "PAPER_BOARD_BOARD" },
      { id: 139, name: "Paper and board: mixed", wasteId: 5, code: "PAPER_BOARD_MIXED" },
      { id: 140, name: "Paper and board: paper", wasteId: 5, code: "PAPER_BOARD_PAPER" },

      { id: 141, name: "Aggregates", wasteId: 6, code: "AGGREGATES" },
      { id: 142, name: "Asbestos", wasteId: 6, code: "ASPHALT" },
      { id: 143, name: "Asphalt", wasteId: 6, code: "ASPHALT" },
      { id: 144, name: "Bricks", wasteId: 6, code: "BRICKS" },
      { id: 145, name: "Concrete", wasteId: 6, code: "CONCRETE" },
      { id: 146, name: "Insulation", wasteId: 6, code: "INSULATION" },
      { id: 147, name: "Plasterboard", wasteId: 6, code: "PLASTERBOARD" },
      { id: 148, name: "Household residual waste", wasteId: 6, code: "HOUSEHOLD_RESIDUAL_WASTE" },
      { id: 149, name: "WEEE - large", wasteId: 6, code: "WEEE_LARGE" },
      { id: 150, name: "WEEE - mixed", wasteId: 6, code: "WEEE_MIXED" },
      { id: 151, name: "WEEE - small", wasteId: 6, code: "WEEE_SMALL" },
      { id: 152, name: "Metal: aluminium cans and foil (excl. forming)", wasteId: 6, code: "METAL_ALUMINIUMCANS_FOIL" },
      { id: 153, name: "Metal: mixed cans", wasteId: 6, code: "METAL_MIXED_CANS" },
      { id: 154, name: "Metal: scrap metal", wasteId: 6, code: "METAL_SCRAP_METAL" },
      { id: 155, name: "Metal: steel cans", wasteId: 6, code: "METAL_STEEL_CANS" },
      { id: 156, name: "Plastics: average plastics", wasteId: 6, code: "PLASTICS_AVERAGE_PLASTICS" },
      { id: 157, name: "Plastics: average plastic film", wasteId: 6, code: "PLASTICS_AVERAGE_PLASTIC_FILM" },
      { id: 158, name: "Plastics: average plastic rigid", wasteId: 6, code: "PLASTICS_AVERAGE_PLASTIC_RIGID" },
      { id: 159, name: "Plastics: HDPE (incl. forming)", wasteId: 6, code: "PLASTICS_HDPE" },
      { id: 160, name: "Plastics: LDPE and LLDPE (incl. forming)", wasteId: 6, code: "PLASTICS_LDPE_LLDPE" },
      { id: 161, name: "Plastics: PET (incl. forming)", wasteId: 6, code: "PLASTICS_PET" },
      { id: 162, name: "Plastics: PP (incl. forming)", wasteId: 6, code: "PLASTICS_PP" },
      { id: 163, name: "Plastics: PS (incl. forming)", wasteId: 6, code: "PLASTICS_PS" },
      { id: 164, name: "Plastics: PVC (incl. forming)", wasteId: 6, code: "PLASTICS_PVC" },
      { id: 165, name: "Paper and board: board", wasteId: 6, code: "PAPER_BOARD_BOARD" },
      { id: 166, name: "Paper and board: mixed", wasteId: 6, code: "PAPER_BOARD_MIXED" },
      { id: 167, name: "Paper and board: paper", wasteId: 6, code: "PAPER_BOARD_PAPER" },


    ]


    this.boilerTypes = [
      { id: 1, name: "Furnace Oil" },
      { id: 2, name: "Solid Biomass" }]

    this.refrigerant_units = [
      { id: 1, name: "kg" }
    ]

    this.municipal_water_categories = [
      { id: 1, name: "Domestic - SamurdhiRecipients", code: "DOMESTIC_SAMURDHIRECIPIENTS" },
      { id: 2, name: "Domestic other than Samurdhi Recipients & Tenement Garden", code: "DOMESTIC_OTHER_THAN_SAMURDHI_RECIPIENTS_TENEMENT_GARDEN" },
      { id: 3, name: "Tenement & Gardens", code: "TENEMENT_GARDENS" },
      { id: 4, name: "Public Stand Posts and Garden Taps", code: "PUBLIC_STAND_POSTS_GARDEN_TAPS" },
      { id: 5, name: "Schools, Religious & Charitable Institutions", code: "SCHOOLS_RELIGIOUS_CHARITABLE_INSTITUTIONS" },
      { id: 6, name: "Government Institution & Industries Other Than SME", code: "GOVERNMENT_INSTITUTION_INDUSTRIES_OTHER_THAN_SME" },
      { id: 7, name: "Government Hospitals", code: "GOVERNMENT_HOSPITALS" },
      { id: 8, name: "Small & Medium Industries", code: "SMALL_MEDIUM_INDUSTRIES" },
      { id: 9, name: "Commercial Institutes", code: "COMMERCIAL_INSTITUTES" },
      { id: 10, name: "Port & Shipping", code: "PORT_SHIPPING" },
      { id: 11, name: "BOI Approved Industries", code: "BOI_APPROVED_INDUSTRIES" },
      { id: 12, name: "Bulk Supply", code: "BULK_SUPPLY" },
    ]

    /* Units of emission source parameters */
    /* Units of emission source parameters */

    this.net_zero_business_travel_transport_modes_distance = [
      { id: 1, name: "Van", code: "VAN" },
      { id: 2, name: "Jeep", code: "JEEP" },
      { id: 3, name: "Car", code: "CAR" },
      { id: 4, name: "Prime Move", code: "PRIME_MOVE" },
      { id: 5, name: "Bike", code: "BIKE" },
      { id: 6, name: "Threewheel", code: "THREEWHEEL" },
      { id: 7, name: "Van Diesel", code: "VAN_DIESEL" },
      { id: 8, name: "Medium Bus Diesel", code: "MEDIUM_BUS_DIESEL" },
      { id: 9, name: "Bus Diesel", code: "BUS_DIESEL" },
      { id: 10, name: "Railway", code: "RAILWAY" },
      { id: 11, name: "None", code: "NONE" }
    ]

    this.net_zero_business_travel_transport_modes_amount = [
      { id: 1, name: "Van", code: "EEIO_EMISSION_FACTORS_VAN" },
      { id: 2, name: "Jeep", code: "EEIO_EMISSION_FACTORS_JEEP" },
      { id: 3, name: "Car", code: "EEIO_EMISSION_FACTORS_CAR" },
      { id: 4, name: "Prime Move", code: "EEIO_EMISSION_FACTORS_PRIME_MOVE" },
      { id: 5, name: "Bike", code: "EEIO_EMISSION_FACTORS_BIKE" },
      { id: 6, name: "Threewheel", code: "EEIO_EMISSION_FACTORS_THREEWHEEL" },
      { id: 7, name: "Van Diesel", code: "EEIO_EMISSION_FACTORS_VAN_DIESEL" },
      { id: 8, name: "Medium Bus Diesel", code: "EEIO_EMISSION_FACTORS_MEDIUM_BUS_DIESEL" },
      { id: 9, name: "Bus Diesel", code: "EEIO_EMISSION_FACTORS_BUS_DIESEL" },
      { id: 10, name: "Railway", code: "EEIO_EMISSION_FACTORS_RAILWAY" },
      { id: 11, name: "None", code: "EEIO_EMISSION_FACTORS_NONE" }
    ]

    this.net_zero_employee_commuting_transport_modes = [
      { id: 1, name: "Van", code: "VAN" },
      { id: 2, name: "Jeep", code: "JEEP" },
      { id: 3, name: "Car", code: "CAR" },
      { id: 4, name: "Prime Move", code: "PRIME_MOVE" },
      { id: 5, name: "Bike", code: "BIKE" },
      { id: 6, name: "Threewheel", code: "THREEWHEEL" },
      { id: 7, name: "Van Diesel", code: "VAN_DIESEL" },
      { id: 8, name: "Medium Bus Diesel", code: "MEDIUM_BUS_DIESEL" },
      { id: 9, name: "Bus Diesel", code: "BUS_DIESEL" },
      { id: 10, name: "Railway", code: "RAILWAY" },
      { id: 11, name: "None", code: "NONE" }
    ]


    this.investments_units = {
      emission: [this.parameterUnits.TCO2]
    }

    this.upstream_lead_asset_units = {
      consumptions: [this.parameterUnits.M3, this.parameterUnits.L],
      emission: [this.parameterUnits.KGCO2E],
      area: [this.parameterUnits.M2],
      consume_ref: [this.parameterUnits.KG],
      consume_elec: [this.parameterUnits.KWH]

    }






    this.electricity_units = {
      consumption: [this.parameterUnits.KWH]
    }

    this.boiler_units = {
      consumption: [this.parameterUnits.L, this.parameterUnits.KG]
    }

    this.fire_extinguisher_units = {
      weightPerTank: [this.parameterUnits.KG, this.parameterUnits.G]
    }

    this.generator_units = {
      consumption: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR]
    }

    this.refrigerant_units = {
      wrg: [this.parameterUnits.KG, this.parameterUnits.G]
    }

    this.welding_units = {
      ac: [this.parameterUnits.KG],
      lc: [this.parameterUnits.KG]
    }

    this.forklifts_units = {
      consumption: [this.parameterUnits.L]
    }

    this.waste_water_units = {
      tip: [this.parameterUnits.TYR],
      wasteGenerated: [this.parameterUnits.M3T],
      cod: [this.parameterUnits.KGCODM3],
      sludgeRemoved: [this.parameterUnits.KGCODYR],
      recoveredCh4: [this.parameterUnits.KGCH4YR]
    }

    this.municipal_water_units = {
      consumption: [this.parameterUnits.M3, this.parameterUnits.L, this.parameterUnits.LKR],
    }


    this.fuel_energy_activity_units = {
      consumption: [this.parameterUnits.M3, this.parameterUnits.L],
      consumption_elec: [this.parameterUnits.KWH],

    }
    this.waste_disposal_units = {
      disposed: [this.parameterUnits.KG, this.parameterUnits.T],
    }

    this.cooking_gas_units = {
      consumption: [this.parameterUnits.KG],
    }

    this.road_freight_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR],
      distance: [this.parameterUnits.KM, this.parameterUnits.LKR],
      weight: [this.parameterUnits.T],
      fuelEconomy: [this.parameterUnits.KML],
    }

    this.air_freight_units = {
      distance: [this.parameterUnits.KM, this.parameterUnits.LKR],
      weight: [this.parameterUnits.T]
    }

    this.water_freight_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.T, this.parameterUnits.KWHNETCV, this.parameterUnits.KWHGROSSCV],
      distance: [this.parameterUnits.KM, this.parameterUnits.LKR],
      weight: [this.parameterUnits.T]
    }

    this.rail_freight_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR, this.parameterUnits.KG],
      distance: [this.parameterUnits.KM, this.parameterUnits.NM, this.parameterUnits.PORT, this.parameterUnits.LKR],
      distUpDown: [this.parameterUnits.KM, this.parameterUnits.LKR],
      weight: [this.parameterUnits.T, this.parameterUnits.KG]
    }

    this.passenger_road_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR],
      distance: [this.parameterUnits.KM, this.parameterUnits.LKR],
      fuelEconomy: [this.parameterUnits.KML],
      ecDistance: [this.parameterUnits.KM],
      publicDistance: [this.parameterUnits.PKM],
      ecFuel: [this.parameterUnits.L, this.parameterUnits.M3]
    }
    this.net_zero_business_travel_types = {
      distance: this.net_zero_business_travel_transport_modes_distance,
      amount: this.net_zero_business_travel_transport_modes_amount,
      fuel: [...this.railFuelType],
      ref: [...this.gWP_RGs]
    }
    this.net_zero_employee_commuting_types = {
      distance: this.net_zero_employee_commuting_transport_modes,
      amount: this.net_zero_employee_commuting_transport_modes,
      fuel: [...this.railFuelType],
      ref: [...this.gWP_RGs]
    }




    this.net_zero_business_travel_units = {
      fuel: [this.parameterUnits.L],
      grid: [this.parameterUnits.KWH],
      ref: [],
      distance: [this.parameterUnits.PKM, this.parameterUnits.VKM],
      amount: [{ id: 1, label: "USD($)", code: "USD" }]
    }

    this.downstreamTransportationUnits = {
      volUnits: [this.parameterUnits.M3],
      grid: [this.parameterUnits.KWH],
      ref: [this.parameterUnits.KG],
      fuel: [this.parameterUnits.L],
      presantage: [this.parameterUnits.PRS],
      currencies: [this.parameterUnits.USD],
      EEIO_EF: [this.parameterUnits.EEIO_EF],
      distance: [this.parameterUnits.KM],
      weight: [this.parameterUnits.T],
      facility: [this.parameterUnits.TCO2EM3],
    }

    this.net_zero_employee_commuting_units = {
      fuel: [this.parameterUnits.L],
      grid: [this.parameterUnits.KWH],
      ref: [],
      distance: [this.parameterUnits.PKM, this.parameterUnits.VKM],
      amount: [{ id: 1, label: "USD($)", code: "USD" }]
    }

    this.net_zero_franchises_units = {
      emission: [this.parameterUnits.KGCO2E],
      area: [this.parameterUnits.M2],
      energy: [this.parameterUnits.KWH],
      presenttage: [this.parameterUnits.PRS],
      building_type_average_emission_factor_units: [this.parameterUnits.KGCO2EM2Y],
      average_emissions_of_building_units: [this.parameterUnits.KGCO2EBAY],
    }


    this._waste_generated_in_operations_units = {
      scope: [this.parameterUnits.TCO2],

      wasteProduced: [this.parameterUnits.T],
      massWaste: [this.parameterUnits.M3],

    }

    this.offroad_freight_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR],
      distance: [this.parameterUnits.KM, this.parameterUnits.NM, this.parameterUnits.PORT, this.parameterUnits.LKR]
    }


    this.offroad_freight_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR],
      distance: [this.parameterUnits.KM, this.parameterUnits.NM, this.parameterUnits.PORT, this.parameterUnits.LKR]
    }

    /* End */

    this.passenger_offroad_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR],
      distance: [this.parameterUnits.KM],
      fuelEconomy: [this.parameterUnits.KML]
    }

    this.passenger_rail_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR, this.parameterUnits.KG],
      distance: [this.parameterUnits.KM, this.parameterUnits.PKM],
      fuelEconomy: [this.parameterUnits.KML]
    }

    this.passenger_water_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR],
      distance: [this.parameterUnits.KM]
    }

    this.offroad_machinery_units = {
      fuel: [this.parameterUnits.L, this.parameterUnits.M3, this.parameterUnits.LKR],
      distance: [this.parameterUnits.KM, this.parameterUnits.LKR],
      fuelEconomy: [this.parameterUnits.KML]
    }

    this.supplier_units = {
      amount: [this.parameterUnits.KG],
      ef: [this.parameterUnits.KGCO2EKG]
    }

    this.eoltsold_products_units = {
      mass: [this.parameterUnits.KG],
    }

    this.capital_goods_units = {
      qty: [this.parameterUnits.M2,this.parameterUnits.QTY],
      ef_units:[this.parameterUnits.TCO2EQTY,this.parameterUnits.TCO2EM2]
    }



    /* (END) Units of emission source parameters*/

    this.revenue_units = [
      { id: 1, name: 'Million', code: 'MILLION', factor: 1000000 },
      { id: 2, name: 'Billion', code: 'BILLION', factor: 1000000000 }
    ]

    /* Transport parameters */
    this.domesticInternationals = [
      { id: 1, name: "Domestic", code: "DOMESTIC" },
      { id: 2, name: "International", code: "INTERNATIONAL" }
    ]

    this.freightModes = [
      { id: 1, name: "Air" },
      { id: 2, name: "Road" },
      { id: 3, name: "Water" },
      { id: 4, name: "Rail" },
      { id: 5, name: "Off-Road" },
    ]

    this.ownership_freightTransport = [
      { id: 1, name: "Own" },
      { id: 2, name: "Hired" },
      { id: 3, name: "Rented" },
      { id: 4, name: "Other" }
    ]

    this.depatureCountry_freightTransport = [
      { id: 1, name: "SriLanka" },
      { id: 2, name: "India" },
      { id: 3, name: "Pakistan" },]

    this.departureAirport_freightTransport = [
      { id: 1, name: "Katunayake" },
      { id: 2, name: "New Delhi" },
      { id: 3, name: "Mombai" },]

    this.destinationCountry_freightTransport = [
      { id: 1, name: "SriLanka" },
      { id: 2, name: "India" },
      { id: 3, name: "Pakistan" },]

    this.destinationAirport_freightTransport = [
      { id: 1, name: "Katunayake" },
      { id: 2, name: "New Delhi" },
      { id: 3, name: "Mombai" },]

    this.transient_freightTransport = [
      { id: 1, name: "A" },
      { id: 2, name: "R" },
      { id: 3, name: "W" },
      { id: 4, name: "Ra" },
      { id: 5, name: "Off" },
    ]

    this.distanceTravelledUnits_freightTransport = [
      { id: 1, name: "Km" },

    ]

    this.methods_freightTransport = [
      { id: 1, name: "Fuel Based" },
      { id: 2, name: "Distance Based" },
    ]

    this.methods_netZeroBusinessTravel = [
      { id: 1, name: "Fuel Based", value: 'fuel-base' },
      { id: 2, name: "Distance Based", value: 'distance-base' },
      { id: 2, name: "Spend Based", value: 'spend-base' },
    ]

    this.methods_franchise = [
      { id: 1, name: "Franchise-specific method", value: 'SPECIFIC-METHOD' },
      { id: 2, name: "franchise buildings that are not sub-metered", value: 'NOT-SUB-METERED' },
      { id: 2, name: "Extrapolating emissions from sample groups", value: 'SAMPLE-GROUPS' },
      { id: 2, name: "Average data method for leased buildings", value: 'AVERAGE-DATA-METHOD-FLOOR-SPACE' },
      { id: 2, name: "Average data method for other asset types", value: 'AVERAGE-DATA-METHOD-NOT-FLOOR-SPACE' },


    ]

    this.methods_net_zero_employee_commuting = [
      { id: 1, name: "Fuel Based", value: 'fuel-base' },
      { id: 2, name: "Distance Based", value: 'distance-base' },
      { id: 2, name: "Average Data", value: 'average-data-base' },
    ]
    this.methods_waste_generated_in_operations = [
      { id: 1, name: "Supplier-specific method", value: 'supplier-specific' },
      { id: 2, name: "Waste-type-specific method", value: 'waste-type-specific' },
      { id: 2, name: "Average-data method", value: 'average-data' },
    ]
    this.solid_water_waste_generated_in_operations = [
      { id: 1, name: "Solid", value: 'solid' },
      { id: 2, name: "Water", value: 'water' },

    ]
    this.activities_upstreamLeasedAssets = [
      { id: 1, name: "Asset-specific method", value: 'fuel_asset_specific_method_data' },
      { id: 2, name: "Lessor-specific method", value: 'distance_lessor_specific_method_data' },
      { id: 2, name: "Average-data method for leased buildings", value: 'spend_leased_buildings_method_data' },
      { id: 2, name: "Average-data method for other assets", value: 'leased_assets_method_data' },

    ]

    this.methods_downstream_leased_assets = [
      { id: 1, name: "Asset-specific method", value: 'asset_specific_method_data' },
      { id: 2, name: "Lessor-specific method", value: 'lessor_specific_method_data' },
      { id: 2, name: "Average-data method for leased buildings", value: 'leased_buildings_method_data' },
      { id: 2, name: "Average-data method for other assets", value: 'leased_assets_method_data' },

    ]


    this.freightTypes_freightTransport = [
      { id: 1, name: "Type 1" },
      { id: 2, name: "Type 2" },
    ]

    this.destinationPort_freightTransport = [
      { id: 1, name: "colombo" },
      { id: 2, name: "New Delhi" },
      { id: 3, name: "Mombai" },]

    this.departurePort_freightTransport = [
      { id: 1, name: "colombo" },
      { id: 2, name: "New Delhi" },
      { id: 3, name: "Mombai" },]

    this.destinationStation_freightTransport = [
      { id: 1, name: "colombo" },
      { id: 2, name: "New Delhi" },
      { id: 3, name: "Mombai" },]

    this.departureStation_freightTransport = [
      { id: 1, name: "colombo" },
      { id: 2, name: "New Delhi" },
      { id: 3, name: "Mombai" },]



    this.vehicleModel_freightTransport = [
      { id: 1, name: "Asphalt Pavers/ Concreate" },
      { id: 2, name: "Plate Compactors/ Tampers/Rammers" },
      { id: 3, name: "Rollers" },
      { id: 4, name: "Trenches/Mini Excavators" },
      { id: 5, name: "Excavators (Wheel/ Crawler Type)" },
      { id: 6, name: "Cement and Motar Mixers" },
      { id: 7, name: "Cranes" },
      { id: 8, name: "Granders/ Scrapers" },
      { id: 9, name: "Off-highway trucks" },
      { id: 10, name: "Bulldozers" },
      { id: 11, name: "Tractors/Loaders/Backhoes" },
      { id: 12, name: "Skid Steer Loaders" },
      { id: 13, name: "Dumpers/Tenders" },
      { id: 14, name: "Aerial Lifts" },
      { id: 15, name: "Fork Lifts" },
      { id: 16, name: "Generator Sets" },
      { id: 17, name: "None" },
    ]

    this.activity_freightTransport = [
      { id: 1, name: "Cargo Ship" },
      { id: 2, name: "Sea Tanker" },
    ]

    this.size_freightTransport = [
      { id: 1, name: "200,000+dwt" },
      { id: 2, name: "120,000-199,999 dwt" },
      { id: 3, name: "80,000-119,999 dwt" },
      { id: 4, name: "60,000-79,999 dwt" },
      { id: 5, name: "10,000-59,999 dwt" },
      { id: 6, name: "0-9,999 dwt" },
    ]

    this.type_water_freightTransport = [
      { id: 1, name: "Crude Tanker" },
      { id: 2, name: "Product Tanker" },
      { id: 3, name: "Chemical Tanker" },
      { id: 4, name: "LNG Tanker" },
      { id: 5, name: "LPG Tanker" },
    ]

    this.p_water_vehicle_model = [
      { id: 1, name: "Ship", code: "SHIP" },
      { id: 2, name: "Boat", code: "BOAT" }
    ]


    //IPCC waste Disposal
    this.gasTypes = [
      { id: 1, name: "CH4" },
      { id: 2, name: "N20" },
      { id: 3, name: "CO2" },

    ]


    this.wasteBasis = [
      { id: 1, name: "Wet" },
      { id: 2, name: "Dry" },
    ]


    this.biologicalTreatments = [
      { id: 1, name: "Composting" },
      { id: 2, name: "Anaerobic digestion at biogas facilities" },
    ]


    this.wasteCategories = [
      { id: 1, name: "Municipal Solid waste" },
      { id: 2, name: "Industrial Waste" },
      { id: 3, name: "Swage Sludge" },
      { id: 4, name: "Hazardous Waste" },
      { id: 5, name: "Clinical Waste" },
      { id: 6, name: "Other" },




    ]

    this.treatmentTypeDischarge = [
      { id: 1, name: "Sea, river and lake discharge" },
      { id: 2, name: "Stagnant sewer" },
      { id: 3, name: "Flowing sewer (open or closed)" },
      { id: 4, name: "Centralized, aerobic treatment plant" },
      { id: 5, name: "Anaerobic digester for sludge" },

    ]

    this.WasteTypes.push(...[
      { wcat: "Municipal Solid waste", id: 1, name: "Paper/Cardboard" },
      { wcat: "Municipal Solid waste", id: 2, name: "Textiles" },
      { wcat: "Municipal Solid waste", id: 3, name: "Food waste" },
      { wcat: "Municipal Solid waste", id: 4, name: "Wood" },
      { wcat: "Municipal Solid waste", id: 5, name: "Garden and park waste" },
      { wcat: "Municipal Solid waste", id: 6, name: "Garden and park waste" },
      { wcat: "Municipal Solid waste", id: 7, name: "Nappies" },
      { wcat: "Municipal Solid waste", id: 8, name: "Rubber and leather" },
      { wcat: "Municipal Solid waste", id: 9, name: "Plastics" },
      { wcat: "Municipal Solid waste", id: 10, name: "Metal" },
      { wcat: "Municipal Solid waste", id: 11, name: "Glass" },
      { wcat: "Municipal Solid waste", id: 12, name: "Other, inset waste" },
      { wcat: "Municipal Solid waste", id: 13, name: "Total MSW" },
      { wcat: "Industrial Waste", id: 1, name: "Industrial Waste" },
      { wcat: "Swage Sludge", id: 1, name: "Swage Sludge" },
      { wcat: "Hazardous Waste", id: 1, name: "Hazardous Waste" },
      { wcat: "Clinical Waste", id: 1, name: "Clinical Waste" },
      { wcat: "Other", id: 1, name: "Other" },

    ])



    this.MSWTypes.push(...[
      { gasTypes: "CO2", id: 1, name: "MSW by components" },
      { gasTypes: "CO2", id: 2, name: "MSW by aggregated" },
      { gasTypes: "CH4", id: 1, name: "MSW by components" },
      { gasTypes: "N20", id: 1, name: "MSW by components" },

    ])

    this.industrialSectors = [
      { id: 1, name: "Alcohol Refining" },
      { id: 2, name: "Beer & Malt" },
      { id: 3, name: "Coffee" },
      { id: 4, name: "Dairy Products" },
      { id: 5, name: "Fish Processing" },
      { id: 6, name: "Meat & Poultry" },
      { id: 7, name: "Organic Chemicals" },
      { id: 8, name: "Petroleum Refineries" },
      { id: 9, name: "Plastics & Resins" },

    ]

    this.wdApproach = [
      { id: 1, name: "Waste by composition" },
      { id: 2, name: "Bulk waste data only" },


    ]

    this.climateZone = [
      { id: 1, name: "Boreal and temerate dry" },
      { id: 2, name: "Boreal and temerate wet" },
      { id: 3, name: "Tropical dry" },
      { id: 4, name: "Tropical wet" },



    ]

    this.fuelFacTypes = [
      { id: 1, code: "FuelFactor" },
      { id: 2, code: "FuelPrice" },
      { id: 3, code: "FuelSpecification" },

    ]

    this.options_freightTransport = [
      { id: 1, name: "One way", code: "ONE_WAY" },
      { id: 2, name: "Round Trip", code: "ROUND_TRIP" },

    ]


    this.cargoType_road_freightTransport = [
      { id: 1, name: "Agricultural products and live animals", code: "AGRICULTURAL_PRODUCTS_AND_LIVE_ANIMALS", },
      { id: 2, name: "Beverage", code: "BEVERAGE" },
      { id: 3, name: "Groceries", code: "GROCERIES" },
      { id: 4, name: "Perishable and semi-perishable foodstuff and canned food", code: "PERISHABLE_AND_SEMI_PERISHABLE_FOODSTUFF_AND_CANNED_FOOD" },
      { id: 5, name: "Other food products and fodder", code: "OTHER_FOOD_PRODUCTS_AND_FODDER" },
      { id: 6, name: "Solid minerul fuels and petroleum products", code: "SOLID_MINERUL_FUELS_AND_PETROLEUM_PRODUCTS" },
      { id: 7, name: "Ores and metal waste", code: "ORES_AND_METAL_WASTE" },
      { id: 8, name: "Metal products", code: "METAL_PRODUCTS" },
      { id: 9, name: "Mineral products", code: "MINERAL_PRODUCTS" },
      { id: 10, name: "Other crude and manufactured minerals and building materials", code: "OTHER_CRUDE_AND_MANUFACTURED_MINERALS_AND_BUILDING_MATERIALS" },
      { id: 11, name: "Fertilizers", code: "FERTILIZERS" },
      { id: 12, name: "Chemicals", code: "CHEMICALS" },
      { id: 13, name: "Transport equipment", code: "TRANSPORT_EQUIPMENT" },
      { id: 14, name: "Machinery and metal products", code: "MACHINERY_AND_METAL_PRODUCTS" },
      { id: 15, name: "Glass and ceramic and porcelain products", code: "GLASS_AND_CERAMIC_AND_PORCELAIN_PRODUCTS" },
      { id: 16, name: "Grouped goods", code: "GROUPED_GOODS" },
      { id: 17, name: "Other manufactured articles", code: "OTHER_MANUFACTURED_ARTICLES" },
      { id: 17, name: "Other", code: "OTHER" }, //update in freight road if removed
    ]
    this.cargoType_shared = [
      { id: 1, name: "Municipal waste", code: "MUNICIPAL_WASTE", },
      { id: 2, name: "Water bottles", code: "WATER_BOTTLES" },
      { id: 3, name: "Stationaries", code: "STATIONARIES" },
      { id: 4, name: "Machinery and metal products", code: "MACHINERY_AND_METAL_PRODUCTS" },
      { id: 5, name: "Chemicals", code: "CHEMICALS" },
      { id: 6, name: "Solid minerul fuels and petroleum products", code: "SOLID_MINERUL_FUELS_AND_PETROLEUM_PRODUCTS" },
      { id: 7, name: "Groceries", code: "GROCERIES" },
      { id: 8, name: "Organic: food and drink waste", code: "ORGANIC_FOOD_DRINK_WASTE" },
      { id: 9, name: "Organic: mixed food and garden waste", code: "ORGANIC_MIXED_FOOD_GARDEN_WASTE" },
      { id: 10, name: "Plastics", code: "PLASTICS" },
      { id: 11, name: "Paper and board", code: "PAPER_BOARD" },
      { id: 11, name: "Books", code: "BOOKS" },
    ]


    //Passenger transport 

    this.passengerModes = [
      { id: 1, name: "Air", code: "AIR" },
      { id: 2, name: "Road", code: "ROAD" },
      { id: 3, name: "Water", code: "WATER" },
      { id: 4, name: "Rail", code: "RAIL" },
      { id: 5, name: "Off-Road", code: "OFFROAD" },
      { id: 6, name: "Business Travel", code: "BT" },
    ]

    this.railActivities = [
      { id: 1, name: "Rail", code: "RAIL" },
    ]

    this.railTypes = [
      { id: 1, name: "Freight Train", code: "FREIGHT_TRAIN" }
    ]

    this.passenger_onroad_methods = [
      { id: 1, name: "Employee Commuting", code: "EC" },
      { id: 2, name: "Business Travel", code: "BT" }
    ]

    this.noEmission_transport_modes = [
      { id: 1, name: "Walking", code: "WALKING" },
      { id: 2, name: "Cycling", code: "CYCLING" },
      { id: 3, name: "Free Ride", code: "FREE_RIDE" },
      { id: 4, name: "None", code: "NONE" }
    ]

    this.public_transport_modes = [
      { id: 1, name: "Van Diesel", code: "VAN_DIESEL" },
      { id: 2, name: "Medium Bus Diesel", code: "MEDIUM_BUS_DIESEL" },
      { id: 3, name: "Bus Diesel", code: "BUS_DIESEL" },
      { id: 4, name: "Railway", code: "RAILWAY" },
      { id: 5, name: "None", code: "NONE" }
    ]

    this.private_transport_modes = [
      { id: 1, name: "Van", code: "VAN" },
      { id: 2, name: "Jeep", code: "JEEP" },
      { id: 3, name: "Car", code: "CAR" },
      { id: 4, name: "Prime Move", code: "PRIME_MOVE" },
      { id: 5, name: "Bike", code: "BIKE" },
      { id: 6, name: "Threewheel", code: "THREEWHEEL" },
      { id: 7, name: "None", code: "NONE" }
    ]



    this.options_passenger_air = [
      { id: 1, name: "One Way", code: "ONE_WAY" },
      { id: 2, name: "Round Trip", code: "ROUND_TRIP" }
    ]

    this.class_passenger_air = [
      { id: 1, name: "Economy", code: "ECONOMY" },
      { id: 2, name: "Premium", code: "PREMIUM" }
    ]
    /* (END) Transport parameters */



    this.activities = [
      { id: 1, name: "Sea Tanker", code: "SEATANKER" },
      { id: 2, name: "Cargo Ship", code: "CARGOSHIP" },

    ]


    this.fwTypes = [
      { activity: "SEATANKER", id: 1, name: "Crude tanker", code: "CRUDETANKER" },
      { activity: "SEATANKER", id: 2, name: "Products tanker", code: "PRODUCTSTANKER" },
      { activity: "SEATANKER", id: 3, name: "Chemical tanker", code: "CHEMICALTANKER" },
      { activity: "SEATANKER", id: 4, name: "LNG tanker", code: "LNGTANKER" },
      { activity: "SEATANKER", id: 5, name: "LPG Tanker", code: "LPGTANKER" },

      { activity: "CARGOSHIP", id: 1, name: "Bulk carrier", code: "BULKCARRIER" },
      { activity: "CARGOSHIP", id: 2, name: "General cargo", code: "GENERALCARGO" },
      { activity: "CARGOSHIP", id: 3, name: "Container ship", code: "CONTAINERSHIP" },
      { activity: "CARGOSHIP", id: 4, name: "Vehicle transport", code: "VTRANSPORT" },
      { activity: "CARGOSHIP", id: 5, name: "RoRo-Ferry", code: "ROROFERRY" },
      { activity: "CARGOSHIP", id: 6, name: "Large RoPax ferry", code: "LRFERRY" },
      { activity: "CARGOSHIP", id: 7, name: "Refrigerated cargo", code: "RCARGO" },


    ]

    this.fwSizes = [
      { type: "CRUDETANKER", id: 1, name: "200,000+ dwt", code: "200,000+ dwt" },
      { type: "CRUDETANKER", id: 2, name: "120,000–199,999 dwt", code: "120,000–199,999 dwt" },
      { type: "CRUDETANKER", id: 3, name: "80,000–119,999 dwt", code: "80,000–119,999 dwt" },
      { type: "CRUDETANKER", id: 4, name: "60,000–79,999 dwt", code: "200,000+ dwt" },
      { type: "CRUDETANKER", id: 5, name: "10,000–59,999 dwt", code: "200,000+ dwt" },
      { type: "CRUDETANKER", id: 6, name: "0–9999 dwt", code: "200,000+ dwt" },
      { type: "CRUDETANKER", id: 7, name: "Average", code: "AVG" },


      { type: "PRODUCTSTANKER", id: 1, name: "60,000+ dwt", code: "60,000+ dwt" },
      { type: "PRODUCTSTANKER", id: 2, name: "20,000–59,999 dwt", code: "20,000–59,999 dwt" },
      { type: "PRODUCTSTANKER", id: 3, name: "10,000–19,999 dwt", code: "10,000–19,999 dwt" },
      { type: "PRODUCTSTANKER", id: 4, name: "5000–9999 dwt", code: "5000–9999 dwt" },
      { type: "PRODUCTSTANKER", id: 5, name: "0–4999 dwt", code: "0–4999 dwt" },
      { type: "PRODUCTSTANKER", id: 6, name: "Average", code: "AVG" },




      { type: "CHEMICALTANKER", id: 1, name: "20,000+ dwt", code: "20,000+ dwt" },
      { type: "CHEMICALTANKER", id: 2, name: "10,000–19,999 dwt", code: "10,000–19,999 dwt" },
      { type: "CHEMICALTANKER", id: 3, name: "5000–9999 dwt", code: "5000–9999 dwt" },
      { type: "CHEMICALTANKER", id: 4, name: "0–4999 dwt", code: "0–4999 dwt" },
      { type: "CHEMICALTANKER", id: 5, name: "Average", code: "AVG" },


      { type: "LNGTANKER", id: 1, name: "200,000+ m3", code: "200,000+ m3" },
      { type: "LNGTANKER", id: 2, name: "0–199,999 m3", code: "0–199,999 m3" },
      { type: "LNGTANKER", id: 3, name: "5000–9999 dwt", code: "5000–9999 dwt" },
      { type: "LNGTANKER", id: 4, name: "Average", code: "AVG" },

      { type: "LPGTANKER", id: 1, name: "50,000+ m3", code: "50,000+ m3" },
      { type: "LPGTANKER", id: 2, name: "0–49,999 m3", code: "0–49,999 m3" },
      { type: "LPGTANKER", id: 3, name: "Average", code: "AVG" },



      { type: "BULKCARRIER", id: 1, name: "200,000+ dwt", code: "200,000+ dwt" },
      { type: "BULKCARRIER", id: 2, name: "100,000–199,999 dwt", code: "100,000–199,999 dwt" },
      { type: "BULKCARRIER", id: 3, name: "60,000–99,999 dwt", code: "60,000–99,999 dwt" },
      { type: "BULKCARRIER", id: 4, name: "35,000–59,999 dwt", code: "35,000–59,999 dwt" },
      { type: "BULKCARRIER", id: 5, name: "10,000–34,999 dwt", code: "10,000–34,999 dwt" },
      { type: "BULKCARRIER", id: 6, name: "0–9999 dwt", code: "0–9999 dwt" },
      { type: "BULKCARRIER", id: 7, name: "Average", code: "AVG" },

      { type: "GENERALCARGO", id: 1, name: "10,000+ dwt", code: "10,000+ dwt" },
      { type: "GENERALCARGO", id: 2, name: "15000–9999 dwt", code: "15000–9999 dwt" },
      { type: "GENERALCARGO", id: 3, name: "0–4999 dwt", code: "0–4999 dwt" },
      { type: "GENERALCARGO", id: 4, name: "10,000+ dwt 100+ TEU", code: "10,000+ dwt 100+ TEU" },
      { type: "GENERALCARGO", id: 5, name: "5000–9999 dwt 100+ TEU", code: "5000–9999 dwt 100+ TEU" },
      { type: "GENERALCARGO", id: 6, name: "0–4999 dwt 100+ TEU", code: "0–4999 dwt 100+ TEU" },
      { type: "GENERALCARGO", id: 7, name: "Average", code: "AVG" },


      { type: "CONTAINERSHIP", id: 1, name: "8000+ TEU", code: "8000+ TEU" },
      { type: "CONTAINERSHIP", id: 2, name: "5000–7999 TEU", code: "5000–7999 TEU" },
      { type: "CONTAINERSHIP", id: 3, name: "3000–4999 TEU", code: "3000–4999 TEU" },
      { type: "CONTAINERSHIP", id: 4, name: "2000–2999 TEU", code: "2000–2999 TEU" },
      { type: "CONTAINERSHIP", id: 5, name: "1000–1999 TEU", code: "1000–1999 TEU" },
      { type: "CONTAINERSHIP", id: 6, name: "0–999 TEU", code: "0–999 TEU" },
      { type: "CONTAINERSHIP", id: 7, name: "Average", code: "AVG" },


      { type: "VTRANSPORT", id: 1, name: "4000+ CEU", code: "4000+ CEU" },
      { type: "VTRANSPORT", id: 2, name: "0–3999 CEU", code: "0–3999 CEU" },
      { type: "VTRANSPORT", id: 3, name: "Average", code: "AVG" },

      { type: "ROROFERRY", id: 1, name: "2000+ LM", code: "2000+ LM" },
      { type: "ROROFERRY", id: 2, name: "0–1999 LM", code: "0–1999 LM" },
      { type: "ROROFERRY", id: 3, name: "Average", code: "AVG" },

      { type: "LRFERRY", id: 1, name: "Average", code: "AVG" },

      { type: "RCARGO", id: 1, name: "All dwt", code: "All dwt" },


    ]


    this.ef_units = [
      { id: 1, name: "Kg/TJ" }

    ]

    this.consumption_units = [
      { id: 1, name: "l", code: "L" },
      { id: 2, name: "tonnes", code: "T" }

    ]

    this.unit_ncv = [
      { id: 1, name: "TJ/t" }

    ]

    this.unit_density = [
      { id: 1, name: "t/m3" }

    ]


    this.freightESList = [
      PuesDataReqDtoSourceName.Freight_air,
      PuesDataReqDtoSourceName.Freight_offroad,
      PuesDataReqDtoSourceName.Freight_rail,
      PuesDataReqDtoSourceName.Freight_road,
      PuesDataReqDtoSourceName.Freight_water
    ];

    this.passengerESList = [
      PuesDataReqDtoSourceName.Passenger_air,
      PuesDataReqDtoSourceName.Passenger_offroad,
      PuesDataReqDtoSourceName.Passenger_rail,
      PuesDataReqDtoSourceName.Passenger_road
    ]

    this.offroadESList = [
      PuesDataReqDtoSourceName.Offroad_machinery_offroad
    ];
    this.transportESList = [...this.offroadESList, ...this.passengerESList, ...this.freightESList]


    this.orgBoundaries = [
      { name: 'Control approach', code: 'CONTROL_APPROACH' },
      { name: 'Equity share', code: 'EQUITY_SHARE' }
    ]

    this.controlApproaches = [
      { name: 'Operational', code: 'OPERATIONAL' },
      { name: 'Financial', code: 'FINANCIAL' }
    ]

    this.fireExtinguisherTypes = [
      { name: 'CO₂', id: 1, code: 'CO2' }
    ]


    this.suppressionTypes = [
      { name: 'Fixed fire suppression system', id: 1, code: 'FIXED' },
      { name: 'Portable fire suppression system', id: 2, code: 'PORTABLE' }

    ]

    //net-zero
    this.purchase_methods = [
      { id: 1, name: 'Supplier Specific Method' },
      { id: 2, name: 'Hybrid Method' },
      { id: 3, name: 'Average Data Method' },
      { id: 4, name: 'Spend Based Method' }
    ]

    this.supplier_specific_products = [
      { id: 1, name: 'Cement', code: 'CEMENT' },
      { id: 2, name: 'Paint', code: 'PAINT' },
      { id: 3, name: 'Timber', code: 'TIMBER' },
      { id: 4, name: 'Tea', code: 'TEA' },
      { id: 5, name: 'Fabric', code: 'FABRIC' },
    ]

    this.hybrid_material_type = [
      { id: 1, name: 'Cotton', code: 'COTTON' },
      { id: 2, name: 'Polymer', code: 'POLYMER' },
      { id: 3, name: 'Chemical A', code: 'CHEMICAL_A' },
      { id: 4, name: 'Pre-processed tea', code: 'PRE_PROCESSED_TEA' },
      { id: 5, name: 'Low-density polyethylene (LDPE)', code: 'LDPE' },
    ]

    this.hybrid_vehicle_type = [
      { id: 1, name: 'Lorry', code: 'LORRY' },
      { id: 2, name: 'Tractor', code: 'TRACTOR' },
      { id: 3, name: 'Van', code: 'VAN' },
    ]

    this.average_product_type = [
      { id: 1, name: 'Glass', code: 'GLASS' },
      { id: 2, name: 'Aluminium', code: 'ALUMINIUM' },
      { id: 3, name: 'Battery', code: 'BATTERY' },
      { id: 4, name: 'Pre-processed tea', code: 'PRE_PROCESSED_TEA' },
      { id: 5, name: 'Thread', code: 'THREAD' },
    ]

    this.spend_product_type = [
      { id: 1, name: 'Steel', code: 'STEEL' },
      { id: 2, name: 'Aluminium', code: 'ALUMINIUM' },
      { id: 3, name: 'PET (film)', code: 'PET' },
      { id: 4, name: 'Epoxy resin', code: 'EPOXY_RESIN' },
      { id: 5, name: 'Copper', code: 'COPPER' },
      { id: 6, name: 'Glass', code: 'GLASS' },
    ]

    this.units_purchase_good_and_services = {
      supplier_quantity: [this.parameterUnits.KG],
      supplier_ef: [this.parameterUnits.KGCO2EKG],
      hybrid_purchased_ef: [this.parameterUnits.KGCO2E],
      hybrid_material_amount: [this.parameterUnits.KG, this.parameterUnits.UNIT],
      hybrid_matrial_ef: [this.parameterUnits.KGCO2EKG, this.parameterUnits.KGCO2EUNIT],
      hybrid_transport_distance: [this.parameterUnits.KM],
      hybrid_transport_mass: [this.parameterUnits.T, this.parameterUnits.TEU],
      hybrid_transport_ef: [this.parameterUnits.KGCO2ETKM, this.parameterUnits.KGCO2ETEUKM],
      hybrid_waste_amount: [this.parameterUnits.KG],
      hybrid_waste_ef: [this.parameterUnits.KGCO2E],
      average_mass: [this.parameterUnits.KG, this.parameterUnits.PIECE],
      average_ef: [this.parameterUnits.KGCO2EKG, this.parameterUnits.KGCO2EPIECE],
      spend_value: [this.parameterUnits.USD],
      spend_ef: [this.parameterUnits.KGCO2EDOLLAR]
    }

    this.units_use_of_sold_products = {
      fuel_consumption: [this.parameterUnits.L],
      electricity_consumption: [this.parameterUnits.KWH],
      regrigerant_leakage: [this.parameterUnits.KG],
      ghg_emit: [this.parameterUnits.KG],
      intermediate_ef: [this.parameterUnits.KGCO2EUSE]
    }

    this.use_of_sold_products_method = [
      { id: 1, name: 'Direct use-phase emissions from products that directly consume energy (fuels or electricity) during use', code: 'DIRECT_ENERGY' },
      { id: 2, name: 'Direct use-phase emissions from combusted fuels and feedstocks', code: 'DIRECT_COMBUSTED' },
      { id: 3, name: 'Direct use-phase emissions from greenhouse gases and products that contain or form greenhouse gases that are emitted during use', code: 'DIRECT_GREENHOUSE' },
      { id: 4, name: 'Indirect use-phase emissions from products that indirectly consume energy (fuels or electricity) during use', code: 'INDIRECT_ENERGY' },
      { id: 5, name: 'Use-phase emissions from sold intermediate products Use-phase', code: 'INTERMEDIATE_PRODUCTS' },
    ]

    this.intermediate_products = [
      { id: 1, name: 'Thread-synthetic', code: 'THREAD_SYNTHETIC' },
      { id: 2, name: 'Pre processed tea', code: 'PRE_PROCESSED_TEA' }
    ]

    this.ghg_types = [
      { id: 1, name: 'CO₂', code: 'co2' },
      { id: 2, name: 'CH₄', code: 'ch4' },
      { id: 3, name: 'N₂O', code: 'n2o' },
      { id: 4, name: 'R407C', code: 'R407C' },
      { id: 5, name: 'R410A', code: 'R410A' },
      { id: 6, name: 'R22', code: 'R22' },
      { id: 7, name: 'R134a', code: 'R134a' },
    ]

  }



  set months(value: { name: string; value: number }[]) {
    this._months = value;
  }

  get months(): { name: string; value: number }[] {
    return this._months;
  }

  set gWP_RGs(value: { name: string; id: number }[]) {
    this._gWP_RGs = value;
  }

  get gWP_RGs(): { name: string; id: number }[] {
    return this._gWP_RGs;
  }



  set refActivityTypes(value: { name: string; id: number, code: string }[]) {
    this._refActivityTypes = value;
  }

  get refActivityTypes(): { name: string; id: number, code: string }[] {
    return this._refActivityTypes;
  }


  set investActivityTypes(value: { name: string; id: number, code: string }[]) {
    this._investActivityTypes = value;
  }

  get investActivityTypes(): { name: string; id: number, code: string }[] {
    return this._investActivityTypes;
  }

  set fuelEnergyActivityTypes(value: { name: string; id: number, code: string }[]) {
    this._fuelEnergyActivityTypes = value;
  }

  get fuelEnergyActivityTypes(): { name: string; id: number, code: string }[] {
    return this._fuelEnergyActivityTypes;
  }

  set processingOfSoldProductActivityTypes(value: { name: string; id: number, code: string }[]) {
    this._processingOfSoldProductActivityTypes = value;
  }

  get processingOfSoldProductActivityTypes(): { name: string; id: number, code: string }[] {
    return this._processingOfSoldProductActivityTypes;
  }

  set upstreamTransportctivityTypes(value: { name: string; id: number, code: string }[]) {
    this._upstreamTransportctivityTypes = value;
  }

  get upstreamTransportctivityTypes(): { name: string; id: number, code: string }[] {
    return this._upstreamTransportctivityTypes;
  }





  set fuel(value: { name: string; id: number; code: string }[]) {
    this._fuel = value;
  }

  get fuel(): { name: string; id: number; code: string }[] {
    return this._fuel;
  }

  set fuelType1(value: { name: string; id: number, code: string }[]) {
    this._fuelType1 = value;
  }

  get fuelType1(): { name: string; id: number, code: string }[] {
    return this._fuelType1;
  }

  set fuelTypeFreightWater(value: { name: string; id: number, code: string }[]) {
    this._fuelTypeFreightWater = value;
  }

  get fuelTypeFreightWater(): { name: string; id: number, code: string }[] {
    return this._fuelTypeFreightWater;
  }

  set fuelTypeBoilers(value: { name: string; id: number; boilerId: number, code: string }[]) {
    this._fuelTypeBoilers = value;
  }

  get fuelTypeBoilers(): { name: string; id: number; boilerId: number, code: string }[] {
    return this._fuelTypeBoilers;
  }

  set units(value: { name: string; id: number }[]) {
    this._units = value;
  }

  get units(): { name: string; id: number }[] {
    return this._units;
  }

  set purposes(value: { name: string; id: number }[]) {
    this._purposes = value;
  }

  get purposes(): { name: string; id: number }[] {
    return this._purposes;
  }

  set anaerobicDeepLagoons(value: { name: string; id: number; code: string }[]) {
    this._anaerobicDeepLagoons = value;
  }

  get anaerobicDeepLagoons(): { name: string; id: number; code: string }[] {
    return this._anaerobicDeepLagoons;
  }
  /* For units of emission source parameters */
  set electricity_units(value) {
    this._electricity_units = value;
  }

  get electricity_units() {
    return this._electricity_units;
  }
  set investments_units(value) {
    this._investments_units = value;
  }

  get investments_units() {
    return this._investments_units;
  }

  set upstream_lead_asset_units(value) {
    this._upstream_lead_asset_units = value;
  }

  get upstream_lead_asset_units() {
    return this._upstream_lead_asset_units;
  }



  set boiler_units(value) {
    this._boilers_units = value;
  }

  get boiler_units() {
    return this._boilers_units;
  }

  set fire_extinguisher_units(value: any) {
    this._fire_extinguisher_units = value;
  }

  get fire_extinguisher_units() {
    return this._fire_extinguisher_units;
  }

  set generator_units(value: any) {
    this._generator_units = value;
  }

  get generator_units() {
    return this._generator_units;
  }

  set downstreamTransportationUnits(value: any) {
    this._downstreamTransportationUnits = value;
  }

  get downstreamTransportationUnits() {
    return this._downstreamTransportationUnits;
  }

  set refrigerant_units(value: any) {
    this._refrigerant_units = value;
  }

  get refrigerant_units() {
    return this._refrigerant_units;
  }

  set welding_units(value: any) {
    this._welding_units = value;
  }

  get welding_units() {
    return this._welding_units;
  }

  set forklifts_units(value) {
    this._forklifts_units = value;
  }

  get forklifts_units() {
    return this._forklifts_units;
  }

  set waste_water_units(value) {
    this._waste_water_units = value;
  }

  get waste_water_units() {
    return this._waste_water_units;
  }

  set municipal_water_units(value) {
    this._municipal_water_units = value;
  }

  get municipal_water_units() {
    return this._municipal_water_units;
  }


  set fuel_energy_activity_units(value) {
    this._fuel_energy_activity_units = value;
  }

  get fuel_energy_activity_units() {
    return this._fuel_energy_activity_units;
  }


  set waste_disposal_units(value) {
    this._waste_disposal_units = value;
  }

  get waste_disposal_units() {
    return this._waste_disposal_units;
  }

  set cooking_gas_units(value) {
    this._cooking_gas_units = value;
  }

  get cooking_gas_units() {
    return this._cooking_gas_units;
  }
  set road_freight_units(value) {
    this._road_freight_units = value;
  }

  get road_freight_units() {
    return this._road_freight_units;
  }

  set air_freight_units(value) {
    this._air_freight_units = value;
  }

  get air_freight_units() {
    return this._air_freight_units;
  }

  set water_freight_units(value) {
    this._water_freight_units = value;
  }

  get water_freight_units() {
    return this._water_freight_units;
  }

  set rail_freight_units(value) {
    this._rail_freight_units = value;
  }

  get rail_freight_units() {
    return this._rail_freight_units;
  }

  set passenger_road_units(value) {
    this._passenger_road_units = value;
  }

  get passenger_road_units() {
    return this._passenger_road_units;
  }
  set net_zero_business_travel_units(value) {
    this._net_zero_business_travel_units = value;
  }

  get net_zero_business_travel_units() {
    return this._net_zero_business_travel_units;
  }
  set net_zero_business_travel_types(value) {
    this._net_zero_business_travel_types = value;
  }

  get net_zero_business_travel_types() {
    return this._net_zero_business_travel_types;
  }
  get net_zero_business_travel_transport_modes_distance(): { id: number; name: string; code: string; }[] {
    return this._net_zero_business_travel_transport_modes_distance;
  }
  set net_zero_business_travel_transport_modes_distance(value: { name: string; id: number; code: string }[]) {
    this._net_zero_business_travel_transport_modes_distance = value;
  }

  get net_zero_business_travel_transport_modes_amount(): { id: number; name: string; code: string; }[] {
    return this._net_zero_business_travel_transport_modes_amount;
  }
  set net_zero_business_travel_transport_modes_amount(value: { name: string; id: number; code: string }[]) {
    this._net_zero_business_travel_transport_modes_amount = value;
  }

  set net_zero_franchises_units(value) {
    this._net_zero_franchises_units = value
  }

  get net_zero_franchises_units() {
    return this._net_zero_franchises_units;
  }

  set net_zero_employee_commuting_units(value) {
    this._net_zero_employee_commuting_units = value;
  }

  get net_zero_employee_commuting_units() {
    return this._net_zero_employee_commuting_units;
  }
  set net_zero_employee_commuting_types(value) {
    this._net_zero_employee_commuting_types = value;
  }

  get net_zero_employee_commuting_types() {
    return this._net_zero_employee_commuting_types;
  }


  get net_zero_employee_commuting_transport_modes(): { id: number; name: string; code: string; }[] {
    return this._net_zero_employee_commuting_transport_modes;
  }
  set net_zero_employee_commuting_transport_modes(value: { name: string; id: number; code: string }[]) {
    this._net_zero_employee_commuting_transport_modes = value;
  }

  set passenger_offroad_units(value) {
    this._passenger_offroad_units = value;
  }

  get passenger_offroad_units() {
    return this._passenger_offroad_units;
  }

  set passenger_rail_units(value) {
    this._passenger_rail_units = value
  }

  get passenger_rail_units() {
    return this._passenger_rail_units;
  }

  set passenger_water_units(value: any) {
    this._passenger_water_units = value
  }

  get passenger_water_units() {
    return this._passenger_water_units;
  }

  set offroad_freight_units(value) {
    this._offroad_freight_units = value;
  }

  get offroad_freight_units() {
    return this._offroad_freight_units;
  }


  set offroad_machinery_units(value) {
    this._offroad_machinery_units = value;
  }

  get offroad_machinery_units() {
    return this._offroad_machinery_units;
  }

  set supplier_units(value) {
    this._supplier_units = value;
  }

  get supplier_units() {
    return this._supplier_units;
  }

  set eoltsold_products_units(value) {
    this._eoltsold_products_units = value;
  }

  get eoltsold_products_units() {
    return this._eoltsold_products_units;
  }


  set capital_goods_units(value) {
    this._capital_goods_units = value;
  }

  get capital_goods_units() {
    return this._capital_goods_units;
  }

  /* (END) For units of emission source parameters*/

  set ivesteesectors(value: { name: string; id: number; code: string }[]) {
    this._investeesector = value;
  }

  get ivesteesectors(): { name: string; id: number; code: string }[] {
    return this._investeesector;
  }

  set fuel_upstream(value: { name: string; id: number; code: string }[]) {
    this._fuel_eq1 = value;
  }

  get fuel_upstream(): { name: string; id: number; code: string }[] {
    return this._fuel_eq1;
  }

  set fuel_upstream_leased(value: { name: string; id: number; code: string }[]) {
    this._fuel_upstream_leased = value;
  }

  get fuel_upstream_leased(): { name: string; id: number; code: string }[] {
    return this._fuel_upstream_leased;
  }

  set sold_intermediate_type(value: { name: string; id: number; code: string }[]) {
    this._sold_intermediate_type = value;
  }

  get sold_intermediate_type(): { name: string; id: number; code: string }[] {
    return this._sold_intermediate_type;
  }
  //fuel_lifecycle
  set fuel_lifecycle(value: { name: string; id: number; code: string }[]) {
    this._fuel_lifecycle = value;
  }

  get fuel_lifecycle(): { name: string; id: number; code: string }[] {
    return this._fuel_lifecycle;
  }


  set building_types(value: { name: string; id: number; code: string }[]) {
    this._building_types = value;
  }

  get building_types(): { name: string; id: number; code: string }[] {
    return this._building_types;
  }



  set operatingsectors(value: { name: string; id: number; code: string }[]) {
    this._operatingsector = value;
  }

  get operatingsectors(): { name: string; id: number; code: string }[] {
    return this._operatingsector;
  }


  set constructsectors(value: { name: string; id: number; code: string }[]) {
    this._constructsector = value;
  }

  get constructsectors(): { name: string; id: number; code: string }[] {
    return this._constructsector;
  }

  set revenue_units(value: { name: string; id: number, code: string, factor: number }[]) {
    this._revenue_units = value;
  }

  get revenue_units(): { name: string; id: number, code: string, factor: number }[] {
    return this._revenue_units;
  }


  set countries(value: { name: string; id: number, code: string }[]) {
    this._countries = value;
  }

  get countries(): { name: string; id: number, code: string }[] {
    return this._countries;
  }

  set emsources(value: { name: string; id: number }[]) {
    this._emsources = value;
  }

  get emsources(): { name: string; id: number }[] {
    return this._emsources;
  }


  set strokes(value: { name: string; id: number; code: string }[]) {
    this._strokes = value;
  }

  get strokes(): { name: string; id: number; code: string }[] {
    return this._strokes;
  }

  set units_Marine(value: { name: string; id: number }[]) {
    this._units_Marine = value;
  }

  get units_Marine(): { name: string; id: number }[] {
    return this._units_Marine;
  }

  set sources(value: { name: string; id: number, code: SourceType }[]) {
    this._sources = value;
  }

  set industries(value: { name: string; id: number }[]) {
    this._industries = value;
  }

  get industries(): { name: string; id: number }[] {
    return this._industries;
  }

  get sources(): { name: string; id: number, code: SourceType }[] {
    return this._sources;
  }

  set tieres(value: { name: string; id: number, code: ProjectUnitEmissionSourceTier }[]) {
    this._tieres = value;
  }

  get tieres(): { name: string; id: number, code: ProjectUnitEmissionSourceTier }[] {
    return this._tieres;
  }

  set currencies(value: { name: string; id: number, code: string }[]) {
    this._currencies = value;
  }

  get currencies(): { name: string; id: number, code: string }[] {
    return this._currencies;
  }

  set wasteTypes(value: { name: string; id: number }[]) {
    this._wasteTypes = value;
  }

  get wasteTypes(): { name: string; id: number }[] {
    return this._wasteTypes;
  }

  set disposalMethods(value: { name: string; id: number }[]) {
    this._disposalMethods = value;
  }

  get disposalMethods(): { name: string; id: number }[] {
    return this._disposalMethods;
  }

  set cookingEmissionSources(value: { name: string; id: number }[]) {
    this._cookingEmissionSources = value;
  }

  get cookingEmissionSources(): { name: string; id: number }[] {
    return this._cookingEmissionSources;
  }

  set cookingGasTypes(value: { name: string; id: number; sourceId: number; code: string; }[]) {
    this._cookingGasTypes = value;
  }

  get cookingGasTypes(): { name: string; id: number; sourceId: number; code: string; }[] {
    return this._cookingGasTypes;
  }

  set disposalWasteTypes(value: { name: string; id: number; wasteId: number; code: string; }[]) {
    this._disposalWasteTypes = value;
  }

  get disposalWasteTypes(): { name: string; id: number; wasteId: number; code: string; }[] {
    return this._disposalWasteTypes;
  }

  set boilerTypes(value: { name: string; id: number }[]) {
    this._boilerTypes = value;
  }

  get boilerTypes(): { name: string; id: number }[] {
    return this._boilerTypes;
  }

  set boilers_units(value: { name: string; id: number }[]) {
    this._boilers_units = value;
  }

  get boilers_units(): { name: string; id: number }[] {
    return this._boilers_units;
  }

  set municipal_water_categories(value: { name: string; id: number; code: string; }[]) {
    this._municipal_water_categories = value;
  }

  get municipal_water_categories(): { name: string; id: number; code: string; }[] {
    return this._municipal_water_categories;
  }

  /* For transport parameters */
  set domesticInternationals(value: { name: string; id: number, code: string }[]) {
    this._domesticInternationals = value;
  }

  get domesticInternationals(): { name: string; id: number, code: string }[] {
    return this._domesticInternationals;
  }

  set freightModes(value: { name: string; id: number }[]) {
    this._freightModes = value;
  }

  get freightModes(): { name: string; id: number }[] {
    return this._freightModes;
  }

  set ownership_freightTransport(value: { name: string; id: number }[]) {
    this._ownership_freightTransport = value;
  }

  get ownership_freightTransport(): { name: string; id: number }[] {
    return this._ownership_freightTransport;
  }

  set depatureCountry_freightTransport(value: { name: string; id: number }[]) {
    this._depatureCountry_freightTransport = value;
  }

  get depatureCountry_freightTransport(): { name: string; id: number }[] {
    return this._depatureCountry_freightTransport;
  }

  set departureAirport_freightTransport(value: { name: string; id: number }[]) {
    this._departureAirport_freightTransport = value;
  }

  get departureAirport_freightTransport(): { name: string; id: number }[] {
    return this._departureAirport_freightTransport;
  }

  set destinationCountry_freightTransport(value: { name: string; id: number }[]) {
    this._destinationCountry_freightTransport = value;
  }

  get destinationCountry_freightTransport(): { name: string; id: number }[] {
    return this._destinationCountry_freightTransport;
  }

  set destinationAirport_freightTransport(value: { name: string; id: number }[]) {
    this._destinationAirport_freightTransport = value;
  }

  get destinationAirport_freightTransport(): { name: string; id: number }[] {
    return this._destinationAirport_freightTransport;
  }

  set transient_freightTransport(value: { name: string; id: number }[]) {
    this._transient_freightTransport = value;
  }

  get transient_freightTransport(): { name: string; id: number }[] {
    return this._transient_freightTransport;
  }

  set distanceTravelledUnits_freightTransport(value: { name: string; id: number }[]) {
    this._distanceTravelledUnits_freightTransport = value;
  }

  get distanceTravelledUnits_freightTransport(): { name: string; id: number }[] {
    return this._distanceTravelledUnits_freightTransport;
  }

  set methods_freightTransport(value: { name: string; id: number }[]) {
    this._methods_freightTransport = value;
  }

  get methods_freightTransport(): { name: string; id: number }[] {
    return this._methods_freightTransport;
  }

  set methods_netZeroBusinessTravel(value: { name: string; id: number; value: string }[]) {
    this._methods_netZeroBusinessTravel = value;
  }

  get methods_netZeroBusinessTravel(): { name: string; id: number; value: string }[] {
    return this._methods_netZeroBusinessTravel;
  }

  set methods_franchise(value: { name: string; id: number; value: string }[]) {
    this._methods_franchise = value;
  }

  get methods_franchise(): { name: string; id: number; value: string }[] {
    return this._methods_franchise;
  }

  set methods_net_zero_employee_commuting(value: { name: string; id: number; value: string }[]) {
    this._methods_net_zero_employee_commuting = value;
  }

  get methods_net_zero_employee_commuting(): { name: string; id: number; value: string }[] {
    return this._methods_net_zero_employee_commuting;
  }

  set methods_waste_generated_in_operations(value: { name: string; id: number; value: string }[]) {
    this._methods_waste_generated_in_operations = value;
  }

  get methods_waste_generated_in_operations(): { name: string; id: number; value: string }[] {
    return this._methods_waste_generated_in_operations;
  }

  set solid_water_waste_generated_in_operations(value: { name: string; id: number; value: string }[]) {
    this._solid_water_waste_generated_in_operations = value;
  }

  get solid_water_waste_generated_in_operations(): { name: string; id: number; value: string }[] {
    return this._solid_water_waste_generated_in_operations;
  }


  set treatment_method_waste_generated_in_operations(value: { name: string, id: number, code: string }[]) {
    this._treatment_methodmethods_waste_generated_in_operations = value;
  }

  get treatment_method_waste_generated_in_operations(): { name: string, id: number, code: string }[] {
    return this._treatment_methodmethods_waste_generated_in_operations;
  }

  set waste_type_waste_generated_in_operations(value: { name: string, id: number, wasteId: number, code: string; }[]) {
    this._waste_type_waste_generated_in_operations = value;
  }

  get waste_type_waste_generated_in_operations(): { name: string, id: number, wasteId: number, code: string; }[] {
    return this._waste_type_waste_generated_in_operations;
  }

  set disposal_type_waste_generated_in_operations(value: { name: string; id: number }[]) {
    this._disposal_type_waste_generated_in_operations = value;
  }

  get disposal_type_waste_generated_in_operations(): { name: string; id: number }[] {
    return this._disposal_type_waste_generated_in_operations;
  }



  set waste_generated_in_operations_units(value) {
    this._waste_generated_in_operations_units = value;
  }

  get waste_generated_in_operations_units() {
    return this._waste_generated_in_operations_units;
  }

  set activities_upstreamLeasedAssets(value: { name: string; id: number; value: string }[]) {
    this._activities_upstreamLeasedAssets = value;
  }

  //capital goods
  set capital_goods_types(value: { name: string; id: number }[]) {
    this._capital_goods_types = value;
  }

  get capital_goods_types(): { name: string; id: number }[] {
    return this._capital_goods_types;
  }


  set capital_goods_categories(value: { name: string, id: number, typeId: number, code: string; }[]) {
    this._capital_goods_categories = value;
  }

  get capital_goods_categories(): { name: string, id: number, typeId: number, code: string; }[] {
    return this._capital_goods_categories;
  }


  get activities_upstreamLeasedAssets(): { name: string; id: number; value: string }[] {
    return this._activities_upstreamLeasedAssets;
  }

  set methods_downstream_leased_assets(value: { name: string; id: number; value: string }[]) {
    this._methods_downstream_leased_assets = value;
  }

  get methods_downstream_leased_assets(): { name: string; id: number; value: string }[] {
    return this._methods_downstream_leased_assets;
  }

  set freightTypes_freightTransport(value: { name: string; id: number }[]) {
    this._freightTypes_freightTransport = value;
  }

  get freightTypes_freightTransport(): { name: string; id: number }[] {
    return this._freightTypes_freightTransport;
  }


  set destinationPort_freightTransport(value: { name: string; id: number }[]) {
    this._destinationPort_freightTransport = value;
  }

  get destinationPort_freightTransport(): { name: string; id: number }[] {
    return this._destinationPort_freightTransport;
  }

  set departurePort_freightTransport(value: { name: string; id: number }[]) {
    this._departurePort_freightTransport = value;
  }

  get departurePort_freightTransport(): { name: string; id: number }[] {
    return this._departurePort_freightTransport;
  }

  set destinationStation_freightTransport(value: { name: string; id: number }[]) {
    this._destinationStation_freightTransport = value;
  }

  get destinationStation_freightTransport(): { name: string; id: number }[] {
    return this._destinationStation_freightTransport;
  }

  set departureStation_freightTransport(value: { name: string; id: number }[]) {
    this._departureStation_freightTransport = value;
  }

  get departureStation_freightTransport(): { name: string; id: number }[] {
    return this._departureStation_freightTransport;
  }

  set vehicleModel_freightTransport(value: { name: string; id: number }[]) {
    this._vehicleModel_freightTransport = value;
  }

  get vehicleModel_freightTransport(): { name: string; id: number }[] {
    return this._vehicleModel_freightTransport;
  }

  set activity_freightTransport(value: { name: string; id: number }[]) {
    this._activity_freightTransport = value;
  }

  get activity_freightTransport(): { name: string; id: number }[] {
    return this._activity_freightTransport;
  }

  set size_freightTransport(value: { name: string; id: number }[]) {
    this._size_freightTransport = value;
  }

  get size_freightTransport(): { name: string; id: number }[] {
    return this._size_freightTransport;
  }

  set type_water_freightTransport(value: { name: string; id: number }[]) {
    this._type_water_freightTransport = value;
  }

  get type_water_freightTransport(): { name: string; id: number }[] {
    return this._type_water_freightTransport;
  }

  set options_freightTransport(value: { name: string; id: number, code: string }[]) {
    this._options_freightTransport = value;
  }

  get options_freightTransport(): { name: string; id: number; code: string }[] {
    return this._options_freightTransport;
  }

  set cargoType_road_freightTransport(value: { name: string; id: number; code: string }[]) {
    this._cargoType_road_freightTransport = value;
  }

  get cargoType_road_freightTransport(): { name: string; id: number; code: string }[] {
    return this._cargoType_road_freightTransport;
  }

  set cargoType_shared(value: { name: string; id: number; code: string }[]) {
    this._cargoType_shared = value;
  }

  get cargoType_shared(): { name: string; id: number; code: string }[] {
    return this._cargoType_shared;
  }
  //passenger

  set passengerModes(value: { name: string; id: number, code: string }[]) {
    this._passengerModes = value;
  }

  get passengerModes(): { name: string; id: number, code: string }[] {
    return this._passengerModes;
  }

  set railFuelType(value: { name: string; id: number, code: string }[]) {
    this._railFuelType = value;
  }

  get railFuelType(): { name: string; id: number, code: string }[] {
    return this._railFuelType;
  }

  set railActivities(value: { name: string; id: number, code: string }[]) {
    this._railActivities = value;
  }

  get railActivities(): { name: string; id: number, code: string }[] {
    return this._railActivities;
  }

  set railTypes(value: { name: string; id: number, code: string }[]) {
    this._railTypes = value;
  }

  get railTypes(): { name: string; id: number, code: string }[] {
    return this._railTypes;
  }

  set passenger_onroad_methods(value: { name: string; id: number, code: string }[]) {
    this._passenger_onroad_methods = value;
  }

  get passenger_onroad_methods(): { name: string; id: number, code: string }[] {
    return this._passenger_onroad_methods;
  }

  set noEmission_transport_modes(value: { name: string; id: number, code: string }[]) {
    this._noEmission_transport_modes = value;
  }

  get noEmission_transport_modes(): { name: string; id: number, code: string }[] {
    return this._noEmission_transport_modes;
  }

  set private_transport_modes(value: { name: string; id: number, code: string }[]) {
    this._private_transport_modes = value;
  }

  get private_transport_modes(): { name: string; id: number, code: string }[] {
    return this._private_transport_modes;
  }

  set public_transport_modes(value: { name: string; id: number, code: string }[]) {
    this._public_transport_modes = value;
  }

  get public_transport_modes(): { name: string; id: number, code: string }[] {
    return this._public_transport_modes;
  }

  set options_passenger_air(value: { name: string; id: number, code: string }[]) {
    this._options_passenger_air = value;
  }

  get options_passenger_air(): { name: string; id: number, code: string }[] {
    return this._options_passenger_air;
  }

  set class_passenger_air(value: { name: string; id: number, code: string }[]) {
    this._class_passenger_air = value;
  }

  get class_passenger_air(): { name: string; id: number, code: string }[] {
    return this._class_passenger_air;
  }

  set p_water_vehicle_model(value: { name: string; id: number, code: string }[]) {
    this._p_water_vehicle_model = value;
  }

  get p_water_vehicle_model(): { name: string; id: number, code: string }[] {
    return this._p_water_vehicle_model;
  }

  /* (END) For transport parameters */


  set gasTypes(value: { name: string; id: number }[]) {
    this._gasTypes = value;
  }

  get gasTypes(): { name: string; id: number }[] {
    return this._gasTypes;
  }

  set wasteBasis(value: { name: string; id: number }[]) {
    this._wasteBasis = value;
  }

  get wasteBasis(): { name: string; id: number }[] {
    return this._wasteBasis;
  }

  set biologicalTreatments(value: { name: string; id: number }[]) {
    this._biologicalTreatments = value;
  }

  get biologicalTreatments(): { name: string; id: number }[] {
    return this._biologicalTreatments;
  }

  set wasteCategories(value: { name: string; id: number }[]) {
    this._wasteCategories = value;
  }

  get wasteCategories(): { name: string; id: number }[] {
    return this._wasteCategories;
  }

  set wdApproach(value: { name: string; id: number }[]) {
    this._wdApproach = value;
  }

  get wdApproach(): { name: string; id: number }[] {
    return this._wdApproach;
  }

  set climateZone(value: { name: string; id: number }[]) {
    this._climateZone = value;
  }

  get climateZone(): { name: string; id: number }[] {
    return this._climateZone;
  }



  set treatmentTypeDischarge(value: { name: string; id: number }[]) {
    this._treatmentTypeDischarge = value;
  }

  get treatmentTypeDischarge(): { name: string; id: number }[] {
    return this._treatmentTypeDischarge;
  }
  set industrialSectors(value: { name: string; id: number }[]) {
    this._industrialSectors = value;
  }

  get industrialSectors(): { name: string; id: number }[] {
    return this._industrialSectors;
  }

  set freightESList(value: PuesDataReqDtoSourceName[]) {
    this._freightESList = value;
  }

  get freightESList(): PuesDataReqDtoSourceName[] {
    return this._freightESList;
  }

  set passengerESList(value: PuesDataReqDtoSourceName[]) {
    this._passengerESList = value;
  }

  get passengerESList(): PuesDataReqDtoSourceName[] {
    return this._passengerESList;
  }

  set offroadESList(value: PuesDataReqDtoSourceName[]) {
    this._offroadESList = value;
  }

  get offroadESList(): PuesDataReqDtoSourceName[] {
    return this._offroadESList;
  }

  set transportESList(value: PuesDataReqDtoSourceName[]) {
    this._transportESList = value;
  }

  get transportESList(): PuesDataReqDtoSourceName[] {
    return this._transportESList;
  }

  set activities(value: { name: string; id: number, code: string }[]) {
    this._activities = value;
  }

  get activities(): { name: string; id: number, code: string }[] {
    return this._activities;
  }


  set ef_units(value: { name: string; id: number }[]) {
    this._ef_units = value;
  }

  get ef_units(): { name: string; id: number }[] {
    return this._ef_units;
  }

  set consumption_units(value: { name: string; id: number, code: string }[]) {
    this._consumption_units = value;
  }

  get consumption_units(): { name: string; id: number, code: string }[] {
    return this._consumption_units;
  }

  set unit_ncv(value: { name: string; id: number }[]) {
    this._unit_ncv = value;
  }

  get unit_ncv(): { name: string; id: number }[] {
    return this._unit_ncv;
  }

  set unit_density(value: { name: string; id: number }[]) {
    this._unit_density = value;
  }

  get unit_density(): { name: string; id: number }[] {
    return this._unit_density;
  }

  set orgBoundaries(value: { name: string; code: string }[]) {
    this._orgBoundaries = value;
  }

  get orgBoundaries(): { name: string; code: string }[] {
    return this._orgBoundaries;
  }

  set controlApproaches(value: { name: string; code: string }[]) {
    this._controlApproaches = value;
  }

  get controlApproaches(): { name: string; code: string }[] {
    return this._controlApproaches;
  }

  set fireExtinguisherTypes(value: { name: string; id: number; code: string }[]) {
    this._fireExtinguisherTypes = value;
  }

  get fireExtinguisherTypes(): { name: string; id: number; code: string }[] {
    return this._fireExtinguisherTypes;
  }

  set suppressionTypes(value: { name: string; id: number; code: string }[]) {
    this._suppressionTypes = value;
  }

  get suppressionTypes(): { name: string; id: number; code: string }[] {
    return this._suppressionTypes;
  }

  set fwTypes(value: { activity: string; name: string; id: number; code: string }[]) {
    this._fwTypes = value;
  }

  get fwTypes(): { activity: string; name: string; id: number; code: string }[] {
    return this._fwTypes;
  }

  set fwSizes(value: { type: string; name: string; id: number; code: string }[]) {
    this._fwSizes = value;
  }

  get fwSizes(): { type: string; name: string; id: number; code: string }[] {
    return this._fwSizes;
  }

  set fuelFacTypes(value: { code: string; id: number }[]) {
    this._fuelFacTypes = value;
  }

  get fuelFacTypes(): { code: string; id: number }[] {
    return this._fuelFacTypes;
  }

  set purchase_methods(value: { id: number; name: string; }[]) {
    this._purchase_methods = value;
  }

  get purchase_methods(): { id: number; name: string; }[] {
    return this._purchase_methods;
  }

  set supplier_specific_products(value: { id: number; name: string; code: string; }[]) {
    this._supplier_specific_products = value;
  }

  get supplier_specific_products(): { id: number; name: string; code: string; }[] {
    return this._supplier_specific_products;
  }

  set hybrid_material_type(value: { id: number; name: string; code: string; }[]) {
    this._hybrid_material_type = value;
  }

  get hybrid_material_type(): { id: number; name: string; code: string; }[] {
    return this._hybrid_material_type;
  }

  set hybrid_vehicle_type(value: { id: number; name: string; code: string; }[]) {
    this._hybrid_vehicle_type = value;
  }

  get hybrid_vehicle_type(): { id: number; name: string; code: string; }[] {
    return this._hybrid_vehicle_type;
  }

  set average_product_type(value: { id: number; name: string; code: string; }[]) {
    this._average_product_type = value;
  }

  get average_product_type(): { id: number; name: string; code: string; }[] {
    return this._average_product_type;
  }

  set spend_product_type(value: { id: number; name: string; code: string; }[]) {
    this._spend_product_type = value;
  }

  get spend_product_type(): { id: number; name: string; code: string; }[] {
    return this._spend_product_type;
  }

  set use_of_sold_products_method(value: { id: number; name: string; code: string; }[]) {
    this._use_of_sold_products_method = value;
  }

  get use_of_sold_products_method(): { id: number; name: string; code: string; }[] {
    return this._use_of_sold_products_method;
  }

  set units_purchase_good_and_services(value: any) {
    this._units_purchase_good_and_services = value;
  }

  get units_purchase_good_and_services() {
    return this._units_purchase_good_and_services;
  }

  set units_use_of_sold_products(value: any) {
    this._units_use_of_sold_products = value;
  }

  get units_use_of_sold_products() {
    return this._units_use_of_sold_products;
  }

  set intermediate_products(value: any) {
    this._intermediate_products = value;
  }

  get intermediate_products() {
    return this._intermediate_products;
  }

  set ghg_types(value: any) {
    this._ghg_types = value;
  }

  get ghg_types() {
    return this._ghg_types;
  }


  getWasteTypes(wcat: string): Observable<any[]> {

    if (wcat == "getAll") {
      console.log('sss', wcat)
      return observableOf(this.WasteTypes)

    }
    return observableOf(this.WasteTypes.filter(d => { return (d.wcat === wcat); }))


  }

  getfwTypes(activity: string): Observable<any[]> {

    if (activity == 'ss') {
      return observableOf(this.fwTypes)

    }

    return observableOf(this.fwTypes.filter(d => { return (d.activity === activity); }))


  }

  getfwSizes(type: string): Observable<any[]> {
    if (type == 'ss') {
      return observableOf(this.fwSizes)

    }
    return observableOf(this.fwSizes.filter(d => { return (d.type === type); }))


  }

  getMSWType(gasType: string): Observable<any[]> {

    if (gasType == 'getAll') {
      return observableOf(this.MSWTypes)

    }
    return observableOf(this.MSWTypes.filter(d => { return (d.gasTypes === gasType); }))


  }




}
