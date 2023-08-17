import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { AuthControllerServiceProxy, AuthCredentialDto, Roles } from 'shared/service-proxies/auth-service-proxies';
import { ServiceProxy, Unit, UnitStatus, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { ContractComponent } from './contract/contract.component';
import { InforComponent } from './infor/infor.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public passwordType: string = "password";
  public isSubmitted: boolean=false;
  public userName: string="";
  public password: string="";

  ref: DynamicDialogRef;
  constructor(
    protected messageService: MessageService,
    private router: Router,
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private appService: AppService,
    private activatedRoute:ActivatedRoute,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    public dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  togglePassword(){
    if (this.passwordType=="text"){
      this.passwordType="password"
    }else {
      this.passwordType="text";
    }
  }

  showPasswordResetForm() {
    this.router.navigate(['../forgot'], {relativeTo:this.activatedRoute});
  }

  async login(form: NgForm) {
    const a = new AuthCredentialDto();
    if(!this.password  || !this.userName){
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All the fields',
        closable: true,
      });
    }else{
      a.password = this.password.trim();
      a.username = this.userName.trim();
      try{
        const res = await this.authControllerServiceProxy.login(a).toPromise();
        this.appService.steToken(res.accessToken);
        this.appService.steRefreshToken(res.refreshToken);
        this.appService.steRoles(res.roles);
        this.appService.steProfileId(res.loginProfileId);
        this.appService.steUserName(this.userName);       
        this.appService.steCreatableRoles(res.creatableRoles)
        this.appService.steUserAction(res.userActions);


        if(this.appService.isOnlyForcalPoint()){
          this.laodAllowedFPprojects(this.userName)
        }

        if(this.appService.isOnlyOperationalAdmin()){
          this.laodAllowedUnits(this.userName)
        }
        
        this.appService.startRefreshTokenTimer();
        this.appService.startIdleTimer();
     
        let unit = await this.usersControllerServiceProxy.getUnitByEmail(this.userName).toPromise();
        if(unit){
          this.appService.steUnitId(unit.id);
          this.appService.steUnitState(unit.unitStatus? unit.unitStatus.toString():"")
          this.validateUnitStatus(unit);
        }else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email, password incorrect or account is locked',
            closable: true,
          });               
          this.appService.logout();   
        }
      }catch(err){
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Email, password incorrect or account is locked',
          closable: true,
        });
      }
    }
  }

  validateUnitStatus(unit: Unit){
    if(unit.unitStatus === UnitStatus.Initial){
      this.showContract(unit);
    }else if(unit.unitStatus === UnitStatus.SIGNED || unit.unitStatus === UnitStatus.DATA_REQUESTED){
      this.showInfor(unit);
    }else if (unit.unitStatus === UnitStatus.APPROVED){
      if(this.appService.getRoles().includes(Roles.AUDITOR)){
        this.router.navigate(['../../app/verification/project-list'], {});
      }else{
        this.router.navigate(['../../app'], {});
      }
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Unit need to be approved to log in',
        detail: 'Your unit is not approved yet',
        closable: true,
      });
    }
  }

  showInfor(unit: Unit){
    this.router.navigate(['../../infor'], {state: {id: unit && unit.id ? unit.id: undefined}});
  }

  showContract(unit: Unit) {
    this.ref = this.dialogService.open(ContractComponent, {
        header: 'Terms and Conditions for Smart Carbon Calculator',
        width: '50%',
        contentStyle: {"overflow": "auto"},
        baseZIndex: 10000,
        data: {
          unit: unit,
        },
    });

    this.ref.onClose.subscribe(async (data: any) => {
      if(data){
        this.showInfor(unit);
      }
    });
  }

  async laodAllowedFPprojects(email: string){
    try{
      let res = await this.usersControllerServiceProxy.getAllowedFPProjects(email).toPromise();
      if(res){
      let ids = res.map((r: { id: any; })=> r.id).filter((rr: any) => rr !== undefined);
      this.appService.steAllowedFtProjectIds(ids);
      }
    }catch(err){
      console.log(err);
    }
  }

  async laodAllowedUnits(email: string){
    try{
      let res = await this.usersControllerServiceProxy.getAllowedUnits(email).toPromise();
      if(res){
      let ids = res.map((r: { id: any; })=> r.id).filter((rr: any) => rr !== undefined);
      this.appService.steAllowedUnitIds(ids);
      }
    }catch(err){
      console.log(err);
    }
  }
}
