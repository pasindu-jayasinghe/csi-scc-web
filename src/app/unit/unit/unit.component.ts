import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import {environment} from '../../../environments/environment'
import { Country, Industry, Level, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';
import { AppService, RecordStatus, SavedData } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  private readonly baseUrl: string = "";
  constructor(
    private serviceProxy: ServiceProxy,
    private http: HttpClient,
    protected messageService: MessageService,
    public appService: AppService
  ) {
    this.baseUrl = environment.baseUrlAPI
  }


  @ViewChild('table') table: Table;

  newEntry: boolean = false;
  clonedUnits: { [s: string]: Unit; } = {};
  industries: Industry[] = [];


  // Excell Uploading
  addMultipleDialog: boolean=false;
  uploadedExcellFile: any;
  public isCreatignMultipleUnits: boolean= false;


  units: Unit[] | any [];
  unit: Unit = new Unit();
  countries: Country[];
  levels:Level[]



  statuses: any[];

  async ngOnInit() {
    await this.getUnits();
    await this.getIndustries();
    await this.getCountries();
    await this.getLevels();
  }


  onRowEditInit(unit: any) {
    this.clonedUnits[unit.id] = {...unit};
    console.log("inside.....",unit)
  }

  new(event: any) {
    console.log("pushing.....")

    if (event.isTrusted) {
      this.newEntry = true;
    }

    this.units = [{
      createdBy: '-',
      createdOn:moment().toDate(),
      editedBy: '-',
      editedOn:moment().toDate(),
      status: undefined,
      name: ""


    }, ...this.units]
    this.table.initRowEdit(this.units[0])


  }

  onRowEditSave(unit: any) {
    console.log("saveuniit--",unit)
    unit.levelDetailsId = 2;
 
    if(this.newEntry){
      this.newEntry= false;

    this.serviceProxy.createOneBaseUnitControllerUnit(unit)
    .subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has saved successfully',
          closable: true,
        });
        setTimeout(() => {
       // this.onBackClick();
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
      }
    );

    }
    else{
      console.log("update")

      this.serviceProxy.updateOneBaseUnitControllerUnit(unit.id, unit)
      .subscribe(
        (res) => {
          localStorage.removeItem(SavedData.units)
          localStorage.removeItem(SavedData.parentUnits)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has update successfully',
            closable: true,
          });
          setTimeout(() => {
         // this.onBackClick();
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
        }
      )
    }


  }

  onRowEditCancel(unit: any, index: number) {
    console.log("cancel-----")
    if (this.newEntry) {
      this.units.shift()
      this.newEntry = false;


    }


  }

  addMultiple(){
    this.addMultipleDialog = true;
  }

  onUpload(e: any){
    this.isCreatignMultipleUnits=true;
    const formData = new FormData();
    formData.append('file', this.uploadedExcellFile);
    this.http.post(this.baseUrl +'/unit/add-from-excell/', formData).subscribe(res=>{
      this.isCreatignMultipleUnits=false;
      this.addMultipleDialog=false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Created saved successfully',
        closable: true,
      });
    },error=> {
      this.isCreatignMultipleUnits=false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
    })
  }

  onAddFile(event: {index: number, file: File}){
    this.uploadedExcellFile = event.file;
  }

  onRemoveFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedExcellFile = null;
  }

  async getIndustries(){
    const res = await this.serviceProxy.getManyBaseIndustryControllerIndustry(
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

  async getUnits(){ // units from local storage
    let filter = [ "status||$ne||"+RecordStatus.Deleted]
    if(this.appService.isOnlyOperationalAdmin()){
      let ids = this.appService.getAllowedUnitIds()
      if(ids.length > 0){
        filter.push("id||$in||"+ids.join(","))
      }
    }    
    const res = await this.serviceProxy.getManyBaseUnitControllerUnit(
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      undefined,
      3000,
      0,
      0,
      0
    ).toPromise();
    this.units = res.data;
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
    ).toPromise();
    this.countries = res.data;
  }

  async getLevels(){
    const res = await this.serviceProxy.getManyBaseLevelControllerLevel(
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
    this.levels = res.data;
  }

}
