import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { PurchasedGoodsAndServicesActivityData } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-supplier-specific-method',
  templateUrl: './supplier-specific-method.component.html',
  styleUrls: ['./supplier-specific-method.component.css']
})
export class SupplierSpecificMethodComponent implements OnInit {

  @Input() isView: boolean;
  @Input() public entity: PurchasedGoodsAndServicesActivityData;
  @Input() index: number;
  @Output() valueChange = new EventEmitter<EmitDto>();

  public units: any

  type: string
  amount: number
  amountUnit: string
  ef: number
  efUnit: string

  constructor(
    private masterDataService: MasterDataService
  ) { }

  ngOnInit(): void {
    this.units = this.masterDataService.supplier_units
  }

  onValueChange(){
    console.log("on value change")
    this.valueChange.emit({entity: this.entity, index: this.index})
  }

}

export class EmitDto{
  entity: PurchasedGoodsAndServicesActivityData
  index: number
}
