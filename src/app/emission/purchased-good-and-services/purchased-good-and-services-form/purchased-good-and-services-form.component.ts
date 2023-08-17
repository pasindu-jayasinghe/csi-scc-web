import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { EmissionBaseControllerServiceProxy, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, PurchasedGoodsAndServicesActivityData, PurchasedGoodsAndServicesActivityDataMode, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-purchased-good-and-services-form',
  templateUrl: './purchased-good-and-services-form.component.html',
  styleUrls: ['./purchased-good-and-services-form.component.css']
})
export class PurchasedGoodAndServicesFormComponent extends EmissionCreateBaseComponent implements OnInit {

  purchase: PurchasedGoodsAndServicesActivityData = new PurchasedGoodsAndServicesActivityData();
  creator: User;

  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  selectedUnit: Unit;
  selectedMode: PurchasedGoodsAndServicesActivityDataMode;
  year: number;
  month: any;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  purchase_methods = PurchasedGoodsAndServicesActivityDataMode

  entities: PurchasedGoodsAndServicesActivityData[] = [new PurchasedGoodsAndServicesActivityData()]

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public methods: {name: string, id: number}[] = []
  public units: any
  public unit: any

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
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy

  ) {
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
   }

  async ngOnInit(): Promise<void> {
    this.months = this.masterDataService.months;
    this.methods = this.masterDataService.purchase_methods;
    // this.units = this.masterDataService.electricity_units;
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

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
     
    }else{
      this.setCreator();
    }
  }

  async setCreator(){
    let u = await this.appService.getUser();
    if(u){
      this.creator = u;
      this.purchase.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Electricity);
    
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.purchase.unit && this.purchase.unit.id){
          this.selectedUnit = this.purchase.unit;
        }
      }
    }
    this.purchase.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.purchase.mobile = false;
      this.purchase.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.purchase.project, PuesDataReqDtoSourceName.Purchased_goods_and_services, this.selectedUnit);    
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Purchased_goods_and_services);
    }
  }

  isMobileChange(){
    this.purchase.mobile = this.isMobile;
    this.purchase.stationary = !this.isMobile;
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
    let e = this.purchase.project;
    if(this.month && this.month.value === 12 && e){
      this.purchase.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

 

  onChangeProject(e:Project){
    this.purchase.project = e;
    this.selectedProject = e;
    this.purchase.project = e;
    // this.electricity.year = e.year;
    this.purchase.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Purchased_goods_and_services)
    
  }

  async save(elecForm: NgForm) {}

  onBackClick() {
    this.router.navigate(['/app/emission/electricity-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.purchase.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    
  }

  addNewEntity(){
    this.entities.push(new PurchasedGoodsAndServicesActivityData())
    console.log(this.entities)
  }

  removeEntity(idx: number){
    this.entities.splice(idx, 1)
    console.log(this.entities)
  }

  onEntityValueChange(e: any){
    console.log(e)
  }
  

}
