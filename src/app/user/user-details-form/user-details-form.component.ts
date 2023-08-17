import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ServiceProxy, Unit, User, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';


@Component({
  selector: 'app-user-details-form',
  templateUrl: './user-details-form.component.html',
  styleUrls: ['./user-details-form.component.css']
})
export class UserDetailsFormComponent implements OnInit {
  public roles = Roles
public userActions = UserActions
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  creating: boolean = false;
  isSubmitted: boolean = false;

  public user: User = new User();
 
  @Input() isCSIUser: boolean =false;



  units: Unit[] = [];
  @ViewChild('fData', { static: true }) form: NgForm;
  
  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute:ActivatedRoute, // {relativeTo:this.activatedRoute},
    public appService: AppService
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });
    this.getUnits();
  }

  initUser(user: User){
    this.user = user;
    this.serviceProxy.getOneBaseUsersControllerUser(this.user.id, ["unit"], undefined, undefined)
    .subscribe(res => {
      const u = this.units.find(u => u.id === res.unit.id);
      if(u){
        this.user.unit = u;
      }
    })
  }

  getUnits(){ // unit list from local storage
    let filter = [ "status||$ne||"+RecordStatus.Deleted]
    if(this.appService.isOnlyOperationalAdmin()){
      let ids = this.appService.getAllowedUnitIds()
      if(ids.length > 0){
        filter.push("id||$in||"+ids.join(","))
      }
    }    
    this.serviceProxy.getManyBaseUnitControllerUnit(
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
    ).subscribe((res: any) => {
      this.units = res.data;    
    });
  }

  isValid(): boolean{
    this.isSubmitted = true;
    return this.form.form.valid && this.user.unit !== undefined
  }

  async save(loginProfileId: string, email: string): Promise<boolean>{
    this.user.email = email;
    this.user.loginProfile = loginProfileId;
    if(this.isNewEntry){
      try{
        const res = await this.serviceProxy.createOneBaseUsersControllerUser(this.user).toPromise();
        this.editEntryId = res.id;
        this.isNewEntry = false;
        this.user = res;
        return res !== undefined
      }catch(err){
        return false
      }
    }else{
      try{
        const res = await this.serviceProxy.updateOneBaseUsersControllerUser(this.editEntryId, this.user).toPromise();
        return res !== undefined        
      }catch(err){
        return false;
      }
    }
  }

  async remove(){
    this.user.status = RecordStatus.Deleted;
    await this.serviceProxy.updateOneBaseUsersControllerUser(this.user.id, this.user).toPromise();
  }


  onUpdateUnit(unit:Unit){
    this.user.unit = unit;
  }

}
