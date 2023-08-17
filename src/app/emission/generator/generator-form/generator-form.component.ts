import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneratorActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-generator-form',
  templateUrl: './generator-form.component.html',
  styleUrls: ['./generator-form.component.css']
})
export class GeneratorFormComponent extends EmissionCreateBaseComponent implements OnInit {



  generator: GeneratorActivityData = new GeneratorActivityData();
  creator: User;
  // selectedUnit: Unit;

  
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public years: any[] = [];
  public months: {name: string, value: number}[] = []
  public fuel:any[] = []
  public units:any
  month: any;
  fuelType:any;
  unit:any
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  nzTypes:{name: string, code: string}[] = [{name: 'generator', code:'generator'},{name: 'boiler', code:'boiler'},]


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  creating: boolean = false;

  public genUnits: any;
  public genUnit: any

  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute:ActivatedRoute,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy
  ) { 
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }

  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    this.units = this.masterDataService.generator_units;
    this.ownerships =this.masterDataService.ownership_freightTransport;

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();
  }



  public get sourceType(): typeof SourceType {
    return SourceType; 
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
      this.generator.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setCountry(); // fuel list not loading issue due to country is missing. fixed for generator only
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Generator)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.generator.unit && this.generator.unit.id){
          this.selectedUnit = this.generator.unit;
        }
      }
    }
    this.generator.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.generator.mobile = false;
      this.generator.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.generator.project, PuesDataReqDtoSourceName.Generator, this.selectedUnit);    
  }

  isMobileChange(){
    this.generator.mobile = this.isMobile;
    this.generator.stationary = !this.isMobile;
  }



  async monthCgange(){
    await this.validateMonth(
      PuesDataReqDtoSourceName.Generator.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.generator.year.toString(), this.month.value, this.generator)
    let e = this.generator.project;
    if(this.month && this.month.value === 12 && e){
      this.generator.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.generator.project = e;
    this.generator.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Generator)
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
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseGeneratorActivityDataControllerGeneratorActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.generator = res;
      let project = await this.getProject(this.generator.project.id);
      if (project){
        this.generator.project = project;
        this.isMobile = this.generator.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.generator.month);
      this.fuelType = this.fuel.find(f=>f.code===this.generator.fuelType);
      this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.generator.fc_unit);
    }else{
      this.setCreator();
    }
  }







  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating=true;

    if(genForm.valid && this.generator.project.id){
      this.generator.month = this.month.value
      // this.generator.fuelType = this.fuelType.code
      this.generator.fc_unit = this.unit.code


      console.log("ssss",this.generator)

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseGeneratorActivityDataControllerGeneratorActivityData(this.generator)
          .subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            this.creating = false;
            setTimeout(() => {
              this.onBackClick();}, 500);
            },
            (error) => {
              this.creating = false
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
              this.creating = false;
            },
            () => {
              this.creating = false;
            }
          );


      } else {
        this.serviceProxy.updateOneBaseGeneratorActivityDataControllerGeneratorActivityData(this.generator.id, this.generator)
          .subscribe(
            (res) => {
              this.creating = false
              this.generator.emission = res.emission;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
            },
            (error) => {
              this.creating = false
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
    } else{
      this.creating = false
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      
     }
  }












  onBackClick() {
    this.router.navigate(['app/emission/generator-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.generator.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseGeneratorActivityDataControllerGeneratorActivityData(id)
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
      }, ()=> {
        this.router.navigate(['../generator-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Generator);
    }
  }

  onUpdateFuel(event: string) {
    this.generator.fuelType = event;
  }

}
