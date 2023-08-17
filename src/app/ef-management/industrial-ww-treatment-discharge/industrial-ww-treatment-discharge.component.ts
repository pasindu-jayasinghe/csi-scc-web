import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { IndustrialWWTreatmentDischarge, WasteIncineration } from 'shared/service-proxies/es-service-proxies';
import { ServiceProxy } from 'shared/service-proxies/es-service-proxies';

@Component({
  selector: 'app-industrial-ww-treatment-discharge',
  templateUrl: './industrial-ww-treatment-discharge.component.html',
  styleUrls: ['./industrial-ww-treatment-discharge.component.css']
})
export class IndustrialWwTreatmentDischargeComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  gasTypes: any
  wasteBasis: any
  tieres: any
  biologicalTreatments: any
  wasteCategories: any
  wasteTypes: any
  mswTypes:any
  countries: any
  industrialSectors:any
  treatmentTypeDischarge:any
  id: any;
  // biologicalTeatmentSolidWasteFacs: BiologicalTreatmentSolidWaste[];
  industrialWWDis: IndustrialWWTreatmentDischarge = new IndustrialWWTreatmentDischarge()
  industrialWWDisFacs:IndustrialWWTreatmentDischarge [];
  constructor(

    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    public appService: AppService
  ) {


  }
  fuelsData: any
  rows: any
  totalRecords: any;
  loading: any
  displayFuel: boolean;
  isNewEntry: boolean;
  isView: boolean;
  editEntryId: number



  ngOnInit(): void {
    this.gasTypes = this.masterDataService.gasTypes;
    this.wasteBasis = this.masterDataService.wasteBasis;
    this.tieres = this.masterDataService.tieres;
    this.biologicalTreatments = this.masterDataService.biologicalTreatments;
    this.wasteCategories = this.masterDataService.wasteCategories;
    this.countries = this.masterDataService.countries;
    this.industrialSectors = this.masterDataService.industrialSectors;
    this.treatmentTypeDischarge = this.masterDataService.treatmentTypeDischarge;



    if (this.id == -1) {
      this.industrialWWDis = new IndustrialWWTreatmentDischarge()
    }

    if (this.id > 0) {
      this.editEntryId = this.id
      if (this.editEntryId && this.editEntryId > 0) {

        this.isNewEntry = false;
        this.serviceProxy.getOneBaseIndustrialWWTreatmentDischargeControllerIndustrialWWTreatmentDischarge(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.industrialWWDis = res;
        });
      }

    }


  }

  newEF() {
    this.isNewEntry = true
    this.isView = false
    this.displayFuel = true;
    this.id = -1;
    this.ngOnInit()

  }

  viewEF(id: number) {
    this.displayFuel = true;
    this.isView = true
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }

  editEF(id: number) {
    this.isNewEntry = false;
    this.displayFuel = true;
    this.isView = false
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }


  onChangeWasteCat(value: any) {
    this.masterDataService.getWasteTypes(value).subscribe(d => {
      this.wasteTypes = d;
    })
  }

  onChangeGasType(value:any){

    this.masterDataService.getMSWType(value).subscribe(d => {
      this.mswTypes = d;
    })
  }


loadEF(event :LazyLoadEvent){

  console.log(event);
    this.loading = true;
    this.totalRecords = 0;


    // let typeId = this.searchBy.userType ? this.searchBy.userType.id : 0;
    // let filterText = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber = event.first === 0 || event.first == undefined
      ? 1
      : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    this.serviceProxy
      .getManyBaseIndustrialWWTreatmentDischargeControllerIndustrialWWTreatmentDischarge(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        100,
        0,
        pageNumber,
        0
      ).subscribe((res: any) => {
        this.industrialWWDisFacs = res.data;
        this.totalRecords = res.total;
        this.loading = false;
        // console.log('electricityData--',this.electricityData)
        console.log('total..', this.totalRecords)
      })

}

async saveWasteFac(wasteFacForm:NgForm){

  if (wasteFacForm.valid) {
    console.log("isvalidate")


    if (this.isNewEntry) {
      console.log("jsoninside2")

      this.serviceProxy
        .createOneBaseIndustrialWWTreatmentDischargeControllerIndustrialWWTreatmentDischarge(this.industrialWWDis)
        .subscribe((res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          setTimeout(() => {
            this.loadEF({});
            this.displayFuel = false;
          }, 500);
        },
          (error: any) => {
            console.log(error)
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
            console.log('Error', error);
          },
          () => {
            
          }
        );


    } else {
      console.log("hhhhh")
      this.serviceProxy.updateOneBaseIndustrialWWTreatmentDischargeControllerIndustrialWWTreatmentDischarge(this.industrialWWDis.id, this.industrialWWDis)
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'fuel has updated successfully',
              closable: true,
            });
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
            console.log('Error', error);
          },
          () => {
            this.loadEF({});
            this.displayFuel = false;
          }
        );
    }
  } else {
    console.log("notValidate")

    this.messageService.add({
      severity: 'warn',
      summary: 'Required',
      detail: 'Fill All Mandatory fields',
      closable: true,
    });
  }
}

onBackClick(){
  this.displayFuel = false;
}


}
