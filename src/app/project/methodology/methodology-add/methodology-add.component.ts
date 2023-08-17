import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Methodology, ProjectType, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-methodology-add',
  templateUrl: './methodology-add.component.html',
  styleUrls: ['./methodology-add.component.css']
})
export class MethodologyAddComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  methodology: Methodology = new Methodology();
  projectTypes: ProjectType[] = []

  @Input() isView: boolean;
  @Input() isNewEntry: boolean;
  @Input() editEntryId: number;
  
  creating: boolean = false;

  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private activatedRoute:ActivatedRoute,
    protected appService: AppService,
  ) { 
    
  }

  ngOnInit(): void {

    //this.setAction();
    this.setInitialState();
    this.getProjectTypes();
    console.log("variables",this.isNewEntry,this.isView,this.editEntryId)
  }

  // setAction(){
  //   this.route.url.subscribe(r => {
  //     if(r[0].path.includes("view")){
  //       this.isView =true;
  //     }
  //   });

  //   const id = this.route.snapshot.queryParamMap.get('id');
  //   if(id){
  //     this.editEntryId = parseInt(id);
  //     this.isNewEntry = false;
  //   }
  // }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseMethodologyControllerMethodology(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.methodology = res;
  
    }else{
      
    }
  }

  async save(methodologyForm: NgForm) {
    this.creating = true;
    console.log("variables",this.isNewEntry,this.isView,this.editEntryId)
    if (methodologyForm.valid) {

      if (this.isNewEntry) {
        this.serviceProxy
          .createOneBaseMethodologyControllerMethodology(this.methodology)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              
              this.onBackClick();

            }, 500);
          },
            (error: any) => {
              console.log(error)
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
              this.creating = false;
            }
          );


      } else {
        this.serviceProxy.updateOneBaseMethodologyControllerMethodology(this.methodology.id, this.methodology)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Methodology has updated successfully',
                closable: true,
              });
            },
            (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
              this.creating = false;
              
            }
          );
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      this.creating = false;
    }

  }   

  getProjectTypes(){
    this.serviceProxy.getManyBaseProjectTypeControllerProjectType(
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
    ).subscribe(res=>{
      this.projectTypes = res.data;
    })
  }
  
  onBackClick() {
    this.router.navigate(['app/project/methodology-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.methodology.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseMethodologyControllerMethodology(id)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      },(error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, ()=> {
        this.router.navigate(['../methodology-list'], {relativeTo:this.activatedRoute});
      })
  }


}
