export enum emissionFactors {
    test = "test",
    test2 = "test2",

    efco2 = "efco2",
    gwp_co2 = "gwp_co2",
    ef_ch4 = "ef_ch4",
    gwp_ch4 = "gwp_ch4",
    ef_n2o =  "ef_n2o",
    gwp_n2o = "gwp_n2o",


    EF_GE = "EF_GE" ,
    TD_LOSS = "TD_LOSS",
    //Refrigerant
    GWP_RG_R407C = "GWP_RG_R407C",
    GWP_RG_R410A = "GWP_RG_R410A",
    GWP_RG_R22 = "GWP_RG_R22",
    GWP_RG_R134a = "GWP_RG_R134a",

    //welding
    ACEYTELENE_FACTOR = "ACEYTELENE_FACTOR",
    LIQUIDCO2_FACTOR = "LIQUIDCO2_FACTOR",

    //Municipal Water
    CF_MW = "CF_MW",

    //Boilers
    ef_co2_Residual_Fuel_Oil = "ef_co2_Residual_Fuel_Oil",
    ef_ch4_Residual_Fuel_Oil = "ef_ch4_Residual_Fuel_Oil",
    ef_n2o_Residual_Fuel_Oil = "ef_n2o_Residual_Fuel_Oil",
    ef_co2_Wood_Wood_Waste = "ef_co2_Wood_Wood_Waste",
    ef_ch4_Wood_Wood_Waste = "ef_ch4_Wood_Wood_Waste",
    ef_n2o_Wood_Wood_Waste = "ef_n2o_Wood_Wood_Waste",
    ef_co2_Sulphite_lyes = "ef_co2_Sulphite_lyes",
    ef_ch4_Sulphite_lyes = "ef_ch4_Sulphite_lyes",
    ef_n2o_Sulphite_lyes = "ef_n2o_Sulphite_lyes",
    ef_co2_Other_Primary_Solid_Biomass = "ef_co2_Other_Primary_Solid_Biomass",
    ef_ch4_Other_Primary_Solid_Biomass = "ef_ch4_Other_Primary_Solid_Biomass",
    ef_n2o_Other_Primary_Solid_Biomass = "ef_n2o_Other_Primary_Solid_Biomass",
    ef_co2_Charcoal = "ef_co2_Charcoal",
    ef_ch4_Charcoal = "ef_ch4_Charcoal",
    ef_n2o_Charcoal = "ef_n2o_Charcoal",

    ncv_woodwaste = "ncv_woodwaste",
    ncv_sulphitelyes = "ncv_sludge",
    ncv_othersolidbiomass = "ncv_other",
    ncv_charcoal = "ncv_sludge",

    //Cooking Gas
    //Bio Gas
    ef_co2_landfill = "ef_co2_landfill",
    ef_co2_sludge = "ef_co2_sludge",
    ef_co2_other = "ef_co2_other",
    ef_ch4_landfill = "ef_ch4_landfill",
    ef_ch4_sludge = "ef_ch4_sludge",
    ef_ch4_other = "ef_ch4_other",
    ef_n2o_landfill =  "ef_n2o_landfill",
    ef_n2o_sludge =  "ef_n2o_sludge",
    ef_n2o_other =  "ef_n2o_other",

    //LP Gas
    ef_co2_Energy_Industries = "ef_co2_Energy_Industries",
    ef_co2_Manufacturing = "ef_co2_Manufacturing",
    ef_co2_Institutional = "ef_co2_Institutional",
    ef_co2_Agriculture = "ef_co2_Agriculture",
    ef_ch4_Energy_Industries = "ef_ch4_Energy_Industries",
    ef_ch4_Manufacturing = "ef_ch4_Manufacturing",
    ef_ch4_Institutional = "ef_ch4_Institutional",
    ef_ch4_Agriculture = "ef_ch4_Agriculture",
    ef_n2o_Energy_Industries =  "ef_n2o_Energy_Industries",
    ef_n2o_Manufacturing =  "ef_n2o_Manufacturing",
    ef_n2o_Institutional =  "ef_n2o_Institutional",
    ef_n2o_Agriculture =  "ef_n2o_Agriculture",

    // gwp_n2o = "gwp_n2o",
    // gwp_co2 = "gwp_co2",
    // gwp_ch4 = "gwp_ch4",
    mcf_Sea_River = "mcf_Sea_River",
    mcf_A_T_P_Well_Managed = "mcf_A_T_P_Well_Managed",
    mcf_A_T_P_Not_Well_Managed = "mcf_A_T_P_Not_Well_Managed",
    mcf_A_D_Sludge = "mcf_A_D_Sludge",
    mcf_Anaerobic_Reactor = "mcf_Anaerobic_Reactor",
    mcf_Anaerobic_Shallow_Lagoon = "mcf_Anaerobic_Shallow_Lagoon",
    mcf_Anaerobic_Deep_Lagoon = "mcf_Anaerobic_Deep_Lagoon",


    // ef_co2_landfill = "ef_co2_landfill",
    // ef_co2_sludge = "ef_co2_sludge",
    // ef_co2_other = "ef_co2_other",
    // ef_co2_sludge = "ef_co2_sludge",
    
    // ef_ch4_landfill = "ef_ch4_landfill",
    // ef_ch4_sludge = "ef_ch4_sludge",
    // ef_ch4_other = "ef_ch4_other",
    // ef_ch4_sludge = "ef_ch4_sludge",
    
    // ef_n2o_landfill =  "ef_n2o_landfill",
    // ef_n2o_sludge =  "ef_n2o_sludge",
    // ef_n2o_other =  "ef_n2o_other",
    // ef_n2o_sludge =  "ef_n2o_sludge",

    //Cargo types
    AGRICULTURAL_PRODUCTS_AND_LIVE_ANIMALS = 'Agricultural products and live_animals',
    BEVERAGE = 'beverage',
    GROCERIES = 'Groceries',
    PERISHABLE_AND_SEMI_PERISHABLE_FOODSTUFF_AND_CANNED_FOOD = 'Perishable and semi-perished foodstuff and canned food',
    OTHER_FOOD_PRODUCTS_AND_FODDER = 'Other food products and fodder',
    SOLID_MINERUL_FUELS_AND_PETROLEUM_PRODUCTS = 'Solid mineral fuels and petroleum_products',
    ORES_AND_METAL_WASTE  = 'Ores and metal waste',
    METAL_PRODUCTS = 'Metal products',
    MINERAL_PRODUCTS = 'Mineral products',
    OTHER_CRUDE_AND_MANUFACTURED_MINERALS_AND_BUILDING_MATERIALS = 'Other crude and manufactured minerals and materials',
    FERTILIZERS = 'Fertilizers',
    CHEMICALS = 'Chemicals',
    TRANSPORT_EQUIPMENT = 'Transport equipment',
    MACHINERY_AND_METAL_PRODUCTS = 'Machinery and metal products',
    GLASS_AND_CERAMIC_AND_PORCELAIN_PRODUCTS = 'Glass and ceramic and porcelain_products',
    GROUPED_GOODS = 'Grouped goods',
    OTHER_MANUFACTURED_ARTICLES = 'Other manufactured articles',

    //waste Disposal
    PIGGERY_FEEDRATE = "PIGGERY_FEEDRATE",
    FOOD_OUTLET='FOOD_OUTLET',
    CLOTHING_OUTLET='CLOTHING_OUTLET'

}