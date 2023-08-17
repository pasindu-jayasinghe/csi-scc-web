import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppService, ProfileStatus, RecordStatus } from 'shared/AppService';
import { AuthControllerServiceProxy, AuthCredentialDto, ServiceProxy } from 'shared/service-proxies/auth-service-proxies';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  public passwordType: string = "password";
  public isSubmitted: boolean=false;
  public userName: string="";
  public password: string="";
  public cpassword: string="";

  constructor(
    protected messageService: MessageService,
    private router: Router,
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private authServiceProxy: ServiceProxy,
    private activatedRoute:ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    const resetKey = localStorage.getItem('reset-key');
    if(resetKey){
      this.userName = resetKey;
      const profileState = await this.getProfileState(this.userName);
      if(profileState !== ProfileStatus.OTPValidated){
        this.goLogin(); 
      }
    }else{
      this.goLogin();
    }
  }

  goLogin(){
    this.router.navigate(['../login'], {relativeTo:this.activatedRoute});
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

  async reset(form: NgForm) {    
    const a = new AuthCredentialDto();
    if(!this.password  || !this.userName){
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All the fields',
        closable: true,
      });
    }else{
      a.password = this.password;
      a.username = this.userName;
      try{
        const res = await this.authControllerServiceProxy.resetPassword(a).toPromise();   
        if(res.status){
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
            closable: true,
          });
          this.router.navigate(['../../auth/login'], {});
        }else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
            closable: true,
          });
        }     
      }catch(err){
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please check email and password',
          closable: true,
        });
      }
    }
  }


  async getProfileState(userName: string): Promise<number>{
    const profiles = await this.authServiceProxy.getManyBaseLoginProfileControllerLoginProfile(
      ['profileState'],
      undefined,
      [ "status||$ne||"+RecordStatus.Deleted, "userName||$eq||"+userName],
      undefined,
      undefined,
      undefined,
      2,
      0,
      0,
      0
    ).toPromise();
    if(profiles.count > 0){
      return profiles.data[0].profileState;
    }else{
      return -1;
    }
  }

}
