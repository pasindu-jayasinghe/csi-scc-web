import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Defra, ServiceProxy, Transport } from 'shared/service-proxies/es-service-proxies';

@Component({
  selector: 'app-transport-factor',
  templateUrl: './transport-factor.component.html',
  styleUrls: ['./transport-factor.component.css']
})
export class TransportFactorComponent implements OnInit {
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
  id: any;
  // biologicalTeatmentSolidWasteFacs: BiologicalTreatmentSolidWaste[];
  transFac: Transport = new Transport();
  transFacs:Transport [];
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
  displayFuel: boolean = false;
  isNewEntry: boolean;
  isView: boolean;
  editEntryId: number;

  public_transport_modes: {name: string, id: number, code: string}[] = [];



  ngOnInit(): void {
    this.gasTypes = this.masterDataService.gasTypes;
    this.wasteBasis = this.masterDataService.wasteBasis;
    this.tieres = this.masterDataService.tieres;
    this.biologicalTreatments = this.masterDataService.biologicalTreatments;
    this.wasteCategories = this.masterDataService.wasteCategories;
    this.countries = this.masterDataService.countries;
    this.public_transport_modes = this.masterDataService.public_transport_modes;

    if (this.id == -1) {
      this.transFac = new Transport()
    }

    if (this.id > 0) {
      this.editEntryId = this.id
      if (this.editEntryId && this.editEntryId > 0) {

        this.isNewEntry = false;
        this.serviceProxy.getOneBaseTransportControllerTransport(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.transFac = res;
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
      .getManyBaseTransportControllerTransport(
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
        this.transFacs = res.data;
        this.totalRecords = res.total;
        this.loading = false;
      })

}

async saveWasteFac(wasteFacForm:NgForm){

  if (wasteFacForm.valid) {
    console.log("isvalidate")


    if (this.isNewEntry) {
      console.log("jsoninside2")

      this.serviceProxy
        .createOneBaseTransportControllerTransport(this.transFac)
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
      this.serviceProxy.updateOneBaseTransportControllerTransport(this.transFac.id, this.transFac)
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

onBackClick() {
  this.displayFuel = false
}

}
