import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Unit, Project, Report, ServiceProxy, ProjectType, UnitControllerServiceProxy, EmissionSource } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-previous-emissions',
  templateUrl: './previous-emissions.component.html',
  styleUrls: ['./previous-emissions.component.css']
})
export class PreviousEmissionsComponent implements OnInit {

  selectedUnit: Unit;

  public projectType: ProjectType;
  public baseYear: number;
  public baseYearFromCSI: boolean = false;
  public dataGadaringYears: number[] = [];

  projectTypes: ProjectType[] = []

  esList: EmissionSource[] = [];
  public roles = Roles
public userActions = UserActions
  
  constructor(
    private serviceProxy: ServiceProxy,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    public appService: AppService
  ) { }

  async ngOnInit() {
    if(this.config.data){
      if(this.config.data.unit){
        this.selectedUnit = this.config.data.unit;
      }
    }
    await this.getEmissionSources();
    await this.getProjectTypes();
    await this.getUnitTedatils();
  }

  async getConsecutiveYears(){
    if(this.projectType && this.selectedUnit){
      let years = await this.unitControllerServiceProxy.getConsecutiveYears(this.selectedUnit.id, this.projectType.id).toPromise();
      this.baseYearFromCSI =  years.years.find(y => y.year===this.baseYear && y.withCSI) ? true: false;
      this.dataGadaringYears =  years.years.filter(y => !y.withCSI && y.year !== this.baseYear).map(c =>c.year).sort().reverse().slice(0,5).reverse();
    }
  }

  async getUnitTedatils(){
    if(this.selectedUnit && this.selectedUnit.id){
      let filters = [ "status||$ne||"+RecordStatus.Deleted,  "unit.id||$eq||"+this.selectedUnit.id];
      let res = await this.serviceProxy.getManyBaseUnitDetailsControllerUnitDetails(
        ['baseYear'],
        undefined,
        filters,      
        undefined,
        undefined,
        ['unit'],
        1,
        0,
        0,
        0
      ).toPromise();
      if(res.total === 1){
        this.baseYear = res.data[0].baseYear;
      } 
    }
  }

  async getProjectTypes(){

    try{
      let res = await this.serviceProxy.getManyBaseProjectTypeControllerProjectType(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).toPromise();
      this.projectTypes = res.data;
    }catch(err){
      this.projectTypes = []
    }
  }

  projectTypeChange(){
    this.getConsecutiveYears();
  }


  async getEmissionSources(){
    try{
      let filters = [ "status||$ne||"+RecordStatus.Deleted];
      let res = await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
        undefined, 
        undefined, 
        filters, 
        undefined, 
        undefined, 
        undefined, 
        1000, 
        0, 
        1, 
        0
      ).toPromise();
      this.esList = res.data;
    }catch(err){
      this.esList = []
    }
  }
}
