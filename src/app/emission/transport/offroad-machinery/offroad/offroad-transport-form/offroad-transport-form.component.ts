import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { OffroadMachineryOffroadActivityData, User, Project, ServiceProxy, PuesDataDto, Unit, PuesDataReqDtoSourceName, ProjectUnitEmissionSourceControllerServiceProxy, Industry, IndustryType } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-offroad-transport-form',
  templateUrl: './offroad-transport-form.component.html',
  styleUrls: ['./offroad-transport-form.component.css']
})
export class OffroadTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  offroadMachinery: OffroadMachineryOffroadActivityData = new OffroadMachineryOffroadActivityData()
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: any;

  checked: any

  industries: Industry[];

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public methods_freightTransport: {name: string, id: number}[] = []
  public ownership_freightTransport: {name: string, id: number}[] = []
  public fuelType1: {name: string, id: number}[] = []
  public options_freightTransport: {name: string, id: number}[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []
  public vehicleModels: {name: string, id: number}[] = []
  public strokes: {name: string, id: number, code: string}[] = []

  public units: any
  public onSelectUnitId: any

  month: any;
  method: any;
  ownership: any = {};
  // fuelEconomy_unit: any = {}
  domesticInternational: any;
  vehicleModel: any

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

  async ngOnInit(): Promise<void> {
    this.months = this.masterDataService.months;
    this.methods_freightTransport = this.masterDataService.methods_freightTransport.filter(m => m.id === 1);
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.fuelType1 = this.masterDataService.fuel;
    this.options_freightTransport =this.masterDataService.options_freightTransport;
    this.units = this.masterDataService.offroad_machinery_units
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.vehicleModels = this.masterDataService.vehicleModel_freightTransport;
    this.strokes = this.masterDataService.strokes

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
    await this.getIndustries();
       
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
      this.offroadMachinery.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Offroad_machinery_offroad)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.offroadMachinery.unit && this.offroadMachinery.unit.id){
          this.selectedUnit = this.offroadMachinery.unit;
        }
      }
    }
    this.offroadMachinery.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async getIndustries() {
    let filter = ['type||$eq||'+ IndustryType.M]
    this.serviceProxy.getManyBaseIndustryControllerIndustry(
      undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
    ).subscribe(res => {
      this.industries = res.data
    })
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.offroadMachinery.mobile = false;
      this.offroadMachinery.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.offroadMachinery.project, PuesDataReqDtoSourceName.Offroad_machinery_offroad, this.selectedUnit);    
  }

  isMobileChange(){
    this.offroadMachinery.mobile = this.isMobile;
    this.offroadMachinery.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Offroad_machinery_offroad.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.offroadMachinery.year.toString(), this.month.value, this.offroadMachinery)
    let e = this.offroadMachinery.project;
    if(this.month && this.month.value === 12 && e){
      this.offroadMachinery.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.offroadMachinery.project = e;
    this.offroadMachinery.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Offroad_machinery_offroad)

  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseOffroadMachineryOffroadActivityDataControllerOffroadMachineryOffroadActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.offroadMachinery = res;
      let project = await this.getProject(this.offroadMachinery.project.id);
      if (project){
        this.offroadMachinery.project = project;
        this.isMobile = this.offroadMachinery.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.offroadMachinery.month);
      this.ownership = this.ownership_freightTransport.find(o => o.name === this.offroadMachinery.ownership);
      this.method = this.methods_freightTransport.find(m => m.name === this.offroadMachinery.method);
      this.domesticInternational = this.domesticInternationals.find(o => o.code === this.offroadMachinery.domOrInt)
      // this.fuelEconomy_unit = this.masterDataService.offroad_machinery_units.fuelEconomy.find((o:any) => o.code === this.offroadMachinery.fuelEconomy_unit)
      // this.fuelType = this.fuelType1.find(f => f.name === this.offroadMachinery.fuelType);
      this.vehicleModel = this.vehicleModels.find(o => o.name === this.offroadMachinery.vehicleModel)
      
    }else{
      this.setCreator();
    }
  }



  onSelectMethod(selected:any){
    this.method = this.methods_freightTransport
    .find(m=> 
     m.id === selected.value.id);
    console.log("Freight method",this.method.id)
    console.log("selected",selected)
  }

  // onSelectOption(selected:any){
  //   this.option = this.options_freightTransport
  //   .find(o=> 
  //    o.id === selected.value.id);
  //   console.log("Freight Option",this.option.id)
  //   console.log("selected",selected)
  // }

  save(offRoadForm: NgForm){
    this.creating=true;

    
    
    if(offRoadForm.valid && this.offroadMachinery.project.id){
      this.offroadMachinery.month = this.month.value
      this.offroadMachinery.method =this.method.name
      // this.offroadMachinery.fuelType =this.fuelType.name
      this.offroadMachinery.ownership =this.ownership.name
      // this.offroadMachinery.fuelEconomy_unit = this.fuelEconomy_unit.code
      this.offroadMachinery.vehicleModel = this.vehicleModel.name

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseOffroadMachineryOffroadActivityDataControllerOffroadMachineryOffroadActivityData(this.offroadMachinery)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            console.log('Freight road',res);
            setTimeout(() => {
              this.onBackClick();}, 500);
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
              this.creating = false;
            }
          );


      } else {
        this.serviceProxy.updateOneBaseOffroadMachineryOffroadActivityDataControllerOffroadMachineryOffroadActivityData(this.offroadMachinery.id, this.offroadMachinery)
          .subscribe(
            (res: any) => {
              this.offroadMachinery.e_sc = res.e_sc;
              
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              // console.log('FreightRoad',res)
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
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 2, subTabIndex:0}} );
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.offroadMachinery.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseOffroadMachineryOffroadActivityDataControllerOffroadMachineryOffroadActivityData(id)
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
        this.router.navigate(['../freight-transport-list'], {relativeTo:this.activatedRoute});
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Offroad_machinery_offroad);
    }
  }

  check(){
    this.offroadMachinery.paidByCompany = this.checked[0]
  }

  onUpdateFuel(event: string) {
    this.offroadMachinery.fuelType = event;
  }

}
