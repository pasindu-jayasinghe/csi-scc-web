import { Component, OnInit } from '@angular/core';
import { ReqeustDetailComponent } from '../request-detail/request-detail.component';

@Component({
  selector: 'app-requests-other',
  templateUrl: './requests-other.component.html',
  styleUrls: ['./requests-other.component.css']
})
export class ReqeustsOtherComponent implements OnInit {

  public title = "Upload Evidence"

  constructor() { }

  ngOnInit(): void {
  }

}
