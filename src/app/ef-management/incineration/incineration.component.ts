import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Incineration, ServiceProxy } from 'shared/service-proxies/es-service-proxies';

@Component({
  selector: 'app-incineration',
  templateUrl: './incineration.component.html',
  styleUrls: ['./incineration.component.css']
})
export class IncinerationComponent implements OnInit {

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

  incinerationFac: Incineration = new Incineration();
  incinerationFacData: Incineration[];

  years: number[] = []

  constructor(
    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.years = [];
    for (let i = 2018; i < 2030; i++) {
      this.years.push(i);
    }

    if (this.id == -1) {
      this.incinerationFac = new Incineration()
    }

    if (this.id > 0) {
      this.editEntryId = this.id
      if (this.editEntryId && this.editEntryId > 0) {

        this.isNewEntry = false;
        this.serviceProxy.getOneBaseIncinerationControllerIncineration(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.incinerationFac = res;
        });
      }

    }

    this.efCodes = this.masterDataService.disposalWasteTypes.filter(d => d.wasteId === 9);



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
      .getManyBaseIncinerationControllerIncineration(
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
        this.incinerationFacData = res.data;
        this.totalRecords = res.total;
        this.loading = false;
        console.log('total..', this.totalRecords)
      })

}


async saveIncinerationFac(incinerationFacForm:NgForm){

  if (incinerationFacForm.valid) {


    if (this.isNewEntry) {

      this.serviceProxy
        .createOneBaseIncinerationControllerIncineration(this.incinerationFac)
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

      this.serviceProxy.updateOneBaseIncinerationControllerIncineration(this.incinerationFac.id, this.incinerationFac)
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
    message: 'Are you sure you want to delete this Incineration?',
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
  this.serviceProxy.deleteOneBaseIncinerationControllerIncineration(id)
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


}
