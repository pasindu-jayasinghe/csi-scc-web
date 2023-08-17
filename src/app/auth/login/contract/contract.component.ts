import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ServiceProxy, Unit, UnitControllerServiceProxy, UnitStatus } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private serviceProxy: ServiceProxy,
  ) { }

  unit: Unit;
  ngOnInit(): void {
    if(this.config.data.unit){
      this.unit = this.config.data.unit;
    }
  }

  async sign(){
    let res = this.unitControllerServiceProxy.changeStatus(this.unit.id, UnitStatus.SIGNED.toString()).toPromise();    
    this.ref.close(true);
  }
}
