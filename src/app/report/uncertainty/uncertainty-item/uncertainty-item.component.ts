import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService } from 'primeng/api';
import { EmissionSource, Report, ServiceProxy, Uncertainty } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-uncertainty-item',
  templateUrl: './uncertainty-item.component.html',
  styleUrls: ['./uncertainty-item.component.css']
})
export class UncertaintyItemComponent implements OnInit, OnChanges {

   @Input() uncertainty: Uncertainty;
   @Input() emissionSources: EmissionSource[];
   @Input() reportData: Report;
    characterCount:number=0;

   ownerships:{id: number, name: string}[] = []

  constructor(private masterDataService: MasterDataService, private serviceProxy :ServiceProxy, protected messageService: MessageService,    ) { }


  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if(propName === 'emissionSources'){
        this.emissionSources = changes[propName].currentValue as EmissionSource[];
      }
    }
  }

  ngOnInit(): void {
    if(!this.uncertainty){
      this.uncertainty = new Uncertainty();
    }
    this.ownerships =this.masterDataService.ownership_freightTransport;
  this.updateCount();
  }

  save(){
    if(this.reportData){
      console.log('this.reportData',this.reportData)
      this.uncertainty.report = this.reportData;
      if(this.uncertainty.ownership && this.uncertainty.descryption && this.uncertainty.emissionSource){
        if(this.uncertainty.id){
          this.serviceProxy.updateOneBaseUncertaintyControllerUncertainty(this.uncertainty.id, this.uncertainty).subscribe(res => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has updated successfully',
              closable: true,
            });
          }, err => {
            console.log(err)
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
          })
        }else{
          this.serviceProxy.createOneBaseUncertaintyControllerUncertainty(this.uncertainty).subscribe(res => {
            this.uncertainty.id = res.id;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
          }, err => {
            console.log(err)
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
          })
        }
      }
    }
  }
  updateCount(caher?:any){
    // console.log(caher)
// console.log(this.uncertainty.descryption?.length)
this.characterCount=this.uncertainty.descryption?.length;

  }
}
