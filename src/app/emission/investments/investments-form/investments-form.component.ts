import { Component, OnInit, ViewChild } from '@angular/core';
import { InvestmentsActivityData, InvestmentsActivityDataActivityDataStatus, InvestmentsActivityDataControllerServiceProxy, InvestmentsActivityDataDto, MethodABasedData, MethodBBasedData, MethodCBasedData, MethodDBasedData, MethodEBasedData, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-investment-form',
  templateUrl: './investments-form.component.html',
  styleUrls: ['./investments-form.component.css']
})
export class InvestmentsFormComponent extends EmissionCreateBaseComponent implements OnInit {



  investment: InvestmentsActivityDataDto = new InvestmentsActivityDataDto();



  creator: User;
  selectedUnit: Unit;

  public investfActivityTypes: any[] = []

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: any;
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public years: any[] = [];
  public months: { name: string, value: number }[] = []
  public fuel: any[] = []
  public units: any
  public sectors: any

  month: any;
  fuelType: any;
  unit: any
  isMobile: boolean;
  ownerships: { id: number, name: string }[] = []


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  creating: boolean = false;

  public genUnits: any;
  public genUnit: any;
  investeeSectors:any
  operatingSectors:any
  constructSectors:any



  constructor(
    protected serviceProxy: ServiceProxy,
    private investProxy: InvestmentsActivityDataControllerServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute: ActivatedRoute,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy
  ) {
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }

  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    // this.units = this.masterDataService.investment_units;
    this.ownerships = this.masterDataService.ownership_freightTransport;
    this.investfActivityTypes = this.masterDataService.investActivityTypes;
    this.units = this.masterDataService.investments_units;
    this.investeeSectors = this.masterDataService.ivesteesectors;
    this.operatingSectors = this.masterDataService.operatingsectors;
    this.constructSectors = this.masterDataService.constructsectors;




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

  setAction() {
    this.route.url.subscribe(r => {
      if (r[0].path.includes("view")) {
        this.isView = true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      // this.editEntryId = parseInt(id);
      this.editEntryId = id;

      console.log("gggg",this.editEntryId)
      this.isNewEntry = false;
    }
  }

  async setCreator() {
    let u = await this.appService.getUser();
    if (u) {
      this.creator = u;
      this.investment.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Investments)

  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.investment.unit && this.investment.unit.id) {
          this.selectedUnit = this.investment.unit;
        }
      }
    }
    this.investment.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.investment.mobile = false;
      this.investment.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.investment.project, PuesDataReqDtoSourceName.Investments, this.selectedUnit);
  }

  isMobileChange() {
    this.investment.mobile = this.isMobile;
    this.investment.stationary = !this.isMobile;
  }



  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Investments.toString(), this.selectedProject.id, this.selectedUnit.id,
      this.investment.year.toString(), this.month.value, this.investment)
    let e = this.investment.project;
    if (this.month && this.month.value === 12 && e) {
      this.investment.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.investment.project = e;
    this.investment.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Investments)
  }

  async getProject(id: number) {
    let res = await this.serviceProxy.getOneBaseProjectControllerProject(
      id,
      undefined,
      undefined,
      0
    ).toPromise();
    return res;
  }

  async setInitialState() {
    if (this.editEntryId && this.editEntryId !== undefined) {
      let res = await this.investProxy.getEntryById(
        this.editEntryId,
      ).toPromise();
       this.investment = res;
      console.log("llll",this.investment)
      let project = await this.getProject(res.project.id);
      console.log("pppp",project)

      if (project) {

        this.investment.project = project;
        this.isMobile = this.investment.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.investment.month);
      // this.fuelType = this.fuel.find(f=>f.code===this.investment.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.investment.fc_unit);
    } else {
      this.setCreator();
    }
  }

  onSelectMethod(event:any){
    this.investment.methodA_data = []
    this.investment.methodB_data =[]
    this.investment.methodC_data = []
    this.investment.methodD_data = []
  }

  addMethodAData() {
    this.investment.methodA_data.push(new MethodABasedData({ scp1scpe2EmissionsOfEquityInvestment: undefined, shareOfEquity: undefined,id:0 ,scp1scpe2EmissionsOfEquityInvestment_unit:"0"}))

  }
  addMethodBData() {
    this.investment.methodB_data.push(new MethodBBasedData({ investeeCompanyTotalRevenue: undefined, ef_InvesteeSector: undefined, shareOfEquity: undefined,id:0 ,investeeSector:"0"}))

  }
  addMethodCData() {
    this.investment.methodC_data.push(new MethodCBasedData({ scp1scp2EmissionRelevantProject: undefined, shareOfTotalProjectCosts: undefined,id:0, scp1scp2EmissionRelevantProject_unit:"0"}))


  }

  addMethodDData() {
    this.investment.methodD_data.push(new MethodDBasedData({ projectConstructionCost: undefined, ef_ReleventConsSector: undefined, shareOfTotalProjectCosts: undefined, projectRevenueInReportingYear: undefined, ef_relevantOperatingSector: undefined,id:0,operatingtSector:"0",constructSector:"0" }))

  }

  addMethodEData() {
    this.investment.methodE_data.push(new MethodEBasedData({ projectedAnnualEmissionsOfProject: undefined, projectedLifetimeOfProject: undefined, shareOfTotalProjectCosts: undefined,id:0 ,projectedAnnualEmissionsOfProject_unit:"0"}))

  }



  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;

    console.log("OOOOO", this.investment)

    if (genForm.valid && this.investment.project.id &&  [this.investment.methodA_data, this.investment.methodB_data, this.investment.methodC_data, this.investment.methodD_data,  this.investment.methodE_data].some(arr => arr.length > 0)) {
      this.investment.month = this.month.value
      // this.investment.fuelType = this.fuelType.code
      // this.investment.fc_unit = this.unit.code


      console.log("ssss", this.investment)

      if (this.isNewEntry) {

        this.investProxy.createAll(this.investment)
          .subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            this.creating = false;
            setTimeout(() => {
              this.onBackClick();
            }, 500);
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
        this.investProxy.updateAll(0, this.investment)
          .subscribe(
            (res) => {
              this.creating = false
           //   this.investment.emission = res.emission;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });

              setTimeout(() => {
                this.onBackClick();
              }, 500);
              
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
    } else {
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
    this.router.navigate(['app/emission/investments-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
       this.delete(this.investment.groupNo);
      },
      reject: () => { },
    });
  }

  delete(groupNo: string) {
    
    this.investProxy.deleteAllEntry(groupNo)
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      }, error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, () => {
        this.router.navigate(['../investment-list'], { relativeTo: this.activatedRoute });
      })
  }


  deleteOneA(i:number, id: number) {
    this.investment.methodA_data.splice(i, 1);
    this.deleteOneEntry(id);

  }

  deleteOneB(i:number, id: number) {
    this.investment.methodB_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneC(i:number, id: number) {
    this.investment.methodC_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneD(i:number, id: number) {
    this.investment.methodD_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneE(i:number, id: number) {
    this.investment.methodE_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneEntry(id:number){
    if(id>0){
      this.investProxy.deleteEntry(id)
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
        
      },
      //()=>this.onSearch()
      )}

  }
  async checkAccess() {
    if (this.selectedProject && this.selectedUnit) {
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Investments);
    }
  }

  onUpdateFuel(event: string) {
    // this.investment.fuelType = event;
  }

}
