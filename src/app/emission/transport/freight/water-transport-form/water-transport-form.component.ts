import { Component, OnInit } from '@angular/core';
import { FreightWaterActivityData, Project, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User, Country, SeaPort, SeaPortsDisControllerServiceProxy, ProjectUnitEmissionSourceControllerServiceProxy } from "../../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService } from "../../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { IndexCode } from '../../transport-list/transport-list.component';

@Component({
  selector: 'app-water-transport-form',
  templateUrl: './water-transport-form.component.html',
  styleUrls: ['./water-transport-form.component.css']
})
export class WaterTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  countries: Country[];

  seaPorts: SeaPort[];
  pcodesOne: string[] = [];
  pcodesTwo: string[] = [];

  pcodesOneFull: string[] = [];
  pcodesTwoFull: string[] = [];

  depSeaPorts_1: SeaPort[];
  desSeaPorts_1: SeaPort[];
  depSeaPorts_2: SeaPort[];
  desSeaPorts_2: SeaPort[];

  fwTypes: any
  fwSizes: any

  freightWater: FreightWaterActivityData = new FreightWaterActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships: { id: number, name: string }[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  isTransist_twoWay_2: boolean = false;
  isTransist_twoWay_3: boolean = false;
  isTransist_oneWay_2: boolean = false;
  isTransist_oneWay_3: boolean = false;

  public projects: Project[] = [];
  public months: { name: string, value: number }[] = []
  public methods_freightTransport: { name: string, id: number }[] = []
  public freightModes: { name: string, id: number }[] = []
  public ownership_freightTransport: { name: string, id: number }[] = []
  public departureCountry_freightTransport: { name: string, id: number }[] = []
  public destinationCountry_freightTransport: { name: string, id: number }[] = []
  public transient_freightTransport: { name: string, id: number }[] = []
  public domesticInternationals: { name: string, id: number, code: string }[] = []
  public unit: any
  public freightTypes_freightTransport: { name: string, id: number }[] = []
  public departurePort_freightTransport: { name: string, id: number }[] = []
  public destinationPort_freightTransport: { name: string, id: number }[] = []
  public fuelType1: { name: string, id: number, code: string }[] = []
  public fuelTypeFreightWater: { name: string, id: number }[] = []
  public activity_freightTransport: { name: string, id: number }[] = []
  public size_freightTransport: { name: string, id: number }[] = []
  public type_water_freightTransport: { name: string, id: number }[] = []
  public options_freightTransport: { name: string, id: number }[] = []
  public cargoTypes: { code: string, name: string, id: number }[] = []

  public units: any = {};
  public fuel: any = {};
  public fuel_unit: any = {};
  public distance: any = {};
  public onSelectUnitId: any = {};
  public onSelectUpDistanceUnitId: any = 2
  public onSelectDownDistanceUnitId: any = 2
  public upDistance_unit: any = {};
  public downDistance_unit: any = {};
  public upWeight_unit: any = {};
  public downWeight_unit: any = {};

  cargoType: any;
  month: any;
  method: any;
  freightType: any;
  freightMode: any;
  ownership: any;

  domesticInternational: any = {};
  activity: any = {};
  activities: any



  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;
  checked: any

  constructor(
    protected serviceProxy: ServiceProxy,
    private getSeaDis: SeaPortsDisControllerServiceProxy,

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
    this.freightModes = this.masterDataService.freightModes;
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.departureCountry_freightTransport = this.masterDataService.depatureCountry_freightTransport;
    this.destinationCountry_freightTransport = this.masterDataService.destinationCountry_freightTransport;
    this.transient_freightTransport = this.masterDataService.transient_freightTransport;
    this.methods_freightTransport = this.masterDataService.methods_freightTransport;
    this.destinationPort_freightTransport = this.masterDataService.destinationPort_freightTransport;
    this.departurePort_freightTransport = this.masterDataService.departurePort_freightTransport;
    this.activities = this.masterDataService.activities;

    this.fuelTypeFreightWater = this.masterDataService.fuelTypeFreightWater;
    this.activity_freightTransport = this.masterDataService.activities;
    this.size_freightTransport = this.masterDataService.size_freightTransport;
    this.type_water_freightTransport = this.masterDataService.type_water_freightTransport;

    this.options_freightTransport = this.masterDataService.options_freightTransport;
    this.units = this.masterDataService.water_freight_units
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.cargoTypes = this.masterDataService.cargoType_road_freightTransport;

    //this.onSelect(this.selectedSource.id);

    await this.getCountries();
    await this.getSeeports();

    this.setAction();
    await this.setInitialState();
    await this.setUnit();

    this.isAnyAdmin = this.appService.isAnyAdmin();
    this.isProjectSelected = true;

    await super.ngOnInit();
  }


  async setInitialState() {
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseFreightWaterActivityDataControllerFreightWaterActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.freightWater = res;

      let project = await this.getProject(this.freightWater.project.id);
      if (project) {
        this.freightWater.project = project;
        this.isMobile = this.freightWater.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.freightWater.month);

      this.ownership = this.ownership_freightTransport.find(o => o.name === this.freightWater.ownership);

      this.method = this.methods_freightTransport.find(m => m.name === this.freightWater.method);
      this.domesticInternational = this.domesticInternationals.find(o => o.code === this.freightWater.domOrInt)
      this.cargoType = this.cargoTypes.find(c => c.code === this.freightWater.cargoType)


      let dOne_1 = this.desSeaPorts_1.find(d => d.id === this.freightWater.destinationPortOneWay.id)
      if(dOne_1){
        this.freightWater.destinationPortOneWay=dOne_1;
      }

      let dpOne_1 = this.depSeaPorts_1.find(d => d.id === this.freightWater.departurePortOneWay.id)
      if(dpOne_1){
        this.freightWater.departurePortOneWay=dpOne_1;
      }

      let dTwo_2 = this.desSeaPorts_2.find(d => d.id === this.freightWater.destinationPortTwoWay.id)
      if(dTwo_2){
        this.freightWater.destinationPortTwoWay=dTwo_2;
      }

      let dpTwo_2 = this.depSeaPorts_2.find(d => d.id === this.freightWater.departurePortTwoWay.id)
      if(dpTwo_2){
        this.freightWater.departurePortTwoWay=dpTwo_2;
      }


      let tOne1 = this.depSeaPorts_2.find(d => d.id === this.freightWater.transist_oneWay_1.id)
      if(tOne1){
        this.freightWater.transist_oneWay_1=tOne1;
      }
      let tOne2 = this.depSeaPorts_2.find(d => d.id === this.freightWater.transist_oneWay_2.id)
      if(tOne2){
        this.freightWater.transist_oneWay_2=tOne2;
      }
      let tOne3 = this.depSeaPorts_2.find(d => d.id === this.freightWater.transist_oneWay_3.id)
      if(tOne3){
        this.freightWater.transist_oneWay_3=tOne3;
      }

      let tTwo1 = this.depSeaPorts_2.find(d => d.id === this.freightWater.transist_twoWay_1.id)
      if(tTwo1){
        this.freightWater.transist_twoWay_1=tTwo1;
      }
      let tTwo2 = this.depSeaPorts_2.find(d => d.id === this.freightWater.transist_twoWay_2.id)
      if(tTwo2){
        this.freightWater.transist_twoWay_2=tTwo2;
      }
      let tTwo3 = this.depSeaPorts_2.find(d => d.id === this.freightWater.transist_twoWay_3.id)
      if(tTwo3){
        this.freightWater.transist_twoWay_3=tTwo3;
      }

      this.fwTypes = await this.masterDataService.getfwTypes(this.freightWater.activity).toPromise()
      let type = this.fwTypes?.find((o: any) => o.code === this.freightWater.type)
      if (type){
        this.freightWater.type = type.code
      }

      this.fwSizes = await this.masterDataService.getfwSizes(this.freightWater.type).toPromise()
      let size = this.fwSizes.find((o: any) => o.code === this.freightWater.size)
      if (size) {
        this.freightWater.size =size.code
      }

    } else {
      this.setCreator();
    }

  }

  async getSeeports() {
    this.serviceProxy.getManyBaseSeaPortControllerSeaPort(
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
    ).subscribe((res: any) => {
      this.seaPorts = res.data
      this.seaPorts.sort((a, b) => a.name.localeCompare(b.name));
      // // console.log(this.seaPorts.filter(s => s.country.id === 1));
      this.desSeaPorts_2 = this.seaPorts;
      this.desSeaPorts_1 = this.seaPorts;
      this.depSeaPorts_2 = this.seaPorts;
      this.depSeaPorts_1 = this.seaPorts;
    })
  }

  async getCountries() {
    const res = await this.serviceProxy.getManyBaseCountryControllerCountry(
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
    ).subscribe((res: any) => {
      this.countries = res.data
      this.countries.sort((a, b) => a.name.localeCompare(b.name));

    })
  }


  async onChangeClearOne() {
    this.pcodesOne = []
    this.pcodesOneFull = [];
    this.freightWater.upDistance = 0;
    this.freightWater.upWeight = 0;

        //@ts-ignore
    this.freightWater.transist_oneWay_1 = null
    //@ts-ignore
    this.freightWater.transist_oneWay_2 = null
    //@ts-ignore
    this.freightWater.transist_oneWay_3 = null

    //@ts-ignore
    this.freightWater.destinationPortOneWay = null
    //@ts-ignore
    this.freightWater.destinationCountryOneWay = null
    //@ts-ignore
    this.freightWater.departurePortOneWay = null
    //@ts-ignore
    this.freightWater.departureCountryOneWay = null

  }

  async onChangeClearTwo() {
    this.pcodesTwo = [];
    this.pcodesTwoFull = [];
    this.freightWater.downDistance = 0;
    this.freightWater.downWeight = 0;

        //@ts-ignore
    this.freightWater.transist_twoWay_1 = null
    //@ts-ignore
    this.freightWater.transist_twoWay_2 = null
    //@ts-ignore
    this.freightWater.transist_twoWay_3 = null

    //@ts-ignore
    this.freightWater.destinationPortTwoWay = null
    //@ts-ignore
    this.freightWater.destinationCountryTwoWay = null
    //@ts-ignore
    this.freightWater.departurePortTwoWay = null
    //@ts-ignore
    this.freightWater.departureCountryTwoWay = null
  }





  async onChangePushOne() {

    this.pcodesOne = [
      this.freightWater.destinationPortOneWay?.code,
      this.freightWater.transist_oneWay_1?.code,
      this.freightWater.transist_oneWay_2?.code,
      this.freightWater.transist_oneWay_3?.code,
      this.freightWater.departurePortOneWay?.code
    ]

    console.log(this.pcodesOne);

    this.pcodesOneFull = [];
    for (var pcode of this.pcodesOne) {
      if (pcode !== undefined && Object.keys(pcode).length !== 0 && pcode !== null) {
        this.pcodesOneFull.push(pcode)
      }
    }

    this.getSeaDis.getDisBySeaportcodes(this.pcodesOneFull).subscribe((res: any) => {
      this.freightWater.upDistance = res
    },

      (error: any) => {
        console.log("ss",error)
        const coutomErrorMsg = error.message.substring(22, 37) + " Not Available";
        this.freightWater.upDistance = 0;
        this.messageService.add({
          severity: 'info',
          summary: 'Distance Not Available',
          detail: coutomErrorMsg,
          closable: false,
        });
        // console.log('Error', error.message.substring(22, 34));
      },)


  }


  async onChangePushTwo() {

    this.pcodesTwo = [
      this.freightWater.departurePortTwoWay?.code,
      this.freightWater.transist_twoWay_1?.code,
      this.freightWater.transist_twoWay_2?.code,
      this.freightWater.transist_twoWay_3?.code,
      this.freightWater.departurePortTwoWay?.code
    ]
    this.pcodesTwoFull = [];
    for (var pcode of this.pcodesTwo) {
      if (pcode != undefined) { this.pcodesTwoFull.push(pcode) }
    }

    this.getSeaDis.getDisBySeaportcodes(this.pcodesTwoFull).subscribe((res: any) => {
      this.freightWater.downDistance = res
    },

      (error: any) => {
        const coutomErrorMsg = error.message.substring(22, 34) + "Not Available";
        this.freightWater.downDistance = 0;
        this.messageService.add({
          severity: 'info',
          summary: 'Distance Not Available',
          detail: coutomErrorMsg,
          closable: false,
        });
        // console.log('Error', error.message.substring(22, 34));
      },)


  }


  async onChangeDepCountryOne(country: any) {
    let countryId = country.id;
    // console.log("cid", countryId)

    const res = await this.serviceProxy.getManyBaseSeaPortControllerSeaPort(
      undefined,
      undefined,
      ['country.id||$eq||' + countryId],
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();
    this.depSeaPorts_1 = res.data
    this.depSeaPorts_1.sort((a, b) => a.name.localeCompare(b.name));





  }

  async onChangeDesCountryOne(country: any) {
    let countryId = country.id;
    // console.log("cid", country)

    const res = await this.serviceProxy.getManyBaseSeaPortControllerSeaPort(
      undefined,
      undefined,
      ['country.id||$eq||' + countryId],
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();
    this.desSeaPorts_1 = res.data
    this.desSeaPorts_1.sort((a, b) => a.name.localeCompare(b.name));


  }


  async onChangeDepCountryTwo(country: any) {
    let countryId = country.id;
    // console.log("cid", countryId)

    const res = await this.serviceProxy.getManyBaseSeaPortControllerSeaPort(
      undefined,
      undefined,
      ['country.id||$eq||' + countryId],
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();
    this.depSeaPorts_2 = res.data
    this.depSeaPorts_2.sort((a, b) => a.name.localeCompare(b.name));


  }

  async onChangeDesCountryTwo(country: any) {
    let countryId = country.id;
    // console.log("cid", countryId)

    const res = await this.serviceProxy.getManyBaseSeaPortControllerSeaPort(
      undefined,
      undefined,
      ['country.id||$eq||' + countryId],
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();
    this.desSeaPorts_2 = res.data
    this.desSeaPorts_2.sort((a, b) => a.name.localeCompare(b.name));


  }

  onSelectMethod(selected: any) {
    this.method = this.methods_freightTransport
      .find(m =>
        m.id === selected.value.id);
    // console.log("Freight method", this.method.id)
    // console.log("selected", selected)
  }

  onSelectUnit(selected: any) {

    if (selected.value.code === "LKR") {
      this.onSelectUnitId = 1
    } else {
      this.onSelectUnitId = 2
    }

    // console.log("selected", selected.value.label)
  }

  onSelectUpDistanceUnit(selected: any) {

    if (selected.value.code === "LKR") {
      this.onSelectUpDistanceUnitId = 1
    } else {
      this.onSelectUpDistanceUnitId = 2
    }
    // console.log("selected", selected.value.label)
  }

  onSelectDownDistanceUnit(selected: any) {

    if (selected.value.code === "LKR") {
      this.onSelectDownDistanceUnitId = 1
    } else {
      this.onSelectDownDistanceUnitId = 2
    }
    // console.log("selected", selected.value.label)
  }

  onClickTransist_twoWay_1() {

    this.isTransist_twoWay_2 = true;

  }

  onClickTransist_twoWay_2() {

    this.isTransist_twoWay_3 = true;
  }

  onClickTransist_oneWay_1() {

    this.isTransist_oneWay_2 = true;

  }

  onClickTransist_oneWay_2() {

    this.isTransist_oneWay_3 = true;
  }

  setAction() {
    this.route.url.subscribe(r => {
      if (r[0].path.includes("view")) {
        this.isView = true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editEntryId = parseInt(id);
      this.isNewEntry = false;
    }
  }

  async setCreator() {
    let u = await this.appService.getUser();
    if (u) {
      this.creator = u;
      this.freightWater.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Freight_water)
  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.freightWater.unit && this.freightWater.unit.id) {
          this.selectedUnit = this.freightWater.unit;
        }
      }
    }
    this.freightWater.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.freightWater.mobile = false;
      this.freightWater.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.freightWater.project, PuesDataReqDtoSourceName.Freight_water, this.selectedUnit);
  }

  isMobileChange() {
    this.freightWater.mobile = this.isMobile;
    this.freightWater.stationary = !this.isMobile;
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

  async monthCgange() {
    await this.validateMonth(
      PuesDataReqDtoSourceName.Freight_water.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.freightWater.year.toString(), this.month.value, this.freightWater)
    let e = this.freightWater.project;
    if (this.month && this.month.value === 12 && e) {
      this.freightWater.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.freightWater.project = e;
    this.freightWater.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Freight_water)
  }





  async save(freightWaterForm: NgForm) {
    this.creating = true;
    this.removeNull();


    if (freightWaterForm.valid && this.freightWater.project.id) {

      this.freightWater.month = this.month.value
      this.freightWater.ownership = this.ownership.name
      this.freightWater.method = this.method.name
      this.freightWater.downDistance_unit = this.downDistance_unit.code
      this.freightWater.upDistance_unit = this.upDistance_unit.code
      this.freightWater.fuel_unit = this.fuel_unit.code
      this.freightWater.upWeight_unit = this.upWeight_unit.code
      this.freightWater.downWeight_unit = this.downWeight_unit.code
      this.freightWater.domOrInt = this.domesticInternational.code
      this.freightWater.cargoType = this.cargoType.code

      if (this.isNewEntry) {

        this.serviceProxy
          .createOneBaseFreightWaterActivityDataControllerFreightWaterActivityData(this.freightWater)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            // console.log('Freight Water', res);
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
              // console.log('Error', error);
            },
            () => {
              this.creating = false;
            }
          );


      } else {
        this.serviceProxy.updateOneBaseFreightWaterActivityDataControllerFreightWaterActivityData(this.freightWater.id, this.freightWater)
          .subscribe(
            (res: { emission: any; }) => {
              this.freightWater.emission = res.emission;

              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              // console.log('FreightWater', res)
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
              // console.log('Error', error);
            },
            () => {
              this.creating = false;
            }
          );
      }
    } else {
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
    this.router.navigate(['app/emission/transport-list'], { state: { mainTabIndex: 0, subTabIndex: 2, subTabIndexCode: IndexCode.F_WATER } });
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.freightWater.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseFreightWaterActivityDataControllerFreightWaterActivityData(id)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      }, (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, () => {
        this.router.navigate(['../freight-transport-list'], { relativeTo: this.activatedRoute });
      })
  }

  async checkAccess() {
    if (this.selectedProject && this.selectedUnit) {
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Freight_water);
    }
  }

  check() {
    this.freightWater.paidByCompany = this.checked[0]
  }

  async onChangeAct(value: any) {
    this.fwTypes = await this.masterDataService.getfwTypes(value).toPromise();
  }

  onChangeType(value: any) {
    this.masterDataService.getfwSizes(value).subscribe(d => {
      this.fwSizes = d;
    })
  }

  removeNull() {
    let a = 0;
    //@ts-ignore
    !this.freightWater.transist_oneWay_1?.id ? this.freightWater.transist_oneWay_1 = null : a = 1;
    //@ts-ignore
    !this.freightWater.transist_oneWay_2?.id ? this.freightWater.transist_oneWay_2 = null : a = 1;
    //@ts-ignore
    !this.freightWater.transist_oneWay_3?.id ? this.freightWater.transist_oneWay_3 = null : a = 1;

    //@ts-ignore
    !this.freightWater.transist_twoWay_1?.id ? this.freightWater.transist_twoWay_1 = null : a = 1;
    //@ts-ignore
    !this.freightWater.transist_twoWay_2?.id ? this.freightWater.transist_twoWay_2 = null : a = 1;
    //@ts-ignore
    !this.freightWater.transist_twoWay_3?.id ? this.freightWater.transist_twoWay_3 = null : a = 1;


    //@ts-ignore
    !this.freightWater.destinationPortTwoWay?.id ? this.freightWater.destinationPortTwoWay = null : a = 1;
    //@ts-ignore
    !this.freightWater.destinationCountryTwoWay?.id ? this.freightWater.destinationCountryTwoWay = null : a = 1;
    //@ts-ignore
    !this.freightWater.departurePortTwoWay?.id ? this.freightWater.departurePortTwoWay = null : a = 1;
    //@ts-ignore
    !this.freightWater.departureCountryTwoWay?.id ? this.freightWater.departureCountryTwoWay = null : a = 1;



  }


  onUpdateFuel(event: string) {
    this.freightWater.fuelType = event;
  }

}
