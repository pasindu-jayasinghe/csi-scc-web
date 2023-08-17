import { Component, Input, OnInit } from '@angular/core';
import { Country, EmissionSource, ServiceProxy } from 'shared/service-proxies/service-proxies';
import {  NetZeroFactor, ServiceProxy as EsServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { RecordStatus } from 'shared/AppService';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-netzero-ef-single',
  templateUrl: './netzero-ef-single.component.html',
})
export class NetzeroEfSingleComponent implements OnInit {

  @Input() countries: Country[] = [];
  @Input() efCodes: string[] = []
  @Input() emsources:EmissionSource[] = [];
  @Input() new: boolean=false;
  @Input() ef: NetZeroFactor = new NetZeroFactor();

  

  
  years: number[] = []
  constructor(
    private serviceProxy: ServiceProxy,
    private esServiceProxy: EsServiceProxy,
    protected messageService: MessageService
  ) {     
  }

  async ngOnInit(): Promise<void> {
    for (let i = 2015; i < 2030; i++) {
      this.years.push(i);

    }
    await this.getESList()



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


  async save(){

    console.log("kkkk",this.ef)

    if(this.new){

      if(await this.isAlreadyAdded()){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Already in database` });
      }else{
        let res = await this.esServiceProxy.createOneBaseNetZeroFactorControllerNetZeroFactor(this.ef).toPromise();
        if(res){
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Created saved successfully',
            closable: true,
          });
        }
      }
    }else{
      let res = await this.esServiceProxy.updateOneBaseNetZeroFactorControllerNetZeroFactor(this.ef.id,this.ef).toPromise();
      if(res){
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Updated saved successfully',
          closable: true,
        });
      }
    }
  }

  async isAlreadyAdded(){
    let filter = [
      "status||$ne||"+RecordStatus.Deleted, 
      "code||$eq||"+this.ef.code, 
      "year||$eq||"+this.ef.year,
      "countryCode||$eq||"+this.ef.countryCode
    ];

    let res = await this.esServiceProxy.getManyBaseNetZeroFactorControllerNetZeroFactor(
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();

    return res.total > 0;
  }



}
