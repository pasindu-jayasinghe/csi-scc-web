import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Mitigation, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataReqDtoSourceName, ServiceProxy, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-mitigation',
  templateUrl: './mitigation.component.html',
  styleUrls: ['./mitigation.component.css']
})
export class MitigationComponent extends EmissionCreateBaseComponent implements OnInit {

  public roles = Roles
public userActions = UserActions
  display: boolean = false;
  loading: boolean;
  rows: number = 10;
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  id: number;
  isProjectSelected: boolean = false;

  totalRecords: number;

  mitigationData: Mitigation[];
  mitigation: Mitigation = new Mitigation();
  isCSIUser: boolean =false;
  selectedUnit: Unit;
  selectedProject: Project;

  public projects: Project[] = [];
  public units: any

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  searchBy: any = {
    text: null,
    usertype: null,
  };

  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    //private activatedRoute:ActivatedRoute,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy

  ) {
        super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
   }

   ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit(){

    this.isCSIUser = this.appService.isCSIUser();

    this.setAction();

    this.setInitialState();

    await this.setUnit();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    this.load({});
    await super.ngOnInit();
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


  

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.mitigation.unit && this.mitigation.unit.id){
          this.selectedUnit = this.mitigation.unit;
        }
      }
    }
    this.mitigation.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  

  async getProject(id: number){
    let res = await this.serviceProxy.getOneBaseProjectControllerProject(
      id,
      undefined,
      undefined,
      0
    ).toPromise();
    return res;
  }

  async setInitialState(){

    if (this.id == -1) {

      this.mitigation = new Mitigation();

    }

    if (this.id > 0) {
      this.editEntryId = this.id
    if (this.editEntryId && this.editEntryId > 0) {

      this.isNewEntry = false;

       this.serviceProxy.getOneBaseMitigationControllerMitigation(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).subscribe((res: any) => {
        this.mitigation = res;


      });

    
      let project = await this.getProject(this.mitigation.project.id);
      if (project){
        this.mitigation.project = project;
        
      }
      
    }else{
      

    }
  }
  }


  load(event: LazyLoadEvent) {
    console.log(event);
    this.loading = true;
    this.totalRecords = 0;


    let typeId = this.searchBy.userType ? this.searchBy.userType.id : 0;
    let filterText = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber = event.first === 0 || event.first == undefined
      ? 1
      : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    let filters = [ "status||$ne||"+RecordStatus.Deleted];
    if(this.selectedProject){
      filters.push("project.id||$eq||"+this.selectedProject.id);
    }
    if(this.selectedUnit){
      filters.push("unit.id||$eq||"+this.selectedUnit.id);
    }

    if(this.selectedUnit || this.isCSIUser){
    this.serviceProxy
      .getManyBaseMitigationControllerMitigation(
        undefined,
        undefined,
        filters,
        undefined,
        undefined,
        ['unit','project'],
        this.rows,
        0,
        pageNumber,
        0
      ).subscribe((res: any) => {
        this.mitigationData = res.data;
        this.totalRecords = res.total;
        this.loading = false;
        
        console.log('total..', this.totalRecords)
      })
    }

  }

  

  async save(mitigationForm: NgForm) {
    this.creating = true;

    if (mitigationForm.valid) {

      if (this.isNewEntry) {
        this.serviceProxy
          .createOneBaseMitigationControllerMitigation(this.mitigation)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.display = false;
              this.load({});

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
              this.onSearch()
            }
          );


      } else {
        this.serviceProxy.updateOneBaseMitigationControllerMitigation(this.mitigation.id, this.mitigation)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Mitigation has updated successfully',
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
              this.display = false;
              this.load({});
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
    this.serviceProxy.deleteOneBaseMitigationControllerMitigation(id)
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

  new() {
    this.isNewEntry = true
    this.isView = false
    this.display = true;
    this.id = -1;
    this.ngOnInit()

  }

  view(id: number) {

    this.display = true;
    this.isView = true
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }

  edit(id: number) {
    this.isNewEntry = false;

    this.display = true;
    this.isView = false
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }

  onBackClick() {
    this.display = false
  }


  showDialog() {
    this.isNewEntry = true
    this.isView = false
    this.display = true;
    this.id = -1;
    this.ngOnInit()


  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.load(event);
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.load({});
    
  }


  onChangeProject(e:Project){
    this.selectedProject = e;
    this.mitigation.project =e;
    this.load({});
  }


}
