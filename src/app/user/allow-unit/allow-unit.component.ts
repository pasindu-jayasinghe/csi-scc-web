import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { LoginProfile, Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Unit, UnitControllerServiceProxy, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-allow-unit',
  templateUrl: './allow-unit.component.html',
  styleUrls: ['./allow-unit.component.css']
})
export class AllowUnitComponent implements OnInit {

  // .map(u => {
  //   return {
  //     id: u.id,
  //     name: u.name
  //   }
  // });

  public roles = Roles
public userActions = UserActions

  selectedUnit: Unit;
  units: {id: number, name: string}[] = [];
  selectedUnits: number[] = [];
  loginProfile: LoginProfile;


  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private userControllerServiceProxy: UsersControllerServiceProxy,
    protected messageService: MessageService,
    public appService: AppService
  ) { }

  async ngOnInit() {
    this.loginProfile = this.config.data.loginProfile;
    await this.laodAllowed();
  }

  async laodAllowed(){
    try{
      console.log(this.loginProfile.userName)
      let res = await this.userControllerServiceProxy.getAllowedUnits(this.loginProfile.userName).toPromise();
      // this.units = [...this.units, ...res]
      // this.units = [...new Set(this.units)]
      console.log(this.units)
      this.selectedUnits = [...this.selectedUnits, ...res.map((u: { id: any; }) => u.id)]
      console.log(this.selectedUnits)
    }catch(err){
      console.log(err);
    }
  }

  clear(){
    this.units = [];
    this.selectedUnits = [];
  }

  async onUpdateUnit(unit: Unit){
    this.selectedUnit = unit;
    let d = await this.unitControllerServiceProxy.getChildUnits(unit.id).toPromise();
    this.units = [...this.units, ...d]
    this.units.push(unit);
  }

  selectAll(){
    this.selectedUnits = this.units.map(u => u.id);
  }

  async save(){
    try{
      let data: string[] = [];
      if(this.selectedUnits.length > 0){
        data = this.selectedUnits.map(a => a.toString());
      }
      let res = await this.userControllerServiceProxy.addAllowedUnits(this.loginProfile.userName, data).toPromise()
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'has updated successfully',
        closable: true,
      });
    }catch(err){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred, please try again',
        closable: true,
      });
    }
  }

}
