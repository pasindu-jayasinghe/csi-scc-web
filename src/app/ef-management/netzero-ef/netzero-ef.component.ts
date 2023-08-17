import { Component, OnInit } from '@angular/core';
import { ExcellUplodDialogComponent } from 'app/emission/excell-uplod-dialog/excell-uplod-dialog.component';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { NetZeroFactor, ServiceProxy as EsServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { Country, EmissionSource, PuesDataReqDtoSourceName, ServiceProxy } from 'shared/service-proxies/service-proxies';
import { efType } from '../enum/ef-types.enum';
import { ExcellUploadEfComponent } from '../excell-upload-ef/excell-upload-ef.component';
import { netZeroFactors } from './netZeroFactor.enum';

@Component({
  selector: 'app-common-ef',
  templateUrl: './netzero-ef.component.html',
  styleUrls: ['./netzero-ef.component.css']
})
export class NetzeroEfComponent implements OnInit {
  public roles = Roles
  public userActions = UserActions
  loading: boolean;
  rows: number = 10;
  totalRecords: number;

  display: boolean = false;
  editEF: boolean = false;
  ef: NetZeroFactor;

  countries: Country[] = [];
  efCodes: string[] = []

  NetzeroEmissionFactors: NetZeroFactor[] = []
  emsources: EmissionSource[] = [];



  years: number[] = []

  filter = [
    "status||$ne||"+RecordStatus.Deleted, 
    // "code||$eq||"+this.ef.code, 
    // "year||$eq||"+this.ef.year,
    // "countryCode||$eq||"+this.ef.countryCode
  ];

  constructor(
    private serviceProxy: ServiceProxy,
    private esServiceProxy: EsServiceProxy,
    protected dialogService: DialogService,

    public appService: AppService
  ) { }

  async ngOnInit() {
    for (let i = 2015; i < 2030; i++) {
      this.years.push(i);
    }
    await this.getCountries();
    await this.getEFCodes();
    await this.getESList();
  }


  async getEFCodes(){
    // this.NetzeroEmissionFactorServiceProxy.getCommonEFNames().subscribe((res: any)=> {
    //   this.efCodes = res?.data;
    // })
    let efNames = Object.values(netZeroFactors);
    this.efCodes =efNames;
  }

  async getESList(){
    try{
      let res = await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
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
  
      this.emsources = res.data;
    }catch(err){
      this.emsources = [];
    }
  }
  async getCountries(){
    const res = await this.serviceProxy.getManyBaseCountryControllerCountry(
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
    ).subscribe((res: any) => {
      this.countries = res.data

    })
  }

  new(){
    this.display = true;
  }

  async getCommonEfList(){
    
    try{
      let res = await this.esServiceProxy.getManyBaseNetZeroFactorControllerNetZeroFactor(
        undefined,
        undefined,
        this.filter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).toPromise();
  
      return res.data;
    }catch(err){
      console.log(err);
      return [];
    }
  }

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber = (event.first === 0 || event.first == undefined) ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;


    this.esServiceProxy
        .getManyBaseNetZeroFactorControllerNetZeroFactor(
          undefined,
          undefined,
          this.filter,
          undefined,
          undefined,
          undefined,
          this.rows,
          0,
          pageNumber,
          0
        ).subscribe((res:any) => {
        this.NetzeroEmissionFactors = res.data;
        this.totalRecords = res.total;
        this.loading = false;
      }) 
  }

  edit(data: NetZeroFactor){
    this.ef = data;
    this.editEF = true;
  }

  onDeleteClick(data: NetZeroFactor){

  }

  changeCountry(country: Country){
    if(country && country.code){
      this.filter = this.filter.filter(f => !f.includes("countryCode"))
      this.filter.push( "countryCode||$eq||"+country.code)
    }
    this.load({});
  }

  changeYear(year: number){
    if(year){
      this.filter = this.filter.filter(f => !f.includes("year"))
      this.filter.push( "year||$eq||"+year)
    }
    this.load({}); 
  }

  changeName(name: any){
    console.log(name.value)
    if(name && name.value){
      this.filter = this.filter.filter(f => !f.includes("name"))
      this.filter.push( "name||$starts||"+name.value)
    }else{
      this.filter = this.filter.filter(f => !f.includes("name"))
    }
    this.load({}); 
  }

  reset(){
    this.filter = ["status||$ne||"+RecordStatus.Deleted]
    this.load({}); 
  }

  async uploadExcell() {
    let ref = this.dialogService.open(ExcellUploadEfComponent, {
      header: 'Upload Excel',
      width: '50%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        efType: efType.Common,
      },
  });}

}
