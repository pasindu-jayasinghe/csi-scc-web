import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { FireExtinguisherActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-fire-extinguisher-form',
  templateUrl: './fire-extinguisher-form.component.html',
  styleUrls: ['./fire-extinguisher-form.component.css']
})
export class FireExtinguisherFormComponent extends EmissionCreateBaseComponent implements OnInit {
  fireExtinguisher: FireExtinguisherActivityData = new FireExtinguisherActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public years: any[] = [];
  public months: {name: string, value: number}[] = []
  //public months: any[] = []
  // year: any = {};
  month: any;

  @Input() projectType: any


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;


  fireExtinguisherType:{name: string, id: number, code: string}[]
  suppressionTypes:{name: string, id: number, code: string}[]

  public units: any;
  public unit: any

  constructor(  protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    protected appService: AppService,
    private masterDataService: MasterDataService,protected dialogService: DialogService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy

    ) {
      super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
    }

  async ngOnInit() {

    this.projectType =  this.appService.projectType.value

    console.log("pppppp",this.projectType)

    this.fireExtinguisherType= this.masterDataService.fireExtinguisherTypes
    this.suppressionTypes = this.masterDataService.suppressionTypes

    this.years = [{ value: 2023, name: "2023" },{ value: 2022, name: "2022" }]
    //this.months = [{ value: 1, name: "January" }, { value: 2, name: "February" }, { value: 3, name: "March" }]
    this.months = this.masterDataService.months;
    this.institutions = [{ id: 1, name: "abc" }, { id: 2, name: "abc2" }]

    this.units = this.masterDataService.fire_extinguisher_units

    this.ownerships =this.masterDataService.ownership_freightTransport;

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

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
  
  async setCreator(){
    let u = await this.appService.getUser();
    if(u){
      this.creator = u;
      this.fireExtinguisher.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Fire_extinguisher)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.fireExtinguisher.unit && this.fireExtinguisher.unit.id){
          this.selectedUnit = this.fireExtinguisher.unit;
        }
      }
    }
    this.fireExtinguisher.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.fireExtinguisher.mobile = false;
      this.fireExtinguisher.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.fireExtinguisher.project, PuesDataReqDtoSourceName.Fire_extinguisher, this.selectedUnit);    
  }

  isMobileChange(){
    this.fireExtinguisher.mobile = this.isMobile;
    this.fireExtinguisher.stationary = !this.isMobile;
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

  async monthCgange(){
    await this.validateMonth(
      PuesDataReqDtoSourceName.Fire_extinguisher.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.fireExtinguisher.year.toString(), this.month.value, this.fireExtinguisher)
    let e = this.fireExtinguisher.project;
    if(this.month && this.month.value === 12 && e){
      this.fireExtinguisher.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.fireExtinguisher.project = e;
    this.fireExtinguisher.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Fire_extinguisher)
  }


  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.fireExtinguisher = res;
      let project = await this.getProject(this.fireExtinguisher.project.id);
      if (project){
        this.fireExtinguisher.project = project;
        this.isMobile = this.fireExtinguisher.mobile;
        await this.setPUESData();
      }
      // this.year=this.years.find(a=>a.value==this.fireExtinguisher.year)
      this.month = this.months.find(m=>m.value===this.fireExtinguisher.month);  
      let tempProject = this.projects.findIndex(a=>a.id==this.fireExtinguisher.project.id);
      this.fireExtinguisher.project =this.projects[tempProject];
    }else{
      this.setCreator();
    }
  }


  async save(elecForm: NgForm) {
    // this.fireExtinguisher.emission = 123;
    console.log("sssss",this.fireExtinguisher)
    if(elecForm.valid && this.fireExtinguisher.project.id){
      
      // this.fireExtinguisher.year = this.year.value
      this.fireExtinguisher.month = this.month.value
      this.fireExtinguisher.weightPerTank_unit = this.unit.code
    if (this.isNewEntry) {

      this.serviceProxy
        .createOneBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(this.fireExtinguisher)
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfullysss',
              closable: true,
            });
            setTimeout(() => {
            this.onBackClick();
          }, 500);


          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
            console.log('Error', error);
          },
          () => {
            this.coreatingUser = false;
          }
        );


    } else {

      console.log("uuuuuuu",this.fireExtinguisher)

      this.serviceProxy
        .updateOneBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(this.fireExtinguisher.id, this.fireExtinguisher)
        .subscribe(
          (res) => {
            console.log("gggg",res)
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has update successfully',
              closable: true,
            });
            setTimeout(() => {
            this.onBackClick();
          }, 500);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
            console.log('Error', error);
          }
        );
    }
     } else{

      this.messageService.add({
        severity: 'warn',
        summary: 'Requried',
        detail: 'Fill All Mandetory fields',
        closable: true,
      });
     }
  }

  onBackClick() {
    this.router.navigate(['../fire-extinguisher-list'], {relativeTo:this.route});
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.fireExtinguisher.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseFireExtinguisherActivityDataControllerFireExtinguisherActivityData(id)
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
        this.router.navigate(['../fire-extinguisher-list'], {relativeTo:this.route});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Fire_extinguisher);
    }
  }

}
