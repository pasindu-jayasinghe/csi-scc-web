import { Component, Input, OnInit } from '@angular/core';
import { Country, ServiceProxy } from 'shared/service-proxies/service-proxies';
import { CommonEmissionFactor, CommonEmissionFactorControllerServiceProxy, ServiceProxy as EsServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { RecordStatus } from 'shared/AppService';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-common-ef-single',
  templateUrl: './common-ef-single.component.html',
  styleUrls: ['./common-ef-single.component.css']
})
export class CommonEfSingleComponent implements OnInit {

  @Input() countries: Country[] = [];
  @Input() efCodes: string[] = []
  @Input() new: boolean=false;
  @Input() ef: CommonEmissionFactor = new CommonEmissionFactor();

  
  years: number[] = []
  constructor(
    private serviceProxy: ServiceProxy,
    private esServiceProxy: EsServiceProxy,
    protected messageService: MessageService
  ) {     
  }

  ngOnInit(): void {
    for (let i = 2015; i < 2030; i++) {
      this.years.push(i);
    }
  }

  async save(){
    if(this.new){
      if(await this.isAlreadyAdded()){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Already in database` });
      }else{
        let res = await this.esServiceProxy.createOneBaseCommonEmissionFactorControllerCommonEmissionFactor(this.ef).toPromise();
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
      let res = await this.esServiceProxy.updateOneBaseCommonEmissionFactorControllerCommonEmissionFactor(this.ef.id,this.ef).toPromise();
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

    let res = await this.esServiceProxy.getManyBaseCommonEmissionFactorControllerCommonEmissionFactor(
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
