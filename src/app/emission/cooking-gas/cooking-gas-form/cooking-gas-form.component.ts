import { Component, OnInit } from '@angular/core';
import { CookingGasActivityData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';


@Component({
  selector: 'app-cooking-gas-form',
  templateUrl: './cooking-gas-form.component.html',
  styleUrls: ['./cooking-gas-form.component.css']
})
export class CookingGasFormComponent extends EmissionCreateBaseComponent implements OnInit {

  cooking: CookingGasActivityData = new CookingGasActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  cookingUpdate: IEmission;
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public cookingEmissionSources:any[] = []
  public cookingGasTypes:any[] = []
  public units: any;
  public unit: any

  month: any;
  emissionSource: any;
  //cookingGasType: any ={};
  gasType: any;


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

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
    this.cookingEmissionSources = this.masterDataService.cookingEmissionSources;
    this.cookingGasTypes = this.masterDataService.cookingGasTypes;
    this.units = this.masterDataService.cooking_gas_units;
    this.ownerships =this.masterDataService.ownership_freightTransport;

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();

  }

  onSelect(selected:any){
    this.cookingGasTypes = this.masterDataService.cookingGasTypes
    .filter(e=> 
     e.sourceId == selected.value.id);
    console.log("cookingGasTypes",this.cookingGasTypes)
    console.log("selected",selected)
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
      this.cooking.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Cooking_gas)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.cooking.unit && this.cooking.unit.id){
          this.selectedUnit = this.cooking.unit;
        }
      }
    }
    this.cooking.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.cooking.mobile = false;
      this.cooking.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.cooking.project, PuesDataReqDtoSourceName.Cooking_gas, this.selectedUnit);    
  }

  isMobileChange(){
    this.cooking.mobile = this.isMobile;
    this.cooking.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Cooking_gas.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.cooking.year.toString(), this.month.value, this.cooking)
    let e = this.cooking.project;
    if(this.month && this.month.value === 12 && e){
      this.cooking.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.cooking.project = e;
    this.cooking.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Cooking_gas)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseCookingGasActivityDataControllerCookingGasActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.cooking = res;

      let cookingStringify = res;
      //@ts-ignore
      cookingStringify = JSON.stringify(cookingStringify);
      //@ts-ignore
      cookingStringify = this.cleanString(cookingStringify);
      //@ts-ignore
      this.cookingUpdate = JSON.parse(cookingStringify);

      let project = await this.getProject(this.cooking.project.id);
      if (project){
        this.cooking.project = project;
        this.isMobile = this.cooking.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.cooking.month);  
      this.emissionSource = this.cookingEmissionSources.find(c=>c.name===this.cooking.emissionSource);
      this.gasType = this.cookingGasTypes.find(c=>c.code===this.cooking.gasType);
    }else{
      this.setCreator();
    }

  }

  cleanString(str:string) {

    str = str.replace(/}",/gi, '},');
    str = str.replace(/:"{/gi , ':{');
    str = str.replace(/[\/\\]/g, '');
   return str;
 }



  async save(cookingForm: NgForm) {
    this.creating=true;    

    
    if(cookingForm.valid && this.cooking.project.id){
      
      this.cooking.month = this.month.value
      this.cooking.emissionSource = this.emissionSource.name
      // this.cooking.gasType = this.gasType
      this.cooking.fcn_unit = this.unit.code
      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseCookingGasActivityDataControllerCookingGasActivityData(this.cooking)
          .subscribe((res: any) => {
            this.creating=false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            console.log('Cooking Gas',res);
            this.creating=false;
            setTimeout(() => {
              this.onBackClick();}, 500);
            },
            (error) => {
              this.creating=false;
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
        this.serviceProxy.updateOneBaseCookingGasActivityDataControllerCookingGasActivityData(this.cooking.id, this.cooking)
          .subscribe(
            (res: { emission: any; }) => {
              this.creating=false;
              this.cooking.emission = res.emission;
              let cookingStringify = JSON.stringify(res);
              cookingStringify = this.cleanString(cookingStringify);
              this.cooking = JSON.parse(cookingStringify);
              this.cookingUpdate = JSON.parse(cookingStringify);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              console.log('cooking',res)
            },
            (error) => {
              this.creating=false;
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      this.creating = false
    }
     
    // console.log(user)
    // this.cooking.user = user
  }

  onBackClick() {
    this.router.navigate(['app/emission/cooking-gas-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.cooking.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseCookingGasActivityDataControllerCookingGasActivityData(id)
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
        this.router.navigate(['../cooking-gas-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Cooking_gas);
    }
  }


  onUpdateFuel(event: string) { 
    this.cooking.gasType = event;
  }
}

export interface IEmission {
  emission:{
    e_sc_co2: number;
    e_sc_ch4: number;
    e_sc_n2o: number;
    e_sc: number;
  }
}
