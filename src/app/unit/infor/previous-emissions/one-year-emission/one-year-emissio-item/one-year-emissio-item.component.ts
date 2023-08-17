import { Component, Input, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService } from 'primeng/api';
import { EmissionSource, PrevEmission, ProjectType, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-one-year-emissio-item',
  templateUrl: './one-year-emissio-item.component.html',
  styleUrls: ['./one-year-emissio-item.component.css']
})
export class OneYearEmissioItemComponent implements OnInit {

  @Input() year: number;
  @Input() esList: EmissionSource[] = [];
  @Input() prevEmission: PrevEmission;
  @Input() public projectType: ProjectType;
  @Input() selectedUnit: Unit;


  ownerships:{id: number, name: string}[] = []

  constructor(private masterDataService: MasterDataService,protected messageService: MessageService,private serviceProxy :ServiceProxy) { }

  ngOnInit(): void {
    if(!this.prevEmission){
      this.prevEmission = new PrevEmission();
    }
    this.ownerships =[...this.masterDataService.ownership_freightTransport, {id: 4, name: "None"}]
  }

  save(){
    this.prevEmission.year = this.year;
    this.prevEmission.unit = this.selectedUnit;
    this.prevEmission.projectType = this.projectType;

    console.log(this.prevEmission);
    if(
      this.prevEmission.ownership && 
      this.prevEmission.e_sc 
      && this.prevEmission.emissionSource 
      && this.prevEmission.year
      && this.prevEmission.unit
      && this.prevEmission.projectType
    )
    {
      if(this.prevEmission.id){
        this.serviceProxy.updateOneBasePrevEmissionControllerPrevEmission(this.prevEmission.id, this.prevEmission).subscribe(res => {
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
        this.serviceProxy.createOneBasePrevEmissionControllerPrevEmission(this.prevEmission).subscribe(res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has created successfully',
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
