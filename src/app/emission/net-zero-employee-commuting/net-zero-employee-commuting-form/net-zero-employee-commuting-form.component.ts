import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AmountSpendBasedNetZeroBusinessTravelEmissionSourceData,
  AverageDataNetZeroEmployeeCommutingEmissionSourceData,
  Country,
  EmployeeAverageDataNetZeroEmployeeCommutingEmissionSourceData,
  EnergyDistanceBasedNetZeroEmployeeCommutingEmissionSourceData,
  FuelBasedNetZeroBusinessTravelEmissionSourceData,
  FuelFuelBasedNetZeroBusinessTravelEmissionSourceData,
  FuelFuelBasedNetZeroEmployeeCommutingEmissionSourceData,
  GeneratorActivityData,
  GridFuelBasedNetZeroBusinessTravelEmissionSourceData,
  GridFuelBasedNetZeroEmployeeCommutingEmissionSourceData,
  HotelDistanceBasedNetZeroBusinessTravelEmissionSourceData,
  NetZeroBusinessTravelActivityData,
  NetZeroBusinessTravelActivityDataActivityDataStatus,
  NetZeroBusinessTravelActivityDataControllerServiceProxy,
  NetZeroBusinessTravelActivityDataDto,
  NetZeroBusinessTravelActivityDataDtoMethod,
  NetZeroEmployeeCommutingActivityDataControllerServiceProxy,
  NetZeroEmployeeCommutingActivityDataDto,
  NetZeroEmployeeCommutingActivityDataDtoActivityDataStatus,
  NetZeroEmployeeCommutingActivityDataDtoMethod,
  NetZeroEmployeeCommutingActivityDataMethod,
  Project,
  ProjectUnitEmissionSourceControllerServiceProxy,
  PuesDataDto,
  PuesDataReqDtoSourceName,
  RefrigerantFuelBasedNetZeroBusinessTravelEmissionSourceData,
  RefrigerantFuelBasedNetZeroEmployeeCommutingEmissionSourceData,
  ServiceProxy,
  Unit,
  User,
  VehicleDistanceBasedNetZeroBusinessTravelEmissionSourceData,
  VehicleDistanceBasedNetZeroEmployeeCommutingEmissionSourceData,
} from '../../../../shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';

