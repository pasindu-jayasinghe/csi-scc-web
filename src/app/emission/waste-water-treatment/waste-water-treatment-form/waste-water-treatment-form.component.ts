import { Component, OnInit } from '@angular/core';
import { WasteWaterTreatmentActivityData, Project, ServiceProxy, User, PuesDataDto, PuesDataReqDtoSourceName, Unit, ProjectUnitEmissionSourceControllerServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-waste-water-treatment-form',
  templateUrl: './waste-water-treatment-form.component.html',
  styleUrls: ['./waste-water-treatment-form.component.css']
})
export class WasteWaterTreatmentFormComponent extends EmissionCreateBaseComponent implements OnInit {

  wasteWaterTreatments: WasteWaterTreatmentActivityData = new WasteWaterTreatmentActivityData();
  creator: User;


  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  wasteWaterUpdate: IEmission;
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public months: any[] = [];
  public anaerobicDeepLagoons: any[] = [];
  public unitsTip: {name: string, id: number}[] = []
  public unitTip: any
  public unitsWG: {name: string, id: number}[] = []
  public unitWG: any
  public unitsCOD: {name: string, id: number}[] = []
  public unitCOD: any
  public unitsSR: {name: string, id: number}[] = []
  public unitSR: any
  public unitsRch4: {name: string, id: number}[] = []
  public unitRch4: any
  anaerobicDeepLagoon: any;
  month: any;
  
  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  coreatingUser: boolean = false;

  public units: any
  public tipunit: any
  public wasteGeneratedunit: any
  public codunit: any
  public sludgeRemovedunit: any
  public recoveredCh4unit: any

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
    this.anaerobicDeepLagoons = this.masterDataService.anaerobicDeepLagoons;
    this.units = this.masterDataService.waste_water_units
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
      this.wasteWaterTreatments.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Waste_water_treatment)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.wasteWaterTreatments.unit && this.wasteWaterTreatments.unit.id){
          this.selectedUnit = this.wasteWaterTreatments.unit;
        }
      }
    }
    this.wasteWaterTreatments.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.wasteWaterTreatments.mobile = false;
      this.wasteWaterTreatments.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.wasteWaterTreatments.project, PuesDataReqDtoSourceName.Waste_water_treatment, this.selectedUnit);    
  }

  isMobileChange(){
    this.wasteWaterTreatments.mobile = this.isMobile;
    this.wasteWaterTreatments.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Waste_water_treatment.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.wasteWaterTreatments.year.toString(), this.month.value, this.wasteWaterTreatments)
    let e = this.wasteWaterTreatments.project;
    if(this.month && this.month.value === 12 && e){
      this.wasteWaterTreatments.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.wasteWaterTreatments.project = e;
    this.wasteWaterTreatments.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Waste_water_treatment)
  }


  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.wasteWaterTreatments = res;
      let wasteWaterStringify = res;
      //@ts-ignore
      wasteWaterStringify = JSON.stringify(wasteWaterStringify);
      //@ts-ignore
      wasteWaterStringify = this.cleanString(wasteWaterStringify);
      //@ts-ignore
      this.wasteWaterUpdate = JSON.parse(wasteWaterStringify);

      let project = await this.getProject(this.wasteWaterTreatments.project.id);
      if (project){
        this.wasteWaterTreatments.project = project;
        this.isMobile = this.wasteWaterTreatments.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.wasteWaterTreatments.month);  
      this.anaerobicDeepLagoon = this.anaerobicDeepLagoons.find(a=>a.code===this.wasteWaterTreatments.anaerobicDeepLagoon);

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


  async save(wasteWatertForm: NgForm) {
    this.creating=true;

    if(wasteWatertForm.valid && this.wasteWaterTreatments.project.id){
      this.wasteWaterTreatments.month = this.month.value
      this.wasteWaterTreatments.anaerobicDeepLagoon = this.anaerobicDeepLagoon.code
      this.wasteWaterTreatments.tip_unit = this.tipunit.code
      this.wasteWaterTreatments.wasteGenerated_unit = this.wasteGeneratedunit.code
      this.wasteWaterTreatments.cod_unit = this.codunit.code
      this.wasteWaterTreatments.sludgeRemoved_unit = this.sludgeRemovedunit.code
      this.wasteWaterTreatments.recoveredCh4_unit = this.recoveredCh4unit.code

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(this.wasteWaterTreatments)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.onBackClick();}, 500);
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


      } else {
        this.serviceProxy.updateOneBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(this.wasteWaterTreatments.id, this.wasteWaterTreatments)
          .subscribe(
            (res: { emission: any; }) => {
              this.wasteWaterTreatments.emission = res.emission;
              let wasteWaterStringify = JSON.stringify(res);
              wasteWaterStringify = this.cleanString(wasteWaterStringify);
              this.wasteWaterTreatments = JSON.parse(wasteWaterStringify);
              this.wasteWaterUpdate = JSON.parse(wasteWaterStringify);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
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
    } else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      this.creating = false
    }    
  }

  onBackClick() {
    this.router.navigate(['app/emission/waste-water-treatment-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.wasteWaterTreatments.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseWasteWaterTreatmentActivityDataControllerWasteWaterTreatmentActivityData(id)
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
        this.router.navigate(['app/emission/waste-water-treatment-list']);
        //this.router.navigate(['../waste-water-treatment-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Waste_water_treatment);
    }
  }


}


export interface IEmission {
  emission:{
    tcod: number;
    tch4: number;
    tco2e: number;
    ef: number;
  }
}