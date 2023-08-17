import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { FreightRailFactors, ServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { efType } from '../enum/ef-types.enum';
import { ExcellUploadEfComponent } from '../excell-upload-ef/excell-upload-ef.component';

@Component({
  selector: 'app-freight-rail-fac',
  templateUrl: './freight-rail-fac.component.html',
  styleUrls: ['./freight-rail-fac.component.css']
})
export class FreightRailFacComponent implements OnInit {
  public roles = Roles
  public userActions = UserActions
  loading: boolean;
  totalRecords: number;
  rows: number;
  freightRailFacs: FreightRailFactors[];
  freightRailFac: FreightRailFactors = new FreightRailFactors()
  isDisplay: boolean;
  isView = false

  activities: {name:string, id:number, code: string}[]
  types: {name:string, id:number, code: string}[]
  years: any = [];
  isNewEntry: boolean;

  constructor(
    private serviceProxy: ServiceProxy,
    private masterDataService: MasterDataService,
    private messageService: MessageService,
    protected dialogService: DialogService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.activities = this.masterDataService.railActivities
    this.types = this.masterDataService.railTypes

    for (let i = 2015; i < 2030; i++) {
      this.years.push(i+'');
    }
  }

  loadEF(event: LazyLoadEvent) {
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
      .getManyBaseFreightRailFactorsControllerFreightRailFactors(
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
        this.freightRailFacs = res.data;
        this.totalRecords = res.total;
        this.loading = false;
        console.log('total..', this.totalRecords)
        console.log(this.freightRailFacs)
      })

  }

  async save(freightRailForm: NgForm) {
    if (freightRailForm.valid) {

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseFreightRailFactorsControllerFreightRailFactors(this.freightRailFac)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            console.log('Freight Rail', res);
            setTimeout(() => {
              this.onBackClick();
            }, 500);
          },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
              this.isDisplay = false;
            }
          );


      } else {
        this.serviceProxy.updateOneBaseFreightRailFactorsControllerFreightRailFactors(this.freightRailFac.id, this.freightRailFac)
          .subscribe(
            (res) => {

              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              console.log('freightRail', res)
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
              this.isDisplay = false;
            }
          );
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      this.isDisplay = false
    }


  }

  new(){
    this.isDisplay = true;
    this.isNewEntry = true;
  }

  async edit(id: number){
    this.isDisplay = true;
    this.freightRailFac = await this.serviceProxy.getOneBaseFreightRailFactorsControllerFreightRailFactors(id, undefined, undefined, 0).toPromise()
    this.isNewEntry = false
  }

  async view(id: number){
    this.isDisplay = true;
    this.freightRailFac = await this.serviceProxy.getOneBaseFreightRailFactorsControllerFreightRailFactors(id, undefined, undefined, 0).toPromise()
  }

  onBackClick() { 
    this.isDisplay = false;
  }


  async uploadExcell() {
    let ref = this.dialogService.open(ExcellUploadEfComponent, {
      header: 'Upload Excel',
      width: '50%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        efType: efType.FreightRail,
      },
  });}


}
