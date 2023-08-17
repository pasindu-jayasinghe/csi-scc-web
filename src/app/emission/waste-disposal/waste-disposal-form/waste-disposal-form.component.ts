import { Component, OnInit } from '@angular/core';
import {  Project, ServiceProxy, WasteDisposalActivityData, User, PuesDataDto, PuesDataReqDtoSourceName, Unit, ProjectUnitEmissionSourceControllerServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';


@Component({
  selector: 'app-waste-disposal-form',
  templateUrl: './waste-disposal-form.component.html',
  styleUrls: ['./waste-disposal-form.component.css']
})
export class WasteDisposalFormComponent extends EmissionCreateBaseComponent implements OnInit {

  wasteDisposal: WasteDisposalActivityData = new WasteDisposalActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public projects: Project[] = [];
  public months: any[] = [];
  public disposalMethods: any[] = [];
  public disposalWasteTypes: any[] = [];
  public units: any;
  public unit: any

  disposalMethod: any;
  month: any;
  wasteType: any;

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  coreatingUser: boolean = false;

  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private activatedRoute:ActivatedRoute,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy
  ) {
        super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
   }


  async ngOnInit() {
    
    this.months = this.masterDataService.months;
    this.disposalMethods = this.masterDataService.disposalMethods;
    this.disposalWasteTypes = this.masterDataService.disposalWasteTypes;
    this.units = this.masterDataService.waste_disposal_units;
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
      this.wasteDisposal.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Waste_disposal)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.wasteDisposal.unit && this.wasteDisposal.unit.id){
          this.selectedUnit = this.wasteDisposal.unit;
        }
      }
    }
    this.wasteDisposal.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.wasteDisposal.mobile = false;
      this.wasteDisposal.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.wasteDisposal.project, PuesDataReqDtoSourceName.Waste_disposal, this.selectedUnit);    
  }

  isMobileChange(){
    this.wasteDisposal.mobile = this.isMobile;
    this.wasteDisposal.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Waste_disposal.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.wasteDisposal.year.toString(), this.month.value, this.wasteDisposal)
    let e = this.wasteDisposal.project;
    if(this.month && this.month.value === 12 && e){
      this.wasteDisposal.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.wasteDisposal.project = e;
    this.wasteDisposal.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Waste_disposal)
  }

  onSelect(selected:any){
    this.disposalWasteTypes = this.masterDataService.disposalWasteTypes
    .filter(e=> 
     e.wasteId == selected.value.id);
    console.log("disposalWasteTypes",this.disposalWasteTypes)
    console.log("selected",selected)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseWasteDisposalActivityDataControllerWasteDisposalActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.wasteDisposal = res;
      let project = await this.getProject(this.wasteDisposal.project.id);
      if (project){
        this.wasteDisposal.project = project;
        this.isMobile = this.wasteDisposal.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.wasteDisposal.month);  
      this.disposalMethod = this.disposalMethods.find(d=>d.name===this.wasteDisposal.disposalMethod);
      this.wasteType = this.disposalWasteTypes.find(d=>d.code===this.wasteDisposal.wasteType);
      
    }else{
      this.setCreator();
    }
  }


  async save(wasteDisposalForm: NgForm) {
    this.creating=true;

    
    if(wasteDisposalForm.valid  && this.wasteDisposal.project.id){
      this.wasteDisposal.month = this.month.value
      this.wasteDisposal.disposalMethod = this.disposalMethod.name
      this.wasteDisposal.wasteType = this.wasteType.code
      this.wasteDisposal.amountDisposed_unit = this.unit.code

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseWasteDisposalActivityDataControllerWasteDisposalActivityData(this.wasteDisposal)
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
        this.serviceProxy.updateOneBaseWasteDisposalActivityDataControllerWasteDisposalActivityData(this.wasteDisposal.id, this.wasteDisposal)
          .subscribe(
            (res: { emission: any; }) => {
              this.wasteDisposal.emission = res.emission;
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
    this.router.navigate(['app/emission/waste-disposal-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.wasteDisposal.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseWasteDisposalActivityDataControllerWasteDisposalActivityData(id)
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
        this.router.navigate(['app/emission/waste-disposal-list']);
        //this.router.navigate(['../waste-disposal-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Waste_disposal);
    }
  }


}
