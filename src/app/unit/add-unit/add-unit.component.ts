import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService, RecordStatus, SavedData } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Country, Industry, ServiceProxy, Unit, UnitStatus } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.css']
})
export class AddUnitComponent implements OnInit {

  countries: Country[] = [];
  industries: Industry[] = [];
  units: Unit[] = [];
  unitsStatusList: UnitStatus[] = [UnitStatus.Initial,UnitStatus.SIGNED, UnitStatus.APPROVED];
  isCSIUser: boolean = false;
  addingChild: boolean = false;

  public roles = Roles
public userActions = UserActions

  @Input() unit: Unit = new Unit()
  @Input() editing: boolean = false;

  displayInfor: boolean =false

  parentUnit: Unit;

  constructor( 
    public dialogService: DialogService,
    private serviceProxy: ServiceProxy, 
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    public appService: AppService
  ) { }

  async ngOnInit() {

    await this.getUnits();
    await this.getIndustries();
    await this.getCountries();

    // console.log(this.config.data);

    if(this.config.data){
      this.isCSIUser=this.config.data?.isCSIUser;

      if(this.config.data.addingChild){
        this.addingChild = this.config.data.addingChild;
      }

      if(this.config.data.edit || this.isCSIUser){
        this.editing = true;
      }else{
        this.unit.unitStatus = UnitStatus.Initial;
      }
      if(this.config.data.unit && !this.config.data.edit){
        this.parentUnit =this.config.data.unit;
        this.unit.parentUnit = this.parentUnit;
        let u = this.units.find(u => u.id === this.parentUnit.id)
        if(u){
          this.parentUnit = u;
          this.unit.parentUnit = u;
        }
      }else if(this.config.data.edit){
        this.unit =  await this.getunit(this.config.data.unit.id) 
      }

      if(!this.isCSIUser){
        this.editing=false;
      }
    }
  }

  async save(){
    if(!this.unit.unitStatus || !this.unit.industry || !this.unit.country){
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Fields',
        detail: "Please fill all fields ",
        closable: true,
      });   
    }else{
      try{
        if(!this.unit.id){
          this.unit.levelDetailsId = 2;
          let res = await this.serviceProxy.createOneBaseUnitControllerUnit(this.unit).toPromise();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          localStorage.removeItem(SavedData.units)
          localStorage.removeItem(SavedData.parentUnits)
          this.ref.close();
        }else{
          let res = await this.serviceProxy.updateOneBaseUnitControllerUnit(this.unit.id, this.unit).toPromise();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has updated successfully',
            closable: true,
          });
          localStorage.removeItem(SavedData.units)
          localStorage.removeItem(SavedData.parentUnits)
          this.ref.close();
        }
      }catch(err){
        console.log(err);   
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Failed to save " + this.unit.name,
          closable: true,
        });   
        this.ref.close();
      }
    }


  }

  deleteUnit(){
    this.confirmationService.confirm({
      message: 'All the child untis also will be deleted',
      header: 'Are you sure you want to delete this unit?',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: async () => {
        await this.deleteSingleUnit(this.unit);
        localStorage.removeItem(SavedData.units)
        localStorage.removeItem(SavedData.parentUnits)
        this.ref.close();        
      },
      reject: () => { },
    });
  }

  unitIdList: number[] = [];
  async deleteAllChildUnits(unit: Unit){  
    unit.childUnits.map(cu => {
      this.unitIdList.push(cu.id);

      // TODO: impl delete All ChildUnits
    })
  }

  async deleteSingleUnit(unit: Unit){
    try{
      unit.status = RecordStatus.Deleted;
      await this.serviceProxy.updateOneBaseUnitControllerUnit(unit.id, unit).toPromise();
      localStorage.removeItem(SavedData.units)
      localStorage.removeItem(SavedData.parentUnits)
    }catch(err){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Failed to delete " + unit.name,
        closable: true,
      });
    }
  }

  async getUnits(){ // TODO: unit list from local storage

    let filter = [ "status||$ne||"+RecordStatus.Deleted]
    if(this.appService.isOnlyOperationalAdmin()){
      let ids = this.appService.getAllowedUnitIds()
      if(ids.length > 0){
        filter.push("id||$in||"+ids.join(","))
      }
    }    
    const res = await this.serviceProxy.getManyBaseUnitControllerUnit(
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      undefined,
      3000,
      0,
      0,
      0
    ).toPromise();
    this.units = res.data;
  }

  async getIndustries(){
    const res = await this.serviceProxy.getManyBaseIndustryControllerIndustry(
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
    this.industries = res.data;
  }

  async getCountries(){
    const res = await this.serviceProxy.getManyBaseCountryControllerCountry(
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
    this.countries = res.data;
  }

  async getunit(id: number){
    const res = await this.serviceProxy.getOneBaseUnitControllerUnit(id, undefined,undefined,undefined).toPromise()
    return res;
  }

  openUnitModel(){
    const ref1 = this.dialogService.open(AddUnitComponent, {
      header: 'Add child Unit to ' + this.unit.name,
      width: '50%',
      data: {
        addingChild: true,
        unit: this.unit,
        edit: false,
        isCSIUser: this.isCSIUser
      },
    });

    ref1.onClose.subscribe(async r => {    
      await this.getUnits();
      this.ref.close();
      // let a = this.units.find(u => this.selectUnit && u.id == this.selectUnit.id);
      // if(a){
      //   this.selectUnit = a;
      //   this.onChangeUnit();
      // }
    })
  }

  infor(){
    this.router.navigate(['app/unit/infor'], {state: {id: this.unit.id}});
    this.ref.close();
  }

}
