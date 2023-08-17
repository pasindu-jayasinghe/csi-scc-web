import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import {
  DownstreamLeasedAssetsActivityDataDto,
  User,
  Unit,
  PuesDataDto,
  Project,
  Country,
  ProjectUnitEmissionSourceControllerServiceProxy,
  DownstreamLeasedAssetsActivityDataControllerServiceProxy,
  DownstreamLeasedAssetsActivityDataDtoMethod,
  PuesDataReqDtoSourceName,
  ServiceProxy,
  FuelBaseAssetSpecificDownstreamLeasedAssetsEmissionSourceData,
  LessorDataLessorSpecificDownstreamLeasedAssetsEmissionSourceData,
  RefrigerantAssetSpecificDownstreamLeasedAssetsEmissionSourceData,
  LeasedDataLeasedBuildingsDownstreamLeasedAssetsEmissionSourceData,
  LeasedAssetsDownstreamLeasedAssetsEmissionSourceData,
  LeasedDataLeasedAssetsDownstreamLeasedAssetsEmissionSourceData,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-downstream-leased-assets-form',
  templateUrl: './downstream-leased-assets-form.component.html',
  styleUrls: ['./downstream-leased-assets-form.component.css'],
})
export class DownstreamLeasedAssetsFormComponent
  extends EmissionCreateBaseComponent
  implements OnInit
{
  downstream_leased_assets: DownstreamLeasedAssetsActivityDataDto =
    new DownstreamLeasedAssetsActivityDataDto();
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
  public fuel_types: any;;
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

  refTypes:any;
  building_types:any
 

  public methods_downstream_leased_assets: {
    name: string;
    id: number;
    value: string;
  }[] = [];
  public treatment_method_downstream_leased_assets: {
    name: string;
    id: number;
    code: string;
  }[] = [];
  public waste_type_downstream_leased_assets: {
    name: string;
    id: number;
    wasteId: number;
    code: string;
  }[] = [];
  public disposal_type_downstream_leased_assets: {
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
    protected downstreamLeasedAssetsActivityDataControllerServiceProxy: DownstreamLeasedAssetsActivityDataControllerServiceProxy
  ) {
    super(
      appService,
      serviceProxy,
      projectUnitEmissionSourceControllerServiceProxy,
      messageService
    );
  }
  public get downstreamLeasedAssetsActivityDataDtoMethod(): typeof DownstreamLeasedAssetsActivityDataDtoMethod {
    return DownstreamLeasedAssetsActivityDataDtoMethod;
  }
  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.fuel_types = this.masterDataService.fuel;
    this.units = this.masterDataService.upstream_lead_asset_units;
    this.ownerships = this.masterDataService.ownership_freightTransport;
    this. methods_downstream_leased_assets =this.masterDataService.methods_downstream_leased_assets;
    this. building_types =this.masterDataService.building_types;
    this.refTypes = this.masterDataService.gWP_RGs;
    // this.methods_downstream_leased_assets =
    //   this.masterDataService.methods_downstream_leased_assets;
    // this.treatment_method_downstream_leased_assets =
    //   this.masterDataService.treatment_method_downstream_leased_assets;
    // this.waste_type_downstream_leased_assets =
    //   this.masterDataService.waste_type_downstream_leased_assets;
    // this.disposal_type_downstream_leased_assets =
    //   this.masterDataService.disposal_type_downstream_leased_assets;
    this.setAction();
    await this.setInitialState();
    await this.setUnit();

    console.log(
      'this.downstream_leased_assets',
      this.downstream_leased_assets
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
      this.downstream_leased_assets.user = this.creator;
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
          this.downstream_leased_assets.unit &&
          this.downstream_leased_assets.unit.id
        ) {
          this.selectedUnit = this.downstream_leased_assets.unit;
        }
      }
    }
    this.downstream_leased_assets.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.downstream_leased_assets.mobile = false;
      this.downstream_leased_assets.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(
      this.downstream_leased_assets.project,
      PuesDataReqDtoSourceName.Net_zero_employee_commuting,
      this.selectedUnit
    );
  }

  isMobileChange() {
    this.downstream_leased_assets.mobile = this.isMobile;
    this.downstream_leased_assets.stationary = !this.isMobile;
  }

  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Net_zero_employee_commuting.toString(),
      this.selectedProject.id,
      this.selectedUnit.id,
      this.downstream_leased_assets.year.toString(),
      this.month.value,
      this.downstream_leased_assets
    );
    let e = this.downstream_leased_assets.project;
    if (this.month && this.month.value === 12 && e) {
      this.downstream_leased_assets.year = this.appService.getYear(
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
    this.downstream_leased_assets.project = e;
    this.downstream_leased_assets.year = this.appService.getYear(
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
          this.downstreamLeasedAssetsActivityDataControllerServiceProxy
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
        await this.downstreamLeasedAssetsActivityDataControllerServiceProxy
          .getOneDownstreamLeasedAssetsDataSet(this.groupNumber)
          .toPromise();

      this.downstream_leased_assets = res;
      // if(this.downstream_leased_assets.method==DownstreamLeasedAssetsActivityDataDtoMethod.DistanceBase){
      //   await this.getCountries();
      // }
      if(!this.isView){
        this.addMissingMethodEmptyObject();
        console.log('project1', this.downstream_leased_assets);
       
      }
      console.log('project', res);
      let project = await this.getProject(
        this.downstream_leased_assets.project.id
      );
      if (project) {
        this.downstream_leased_assets.project = project;
        this.isMobile = this.downstream_leased_assets.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(
        (m) => m.value === this.downstream_leased_assets.month
      );
      // this.fuelType = this.fuel.find(f=>f.code===this.downstream_leased_assets.fuelType);
      // this.unit = this.units.consumption.find((u: { code: string; })=>u.code===this.downstream_leased_assets.fc_unit);
    } else {
      this.setCreator();
    }
  }

  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating = true;

    if (genForm.valid && this.downstream_leased_assets.project.id&&(
    ( this.downstream_leased_assets.asset_specific_method_data&&((this.downstream_leased_assets.asset_specific_method_data.fuel_data&&this.downstream_leased_assets.asset_specific_method_data.fuel_data.length>0) ||
   ( this.downstream_leased_assets.asset_specific_method_data.refrigerant_data&&this.downstream_leased_assets.asset_specific_method_data.refrigerant_data.length>0)) )||
    (this.downstream_leased_assets.lessor_specific_method_data&&this.downstream_leased_assets.lessor_specific_method_data.lessor_data.length>0) ||
    (this.downstream_leased_assets.leased_buildings_method_data&&this.downstream_leased_assets.leased_buildings_method_data.leased_data.length>0) ||
    (this.downstream_leased_assets.leased_assets_method_data&&this.downstream_leased_assets.leased_assets_method_data.leased_data.length>0)

    )) {
      this.downstream_leased_assets.month = this.month.value;
      // this.generator.fuelType = this.fuelType.code
      // this.downstream_leased_assets.fc_unit = this.unit.code

      console.log('ssss', this.downstream_leased_assets);

      if (this.isNewEntry) {
        this.downstreamLeasedAssetsActivityDataControllerServiceProxy
          .createOne(this.downstream_leased_assets)
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
        this.downstreamLeasedAssetsActivityDataControllerServiceProxy
          .createOne(this.downstream_leased_assets)
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
    // this.downstream_leased_assets
    this.downstream_leased_assets.asset_specific_method_data.fuel_data =
      [];
    this.downstream_leased_assets.asset_specific_method_data.refrigerant_data =
      [];
    this.downstream_leased_assets.lessor_specific_method_data.lessor_data =
      [];
    this.downstream_leased_assets.leased_buildings_method_data.leased_data =
      [];
    this.downstream_leased_assets.leased_assets_method_data.leased_data =
      [];

    if (
      selected.value ==
      DownstreamLeasedAssetsActivityDataDtoMethod.Asset_specific_method_data
    ) {
      console.log(selected.value);
      this.downstream_leased_assets.asset_specific_method_data.fuel_data.push(
        new FuelBaseAssetSpecificDownstreamLeasedAssetsEmissionSourceData( )
      );
      this.downstream_leased_assets.asset_specific_method_data.refrigerant_data.push(
        new RefrigerantAssetSpecificDownstreamLeasedAssetsEmissionSourceData( )
      );
    } else if (
      selected.value ==
      DownstreamLeasedAssetsActivityDataDtoMethod.Lessor_specific_method_data
    ) {
      this.downstream_leased_assets.lessor_specific_method_data.lessor_data.push(
        new LessorDataLessorSpecificDownstreamLeasedAssetsEmissionSourceData( )
      );
    } else if (
      selected.value ==
      DownstreamLeasedAssetsActivityDataDtoMethod.Leased_buildings_method_data
    ) {
      this.downstream_leased_assets.leased_buildings_method_data.leased_data.push(
        new LeasedDataLeasedBuildingsDownstreamLeasedAssetsEmissionSourceData( )
      );
    } else {
      this.downstream_leased_assets.leased_assets_method_data.leased_data.push(
        new LeasedDataLeasedAssetsDownstreamLeasedAssetsEmissionSourceData( )
      );
    }
  }


  addMissingMethodEmptyObject(){
   
    if(this.downstream_leased_assets.method== DownstreamLeasedAssetsActivityDataDtoMethod.Asset_specific_method_data){
     if(!this.downstream_leased_assets.asset_specific_method_data.fuel_data){
      this.downstream_leased_assets.asset_specific_method_data.fuel_data=[]
      this.downstream_leased_assets.asset_specific_method_data.fuel_data.push(
        new FuelBaseAssetSpecificDownstreamLeasedAssetsEmissionSourceData( )
      );
     }
   
     if(!this.downstream_leased_assets.asset_specific_method_data.refrigerant_data){
      this.downstream_leased_assets.asset_specific_method_data.refrigerant_data=[]
      this.downstream_leased_assets.asset_specific_method_data.refrigerant_data.push(
        new RefrigerantAssetSpecificDownstreamLeasedAssetsEmissionSourceData( )
      );
     }
    }else if(this.downstream_leased_assets.method==DownstreamLeasedAssetsActivityDataDtoMethod.Lessor_specific_method_data){
  
      if(!this.downstream_leased_assets.lessor_specific_method_data.lessor_data){
        this.downstream_leased_assets.lessor_specific_method_data.lessor_data=[]
        this.downstream_leased_assets.lessor_specific_method_data.lessor_data.push(
          new LessorDataLessorSpecificDownstreamLeasedAssetsEmissionSourceData( )
        );
      }
     
  
    }
    else if(this.downstream_leased_assets.method==DownstreamLeasedAssetsActivityDataDtoMethod.Leased_buildings_method_data){
  
      if(!this.downstream_leased_assets.leased_buildings_method_data.leased_data){
        this.downstream_leased_assets.leased_buildings_method_data.leased_data=[]
        this.downstream_leased_assets.leased_buildings_method_data.leased_data.push(
          new LeasedDataLeasedBuildingsDownstreamLeasedAssetsEmissionSourceData( )
        );
      }
     
  
    }else{
      if(!this.downstream_leased_assets.leased_assets_method_data.leased_data){
        this.downstream_leased_assets.leased_assets_method_data.leased_data=[]
        this.downstream_leased_assets.leased_assets_method_data.leased_data.push(
          new LeasedDataLeasedAssetsDownstreamLeasedAssetsEmissionSourceData( )
        );
      }
  
    }
  }
  addNewDataObject(arryName: string) {
    if (arryName == 'fuel') {
      this.downstream_leased_assets.asset_specific_method_data.fuel_data.push(
        new FuelBaseAssetSpecificDownstreamLeasedAssetsEmissionSourceData( )
      );
    } else if (arryName == 'ref') {
      this.downstream_leased_assets.asset_specific_method_data.refrigerant_data.push(
        new RefrigerantAssetSpecificDownstreamLeasedAssetsEmissionSourceData( )
      );
    } else if (arryName == 'lessor') {
      this.downstream_leased_assets.lessor_specific_method_data.lessor_data.push(
        new LessorDataLessorSpecificDownstreamLeasedAssetsEmissionSourceData( )
      );
    } else if (arryName == 'build') {
      this.downstream_leased_assets.leased_buildings_method_data.leased_data.push(
        new LeasedDataLeasedBuildingsDownstreamLeasedAssetsEmissionSourceData( )
      );
    } else {
      this.downstream_leased_assets.leased_assets_method_data.leased_data.push(
        new LeasedDataLeasedAssetsDownstreamLeasedAssetsEmissionSourceData( )
      );
    }
  }

  // onSelect(selected: any) {
  //   const des = this.disposal_type_downstream_leased_assets.find(
  //     (a) => a.name == selected.value
  //   );
  //   if (des)
  //     this.waste_type_downstream_leased_assets =
  //       this.masterDataService.waste_type_downstream_leased_assets.filter(
  //         (e) => e.wasteId == des.id
  //       );
  //   console.log(
  //     'disposalWasteTypes',
  //     this.waste_type_downstream_leased_assets
  //   );
  //   console.log('selected', selected, des);
  // }

  onBackClick() {
    this.router.navigate(['app/emission/downstream-leased-assets-list']);
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
    this.downstreamLeasedAssetsActivityDataControllerServiceProxy
      .deleteWholeGroup(this.downstream_leased_assets.groupNo)
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
