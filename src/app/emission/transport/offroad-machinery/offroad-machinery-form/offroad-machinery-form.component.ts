import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { OffroadMachineryOffroadActivityData, Project, ServiceProxy, User } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-offroad-machinery-form',
  templateUrl: './offroad-machinery-form.component.html',
  styleUrls: ['./offroad-machinery-form.component.css']
})
export class OffroadMachineryFormComponent implements OnInit {

  isView: boolean = false;
  isNewEntry: boolean = true;

  public domesticInternationals: {name: string, id: number}[] = []
  domesticInternational: any ={};

  constructor(
    private masterDataService: MasterDataService,
  ) { }

  ngOnInit(): void {

    this.domesticInternationals = this.masterDataService.domesticInternationals;
  }


}
