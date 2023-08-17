import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { environment } from 'environments/environment';
import { Message, MessageService, TreeNode } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Unit, Project, ProjectUnitEmissionSourceControllerServiceProxy, ProjectStatus, PuesDataReqDtoSourceName, PuesDataDto, User, EmissionBaseControllerServiceProxy, PuesDataDtoClasification, PuesDataDtoSourceType } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-excell-uplod-dialog',
  templateUrl: './excell-uplod-dialog.component.html',
  styleUrls: ['./excell-uplod-dialog.component.css']
})
export class ExcellUplodDialogComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  private validationSheetMapDto: {variable: string,sheetName: string}[] = []
  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    public appService: AppService, 
    private projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private masterDataService: MasterDataService,
    private http: HttpClient,
    protected messageService: MessageService,
    private emissionBaseController: EmissionBaseControllerServiceProxy,

  ) {
    this.baseUrl = environment.baseUrlAPI
  }

  private readonly baseUrl: string="";
  creating: boolean = false;
  puesData: PuesDataDto;
  isAnyAdmin: boolean = false;
  puesAssigned: boolean = false;
  projectInDataEntry: boolean = true;

  selectedUnit: Unit;
  selectedProject: Project;
  selecteOwnership: string;
  sourceName: PuesDataReqDtoSourceName;
  isMobile: boolean;
  uploadedExcellFile: any;
  uploading: boolean = false;
  downloaded: boolean = false;
  hasErrors: boolean = false;
  errorOnSaving: boolean = false;
  user: User;


  headerErrors: Message[] = [{severity:'error', summary:'There are few issues in the uploaded file', detail:'Please go through followings'}]
  errorOnSavingMsg: Message[] = [{severity:'error', summary:'Follwing are not saved', detail:'Please check and reupload only fowwling rows'}]
  errorNodes: TreeNode[];
  errMessages: {row: number, column: string, messages: string[]}[] = [];


  ownerships: {id: number, code: string}[] = [];
  months:{name: string, code: number}[] = []

  isMultiUnit: boolean =true;
  async ngOnInit() {
    this.ownerships = this.masterDataService.ownership_freightTransport.map(ow => {
      return {
        id: ow.id,
        code: ow.name
      }
    });;
    this.months = this.masterDataService.months.map(m => {return {code: m.value, name: m.name}});
    this.isAnyAdmin = this.appService.isAnyAdmin();
    let u = await this.appService.getUser();
    if(u){
      this.user = u;
    }
    if(this.config.data){
      if(this.config.data.sourceName){
        this.sourceName = this.config.data.sourceName;
      }
    }
  }


  async downLoadTemplate(){
    var wb = XLSX.utils.book_new();


    //@ts-ignore
    let res: any[] =await  this.emissionBaseController.getVariableMapping(this.sourceName).toPromise()
    if(res && res.length > 0){
      let d: any ={}
      res.forEach((r: any) => {
        if(r.name){
          d[r.name] = ''
        }        
      });

      if(this.isMultiUnit){
        if(!d['Unit Id']){
          d['Unit Id'] = '';
        }
        if(!d['Ownership']){
          d['Ownership'] = '';
        }
        d['Is Mobile'] = '';
        d['Is Stationary'] = '';
      }
      const wsIn: XLSX.WorkSheet = XLSX.utils.json_to_sheet([d], {skipHeader: false});
      XLSX.utils.book_append_sheet(wb, wsIn, 'in');
    }

    let instructions: any[] = [
      {
        'no': '1',
        'detail': 'If a column contains a value from a drop-down list, Please check the relevant sheet to get supported items.'
      },
      {
        'no': '2',
        'detail': 'Please use text in the column "value" or "code" in that sheets for the drop-down columns'
      },
      {
        'no': 3,
        'detail': 'If there are no data for a dropdown column, keep it blank'
      },
      {
        'no': 4,
        'detail': 'If there is no specific message for the "Ownership", "Is mobile" or "Is stationary" column in the "Allowed Unit" sheet for data entering the unit. That columns not need to fill'
      },
      {
        'no': 5,
        'detail': 'Use 1 or 0 for "Is Mobile" , "Is Stationary", "Paid by the company" and "Is shared" columns'
      },
      {
        'no': 6,
        'detail': 'Use values from 0-100 for the column "share"'
      }
    ];


    const instructionsSt: XLSX.WorkSheet = XLSX.utils.json_to_sheet(instructions, {skipHeader: false});
    XLSX.utils.book_append_sheet(wb, instructionsSt, 'INSTRUCTIONS');

    const ownershipsSt: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ownerships, {skipHeader: false});
    XLSX.utils.book_append_sheet(wb, ownershipsSt, 'Ownerships');

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.months, {skipHeader: false});
    XLSX.utils.book_append_sheet(wb, ws, 'Months');
    this.validationSheetMapDto.push({variable: 'month', sheetName: 'Months'})

    let unitsSteatData: any = this.getUnitInformations();
    // console.log(unitsSteatData);
    Object.keys(unitsSteatData).forEach((key)=> {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(unitsSteatData[key], {skipHeader: false});
      XLSX.utils.book_append_sheet(wb, ws, key);
    })


    let dropdownInformations: any = this.getDropdownInformations();
    Object.keys(dropdownInformations).forEach((key)=> {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dropdownInformations[key], {skipHeader: false});
      XLSX.utils.book_append_sheet(wb, ws, key);
    })

    if(this.isMultiUnit){
      let allowedUnits:{}[] = await this.getAllowdUnits();
      const units: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allowedUnits, {skipHeader: false});
      XLSX.utils.book_append_sheet(wb, units, 'Allowed Units');
    }

    if(this.downloaded){
      let name = "";
      this.selectedUnit?name =this.selectedUnit.name: name = this.selectedProject.name;
      XLSX.writeFile(wb, name + "-" + this.sourceName +"-template.xlsx");
    }
  }


  async getAllowdUnits(){
    try{
      let res =  await this.projectUnitEmissionSourceControllerServiceProxy.getAllowedUnitsforProjectAndEs(this.sourceName.toString(),this.selectedProject.id).toPromise()
      
      res = res.map((r: { code: any; name: any; clasification: any;mobile: boolean,stationery: boolean  }) => {
        let clasificationMsg = "";
        if(r.clasification === PuesDataDtoClasification.Any){
          clasificationMsg = "You shoud enter the 'Ownership' for this unit"
        }

        let msMsg = "";
        if(r.mobile && r.stationery){
          msMsg = "You should mark one of mobile,stationery as 1 for this unit"
        }

        return {
          code: r.code,
          name: r.name,
          clasification: r.clasification,
          'Ownership Message': clasificationMsg,
          'Mobile-Stationary Message': msMsg,
        }
      })
      return res;
    }catch(err){
      console.log(err);
      return [];
    }
  }


  download() {
    this.downloaded = true;
    this.downLoadTemplate();
  }

  getDropdownInformations(){
    let data: any = {};
    if(this.sourceName){
      switch(this.sourceName){ 
        case PuesDataReqDtoSourceName.Municipal_water:
          data['Categories'] = this.masterDataService.municipal_water_categories;
          this.validationSheetMapDto.push({variable: 'category', sheetName: 'Categories'})
          break
        case PuesDataReqDtoSourceName.Business_travel:
          data['Domestic or International'] = this.masterDataService.domesticInternationals;
          data['Methods'] = this.masterDataService.methods_freightTransport.map(m => {
            return {
              id: m.id,
              code: m.name
            }
          });
          data['One Way - Round Trip values'] = this.masterDataService.options_freightTransport;
          data['Fuel Types'] = this.masterDataService.fuel;

          this.validationSheetMapDto.push({variable: 'method', sheetName: 'Methods'})
          this.validationSheetMapDto.push({variable: 'domOrInt', sheetName: 'Domestic or International'})
          this.validationSheetMapDto.push({variable: 'option', sheetName: 'One Way - Round Trip values'})
          this.validationSheetMapDto.push({variable: 'fuelType', sheetName: 'Fuel Types'})
          break;
        case PuesDataReqDtoSourceName.Freight_road:
          data['Domestic or International'] = this.masterDataService.domesticInternationals;
          data['Methods'] = this.masterDataService.methods_freightTransport.map(m => {
            return {
              id: m.id,
              code: m.name
            }
          });;
          data['One Way - Round Trip values'] = this.masterDataService.options_freightTransport;
          data['Fuel Types'] = this.masterDataService.fuel;
          data['Cargo Types'] = this.masterDataService.cargoType_road_freightTransport;
          data['Cargo Types-Shared'] = this.masterDataService.cargoType_shared;
          this.validationSheetMapDto.push({variable: 'method', sheetName: 'Methods'})
          this.validationSheetMapDto.push({variable: 'domOrInt', sheetName: 'Domestic or International'})
          this.validationSheetMapDto.push({variable: 'option', sheetName: 'One Way - Round Trip values'})
          this.validationSheetMapDto.push({variable: 'fuelType', sheetName: 'Fuel Types'})
          this.validationSheetMapDto.push({variable: 'cargoType', sheetName: 'Cargo Types'})
          this.validationSheetMapDto.push({variable: 'fuelType', sheetName: 'Waste Types'})

          break;   
        case PuesDataReqDtoSourceName.Passenger_road:
          data['Fuel Types'] = this.masterDataService.fuel;
          data['Domestic or International'] = this.masterDataService.domesticInternationals;
          data['Methods'] = this.masterDataService.methods_freightTransport.map(m => {
            return {
              id: m.id,
              code: m.name
            }
          });;
          data['One Way - Round Trip values'] = this.masterDataService.options_freightTransport;
          data['Direct Transport Mode'] = this.masterDataService.private_transport_modes;
          data['No Emission Transport Mode'] = this.masterDataService.noEmission_transport_modes;
          data['Private Transport Mode'] = this.masterDataService.private_transport_modes;
          data['Hired Transport Mode'] = this.masterDataService.private_transport_modes;
          data['Public Transport Mode'] = this.masterDataService.public_transport_modes;

          this.validationSheetMapDto.push({variable: 'method', sheetName: 'Methods'})
          this.validationSheetMapDto.push({variable: 'domOrInt', sheetName: 'Domestic or International'})
          this.validationSheetMapDto.push({variable: 'option', sheetName: 'One Way - Round Trip values'})
          this.validationSheetMapDto.push({variable: 'fuelType', sheetName: 'Fuel Types'})

          this.validationSheetMapDto.push({variable: 'directTransportMode', sheetName: 'Direct Transport Mode'})
          this.validationSheetMapDto.push({variable: 'noEmissionMode', sheetName: 'No Emission Transport Mode'})
          this.validationSheetMapDto.push({variable: 'privateMode', sheetName: 'Private Transport Mode'})
          this.validationSheetMapDto.push({variable: 'hiredMode', sheetName: 'Hired Transport Mode'})
          this.validationSheetMapDto.push({variable: 'publicMode', sheetName: 'Public Transport Mode'})
          break;  
        case PuesDataReqDtoSourceName.Boiler:
          data['Fuel Types'] = this.masterDataService.boilerTypes;
          data['Fuels'] = this.masterDataService.fuelTypeBoilers
          this.validationSheetMapDto.push({variable: 'fuelType', sheetName: 'Fuel Types'})
          this.validationSheetMapDto.push({variable: 'fuel', sheetName: 'Fuels'})
          break;
        case PuesDataReqDtoSourceName.Waste_water_treatment:
          data['Anaerobic Deep Lagoons'] = this.masterDataService.anaerobicDeepLagoons;
          this.validationSheetMapDto.push({variable: 'anaerobicDeepLagoon', sheetName: 'Anaerobic Deep Lagoons'})
          break;
        case PuesDataReqDtoSourceName.Waste_disposal:
          data['Waste Types'] = this.masterDataService.disposalWasteTypes;
          data['Disposal Methods'] = this.masterDataService.disposalMethods.map(wt => {
            return {
              id: wt.id,
              code: wt.name
            }
          });
          this.validationSheetMapDto.push({variable: 'disposalMethod', sheetName: 'Disposal Methods'})
          this.validationSheetMapDto.push({variable: 'wasteType', sheetName: 'Waste Types'})
          break;
        case PuesDataReqDtoSourceName.Cooking_gas:
          data['Emission Sources'] = this.masterDataService.cookingEmissionSources;
          data['Gas Types'] = this.masterDataService.cookingGasTypes;
          this.validationSheetMapDto.push({variable: 'emissionSource', sheetName: 'Emission Sources'})
          this.validationSheetMapDto.push({variable: 'gasType', sheetName: 'Gas Types'})
          break;
        case PuesDataReqDtoSourceName.Refrigerant:
          data['Refrigerant Types'] = this.masterDataService.gWP_RGs.map(d => {
            return {
              code: d.id,
              name: d.name
            }
          });
          this.validationSheetMapDto.push({variable: 'gWP_RG', sheetName: 'Refrigerant Types'})
          break;
        case PuesDataReqDtoSourceName.Fire_extinguisher:
          data['Fire Extinguisher Types'] = this.masterDataService.fireExtinguisherTypes;
          this.validationSheetMapDto.push({variable: 'fireExtinguisherType', sheetName: 'Fire Extinguisher Types'})
          break;
        case PuesDataReqDtoSourceName.Generator:
          data['Fuel Types'] = this.masterDataService.fuel;
          this.validationSheetMapDto.push({variable: 'fuelType', sheetName: 'Fuel Types'})
          break;
        case PuesDataReqDtoSourceName.Municipal_water:
          data['Categories'] = this.masterDataService.municipal_water_categories;
          break;
      }
    }
    console.log("dddd",data)
    return data;
  }

  getUnitInformations(){
    let data = {};
    if(this.sourceName){
      let unitMap;
      switch(this.sourceName){
        case PuesDataReqDtoSourceName.Business_travel:
          unitMap = this.masterDataService.passenger_road_units;
          data = {
            'Distance Units': unitMap.distance,            
            'Fuel Consumption Units': unitMap.fuel,            
            'Fuel Economy Units': unitMap.fuelEconomy,            
          }
          this.validationSheetMapDto.push({variable: 'totalDistanceTravelled_unit', sheetName: 'Distance Units'})
          this.validationSheetMapDto.push({variable: 'btFuelConsumption_unit', sheetName: 'Fuel Consumption Units'})
          this.validationSheetMapDto.push({variable: 'fuelEconomy_unit', sheetName: 'Fuel Economy Units'})

          break;
        case PuesDataReqDtoSourceName.Freight_road:
          unitMap = this.masterDataService.road_freight_units;
          data = {
            'Up Weight Units': unitMap.weight,            
            'Down Weight Units': unitMap.weight,            
            'Up Distance Units': unitMap.distance,            
            'Down Distance Units': unitMap.distance,
            'Fuel Consumtion Units': unitMap.fuel,
            'Fuel Economy Units': unitMap.fuelEconomy,
          }
          this.validationSheetMapDto.push({variable: 'upWeight_unit', sheetName: 'Up Weight Units'})
          this.validationSheetMapDto.push({variable: 'downWeight_unit', sheetName: 'Down Weight Units'})
          this.validationSheetMapDto.push({variable: 'upDistance_unit', sheetName: 'Up Distance Units'})
          this.validationSheetMapDto.push({variable: 'downDistance_unit', sheetName: 'Down Distance Units'})
          this.validationSheetMapDto.push({variable: 'fuelConsumption_unit', sheetName: 'Fuel Consumtion Units'})
          this.validationSheetMapDto.push({variable: 'fuelEconomy_unit', sheetName: 'Fuel Economy Units'})

          break;
        case PuesDataReqDtoSourceName.Passenger_road:
          unitMap = this.masterDataService.passenger_road_units;
          data = {
            'Petrol Consumption Units': unitMap.ecFuel,            
            'Diesel Consumption Units': unitMap.ecFuel,            
            'No Emission Distance Units': unitMap.ecDistance,            
            'Public Distance Units': unitMap.publicDistance,
            'Private Distance Units': unitMap.ecDistance,
            'Fuel Economy Units': unitMap.fuelEconomy,
            'Hired Distance Units': unitMap.ecDistance,
            'Hired Fuel Economy Units': unitMap.fuelEconomy,
          }
          this.validationSheetMapDto.push({variable: 'petrolConsumption_unit', sheetName: 'Petrol Consumption Units'})
          this.validationSheetMapDto.push({variable: 'dieselConsumption_unit', sheetName: 'Diesel Consumption Units'})
          this.validationSheetMapDto.push({variable: 'noEmissionDistance_unit', sheetName: 'No Emission Distance Units'})
          this.validationSheetMapDto.push({variable: 'publicDistance_unit', sheetName: 'Public Distance Units'})
          this.validationSheetMapDto.push({variable: 'privateDistance_unit', sheetName: 'Private Distance Units'})
          this.validationSheetMapDto.push({variable: 'fuelEconomy_unit', sheetName: 'Fuel Economy Units'})
          this.validationSheetMapDto.push({variable: 'hiredDistance_unit', sheetName: 'Hired Distance Units'})
          this.validationSheetMapDto.push({variable: 'hiredFuelEconomy_unit', sheetName: 'Hired Fuel Economy Units'})
          break;
        case PuesDataReqDtoSourceName.Boiler:
          unitMap = this.masterDataService.boiler_units;
          data = {
            'Consumption Units': unitMap.wrg
          }
          this.validationSheetMapDto.push({variable: 'consumption_unit', sheetName: 'Consumption Units'})
          break;
        case PuesDataReqDtoSourceName.Waste_water_treatment:

          unitMap = this.masterDataService.waste_water_units;
          data = {
            'Total Industry Product unit': unitMap.tip,
            'Waste Generated unit': unitMap.wasteGenerated,
            'Chemical Oxigen Demand unit': unitMap.cod,
            'Sludge Removed unit': unitMap.sludgeRemoved,
            'Recovered CH4 unit': unitMap.recoveredCh4,
          }
          this.validationSheetMapDto.push({variable: 'tip_unit', sheetName: 'Total Industry Product unit'})
          this.validationSheetMapDto.push({variable: 'wasteGenerated_unit', sheetName: 'Waste Generated unit'})
          this.validationSheetMapDto.push({variable: 'cod_unit', sheetName: 'Chemical Oxigen Demand unit'})
          this.validationSheetMapDto.push({variable: 'sludgeRemoved_unit', sheetName: 'Sludge Removed unit'})
          this.validationSheetMapDto.push({variable: 'recoveredCh4_unit', sheetName: 'Recovered CH4 unit'})
          break;
        case PuesDataReqDtoSourceName.Waste_disposal:
          unitMap = this.masterDataService.waste_disposal_units;
          data = {
            'Amount Disposed Units': unitMap.disposed
          }
          this.validationSheetMapDto.push({variable: 'amountDisposed_unit', sheetName: 'Amount Disposed Units'})
          break;
        case PuesDataReqDtoSourceName.Municipal_water:
          unitMap = this.masterDataService.municipal_water_units;
          data = {
            'Consumption Units': unitMap.consumption
          }
          this.validationSheetMapDto.push({variable: 'consumption_unit', sheetName: 'Consumption Units'})
          break;
        case PuesDataReqDtoSourceName.Cooking_gas:
          unitMap = this.masterDataService.cooking_gas_units;
          data = {
            'Consumption Units': unitMap.consumption
          }
          this.validationSheetMapDto.push({variable: 'fcn_unit', sheetName: 'Consumption Units'})
          break;
        case PuesDataReqDtoSourceName.Welding_es: // ok
          unitMap = this.masterDataService.welding_units;
          data = {
            'Acetylene Consumption Units': unitMap.ac,
            'Liquid CO2  Consumption Units': unitMap.lc
          }
          this.validationSheetMapDto.push({variable: 'ac_unit', sheetName: 'Acetylene Consumption Units'})
          this.validationSheetMapDto.push({variable: 'lc_unit', sheetName: 'Liquid CO2  Consumption Units'})
          break;
        case PuesDataReqDtoSourceName.Refrigerant:
          unitMap = this.masterDataService.refrigerant_units;
          data = {
            'Consumption Units': unitMap.wrg
          }
          this.validationSheetMapDto.push({variable: 'w_RG_unit', sheetName: 'Consumption Units'})
          break;
        case PuesDataReqDtoSourceName.Fire_extinguisher:
          unitMap = this.masterDataService.fire_extinguisher_units;
          data = {
            'Weight of a tank Units': unitMap.weightPerTank
          }
          this.validationSheetMapDto.push({variable: 'weightPerTank_unit', sheetName: 'Weight of a tank Units'})
          break;
        case PuesDataReqDtoSourceName.Generator:
          unitMap = this.masterDataService.generator_units;
          data = {                     
            'Fuel Consumption Units': unitMap.consumption,            
          }
          this.validationSheetMapDto.push({variable: 'fc_unit', sheetName: 'Fuel Consumption Units'})
          break;
        case PuesDataReqDtoSourceName.Electricity:
          unitMap = this.masterDataService.electricity_units;
          data = {                     
            'Consumption Units': unitMap.consumption,            
          }
          this.validationSheetMapDto.push({variable: 'consumption_unit', sheetName: 'Consumption Units'})
          break;
      }
    }
    return data;
  }


  hasValideInputs(){

    if(this.isMultiUnit){
      return this.selectedProject && this.selectedProject.id &&
        this.user && this.user.id &&
        this.sourceName;
    }else{
      return this.selectedProject && this.selectedProject.id &&
        this.selectedUnit && this.selectedUnit.id &&
        this.user && this.user.id &&
        this.sourceName && 
        (this.selecteOwnership || this.puesData.clasification !== PuesDataDtoClasification.Any);
    }
  }

  async onUpload(e: any){
    this.creating=true;
    const formData = new FormData();
    formData.append('file', this.uploadedExcellFile);
    
    let url = '';
    url = `${url}?projectId=`+this.selectedProject.id;
    url = `${url}&esCode=`+this.sourceName;
    if(this.selectedUnit){
      url = `${url}&unitId=`+this.selectedUnit.id;
      url = `${url}&userId=`+this.user.id;
      url = `${url}&ownerShip=`+this.selecteOwnership;
      url = `${url}&isMobile=`+this.isMobile;
    }
   

    if(this.hasValideInputs()){
      console.log("has valid")
      if(this.isMultiUnit){
        console.log("has mmmmm")

        if(!this.downloaded){
          await this.downLoadTemplate();
        }
        formData.append('mapping', JSON.stringify({data: this.validationSheetMapDto}));
        let mainUrl = this.baseUrl +'/emission-base/upload-bulk-multi-unit/';
        this.http.post(mainUrl+url, formData).subscribe((res: any)=>{
          console.log(res);
          this.creating=false;
          let data=res.filter((r: any) => r !== null);
          if(data.length > 0){              
            this.errorOnSaving = res.filter((r: { column: string; }) => r.column === "Error on saving").length > 0;
            this.errMessages = res;        
            this.errorNodes = this.mapErrorMessageToTreeNodeList(this.errMessages);
            this.hasErrors = true;
          }else{
            this.hasErrors = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.uploadedExcellFile.name + 'is uploaded and saved successfully',
              closable: true,
            });
            this.ref.close();
          }
          //@ts-ignore
          this.uploadedExcellFile = null;
        },error=> {
          this.creating=false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
          this.ref.close();
        })
      }else{
        let mainUrl = this.baseUrl +'/emission-base/upload-bulk/';
        this.http.post(mainUrl+url, formData).subscribe((res: any)=>{
          this.creating=false;
          if(res.status){
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.uploadedExcellFile.name + 'is uploaded and created successfully',
              closable: true,
            });
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
          }
          //@ts-ignore
          this.uploadedExcellFile = null;
          this.ref.close();
        },error=> {
          this.creating=false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
          this.ref.close();
        })
      }      
    }else{
      this.creating=false;
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Missing fields` });
    }


    
  }
  

  onAddFile(event: {index: number, file: File}){
    this.uploadedExcellFile = event.file;
  }

  onRemoveFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedExcellFile = null;
  }


  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.hasPUES(this.selectedUnit.id, this.selectedProject, this.sourceName);
  }

  allUnitClick(){
    //@ts-ignore
    this.selectedUnit = null;
  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    if(this.selectedUnit){
      this.hasPUES(this.selectedUnit.id, this.selectedProject, this.sourceName);
    }else{
      // TODO: get allowd unit list and add to template
    }
  }



  async hasPUES(unitId: number, project: Project, sourceName: PuesDataReqDtoSourceName){
    if(project && project.id && unitId && sourceName){

      this.puesData = await this.appService.getPUESData(this.selectedProject, sourceName, this.selectedUnit);         
 

      if(this.puesData.sourceType !== PuesDataDtoSourceType.B){
        this.isMobile = this.puesData.sourceType === PuesDataDtoSourceType.M
      }

      let res = await this.projectUnitEmissionSourceControllerServiceProxy.hasPUES(unitId,project.id,sourceName.toString()).toPromise();
      this.puesAssigned = res;
      if(!res){
        this.messageService.add({
          severity: 'warn',
          summary: 'Warnning',
          detail: 'This Emission source is not assigned to selected unit and project',
          closable: true,
        });
      }else{
        if(project.projectStatus !== ProjectStatus.DataEntry){
          this.projectInDataEntry = false;
          this.puesAssigned = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Warnning',
            detail: 'This project is not in Data Entry mode',
            closable: true,
          });
        }else{
          this.projectInDataEntry = true;
        }
      }
    }else{
      this.puesAssigned = true;
    }
  }

  mapErrorMessageToTreeNodeList(errMessages: {row: number, column: string, messages: string[]}[]){
    return errMessages.map(msg => {
      return {
        "label": "Row - " + msg.row + " - Column - " + msg.column,
        "data": "Row - " + msg.row + " - Column - " + msg.column,
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": msg.messages.map(child => {
          return {
            "label": child,
            "data": child
          }
        })
      }
    })
  }

  downloadErrors(){
    console.log(this.errorNodes)
  }

}
