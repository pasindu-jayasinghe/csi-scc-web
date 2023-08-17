import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import {
  WasteGeneratedInOperationsActivityDataDto,
  User,
  Unit,
  PuesDataDto,
  Project,
  Country,
  ProjectUnitEmissionSourceControllerServiceProxy,
  WasteGeneratedInOperationsActivityDataControllerServiceProxy,
  WasteGeneratedInOperationsActivityDataDtoMethod,
  PuesDataReqDtoSourceName,
  ServiceProxy,
  ScopeSupplierSpecificWasteGeneratedInOperationsEmissionSourceData,
  WasteWasteTypeSpecificWasteGeneratedInOperationsEmissionSourceData,
  WasteAverageDataWasteGeneratedInOperationsEmissionSourceData,
  WasteTypeSpecificWasteGeneratedInOperationsEmissionSourceDataSolid_or_water,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-waste-generated-in-operations-form',
  templateUrl: './waste-generated-in-operations-form.component.html',
  styleUrls: ['./waste-generated-in-operations-form.component.css'],
})
export class WasteGeneratedInOperationsFormComponent
  extends EmissionCreateBaseComponent
  implements OnInit
{
  waste_generated_in_operations: WasteGeneratedInOperationsActivityDataDto =
    new WasteGeneratedInOperationsActivityDataDto();
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

  public methods_waste_generated_in_operations: {
    name: string;
    id: number;
    value: string;
  }[] = [];
  public solid_water_waste_generated_in_operations: {
    name: string;
    id: number;
    value: string;
  }[] = [];
  public treatment_method_waste_generated_in_operations: {
    name: string;
    id: number;
    code: string;
  }[] = [];
  public waste_type_waste_generated_in_operations: {
    name: string;
    id: number;
    wasteId: number;
    code: string;
  }[] = [];
  public disposal_type_waste_generated_in_operations: {
    name: string;
    id: number;
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
    protected wasteGeneratedInOperationsActivityDataControllerServiceProxy: WasteGeneratedInOperationsActivityDataControllerServiceProxy
  ) {
    super(
      appService,
      serviceProxy,
      projectUnitEmissionSourceControllerServiceProxy,
      messageService
    );
  }
  public get wasteGeneratedInOperationsActivityDataDtoMethod(): typeof WasteGeneratedInOperationsActivityDataDtoMethod {
    return WasteGeneratedInOperationsActivityDataDtoMethod;
  }
  public get wasteTypeSpecificWasteGeneratedInOperationsEmissionSourceDataSolid_or_water(): typeof WasteTypeSpecificWasteGeneratedInOperationsEmissionSourceDataSolid_or_water {
    return WasteTypeSpecificWasteGeneratedInOperationsEmissionSourceDataSolid_or_water;
  }
  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    this.units = this.masterDataService.waste_generated_in_operations_units;

    this.types = this.masterDataService.net_zero_employee_commuting_types;
    this.ownerships = this.masterDataService.ownership_freightTransport;
    this.methods_waste_generated_in_operations =
      this.masterDataService.methods_waste_generated_in_operations;
    this.solid_water_waste_generated_in_operations =
      this.masterDataService.solid_water_waste_generated_in_operations;

    this.treatment_method_waste_generated_in_operations =
      this.masterDataService.treatment_method_waste_generated_in_operations;
    this.waste_type_waste_generated_in_operations =
      this.masterDataService.waste_type_waste_generated_in_operations;
    this.disposal_type_waste_generated_in_operations =
      this.masterDataService.disposal_type_waste_generated_in_operations;
    this.setAction();
    await this.setInitialState();
    await this.setUnit();

    console.log(
      'this.waste_generated_in_operations',
      this.waste_generated_in_operations
    );
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
      this.waste_generated_in_operations.user = this.creator;
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
        if (
          this.waste_generated_in_operations.unit &&
          this.waste_generated_in_operations.unit.id
        ) {
          this.selectedUnit = this.waste_generated_in_operations.unit;
        }
      }
    }
    this.waste_generated_in_operations.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.waste_generated_in_operations.mobile = false;
      this.waste_generated_in_operations.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(
      this.waste_generated_in_operations.project,
      PuesDataReqDtoSourceName.Net_zero_employee_commuting,
      this.selectedUnit
    );
  }

  isMobileChange() {
    this.waste_generated_in_operations.mobile = this.isMobile;
    this.waste_generated_in_operations.stationary = !this.isMobile;
  }

  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Net_zero_employee_commuting.toString(),
      this.selectedProject.id,
      this.selectedUnit.id,
      this.waste_generated_in_operations.year.toString(),
      this.month.value,
      this.waste_generated_in_operations
    );
    let e = this.waste_generated_in_operations.project;
    if (this.month && this.month.value === 12 && e) {
      this.waste_generated_in_operations.year = this.appService.getYear(
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
    this.waste_generated_in_operations.project = e;
    this.waste_generated_in_operations.year = this.appService.getYear(
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
          this.wasteGeneratedInOperationsActivityDataControllerServiceProxy
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
        await this.wasteGeneratedInOperationsActivityDataControllerServiceProxy
          .getOneWasteGeneratedInOperationsDataSet(this.groupNumber)
          .toPromise();

      this.waste_generated_in_operations = res;
      // if(this.waste_generated_in_operations.method==WasteGeneratedInOperationsActivityDataDtoMethod.DistanceBase){
      //   await this.getCountries();
      // }
      if(!this.isView){
        this.addMissingMethodEmptyObject();
      }
      console.log('project', res);
      let project = await this.getProject(
        this.waste_generated_in_operations.project.id
      );
      if (project) {
        this.waste_generated_in_operations.project = project;
        this.isMobile = this.waste_generated_in_operations.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(
        (m) => m.value === this.waste_generated_in_operations.month
      );
      // this.fuelType = this.fuel.find(f=>f.code===this.waste_generated_in_operations.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.waste_generated_in_operations.fc_unit);
    } else {
      this.setCreator();
    }
  }

  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;

    if (
      genForm.valid &&
      this.waste_generated_in_operations.project.id &&
      (
       ( this.waste_generated_in_operations
        .supplier_specific_emission_source_data&&this.waste_generated_in_operations
        .supplier_specific_emission_source_data.scope_data&&this.waste_generated_in_operations
          .supplier_specific_emission_source_data.scope_data.length > 0) ||
       ( this.waste_generated_in_operations
        .waste_type_specific_emission_source_data&&this.waste_generated_in_operations
        .waste_type_specific_emission_source_data.waste_data&&this.waste_generated_in_operations
          .waste_type_specific_emission_source_data.waste_data.length > 0) ||
       ( this.waste_generated_in_operations.average_data_emission_source_data&&this.waste_generated_in_operations.average_data_emission_source_data.waste_data&&this.waste_generated_in_operations.average_data_emission_source_data
          .waste_data.length > 0)
      )
    ) {
      this.waste_generated_in_operations.month = this.month.value;
      // this.generator.fuelType = this.fuelType.code
      // this.waste_generated_in_operations.fc_unit = this.unit.code

      console.log('ssss', this.waste_generated_in_operations);

      if (this.isNewEntry) {
        this.wasteGeneratedInOperationsActivityDataControllerServiceProxy
          .createOne(this.waste_generated_in_operations)
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
        this.wasteGeneratedInOperationsActivityDataControllerServiceProxy
          .createOne(this.waste_generated_in_operations)
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
    // this.waste_generated_in_operations
    this.waste_generated_in_operations.supplier_specific_emission_source_data.scope_data =
      [];
    this.waste_generated_in_operations.waste_type_specific_emission_source_data.waste_data =
      [];
    this.waste_generated_in_operations.average_data_emission_source_data.waste_data =
      [];

    if (
      selected.value ==
      WasteGeneratedInOperationsActivityDataDtoMethod.SupplierSpecific
    ) {
      this.waste_generated_in_operations.supplier_specific_emission_source_data.scope_data.push(
        new ScopeSupplierSpecificWasteGeneratedInOperationsEmissionSourceData( )
      );
    } else if (
      selected.value ==
      WasteGeneratedInOperationsActivityDataDtoMethod.WasteTypeSpecific
    ) {
      this.waste_generated_in_operations.waste_type_specific_emission_source_data.waste_data.push(
        new WasteWasteTypeSpecificWasteGeneratedInOperationsEmissionSourceData( )
      );
    } else {
      this.waste_generated_in_operations.average_data_emission_source_data.waste_data.push(
        new WasteAverageDataWasteGeneratedInOperationsEmissionSourceData( )
      );
    }
  }

  addMissingMethodEmptyObject(){
    
    if(this.waste_generated_in_operations.method== WasteGeneratedInOperationsActivityDataDtoMethod.SupplierSpecific){
      if(! this.waste_generated_in_operations.supplier_specific_emission_source_data.scope_data){
        this.waste_generated_in_operations.supplier_specific_emission_source_data.scope_data=[]
        this.waste_generated_in_operations.supplier_specific_emission_source_data.scope_data.push(
          new ScopeSupplierSpecificWasteGeneratedInOperationsEmissionSourceData( )
        );
      }
    
    }else if(this.waste_generated_in_operations.method== WasteGeneratedInOperationsActivityDataDtoMethod.WasteTypeSpecific){
      if( !this.waste_generated_in_operations.waste_type_specific_emission_source_data.waste_data){
        this.waste_generated_in_operations.waste_type_specific_emission_source_data.waste_data=[]
        this.waste_generated_in_operations.waste_type_specific_emission_source_data.waste_data.push(
          new WasteWasteTypeSpecificWasteGeneratedInOperationsEmissionSourceData( )
        );
      }

    }else{
      if( !this.waste_generated_in_operations.average_data_emission_source_data.waste_data){
        this.waste_generated_in_operations.average_data_emission_source_data.waste_data=[]
        this.waste_generated_in_operations.average_data_emission_source_data.waste_data.push(
          new WasteAverageDataWasteGeneratedInOperationsEmissionSourceData( )
        );
      }

    }
  
  }
  addNewDataObject(arryName: string) {
    if (arryName == 'scope') {
      this.waste_generated_in_operations.supplier_specific_emission_source_data.scope_data.push(
        new ScopeSupplierSpecificWasteGeneratedInOperationsEmissionSourceData( )
      );
    } else if (arryName == 'waste') {
      this.waste_generated_in_operations.waste_type_specific_emission_source_data.waste_data.push(
        new WasteWasteTypeSpecificWasteGeneratedInOperationsEmissionSourceData( )
      );
    } else if (arryName == 'average') {
      this.waste_generated_in_operations.average_data_emission_source_data.waste_data.push(
        new WasteAverageDataWasteGeneratedInOperationsEmissionSourceData( )
      );
    }
  }

  onSelect(selected: any) {
    const des = this.disposal_type_waste_generated_in_operations.find(
      (a) => a.name == selected.value
    );
    if (des)
      this.waste_type_waste_generated_in_operations =
        this.masterDataService.waste_type_waste_generated_in_operations.filter(
          (e) => e.wasteId == des.id
        );
    console.log(
      'disposalWasteTypes',
      this.waste_type_waste_generated_in_operations
    );
    console.log('selected', selected, des);
  }
  onSelectWasteCatocgary(selected: any) {
    console.log('selected', selected);
    if (
      selected.value ==
      WasteTypeSpecificWasteGeneratedInOperationsEmissionSourceDataSolid_or_water.Solid
    ) {
      this.units.wasteProduced = [{ label: 'Mt', code: 'T' }];
    } else {
      this.units.wasteProduced = [{ label: 'm³', code: 'M3' }];
    }
  }

  onBackClick() {
    this.router.navigate(['app/emission/waste-generated-in-operations-list']);
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
    this.wasteGeneratedInOperationsActivityDataControllerServiceProxy
      .deleteWholeGroup(this.waste_generated_in_operations.groupNo)
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
