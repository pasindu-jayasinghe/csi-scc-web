import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-offroad-machinery-list',
  templateUrl: './offroad-machinery-list.component.html',
  styleUrls: ['./offroad-machinery-list.component.css']
})
export class OffroadMachineryListComponent implements OnInit {

  @Input() index: number
  @Input() accessESList: PuesDataReqDtoSourceName[] = []
  @Input() isCSIUser: boolean = false;

  public get puesDataReqDtoSourceName(): typeof PuesDataReqDtoSourceName {
    return PuesDataReqDtoSourceName; 
  }

  constructor() { }

  ngOnInit(): void {
  }

}
