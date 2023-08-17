import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { CommonEmissionFactorControllerServiceProxy, MunicipalWaterTariff, ServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { Industry, ServiceProxy as CommonServiceProxy } from 'shared/service-proxies/service-proxies';
import { efType } from '../enum/ef-types.enum';
import { ExcellUploadEfComponent } from '../excell-upload-ef/excell-upload-ef.component';

@Component({
  selector: 'app-municipal-water-tariff',
  templateUrl: './municipal-water-tariff.component.html',
  styleUrls: ['./municipal-water-tariff.component.css']
})
export class MunicipalWaterTariffComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  id: any;
  isNewEntry: boolean;
  isView: boolean;
  editEntryId: number;
  rows: any;
  totalRecords: any;
  loading: any;
  display: boolean;
  efCodes: any;
  category: any;

  isMsc_2: boolean = false;
  isMsc_3: boolean = false;
  isMsc_4: boolean = false;
  isMsc_5: boolean = false;
  isMsc_6: boolean = false;
  isMsc_7: boolean = false;
  isMsc_8: boolean = false;
  isMsc_9: boolean = false;
  isMsc_10: boolean = false;
  isMsc_11: boolean = false;
  isMsc_12: boolean = false;
  isMsc_13: boolean = false;
  isMsc_14: boolean = false;
  isMsc_15: boolean = false;
  isMsc_16: boolean = false;
  isMsc_17: boolean = false;
  isMsc_18: boolean = false;
  isMsc_19: boolean = false;
  isMsc_20: boolean = false;


  municipalWaterTariffFac: MunicipalWaterTariff = new MunicipalWaterTariff();
  municipalWaterTariffFacData: MunicipalWaterTariff[];

  years: number[] = []
  industries: Industry[] = [];
  categories:{id: number, name: string, code: string}[] = []

  constructor(
    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private commonServiceProxy: CommonServiceProxy,
    protected dialogService: DialogService,
    public appService: AppService
  ) { }

  async ngOnInit() {
    this.years = [];
    for (let i = 2018; i < 2030; i++) {
      this.years.push(i);
    }

    await this.getIndustries();

    if (this.id == -1) {
      this.municipalWaterTariffFac = new MunicipalWaterTariff()
    }

    if (this.id > 0) {
      this.editEntryId = this.id
      if (this.editEntryId && this.editEntryId > 0) {

        this.isNewEntry = false;
        this.serviceProxy.getOneBaseMunicipalWaterTariffControllerMunicipalWaterTariff(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.municipalWaterTariffFac = res;
        });
      }

    }
    this.categories = this.masterDataService.municipal_water_categories;
    //this.efCodes = this.masterDataService.industries;



  }

  async getIndustries() {
    const res = await this.commonServiceProxy.getManyBaseIndustryControllerIndustry(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();
    this.industries = res.data;
  }



  newEF() {
    this.isNewEntry = true
    this.isView = false
    this.display = true;
    this.id = -1;
    this.ngOnInit()

  }

  viewEF(id: number) {
    this.display = true;
    this.isView = true
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }

  editEF(id: number) {
    this.isNewEntry = false;
    this.display = true;
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
      .getManyBaseMunicipalWaterTariffControllerMunicipalWaterTariff(
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
        this.municipalWaterTariffFacData = res.data;
        this.totalRecords = res.total;
        this.loading = false;
      
        console.log('total..', this.totalRecords)
      })

}


async saveMunicipalWaterTariffFac(municipalWaterTariffFacForm:NgForm){

  if (municipalWaterTariffFacForm.valid) {



    if (this.isNewEntry) {

      this.serviceProxy
        .createOneBaseMunicipalWaterTariffControllerMunicipalWaterTariff(this.municipalWaterTariffFac)
        .subscribe((res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          this.display = false;
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

      this.serviceProxy.updateOneBaseMunicipalWaterTariffControllerMunicipalWaterTariff(this.municipalWaterTariffFac.id, this.municipalWaterTariffFac)
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'fuel has updated successfully',
              closable: true,
            });
            this.loadEF({})
            this.display = false;
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
  this.display = false;
}

onDeleteClick(id: number) {
  // this.delete(id);
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this Municipal Water Tariff?',
    header: 'Delete Confirmation',
    acceptIcon: 'icon-not-visible',
    rejectIcon: 'icon-not-visible',
    accept: () => {
      this.delete(id);
    },
    reject: () => { },
  });
}

delete(id: number) {
  this.serviceProxy.deleteOneBaseMunicipalWaterTariffControllerMunicipalWaterTariff(id)
    .subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'has deleted successfully',
        closable: true,
      });
    },error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred, please try again',
        closable: true,
      });
    },()=>this.onSearch())
}

onSearch() {
  let event: any = {};
  event.rows = this.rows;
  event.first = 0;

  this.loadEF(event);
}

onClickMSC_1() {
this.isMsc_2 = true;
}

onClickMSC_2() {
  this.isMsc_3 = true;
}
onClickMSC_3() {
  this.isMsc_4 = true;
}
onClickMSC_4() {
  this.isMsc_5 = true;
}
onClickMSC_5() {
  this.isMsc_6 = true;
}
onClickMSC_6() {
  this.isMsc_7 = true;
}
onClickMSC_7() {
  this.isMsc_8 = true;
}
onClickMSC_8() {
  this.isMsc_9 = true;
}
onClickMSC_9() {
  this.isMsc_10 = true;
}
onClickMSC_10() {
  this.isMsc_11 = true;
}
onClickMSC_11() {
  this.isMsc_12 = true;
}
onClickMSC_12() {
  this.isMsc_13 = true;
}

onClickMSC_13() {
  this.isMsc_14 = true;
}
onClickMSC_14() {
  this.isMsc_15 = true;
}
onClickMSC_15() {
  this.isMsc_16 = true;
}
onClickMSC_16() {
  this.isMsc_17 = true;
}
onClickMSC_17() {
  this.isMsc_18 = true;
}
onClickMSC_18() {
  this.isMsc_19 = true;
}
onClickMSC_19() {
  this.isMsc_20 = true;
}




async uploadExcell() {
  let ref = this.dialogService.open(ExcellUploadEfComponent, {
    header: 'Upload Excel',
    width: '50%',
    contentStyle: {"overflow": "auto"},
    baseZIndex: 10000,
    data: {
      efType: efType.MunicipalWaterTariff,
    },
});}
}
