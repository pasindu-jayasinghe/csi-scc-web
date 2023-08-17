// import { Roles } from "shared/AppService"
import { csiRoles } from "shared/AppService"
import { Roles, UserActions } from "shared/service-proxies/auth-service-proxies"
import { PuesDataReqDtoSourceName } from "shared/service-proxies/service-proxies"

export interface ClildMenuItem {
    title: string,
    path: string,
    requireRoles: Roles[],
    childs?: ClildMenuItem[] | undefined,
    isES?: boolean,
    es?: PuesDataReqDtoSourceName
    requireActions: UserActions[],
}
export interface MenuItem {
    title: string,
    path: string,
    requireRoles: Roles[],
    requireActions: UserActions[],
    childs: ClildMenuItem[]
}

  // TODO: remove CSI_ADMIN


export const sideMenu: MenuItem[] = [
    {
        title: 'Dashboard',
        path: '/app/',
        requireRoles: [...csiRoles, Roles.COM_ADMIN, Roles.SBU_ADMIN, Roles.DEO],
        requireActions: [],
        childs: []
    },
    {
        title: 'Company Hierarchy',
        path: '/app/unit/hierarchy',
        requireRoles: [...csiRoles, Roles.COM_ADMIN, Roles.SBU_ADMIN],
        requireActions: [],
        childs: []
    },
    {
        title: 'Enter Data',
        path: '/app/emission/',
        requireRoles: [...csiRoles, Roles.COM_ADMIN, Roles.SBU_ADMIN, Roles.DEO, Roles.DEO, Roles.AUDITOR],
        requireActions: [],
        childs: [
            {
                title: 'Electricity,Indirect Emissions from Purchased Electricity',
                path: '/app/emission/electricity-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Electricity
            },
            {
                title: 'Fire Extinguisher,Fire Suppression Equipment ',
                path: '/app/emission/fire-extinguisher-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Fire_extinguisher
            },
            {
                title: 'Generator,Direct Emissions from Stationary Combustion Sources',
                path: '/app/emission/generator-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Generator
            },
            {
                title: 'Refrigerant Gas, Refrigerent And Air Condition',
                path: '/app/emission/refrigerant-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Refrigerant
            },
            {
                title: 'Welding,Purchased Gases',
                path: '/app/emission/welding-es-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Welding_es
            },
            {
                title: 'Boiler,Boiler',
                path: '/app/emission/boilers-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Boiler
            },
            {
                title: 'Wastewater Treatment,Net Zero Wastewater Treatment',
                path: '/app/emission/waste-water-treatment-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Waste_water_treatment
            },
            {
                title: 'Municipal Water,Net-Zero Municipal Water',
                path: '/app/emission/municipal-water-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Municipal_water
            },
            {
                title: 'Waste Disposal,NA',
                path: '/app/emission/waste-disposal-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Waste_disposal
            },
            {
                title: 'Cooking Gas,Net Zero Cooking Gas',
                path: '/app/emission/cooking-gas-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Cooking_gas
            },
            {
                title: 'Transport',
                path: '/app/emission/transport-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
            },
            {
                title: 'Net Zero Purchase Good and Services',
                path: '/app/emission/purchase-good-and-services-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Purchased_goods_and_services
            },
            {
                title: 'Net Zero Business Travel,Net Zero Business Travel',
                path: '/app/emission/net-zero-business-travel-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Net_zero_business_travel
            },
            {
                title: 'Net Zero Employee Commuting,Net Zero Employee Commuting',
                path: '/app/emission/net-zero-employee-commuting-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Net_zero_employee_commuting
            },
            {
                title: 'Investments,Investments',
                path: '/app/emission/investments-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Investments

            },
            {
                title: 'Fuel And Energy,Fuel And Energy',
                path: '/app/emission/fuel-energy-activity-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Fuel_energy_related_activities
            },
            {
                title: 'End Of Life Treatment Of Sold Products,End Of Life Treatment Of Sold Products',
                path: '/app/emission/eolt-sold-products-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.End_of_life_treatment_of_sold_products
            },
            {
                title: 'Waste Generated In Operations',
                path: '/app/emission/waste-generated-in-operations-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Waste_generated_in_operations},

            {
                title: 'Upstream Leased Assets,Upstream Leased Assets',
                path: '/app/emission/upstream-leased-assets-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Upstream_leased_assets
            },
            {
                title: 'Franchises,Franchises',
                path: '/app/emission/net-zero-franchises-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Franchises
            },

            {
                title: 'Processing of sold product',
                path: '/app/emission/processing-of-sold-product-list',
                requireRoles: [],
                requireActions: [],
                isES: true,          
                es: PuesDataReqDtoSourceName.Processing_of_sold_products      
            },
            // {
            //     title: 'Downstream Leased Assets',
            //     path: '/app/emission/downstream-leased-assets-list',
            //     requireRoles: [],
            //     requireActions: [],
            //     isES: true,          
            //     es: PuesDataReqDtoSourceName.Downstream_leased_assets      
            // },
            {
                title: 'Upstream Transportation And Distribution',
                path: '/app/emission/upstream-transport-list',
                requireRoles: [],
                requireActions: [],
                isES: true,          
                es: PuesDataReqDtoSourceName.Upstream_transportation_and_distribution      
            },
            {
                title: 'Downstream Transportation And Distribution',
                path: '/app/emission/downstream-transport-list',
                requireRoles: [],
                requireActions: [],
                isES: true,          
                es: PuesDataReqDtoSourceName.Downstream_transportation_and_distribution  
            },
            {    
                title: 'Downstream Leased Assets',
                path: '/app/emission/downstream-leased-assets-list',
                requireRoles: [],
                requireActions: [],
                isES: true,          
                es: PuesDataReqDtoSourceName.Downstream_leased_assets      
            }, 
            {
                title: 'Net Zero Use of Sold Products',
                path: '/app/emission/use-of-sold-products-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Use_of_sold_products
            },
            {
                title: 'Capital Goods',
                path: '/app/emission/capital-goods-list',
                requireRoles: [],
                requireActions: [],
                isES: true,
                es: PuesDataReqDtoSourceName.Capital_goods
            },
        ]
    },
    {
        title: 'EF-Management',
        path: '/app/emission-factor',
        requireRoles: [...csiRoles, Roles.EF_MANAGER],
        requireActions: [UserActions.EMISSION_FACTOR_MANAGEMENT],
        childs: [
            {
                title: 'Common Factor',
                path: '/app/emission-factor/common-factors',
                requireRoles: [],
                requireActions: [],
            },
            {
                title: 'Fuel Factor',
                path: '/app/emission-factor/fuel-factors',
                requireRoles: [],
                requireActions: [],
            },
            {
                title: 'Transport Factor',
                path: '/app/emission-factor/transport-factors',
                requireRoles: [],
                requireActions: [],
            },

            {
                title: 'Freight Water Factor',
                path: '/app/emission-factor/freightwater-factors',
                requireRoles: [],
                requireActions: [],
            },

            {
                title: 'Municipal Water Tariff',
                path: '/app/emission-factor/municipal-water-tariff',
                requireRoles: [],
                requireActions: [],
            },

            {
                title: 'Freight Rail Factor',
                path: '/app/emission-factor/freightRail-factors',
                requireRoles: [],
                requireActions: [],
            },
            {
                title: 'NetZero Factor',
                path: '/app/emission-factor/netzero-factors',
                requireRoles: [],
                requireActions: [],
            },
            {
                title: 'Waste Dispol Factors',
                path: '/app/emission-factor',
                requireRoles: [],
                requireActions: [],
                childs: [
                    {
                        title: 'Biological Treatment',
                        path: '/app/emission-factor/biological-treatment-solid-waste',
                        requireRoles: [],
                        requireActions: [],
                    },
                    {
                        title: 'Waste Incineration',
                        path: '/app/emission-factor/waste-incineration',
                        requireRoles: [],
                        requireActions: [],
                    },
                    {
                        title: 'Open Burning of Waste',
                        path: '/app/emission-factor/open-burning-of-waste',
                        requireRoles: [],
                        requireActions: [],
                    },
                    {
                        title: 'Domestic Wastewater Treatment and Discharge',
                        path: '/app/emission-factor/domestic-ww-treatment-discharge',
                        requireRoles: [],
                        requireActions: [],
                    },
                    {
                        title: 'Industrial Wastewater Treatment and Discharge',
                        path: '/app/emission-factor/industrial-ww-treatment-discharge',
                        requireRoles: [],
                        requireActions: [],
                    },
                    {
                        title: 'Solid Waste Disposal',
                        path: '/app/emission-factor/solid-waste-disposal',
                        requireRoles: [],
                        requireActions: [],
                    },
                    {
                        title: 'Defra',
                        path: '/app/emission-factor/defra',
                        requireRoles: [],
                        requireActions: [],
                    },
                    {
                        title: 'Incineration',
                        path: '/app/emission-factor/incineration',
                        requireRoles: [],
                        requireActions: [],
                    },

                ]
            },


            {
                title: 'IPPU Factors',
                path: '/app/emission-factor',
                requireRoles: [],
                requireActions: [],
                childs: [
                    {
                        title: 'Cemenet Production',
                        path: '/app/emission-factor/cement-production',
                        requireRoles: [],
                        requireActions: [],
                    },



                ]
            },
        ]
    },
    {
        title: 'Project',
        path: '/app/project',
        requireRoles: [...csiRoles, Roles.FINANCIAL_MANAGER],
        requireActions: [],
        childs: [
            {
                title: 'Create',
                path: '/app/project/create',
                requireRoles: [],
                requireActions: [UserActions.CREATE_PROJECT],
            },
            {
                title: 'List',
                path: '/app/project/list',
                requireRoles: [],
                requireActions: [],
            }
        ]
    },
    {
        title: 'User',
        path: '/app/user',
        requireRoles: [...csiRoles, Roles.COM_ADMIN, Roles.SBU_ADMIN],
        requireActions: [],
        childs: [
            {
                title: 'ES Access',
                path: '/app/es-access',
                requireRoles: [],
                requireActions: [],
            },
            {
                title: 'Create',
                path: '/app/user/create',
                requireRoles: [],
                requireActions: [],
            },
            {
                title: 'List',
                path: '/app/user/list',
                requireRoles: [],
                requireActions: [],
            },
            {
                title: 'Import/Export',
                path: '/app/user/import-export',
                requireRoles: [],
                requireActions: [],
            },
            {
                title: 'Roles',
                path: '/app/user/roles',
                requireRoles: [Roles.SUPER_ADMIN],
                requireActions: [],
            },
            {
                title: 'User Action',
                path: '/app/user/user-action',
                requireRoles: [Roles.SUPER_ADMIN],
                requireActions: [],
            },
            {
                title: 'Manage User\'s Action',
                path: '/app/user/user-actions-of-user',
                requireRoles: [Roles.SUPER_ADMIN],
                requireActions: [],
            }
        ]
    },
    {
        title: 'Report-Data',
        path: '',
        requireRoles: [...csiRoles, Roles.COM_ADMIN, Roles.SBU_ADMIN],
        requireActions: [],
        childs: [
            {
                title: 'Mitigation',
                path: '/app/report/mitigation',
                requireRoles: [...csiRoles, Roles.COM_ADMIN, Roles.SBU_ADMIN],
                requireActions: [],
            },
            {
                title: 'Recommendation',
                path: '/app/report/recommendation',
                requireRoles: [...csiRoles],
                requireActions: [],
            },
            {
                title: 'Next-Steps',
                path: '/app/report/next-steps',
                requireRoles: [...csiRoles],
                requireActions: [],
            },
        ]
    },
    {
        title: 'Report',
        path: '/app/report/data',
        requireRoles: [...csiRoles, Roles.COM_ADMIN, Roles.SBU_ADMIN, Roles.AUDITOR],
        requireActions: [],
        childs: []
    },
    {
        title: 'Guidance',
        path: '/app/project/methodology-list',
        requireRoles: [...csiRoles],
        requireActions: [],
        childs: []
    },
    {
        title: 'Info',
        path: '/app/unit/infor',
        requireRoles: [...csiRoles, Roles.COM_ADMIN, Roles.SBU_ADMIN],
        requireActions: [],
        childs: []
    },
    {
        title: 'Verification',
        path: '/app/verification/project-list',
        requireRoles: [Roles.AUDITOR],
        requireActions: [],
        childs: []
    },
    {
        title: 'Evidence Requested',
        path: '/app/evidence-requested/request-list',
        requireRoles: [Roles.COM_ADMIN, Roles.SBU_ADMIN, Roles.DEO, Roles.DEO],
        requireActions: [],
        childs: []
    },
    {
        title: 'Requested Evidence',
        path: '/app/evidence-requested/request-list-verifier',
        requireRoles: [Roles.AUDITOR],
        requireActions: [],
        childs: []
    },
    {
        title: 'Summary',
        path: '/app/summary',
        requireRoles: [Roles.COM_ADMIN, Roles.SBU_ADMIN, ...csiRoles],
        requireActions: [UserActions.ORG_SUMMARY],
        childs: []
    },
    {
        title: 'Progress Report',
        path: '/app/progress-report',
        requireRoles: [Roles.COM_ADMIN, Roles.SBU_ADMIN, ...csiRoles],
        requireActions: [UserActions.COMPLENESS_CHECK],
        childs: []
    },
    {
        title: 'Emission Category',
        path: '/app/emission/es-category',
        requireRoles: [Roles.CLIMATESI_FP, Roles.EF_MANAGER],
        requireActions: [],
        childs: []
    },
    {
        title: 'Data Migration',
        path: '/app/migration',
        requireRoles: [Roles.SUPER_ADMIN],
        requireActions: [],
        childs: []
    },
    {
        title: 'Bulk Recalculate',
        path: '/app/bulk-recalculate',
        requireRoles: [Roles.SUPER_ADMIN, Roles.CLIMATESI_FP],
        requireActions: [],
        childs: []
    },
    {
        title: 'Reset Password',
        path: '/app/user/setting',
        requireRoles: [],
        requireActions: [],
        childs: []
    },
    {
        title: 'Audit Log',
        path: '/app/audit',
        requireRoles: [Roles.SUPER_ADMIN],
        requireActions: [],
        childs: []
    },
]
