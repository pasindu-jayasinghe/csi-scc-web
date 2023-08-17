import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Defra, ServiceProxy, WasteIncineration } from 'shared/service-proxies/es-service-proxies';
import { efType } from '../enum/ef-types.enum';
import { ExcellUploadEfComponent } from '../excell-upload-ef/excell-upload-ef.component';
import { WasteDisposal } from './waste-disposal.enum';

@Component({
  selector: 'app-defra',
  templateUrl: './defra.component.html',
  styleUrls: ['./defra.component.css']
})
export class DefraComponent implements OnInit {

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
  defraFac: Defra = new Defra()
  defraFacs:Defra [];
  router: any;

  years: number[] = []

  constructor(
    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    protected dialogService: DialogService,
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
  efCodes: string[] = []



  ngOnInit(): void {

    this.years = [];
    for (let i = 2018; i < 2030; i++) {
      this.years.push(i);
    }

    let efNames = Object.values(WasteDisposal);
    this.efCodes =efNames;
    console.log(this.efCodes);

    this.gasTypes = this.masterDataService.gasTypes;
    this.wasteBasis = this.masterDataService.wasteBasis;
    this.tieres = this.masterDataService.tieres;
    this.biologicalTreatments = this.masterDataService.biologicalTreatments;
    this.wasteCategories = this.masterDataService.wasteCategories;
    this.countries = this.masterDataService.countries;

    if (this.id == -1) {
      this.defraFac = new Defra()
    }

    if (this.id > 0) {
      this.editEntryId = this.id
      if (this.editEntryId && this.editEntryId > 0) {

        this.isNewEntry = false;
        this.serviceProxy.getOneBaseDefraControllerDefra(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.defraFac = res;
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








async loadEF(event :LazyLoadEvent){

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
      .getManyBaseDefraControllerDefra(
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
        this.defraFacs = res.data;
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
        .createOneBaseDefraControllerDefra(this.defraFac)
        .subscribe((res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          this.displayFuel = false;
          this.loadEF({})
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
      this.serviceProxy.updateOneBaseDefraControllerDefra(this.defraFac.id, this.defraFac)
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'fuel has updated successfully',
              closable: true,
            });
            this.loadEF({})
            this.displayFuel = false;
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

async uploadExcell() {
  let ref = this.dialogService.open(ExcellUploadEfComponent, {
    header: 'Upload Excel',
    width: '50%',
    contentStyle: {"overflow": "auto"},
    baseZIndex: 10000,
    data: {
      efType: efType.Defra,
    },
});}

}
