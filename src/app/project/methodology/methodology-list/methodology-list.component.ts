import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Methodology, ProjectType, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-methodology-list',
  templateUrl: './methodology-list.component.html',
  styleUrls: ['./methodology-list.component.css']
})
export class MethodologyListComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  id:number;
  loading: boolean;
  rows: number = 10;
  creating: boolean = false;
  totalRecords: number;
  display: boolean = false;
  methodology: Methodology = new Methodology();
  projectTypes: ProjectType[] = []
  methodologyData:Methodology[];

  searchBy: any = {
    text: null,
    usertype: null,
  };

  constructor(
    protected messageService: MessageService,
    private route: ActivatedRoute,
    protected serviceProxy: ServiceProxy, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute:ActivatedRoute, // {relativeTo:this.activatedRoute}
    private confirmationService: ConfirmationService,
    protected appService: AppService
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }


  ngOnInit() {
    this.setAction();
    this.setInitialState();
    this.getProjectTypes();
  }

  setAction(){
    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });
    const id = this.route.snapshot.queryParamMap.get('id');
    if(id){
      this.editEntryId = parseInt(id);
      this.isNewEntry = false;
    }
  }

  async setInitialState(){

    if (this.id == -1) {
      this.methodology = new Methodology();


    }

    if (this.id >0){

      this.editEntryId = this.id
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
  }

  async save(methodologyForm: NgForm) {
    this.creating = true;
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
              this.load({});
              this.display = false;

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
              this.load({});
              this.display = false;
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

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.load(event);
  }

  load(event: LazyLoadEvent) {
    console.log(event);
    this.loading = true;
    this.totalRecords = 0;


    let pageNumber = (event.first === 0 || event.first == undefined) ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    
      this.serviceProxy
        .getManyBaseMethodologyControllerMethodology(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          100,
          0,
          pageNumber,
          0
        ).subscribe((res:any) => {

        this.methodologyData = res.data;
        this.totalRecords = res.total;
        this.loading = false;
        
        console.log('total..', this.totalRecords)
        
      })
    }  
    
    edit(id: number) {
      this.display = true;
      this.isView = false;
      this.isNewEntry = false;
      this.id =id;
      this.ngOnInit()
    }
  
    view(id: number) {
      this.display = true;
      this.isView = true;
      this.isNewEntry = false;
      this.id =id;
      this.ngOnInit()
    }

    new() {
      this.isNewEntry = true;
      this.isView = false;
      this.display = true;
      this.id = -1;
      this.ngOnInit()
     // this.router.navigate(['../methodology-add'], {relativeTo:this.activatedRoute});
    }

    onBackClick() {
      this.display = false;    
    }

    onDeleteClick(id: number) {
      // this.delete(id);
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the record?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: () => {
          this.delete(id);
        },
        reject: () => { },
      });
    }
  
    delete(id: number) {
      this.serviceProxy.deleteOneBaseMethodologyControllerMethodology(id)
        .subscribe(res => {
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
        },()=>this.onSearch())
    }
  

  

}
