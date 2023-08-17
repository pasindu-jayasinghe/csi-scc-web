import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-passenger-transport-form',
  templateUrl: './passenger-transport-form.component.html',
  styleUrls: ['./passenger-transport-form.component.css']
})
export class PassengerTransportFormComponent implements OnInit {


  isView: boolean = false;
  isNewEntry: boolean = true;
  type: any

  public domesticInternationals: {name: string, id: number}[] = []
  public passengerModes: {name: string, id: number, code: string}[] = []

  domesticInternational: any ={};
  passengerMode: any ={};

  constructor(
    private masterDataService: MasterDataService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.passengerModes = this.masterDataService.passengerModes

    this.route.queryParams.subscribe((params) => {
      this.type = params['type']
      if (this.type){
        this.passengerMode = this.passengerModes.find(o => o.code === this.type)
      }
    })
  }

  onSelectMode(selected:any){
    this.passengerMode = this.passengerModes
    .find(f=> 
     f.id === selected.value.id);
    console.log("selected",selected)
  }


}
