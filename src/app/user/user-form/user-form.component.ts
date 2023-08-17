import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService, csiRoles, ProfileStatus, RecordStatus } from 'shared/AppService';
import { UsersControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';
import {AuthControllerServiceProxy, AuthCredentialDto, CreatableRoles, LoginProfile, LoginProfileControllerServiceProxy, Role, Roles, ServiceProxy as AuthServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { UserDetailsFormComponent } from '../user-details-form/user-details-form.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AllowUnitComponent } from '../allow-unit/allow-unit.component';
import { take } from 'rxjs/operators';
import { AllowProjectsComponent } from '../allow-projects/allow-projects.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() isSetting: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;  
  editEntryId: number; // user id. not login profile id
  editEntryLpId: string;
  editingUserName: string;
  creating: boolean = false;
  isNotAllEditableRoles: boolean = false;

  password: string = "";
  oldPassword: string = "";
  loginProfile: LoginProfile = new LoginProfile();
  roles: Role[] = [];
  isCSIUser: boolean =false;
  isORGAdmin: boolean = false;
  isOperationalAdmin: boolean = false;
  isCSITrainee: boolean = false;
  isFocalPoint: boolean = false;

  emialtaken: boolean = false;
  
  userStatusList: {value: any, name:string }[] = [];
  csiUserStateList:any[] = [ProfileStatus.BlockedByWrongAttemps, ProfileStatus.OTPFailed, ProfileStatus.OTPValidated]

  @ViewChild(UserDetailsFormComponent) userDetailsFormComponent:UserDetailsFormComponent;
  
  constructor(
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private authServiceProxy: AuthServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private activatedRoute:ActivatedRoute, // {relativeTo:this.activatedRoute}
    private loginProfileControllerServiceProxy: LoginProfileControllerServiceProxy,
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private appService: AppService,
    private masterDataService: MasterDataService,
    public dialogService: DialogService
  ) { }

  async ngOnInit() {
    this.isCSIUser = this.appService.isCSIUser();
    this.isORGAdmin = this.appService.isORGAdmin();
    let creatableRoles = this.appService.getCreatableRoles();
    if(this.isSetting){
      let currentRoles = this.appService.getRoles();
      creatableRoles = [...creatableRoles,...currentRoles as unknown as CreatableRoles[]];
      let unique = [...new Set(creatableRoles)]
      creatableRoles = unique;
    }


    let list = Object.values(ProfileStatus);
    list = list.filter(l => typeof l === 'string') as ProfileStatus[];
    if(!this.isCSIUser){
      list = list.filter(l => !this.csiUserStateList.includes(ProfileStatus[l as ProfileStatus]))
      console.log(list);
    }
    list.forEach(l => {
      this.userStatusList.push({
        value: ProfileStatus[l as ProfileStatus],
        name: l as string
      })
    })

    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });
    await this.getRoles();
    if(!this.isCSIUser){
      this.roles = this.roles.filter(r => !csiRoles.includes(r.code as unknown as Roles))
      if (this.isORGAdmin){
        this.roles = this.roles.filter(r => ![Roles.AUDITOR, Roles.EF_MANAGER].includes(r.code as unknown as Roles))
      }
    }

    this.roles = this.roles.filter(r =>  creatableRoles.includes(r.code as unknown as CreatableRoles))

    await this.setInitialState();
  }

  enableButtons(){
    let codes =this.loginProfile.roles.map(r => r.code);
    this.isFocalPoint = codes.includes(Roles.CLIMATESI_FP.toString());
    this.isCSITrainee = codes.includes(Roles.CLIMATESI_TRAINEES.toString());
    this.isOperationalAdmin = codes.includes(Roles.OPERATIONAL_ADMIN.toString());
  }

  async setInitialState(){


    if(this.isSetting){
      const loginProfileId = this.appService.getProfileId();
      const userName = this.appService.getUserName();
      const roles = this.appService.getRoles();
      if(loginProfileId && userName && roles){
        this.loginProfile.userName = userName; 
        this.editingUserName = userName;
        this.loginProfile.id = loginProfileId;
        this.loginProfile.roles = this.roles.filter(r => roles.includes(r.code as unknown as Roles));            
      }
    }else{
      let params = await this.route.queryParams.pipe(take(1)).toPromise()
      if(params){
        if(params['id']){
          this.isNewEntry = false;
          this.editEntryId = params['id'];
          await this.getUserData();
        }
      }

      // this.route.queryParams.subscribe(async (params) => {
      //   if(params['id']){
      //     this.isNewEntry = false;
      //     this.editEntryId = params['id'];
      //     await this.getUserData();
      //   }
      // });
    }

    this.enableButtons();

  }

  async getRoles(){
    const res = await this.authServiceProxy.getManyBaseRoleControllerRole(
      undefined,
      undefined,
      [ "status||$ne||"+RecordStatus.Deleted],
      undefined,
      undefined,
      undefined,
      100,
      0,
      0,
      0
    ).toPromise();
    this.roles = res.data
  }

  async getUserData(){
    let res = await this.usersControllerServiceProxy.getUserDetailsWithLoginProfile(this.editEntryId).toPromise();
    if(res){
      this.loginProfile.profileState = res.profileState;
      this.loginProfile.userName = res.userName;
      this.editingUserName = res.userName;
      this.loginProfile.id = res.user.loginProfile;
      this.editEntryLpId = res.user.loginProfile;
      this.loginProfile.roles = this.roles.filter(role => res.roles.includes(role.code))
      this.isNotAllEditableRoles = res.roles.some(r => !this.roles.map(rrr => rrr.code).includes(r))
      this.userDetailsFormComponent.initUser(res.user);  
    }
  }

  private isSupperRole(){
    let msterRoles = [Roles.MASTER_ADMIN.toString(),Roles.CSI_ADMIN.toString() ]
    return this.loginProfile.roles.map(r => r.code).some(code => msterRoles.includes(code));
    // return this.loginProfile.role.code === Roles.MASTER_ADMIN || this.loginProfile.role.code === Roles.CSI_ADMIN; 
  }

  private abaleToSave(form: NgForm){
    return (form.valid || (!this.isNewEntry && this.loginProfile.roles.length > 0 && this.loginProfile.userName) ) && 
      this.loginProfile.roles.length > 0 && this.userDetailsFormComponent.isValid() ;
  }

  async save(form: NgForm) {
    this.creating=true;    

    if(this.isSetting){
      if(this.oldPassword === '' || !this.oldPassword){
        this.creating=false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Required',
          detail: 'Fill the old password',
          closable: true,
        });
      }else if (this.loginProfile.password === '' || !this.loginProfile.password){
        this.creating=false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Required',
          detail: 'Fill the password',
          closable: true,
        });
      }else{
        let req = new AuthCredentialDto();
        req.password = this.oldPassword;
        req.username = this.loginProfile.userName;
        try{
          let login = await this.authControllerServiceProxy.checkOldPassword(req).toPromise();
          if(login){
            let isPasswordUpdated = this.loginProfile.password === this.oldPassword;
            if(isPasswordUpdated){
              this.messageService.add({
                severity: 'warn',
                summary: 'Password was NOT change',
                detail: 'You have entered old password',
                closable: true,
              });
            }else{
              this.confirmationService.confirm({
                message: 'Do you want to change the password? If yes, You will be redirected to the login page.',
                header: 'Password Change Confirmation',
                icon: 'pi pi-info-circle',
                accept: () => {
                  this.loginProfileControllerServiceProxy.updateOneLoginProfile(this.loginProfile).subscribe(res => {   
                    this.creating=false;         
                    this.appService.logout()
                  }, err => {
                    this.creating=false;
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: "Failed to reset",
                      closable: true,
                    });
                  })     
                },
                reject: (type: any) => {                  
                }
              });          
            }   
          }          
        }catch(err){
          this.creating=false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Old password is incorrect",
            closable: true,
          });
        }
      }
    }else{
      if(this.abaleToSave(form)){
        if(this.isNewEntry){        
          this.authServiceProxy.createOneBaseLoginProfileControllerLoginProfile(this.loginProfile)
            .subscribe(async (res: LoginProfile) => {
  
              if(!res.id){
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: '',
                  closable: true,
                });
              }else{
                // this.editEntryId = res.id;
                this.isNewEntry = false;
                this.loginProfile = res;
                let userSaved =  await this.userDetailsFormComponent.save(res.id, this.loginProfile.userName);
                // if(!this.isSupperRole()){
                //   userSaved = await this.userDetailsFormComponent.save(res.id, this.loginProfile.userName)
                // }
                if(!userSaved){
                  // deleted login profile
                }
                if(res && userSaved){
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'has saved successfully',
                    closable: true,
                  });
                  this.onBackClick()
                }else{
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: "Failed to save",
                    closable: true,
                  });
                }
              }
            }, err => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', err);
            }, () => {this.creating=false;})
        }else{
          if (this.loginProfile.password === ''){
            //@ts-ignore
            this.loginProfile.password = undefined
          }
          this.loginProfileControllerServiceProxy.updateOneLoginProfile(this.loginProfile)
          .subscribe(async res => {
            let userSaved = await this.userDetailsFormComponent.save(res.id, this.loginProfile.userName);
            // if(!this.isSupperRole()){
            //   userSaved = await this.userDetailsFormComponent.save(res.id, this.loginProfile.userName)
            // }
            if(res && userSaved){
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              this.onBackClick()
            }else{
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Failed to update",
                closable: true,
              });
            }          
          }, err=> {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
            console.log('Error', err);
          })
        }
      }else{
        this.messageService.add({
          severity: 'warn',
          summary: 'Required',
          detail: 'Fill All Mandatory fields',
          closable: true,
        });
      }
    }
  }

  onBackClick() {
    if(this.isSetting){
      this.router.navigate(['../../'], {relativeTo:this.activatedRoute});
    }else{
      this.router.navigate(['../list'], {relativeTo:this.activatedRoute});
    }
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the user?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete();
      },
      reject: () => { },
    });
  }

  async delete() {
    //@ts-ignore
    if (this.loginProfile.id) {
      this.loginProfileControllerServiceProxy.remove(this.loginProfile.id)
        .subscribe(async res => {
          console.log("profile removed")
          await this.userDetailsFormComponent.remove();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has deleted successfully',
            closable: true,
          });
        },error => {        
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred, please try again',
            closable: true,
          });
        }, ()=> {
          this.router.navigate(['../list'], {relativeTo:this.activatedRoute});
        })
    } else {
       await this.userDetailsFormComponent.remove()
       .then(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
        this.onBackClick()
       }).catch(err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
       })
          
    }
  }

  async onChangeStatus(e: {value: number}){
    this.loginProfile.profileState = e.value;
    try{
      let res = await this.loginProfileControllerServiceProxy.updateOneLoginProfile(this.loginProfile).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'status changed successfully',
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

  emailChage(){
    if(this.loginProfile.userName){
      this.authServiceProxy.getManyBaseLoginProfileControllerLoginProfile(
        ["userName"],
        undefined,
        [ "status||$ne||"+RecordStatus.Deleted, "userName||$eq||"+this.loginProfile.userName],
        undefined,
        undefined,
        undefined,
        100,
        0,
        0,
        0
      ).subscribe(res => {
        if(res.total > 0){
          if(this.editEntryLpId !== undefined && this.editingUserName === res.data[0].userName){
            this.emialtaken = false;
          }else{
            this.emialtaken = true;
          }        
        }else{
          this.emialtaken = false;
        }
      })
    }
    
  }


  allowUnits(){
    const ref = this.dialogService.open(AllowUnitComponent, {
      header: 'Allow Unit to User',
      width: '70%',
      data: {
        loginProfile: this.loginProfile
      },
    });

    ref.onClose.subscribe( r => { 
    })
  }

  allowProjects(){
    const ref = this.dialogService.open(AllowProjectsComponent, {
      header: 'Allow Project to forcal point',
      width: '70%',
      data: {
        loginProfile: this.loginProfile
      },
    });

    ref.onClose.subscribe( r => { 
    })
  }
}
