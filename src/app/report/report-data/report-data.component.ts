import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { User, Unit, Project, ServiceProxy, Report, Recomendation, NextStep } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-report-data',
  templateUrl: './report-data.component.html',
  styleUrls: ['./report-data.component.css']
})
export class ReportDataComponent implements OnInit {

  logedUser: User;
  isCSIUser: boolean =false;
  isAnyAdmin: boolean = false;
  isAuditor: boolean = false;
  selectedUnit: Unit;
  selectedProject: Project;

  public roles = Roles
  public userActions = UserActions

  constructor(
    protected messageService: MessageService,
    public appService: AppService,
    private _fb: FormBuilder, 
    private serviceProxy: ServiceProxy
  ) { }

  async ngOnInit() {
    this.isAnyAdmin = this.appService.isAnyAdmin()
    this.isCSIUser = this.appService.isCSIUser();
    this.isAuditor = this.appService.isAuditor();
    let u = await this.appService.getUser();
    if(u){
      this.logedUser = u;
    }

    if(!this.isAnyAdmin){
      let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
  }

 

}
