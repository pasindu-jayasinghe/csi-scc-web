import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import {
  ElectricityBaseData,
  FuelBasedeData,
  LeasedAssetsMethodData,
  LeasedBuildingsMethodData,
  LessorSpecificMethodData,
  Project,
  ProjectUnitEmissionSourceControllerServiceProxy,
  PuesDataDto,
  PuesDataReqDtoSourceName,
  RefrigerantBasdeData,
  ServiceProxy,
  Unit,
  UpstreamLeasedAssetsActivityDataControllerServiceProxy,
  UpstreamLeasedAssetsActivityDataDto,
  UpstreamLeasedAssetsActivityDataDtoActivityType,
  User,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-upstream-leased-assets-form',
  templateUrl: './upstream-leased-assets-form.component.html',
  styleUrls: ['./upstream-leased-assets-form.component.css'],
})
export class UpstreamLeasedAssetsFormComponent
  extends EmissionCreateBaseComponent
  implements OnInit
{
  upstreamLeasedAssets: UpstreamLeasedAssetsActivityDataDto =
    new UpstreamLeasedAssetsActivityDataDto();

  creator: User;
  selectedUnit: Unit;

  public investfActivityTypes: any[] = [];

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: any;
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public years: any[] = [];
  public months: { name: string; value: number }[] = [];
  public fuel: any[] = [];
  public units: any;
  public sectors: any;

  month: any;
  fuelType: any;
  refTypes: any;
  unit: any;
  isMobile: boolean;
  ownerships: { id: number; name: string }[] = [];

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  creating: boolean = false;

  public genUnits: any;
  public genUnit: any;
  investeeSectors: any;
  operatingSectors: any;
  constructSectors: any;
  building_types: any;
  activites_upstreamLeasedAssets: any;
  fuel_upstream_leased: { name: string; id: number; code: string; }[];
  units_elec: any;

  constructor(
    protected serviceProxy: ServiceProxy,
    private upstreamLeasedAssetsProxy: UpstreamLeasedAssetsActivityDataControllerServiceProxy,
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
    super(
      appService,
      serviceProxy,
      projectUnitEmissionSourceControllerServiceProxy,
      messageService
    );
  }

  public get UpstreamLeasedAssetsActivityDataDtoActivityType(): typeof UpstreamLeasedAssetsActivityDataDtoActivityType {
    return UpstreamLeasedAssetsActivityDataDtoActivityType;
  }

  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;

   this.fuel_upstream_leased  = this.masterDataService.fuel_upstream_leased;
    // this.units = this.masterDataService.investment_units;
    this.ownerships = this.masterDataService.ownership_freightTransport;
    this.investfActivityTypes = this.masterDataService.investActivityTypes;
    this.units = this.masterDataService.upstream_lead_asset_units;
    this.investeeSectors = this.masterDataService.ivesteesectors;
    this.operatingSectors = this.masterDataService.operatingsectors;
    this.constructSectors = this.masterDataService.constructsectors;
    this.activites_upstreamLeasedAssets =
      this.masterDataService.activities_upstreamLeasedAssets;
    this.building_types = this.masterDataService.building_types;
    this.fuelType = this.masterDataService.fuel;
    this.refTypes = this.masterDataService.gWP_RGs;

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
    this.route.url.subscribe((r) => {
      if (r[0].path.includes('view')) {
        this.isView = true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      // this.editEntryId = parseInt(id);
      this.editEntryId = id;

      console.log('gggg', this.editEntryId);
      this.isNewEntry = false;
    }
  }

  async setCreator() {
    let u = await this.appService.getUser();
    if (u) {
      this.creator = u;
      this.upstreamLeasedAssets.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Upstream_leased_assets);
  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) {
        // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (
          this.upstreamLeasedAssets.unit &&
          this.upstreamLeasedAssets.unit.id
        ) {
          this.selectedUnit = this.upstreamLeasedAssets.unit;
        }
      }
    }
    this.upstreamLeasedAssets.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.upstreamLeasedAssets.mobile = false;
      this.upstreamLeasedAssets.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(
      this.upstreamLeasedAssets.project,
      PuesDataReqDtoSourceName.Upstream_leased_assets,
      this.selectedUnit
    );
  }

  isMobileChange() {
    this.upstreamLeasedAssets.mobile = this.isMobile;
    this.upstreamLeasedAssets.stationary = !this.isMobile;
  }

  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Upstream_leased_assets.toString(),
      this.selectedProject.id,
      this.selectedUnit.id,
      this.upstreamLeasedAssets.year.toString(),
      this.month.value,
      this.upstreamLeasedAssets
    );
    let e = this.upstreamLeasedAssets.project;
    if (this.month && this.month.value === 12 && e) {
      this.upstreamLeasedAssets.year = this.appService.getYear(
        e.isFinancialYear,
        e.year,
        e.fyFrom,
        e.fyTo,
        true
      );
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.upstreamLeasedAssets.project = e;
    this.upstreamLeasedAssets.year = this.appService.getYear(
      e.isFinancialYear,
      e.year,
      e.fyFrom,
      e.fyTo
    );

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Upstream_leased_assets);
  }

  async getProject(id: number) {
    let res = await this.serviceProxy
      .getOneBaseProjectControllerProject(id, undefined, undefined, 0)
      .toPromise();
    return res;
  }

  async setInitialState() {
    if (this.editEntryId && this.editEntryId !== undefined) {
      let res = await this.upstreamLeasedAssetsProxy
        .getEntryById(this.editEntryId)
        .toPromise();
      this.upstreamLeasedAssets = res;
      console.log('llll', this.upstreamLeasedAssets);
      let project = await this.getProject(res.project.id);
      console.log('pppp', project);

      if (project) {
        this.upstreamLeasedAssets.project = project;
        this.isMobile = this.upstreamLeasedAssets.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(
        (m) => m.value === this.upstreamLeasedAssets.month
      );
      // this.fuelType = this.fuel.find(f=>f.code===this.upstreamLeasedAssets.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.upstreamLeasedAssets.fc_unit);
    } else {
      this.setCreator();
    }
  }

  onSelectMethod(event: any) {
    this.upstreamLeasedAssets.asset_specific_method_data.fuel_data = [];
    this.upstreamLeasedAssets.asset_specific_method_data.refrigerant_data = [];

    this.upstreamLeasedAssets.lessor_specific_method_data = [];
    this.upstreamLeasedAssets.leased_buildings_method_data = [];
    this.upstreamLeasedAssets.leased_assets_method_data = [];
  }

  addMethodAFuelData() {
    this.upstreamLeasedAssets.asset_specific_method_data.fuel_data.push(
      new FuelBasedeData({
        fuel_type: '',
        fuel_quntity_unit: '',
        id: 0,
        fuel_quntity: undefined,
        typeName:undefined
      })
    );
  }

  
  addMethodAElecData() {
    this.upstreamLeasedAssets.asset_specific_method_data.elec_data.push(
      new ElectricityBaseData({
        fuel_type: '',
        fuel_quntity_unit: '',
        id: 0,
        fuel_quntity: undefined,
        typeName:undefined
      })
    );
  }


  addMethodARefData() {
    this.upstreamLeasedAssets.asset_specific_method_data.refrigerant_data.push(
      new RefrigerantBasdeData({
        refrigerant_type: '',
        refrigerant_quntity: undefined,
        refrigerant_quntity_unit: '',
        id: 0,
        process_emission: undefined,
        process_emission_unit: '',
        typeName:undefined

      })
    );
  }

  addMethodBData() {
    this.upstreamLeasedAssets.lessor_specific_method_data.push(
      new LessorSpecificMethodData({
        scp1scp2_emissions_lessor: undefined,
        scp1scp2_emissions_lessor_unit: '',
        id: 0,
        lease_assests_ratio: undefined,
        userInputEF: undefined,
        lessorType: '',
      })
    );
  }

  addMethodCData() {
    this.upstreamLeasedAssets.leased_buildings_method_data.push(
      new LeasedBuildingsMethodData({
        total_floor_space: undefined,
        total_floor_space_unit: '',
        building_type: '',
        id: 0,
        userInputEF: undefined,
      })
    );
  }

  addMethodDData() {
    this.upstreamLeasedAssets.leased_assets_method_data.push(
      new LeasedAssetsMethodData({
        number_of_assets: undefined,
        asset_type: '',
        id: 0,
        userInputEF: undefined,
      })
    );
  }
  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;

    console.log('OOOOO----', this.upstreamLeasedAssets);

    if (
      genForm.valid &&
      this.upstreamLeasedAssets.project.id &&
      ((this.upstreamLeasedAssets.asset_specific_method_data &&
        (this.upstreamLeasedAssets.asset_specific_method_data.fuel_data.length >
          0 ||
          this.upstreamLeasedAssets.asset_specific_method_data.refrigerant_data
            .length > 0 || this.upstreamLeasedAssets.asset_specific_method_data.elec_data
            .length > 0)) ||
        (this.upstreamLeasedAssets.lessor_specific_method_data &&
          this.upstreamLeasedAssets.lessor_specific_method_data.length > 0) ||
        (this.upstreamLeasedAssets.leased_buildings_method_data &&
          this.upstreamLeasedAssets.leased_buildings_method_data.length > 0) ||
        (this.upstreamLeasedAssets.leased_assets_method_data &&
          this.upstreamLeasedAssets.leased_assets_method_data.length > 0) )
    ) {
      this.upstreamLeasedAssets.month = this.month.value;
      // this.upstreamLeasedAssets.fuelType = this.fuelType.code
      // this.upstreamLeasedAssets.fc_unit = this.unit.code

      if (this.isNewEntry) {
        console.log("NEWWWW")
        this.upstreamLeasedAssetsProxy
          .createAll(this.upstreamLeasedAssets)
          .subscribe(
            (res) => {
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
              this.creating = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'selected paramter may not have Emission factor or server error',
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
        this.upstreamLeasedAssetsProxy
          .updateAll(0, this.upstreamLeasedAssets)
          .subscribe(
            (res) => {
              this.creating = false;
              //   this.upstreamLeasedAssets.emission = res.emission;
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
              this.creating = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'selected paramter may not have Emission factor or server error',
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
      this.creating = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields and check valid inputs',
        closable: true,
      });
    }
  }

  onBackClick() {
    this.router.navigate(['app/emission/upstream-leased-assets-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the entry?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.upstreamLeasedAssets.groupNo);
      },
      reject: () => {},
    });
  }

  delete(groupNo: string) {
    this.upstreamLeasedAssetsProxy.deleteAllEntry(groupNo).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      },
      () => {
        this.router.navigate(['../upstream-leased-assets-list'], {
          relativeTo: this.activatedRoute,
        });
      }
    );
  }

  deleteOneAFuel(i: number, id: number) {
    this.upstreamLeasedAssets.asset_specific_method_data.fuel_data.splice(i, 1);

    this.deleteOneEntry(id);
  }

  deleteOneAElec(i: number, id: number) {
    this.upstreamLeasedAssets.asset_specific_method_data.elec_data.splice(i, 1);

    this.deleteOneEntry(id);
  }

  deleteOneARef(i: number, id: number) {
    this.upstreamLeasedAssets.asset_specific_method_data.refrigerant_data.splice(
      i,
      1
    );

    this.deleteOneEntry(id);
  }

  deleteOneB(i: number, id: number) {
    this.upstreamLeasedAssets.lessor_specific_method_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneC(i: number, id: number) {
    this.upstreamLeasedAssets.leased_buildings_method_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneD(i: number, id: number) {
    this.upstreamLeasedAssets.leased_assets_method_data.splice(i, 1);
    this.deleteOneEntry(id);
  }

  deleteOneEntry(id: number) {
    if (id > 0) {
      this.upstreamLeasedAssetsProxy.deleteEntry(id).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has deleted successfully',
            closable: true,
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred, please try again',
            closable: true,
          });
        }
        //()=>this.onSearch()
      );
    }
  }
  async checkAccess() {
    if (this.selectedProject && this.selectedUnit) {
      await this.hasPUES(
        this.selectedUnit.id,
        this.selectedProject,
        PuesDataReqDtoSourceName.Upstream_leased_assets
      );
    }
  }

  onUpdateFuel(event: string) {
    // this.upstreamLeasedAssets.fuelType = event;
  }
}