@Component({
  selector: 'app-net-zero-employee-commuting-form',
  templateUrl: './net-zero-employee-commuting-form.component.html',
  styleUrls: ['./net-zero-employee-commuting-form.component.css'],
})
export class NetZeroEmployeeCommutingFormComponent
  extends EmissionCreateBaseComponent
  implements OnInit
{
  employee_commuting: NetZeroEmployeeCommutingActivityDataDto =
    new NetZeroEmployeeCommutingActivityDataDto();
  creator: User;
  selectedUnit: Unit;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  groupNumber: string;
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public years: any[] = [];
  public months: { name: string; value: number }[] = [];
  public fuel: any[] = [];
  public units: any;
  public types: any;
  month: any;
  fuelType: any;
  unit: any;
  isMobile: boolean;
  ownerships: { id: number; name: string }[] = [];

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  creating: boolean = false;

  method: any;
  countries: Country[] = [];
  public genUnits: any;
  public genUnit: any;

  public methods_net_zero_employee_commuting: {
    name: string;
    id: number;
    value: string;
  }[] = [];
  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute: ActivatedRoute,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    protected netZeroEmployeeCommutingActivityDataControllerServiceProxy: NetZeroEmployeeCommutingActivityDataControllerServiceProxy
  ) {
    super(
      appService,
      serviceProxy,
      projectUnitEmissionSourceControllerServiceProxy,
      messageService
    );
  }
  public get netEmployeeCommutingActivityDataDtoMethod(): typeof NetZeroEmployeeCommutingActivityDataDtoMethod {
    return NetZeroEmployeeCommutingActivityDataDtoMethod;
  }
  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    this.units = this.masterDataService.net_zero_employee_commuting_units;
    this.types = this.masterDataService.net_zero_employee_commuting_types;
    this.ownerships = this.masterDataService.ownership_freightTransport;
    this.methods_net_zero_employee_commuting =
      this.masterDataService.methods_net_zero_employee_commuting;

    this.setAction();
    await this.setInitialState();
    await this.setUnit();

    console.log('this.employee_commuting', this.employee_commuting);
    this.isAnyAdmin = this.appService.isAnyAdmin();
    this.isProjectSelected = true;

    await super.ngOnInit();
  }

  async getCountries() {
    const res = await this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.countries = res.data;
      });
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
      this.groupNumber = id;
      this.isNewEntry = false;
    }
  }

  async setCreator() {
    let u = await this.appService.getUser();
    if (u) {
      this.creator = u;
      this.employee_commuting.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Net_zero_employee_commuting);
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
        if (this.employee_commuting.unit && this.employee_commuting.unit.id) {
          this.selectedUnit = this.employee_commuting.unit;
        }
      }
    }
    this.employee_commuting.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.employee_commuting.mobile = false;
      this.employee_commuting.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(
      this.employee_commuting.project,
      PuesDataReqDtoSourceName.Net_zero_employee_commuting,
      this.selectedUnit
    );
  }

  isMobileChange() {
    this.employee_commuting.mobile = this.isMobile;
    this.employee_commuting.stationary = !this.isMobile;
  }

  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Net_zero_employee_commuting.toString(),
      this.selectedProject.id,
      this.selectedUnit.id,
      this.employee_commuting.year.toString(),
      this.month.value,
      this.employee_commuting
    );
    let e = this.employee_commuting.project;
    if (this.month && this.month.value === 12 && e) {
      this.employee_commuting.year = this.appService.getYear(
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
    this.employee_commuting.project = e;
    this.employee_commuting.year = this.appService.getYear(
      e.isFinancialYear,
      e.year,
      e.fyFrom,
      e.fyTo
    );

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Net_zero_employee_commuting);
  }

  removeRow(data: any, index: number) {
    if (data[index].id) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this data?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: () => {
          this.netZeroEmployeeCommutingActivityDataControllerServiceProxy
            .deleteOneRow(data[index].id)
            .subscribe((a) => {
              data.splice(index, 1);
            });
        },
        reject: () => {},
      });
    } else {
      data.splice(index, 1);
    }
  }

  async getProject(id: number) {
    let res = await this.serviceProxy
      .getOneBaseProjectControllerProject(id, undefined, undefined, 0)
      .toPromise();
    return res;
  }

  async setInitialState() {
    if (this.groupNumber) {
      let res =
        await this.netZeroEmployeeCommutingActivityDataControllerServiceProxy
          .getOneEmployeeCommutingDataSet(this.groupNumber)
          .toPromise();

      this.employee_commuting = res;
      if (!this.isView) {
        this.addMissingMethodEmptyObject();
      }

      if (
        this.employee_commuting.method ==
        NetZeroEmployeeCommutingActivityDataDtoMethod.DistanceBase
      ) {
        await this.getCountries();
      }
      console.log('project', res);
      let project = await this.getProject(this.employee_commuting.project.id);
      if (project) {
        this.employee_commuting.project = project;
        this.isMobile = this.employee_commuting.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(
        (m) => m.value === this.employee_commuting.month
      );
      // this.fuelType = this.fuel.find(f=>f.code===this.employee_commuting.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.employee_commuting.fc_unit);
    } else {
      this.setCreator();
    }
  }

  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;

    if (
      genForm.valid &&
      this.employee_commuting.project.id &&
      (
        (this.employee_commuting.fuel_emission_source_data &&
          ((this.employee_commuting.fuel_emission_source_data.fuel_data&&this.employee_commuting.fuel_emission_source_data.fuel_data.length >
            0) ||
            (this.employee_commuting.fuel_emission_source_data.grid_data&&this.employee_commuting.fuel_emission_source_data.grid_data
              .length > 0) ||
             ( this.employee_commuting.fuel_emission_source_data.refrigerant_data&& this.employee_commuting.fuel_emission_source_data.refrigerant_data
              .length > 0))) ||
        (this.employee_commuting.distance_emission_source_data &&
          ((this.employee_commuting.distance_emission_source_data.vehicale_data&&this.employee_commuting.distance_emission_source_data.vehicale_data
            .length > 0) ||
            (this.employee_commuting.distance_emission_source_data.energy_data&&this.employee_commuting.distance_emission_source_data.energy_data
              .length > 0))) ||
        (this.employee_commuting.average_data_emission_source_data &&
          this.employee_commuting.average_data_emission_source_data.average_data
            .length > 0)
      )
    ) {
      this.employee_commuting.month = this.month.value;
      // this.generator.fuelType = this.fuelType.code
      // this.employee_commuting.fc_unit = this.unit.code

      console.log('ssss', this.employee_commuting);

      if (this.isNewEntry) {
        this.netZeroEmployeeCommutingActivityDataControllerServiceProxy
          .createOne(this.employee_commuting)
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
        this.netZeroEmployeeCommutingActivityDataControllerServiceProxy
          .createOne(this.employee_commuting)
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
      }
    } else {
      this.creating = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields or Check input validation',
        closable: true,
      });
    }
  }

  async onSelectMethod(selected: any) {
    console.log(selected.value);
    await this.getCountries();
    // this.employee_commuting
    this.employee_commuting.fuel_emission_source_data.fuel_data = [];
    this.employee_commuting.fuel_emission_source_data.grid_data = [];
    this.employee_commuting.fuel_emission_source_data.refrigerant_data = [];
    this.employee_commuting.distance_emission_source_data.vehicale_data = [];
    this.employee_commuting.distance_emission_source_data.energy_data = [];
    this.employee_commuting.average_data_emission_source_data.average_data = [];
    if (
      selected.value == NetZeroEmployeeCommutingActivityDataDtoMethod.FuelBase
    ) {
      this.employee_commuting.fuel_emission_source_data.fuel_data.push(
        new FuelFuelBasedNetZeroEmployeeCommutingEmissionSourceData()
      );
      this.employee_commuting.fuel_emission_source_data.grid_data.push(
        new GridFuelBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
      this.employee_commuting.fuel_emission_source_data.refrigerant_data.push(
        new RefrigerantFuelBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
    } else if (
      selected.value ==
      NetZeroEmployeeCommutingActivityDataDtoMethod.DistanceBase
    ) {
      this.employee_commuting.distance_emission_source_data.vehicale_data.push(
        new VehicleDistanceBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
      this.employee_commuting.distance_emission_source_data.energy_data.push(
        new EnergyDistanceBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
    } else {
      this.employee_commuting.average_data_emission_source_data.average_data.push(
        new EmployeeAverageDataNetZeroEmployeeCommutingEmissionSourceData( )
      );
    }
  }
  addMissingMethodEmptyObject() {
    if (
      this.employee_commuting.method ==
      NetZeroEmployeeCommutingActivityDataDtoMethod.FuelBase
    ) {
      if (!this.employee_commuting.fuel_emission_source_data.fuel_data) {
        this.employee_commuting.fuel_emission_source_data.fuel_data = [];
        this.employee_commuting.fuel_emission_source_data.fuel_data.push(
          new FuelFuelBasedNetZeroEmployeeCommutingEmissionSourceData( )
        );
      }
      if (!this.employee_commuting.fuel_emission_source_data.grid_data) {
        this.employee_commuting.fuel_emission_source_data.grid_data = [];
        this.employee_commuting.fuel_emission_source_data.grid_data.push(
          new GridFuelBasedNetZeroEmployeeCommutingEmissionSourceData( )
        );
      }
      if (!this.employee_commuting.fuel_emission_source_data.refrigerant_data) {
        this.employee_commuting.fuel_emission_source_data.refrigerant_data = [];
        this.employee_commuting.fuel_emission_source_data.refrigerant_data.push(
          new RefrigerantFuelBasedNetZeroEmployeeCommutingEmissionSourceData( )
        );
      }
    } else if (
      this.employee_commuting.method ==
      NetZeroEmployeeCommutingActivityDataDtoMethod.DistanceBase
    ) {
      if (
        !this.employee_commuting.distance_emission_source_data.vehicale_data
      ) {
        this.employee_commuting.distance_emission_source_data.vehicale_data =
          [];
        this.employee_commuting.distance_emission_source_data.vehicale_data.push(
          new VehicleDistanceBasedNetZeroEmployeeCommutingEmissionSourceData( )
        );
      }
      if (!this.employee_commuting.distance_emission_source_data.energy_data) {
        this.employee_commuting.distance_emission_source_data.energy_data = [];
        this.employee_commuting.distance_emission_source_data.energy_data.push(
          new EnergyDistanceBasedNetZeroEmployeeCommutingEmissionSourceData( )
        );
      }
    } else {
      if (
        !this.employee_commuting.average_data_emission_source_data.average_data
      ) {
        this.employee_commuting.average_data_emission_source_data.average_data =
          [];
        this.employee_commuting.average_data_emission_source_data.average_data.push(
          new EmployeeAverageDataNetZeroEmployeeCommutingEmissionSourceData( )
        );
      }
    }
  }
  addNewDataObject(arryName: string) {
    if (arryName == 'fuel') {
      this.employee_commuting.fuel_emission_source_data.fuel_data.push(
        new FuelFuelBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
    } else if (arryName == 'grid') {
      this.employee_commuting.fuel_emission_source_data.grid_data.push(
        new GridFuelBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
    } else if (arryName == 'ref') {
      this.employee_commuting.fuel_emission_source_data.refrigerant_data.push(
        new RefrigerantFuelBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
    } else if (arryName == 'distance') {
      this.employee_commuting.distance_emission_source_data.vehicale_data.push(
        new VehicleDistanceBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
    } else if (arryName == 'energy') {
      this.employee_commuting.distance_emission_source_data.energy_data.push(
        new EnergyDistanceBasedNetZeroEmployeeCommutingEmissionSourceData( )
      );
    } else {
      this.employee_commuting.average_data_emission_source_data.average_data.push(
        new EmployeeAverageDataNetZeroEmployeeCommutingEmissionSourceData( )
      );
    }
  }

  onBackClick() {
    this.router.navigate(['app/emission/net-zero-employee-commuting-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteWholeGroup();
      },
      reject: () => {},
    });
  }

  deleteWholeGroup() {
    this.netZeroEmployeeCommutingActivityDataControllerServiceProxy
      .deleteWholeGroup(this.employee_commuting.groupNo)
      .subscribe(
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
          this.onBackClick();
        }
      );
  }

  async checkAccess() {
    if (this.selectedProject && this.selectedUnit) {
      await this.hasPUES(
        this.selectedUnit.id,
        this.selectedProject,
        PuesDataReqDtoSourceName.Net_zero_employee_commuting
      );
    }
  }

  onUpdateFuel(event: string, fuel: any) {
    fuel.fuel_type = event;
  }
}
