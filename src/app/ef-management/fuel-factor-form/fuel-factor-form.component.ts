import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { FuelFactor, ServiceProxy } from 'shared/service-proxies/es-service-proxies';


@Component({
  selector: 'app-fuel-factor-form',
  templateUrl: './fuel-factor-form.component.html',
  styleUrls: ['./fuel-factor-form.component.css']
})
export class FuelFactorFormComponent implements OnInit {


  fuelFactor: FuelFactor = new FuelFactor();
  public roles = Roles
  public userActions = UserActions

  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute:ActivatedRoute,
    public appService: AppService
  ) { }
  ngOnInit(): void {
  }

  display: boolean = false;

    showDialog() {
        this.display = true;
    }






  }