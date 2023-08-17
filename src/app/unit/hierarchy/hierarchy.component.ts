import { Component, OnInit } from '@angular/core';
import { INode } from 'ngx-org-chart/lib/node';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService, RecordStatus, SavedData } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ByUnitIdsDto, ServiceProxy, Unit, UnitControllerServiceProxy, UnitStatus } from 'shared/service-proxies/service-proxies';
import { AddUnitMultipleComponent } from '../add-unit-multiple/add-unit-multiple.component';
import { AddUnitComponent } from '../add-unit/add-unit.component';


@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  seeUnitDetails: boolean =false;
  isChangeAllStatus: boolean = false;
  unitsStatusList: UnitStatus[] = [UnitStatus.Initial,UnitStatus.SIGNED, UnitStatus.APPROVED];
  selectedAllStatus: UnitStatus;

  units: Unit[];
  parentUnits: Unit[] = [];
  header: string = "";
  clickedUnit: Unit | undefined;
  selectUnit: Unit;
  selectUnitId: number;

  isLenghtly: boolean = false;
  isCSIUser: boolean = false;

  constructor(
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    protected messageService: MessageService,
    private serviceProxy: ServiceProxy, 
    public dialogService: DialogService,
    public appService: AppService) { }

  async ngOnInit() {
    this.isCSIUser = this.appService.isCSIUser();
    this.getUnits();
  }

  async getOrgUnits(unitId: number){
    let unitids = await this.unitControllerServiceProxy.getChildUnitIds(unitId).toPromise();
    unitids.push(unitId);
    let req = new ByUnitIdsDto();
    req.unitIds = unitids;
    let u = await this.unitControllerServiceProxy.getUnitsWithParent(req).toPromise();
    this.units = [...this.units, ...u];  
    let units = this.units.filter(u => !u.parentUnit.id);
    this.parentUnits = units;
    if(this.selectUnit){
      let u = this.parentUnits.find(pu=>pu.id===this.selectUnit.id);
      if(u){
        this.selectUnit = u;
      }
    }
    this.rearrage();
  }

  async getUnits(){ 

    if(this.isCSIUser){
      let data = localStorage.getItem(SavedData.units);
      if(data){
        let us = JSON.parse(data) as any[];
        let u: Unit[] = [];
        us.forEach(uu => {
          let nu = new Unit();
          nu.init(uu)
          u.push(nu);
        })
        this.units = u;
      }else{
        let filter = [ "status||$ne||"+RecordStatus.Deleted]
        if(this.appService.isOnlyOperationalAdmin()){
          let ids = this.appService.getAllowedUnitIds()
          if(ids.length > 0){
            filter.push("id||$in||"+ids.join(","))
          }
        }    
        let res = await this.serviceProxy.getManyBaseUnitControllerUnit(
          undefined,
          undefined,
          filter,
          undefined,
          undefined,
          ['country','industry'],
          3000,
          0,
          0,
          0
        ).toPromise()
        this.units = res.data;
        localStorage.setItem(SavedData.units, JSON.stringify(this.units));
      }
      let units = this.units.filter(u => !u.parentUnit.id);
      this.parentUnits = units;  
      if(!localStorage.getItem(SavedData.parentUnits)){
        localStorage.setItem(SavedData.parentUnits, JSON.stringify(this.parentUnits));
      }
      if(this.selectUnitId){
        let u = this.parentUnits.find(pu=>pu.id===this.selectUnitId);
        if(u){
          this.selectUnit = u;
        }
      }
      this.rearrage();
    }else{
      let unit = await this.appService.getLogedUnit();
      if(unit){
        this.units = [unit];
        this.selectUnitId = unit.id;
        this.getOrgUnits(unit.id);
      }
    }
  }

  onChangeUnit(){
    this.selectUnitId = this.selectUnit.id;
    this.rearrage();
  }

  rearrage(){
    if(!this.selectUnit){
      let u = this.parentUnits.find(u => u.id === this.selectUnitId);
      if(u){
        this.selectUnit = u;
      }
    }
    if(this.selectUnit){
      this.insertNode(this.selectUnit);
      let data = this.mapObject([this.selectUnit])
      this.nodes = data;     
    }  
  }

  insertNode(parentUnit: Unit){
    let subUnits = this.units.filter(u => u.parentUnit.id === parentUnit.id);
    if(subUnits.length > 10){
      this.isLenghtly = true;
    }
    parentUnit.childUnits = subUnits;
    parentUnit.childUnits.forEach(pu=>this.insertNode(pu));
  }

  mapObject(units: any[]): any {
    if(!units || units.length < 0) return [];
  
    return units.map((unit: any) => { 
      let cssClass = '';
      switch(unit.unitStatus){
        case UnitStatus.Initial:
          cssClass = 'initial-unit';
          break;
        case UnitStatus.SIGNED:
          cssClass = 'signed-unit';
          break;
        case UnitStatus.APPROVED:
          cssClass = 'approved-unit';
          break;
      }
      return {
        id: unit.id,
        cssClass: cssClass,
        image: '',
        title: unit.name,
        name: '',
        childs: this.mapObject(unit.childUnits)
      }
    });
  }
  



  nodes: any = [];


  chickUnit(event: any) {
    this.clickedUnit = this.units.find(u=>u.id===event.id)
    this.openUnitModel(this.clickedUnit, true);
  }

  openUnitModel(unit: Unit | null | undefined, edit: boolean = false){
    const ref = this.dialogService.open(AddUnitComponent, {
      header: unit && !edit ? 'Add child Unit to '+ unit.name: !edit?'Add root Unit':'Unit details',
      width: '50%',
      data: {
        addingChild: unit && !edit,
        unit: unit,
        edit: edit,
        isCSIUser: this.isCSIUser
      },
    });

    ref.onClose.subscribe( r => { 
      this.getUnits();
    })
  }

  addMultiple(){
    const ref = this.dialogService.open(AddUnitMultipleComponent, {
      header: 'Upload Excel File as in the sample',
      footer:'',

      width: '50%',
      data: {
       
      },
    });

    ref.onClose.subscribe( r => { 
      this.getUnits();
    })
  }

  new(unit: Unit | null | undefined){
    this.openUnitModel(unit);
  }


  changeAllStatus(){
    this.isChangeAllStatus = true;
  }

  async changeAllStatusSave(){
    if(this.selectUnitId && this.selectedAllStatus){
      try{
        let res = this.unitControllerServiceProxy.changeStatusOfAll(this.selectUnitId, this.selectedAllStatus.toString()).toPromise();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has updated successfully',
          closable: true,
        });
        localStorage.removeItem(SavedData.units);
        localStorage.removeItem(SavedData.parentUnits);
        setTimeout(() => {
          this.getUnits();
          this.isChangeAllStatus = false;
        },500)
      }catch(err){
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Failed to chageg status ",
          closable: true,
        });  
      }
    }
  }

}
