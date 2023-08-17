import { Component, OnInit } from '@angular/core';
import { FreightAirActivityData, Project, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User, AirPort, AirPortDisControllerServiceProxy, Country, ProjectUnitEmissionSourceControllerServiceProxy, } from "../../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService } from "../../../../shared/master-data.service";
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { IndexCode } from '../../transport-list/transport-list.component';

@Component({
  selector: 'app-air-transport-form',
  templateUrl: './air-transport-form.component.html',
  styleUrls: ['./air-transport-form.component.css']
})
export class AirTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  countries: Country[];

  airPorts: AirPort[];
  pcodesOne: string[] = [];
  pcodesTwo: string[] = [];

  pcodesOneFull: string[] = [];
  pcodesTwoFull: string[] = [];


  //---options-airports
  depAirPorts_1: AirPort[];
  desAirPorts_1: AirPort[];
  depAirPorts_2: AirPort[];
  desAirPorts_2: AirPort[];

  freightAir: FreightAirActivityData = new FreightAirActivityData();
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
  public depatureCountry_freightTransport: { name: string, id: number }[] = []
  public departureAirport_freightTransport: { name: string, id: number }[] = []
  public destinationCountry_freightTransport: { name: string, id: number }[] = []
  public destinationAirport_freightTransport: { name: string, id: number }[] = []
  public transient_freightTransport: { name: string, id: number }[] = []
  public domesticInternationals: { name: string, id: number, code: string }[] = []
  public unit: any = {};
  public fuelType1: { name: string, id: number }[] = []
  public options_freightTransport: { name: string, id: number }[] = []
  public cargoTypes: { code: string, name: string, id: number }[] = []

  public units: any = {};
  public fuel: any = {};
  public distance: any = {};
  public onSelectUnitId: any = {};
  public onSelectUpDistanceUnitId: any = 2
  public onSelectDownDistanceUnitId: any = 2
  public upDistance_unit: any = {};
  public downDistance_unit: any = {};
  public upWeight_unit: any = {};
  public downWeight_unit: any = {};

  cargoType: any;
  month: any = {};
  method: any = {};
  freightMode: any = {};
  ownership: any = {};
  domesticInternational: any;


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  checked: any

  constructor(
    protected serviceProxy: ServiceProxy,
    private getAirDis: AirPortDisControllerServiceProxy,
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
    this.methods_freightTransport = this.masterDataService.methods_freightTransport.filter(m => m.id === 2);
    this.fuelType1 = this.masterDataService.fuelType1;
    this.options_freightTransport = this.masterDataService.options_freightTransport;
    this.units = this.masterDataService.air_freight_units
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.cargoTypes = this.masterDataService.cargoType_road_freightTransport;



    await this.getCountries();
    await this.getAirports();

    this.setAction();
    await this.setInitialState();
    await this.setUnit();

    this.isAnyAdmin = this.appService.isAnyAdmin();
    this.isProjectSelected = true;

    await super.ngOnInit();

  }

  async setInitialState() {
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBaseFreightAirActivityDataControllerFreightAirActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.freightAir = res;


      let project = await this.getProject(this.freightAir.project.id);
      if (project) {
        this.freightAir.project = project;
        this.isMobile = this.freightAir.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.freightAir.month);
      this.method = this.methods_freightTransport.find(m => m.name === this.freightAir.method);

      this.ownership = this.ownership_freightTransport.find(o => o.name === this.freightAir.ownership);

      this.domesticInternational = this.domesticInternationals.find(o => o.code === this.freightAir.domOrInt)
      this.cargoType = this.cargoTypes.find(c => c.code === this.freightAir.cargoType)


      let dOne_1 = this.desAirPorts_1.find(d => d.id === this.freightAir.destinationAirportOneWay.id)
      if(dOne_1){
        this.freightAir.destinationAirportOneWay=dOne_1;
      }

      let dpOne_1 = this.depAirPorts_1.find(d => d.id === this.freightAir.departureAirportOneWay.id)
      if(dpOne_1){
        this.freightAir.departureAirportOneWay=dpOne_1;
      }

      let dTwo_2 = this.desAirPorts_2.find(d => d.id === this.freightAir.destinationAirportTwoWay.id)
      if(dTwo_2){
        this.freightAir.destinationAirportTwoWay=dTwo_2;
      }

      let dpTwo_2 = this.depAirPorts_2.find(d => d.id === this.freightAir.departureAirportTwoWay.id)
      if(dpTwo_2){
        this.freightAir.departureAirportTwoWay=dpTwo_2;
      }


      let tOne1 = this.depAirPorts_2.find(d => d.id === this.freightAir.transist_oneWay_1.id)
      if(tOne1){
        this.freightAir.transist_oneWay_1=tOne1;
      }
      let tOne2 = this.depAirPorts_2.find(d => d.id === this.freightAir.transist_oneWay_2.id)
      if(tOne2){
        this.freightAir.transist_oneWay_2=tOne2;
      }
      let tOne3 = this.depAirPorts_2.find(d => d.id === this.freightAir.transist_oneWay_3.id)
      if(tOne3){
        this.freightAir.transist_oneWay_3=tOne3;
      }

      let tTwo1 = this.depAirPorts_2.find(d => d.id === this.freightAir.transist_twoWay_1.id)
      if(tTwo1){
        this.freightAir.transist_twoWay_1=tTwo1;
      }
      let tTwo2 = this.depAirPorts_2.find(d => d.id === this.freightAir.transist_twoWay_2.id)
      if(tTwo2){
        this.freightAir.transist_twoWay_2=tTwo2;
      }
      let tTwo3 = this.depAirPorts_2.find(d => d.id === this.freightAir.transist_twoWay_3.id)
      if(tTwo3){
        this.freightAir.transist_twoWay_3=tTwo3;
      }
      


    } else {
      this.setCreator();
    }

  }


  async getAirports() {
    this.serviceProxy.getManyBaseAirPortControllerAirPort(
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
      this.airPorts = res.data
      this.airPorts.sort((a, b) => a.name.localeCompare(b.name));
      this.desAirPorts_1 = this.airPorts;
      this.desAirPorts_2 = this.airPorts;
      this.depAirPorts_1 = this.airPorts;
      this.depAirPorts_2 = this.airPorts;
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
    this.freightAir.upDistance = 0;
    this.freightAir.upWeight = 0;
    this.upWeight_unit = null;
    this.upDistance_unit = null;
    this.freightAir.upCostPerKM = 0;
    this.freightAir.upCost = 0;

    //@ts-ignore
    this.freightAir.transist_oneWay_1 = null
    //@ts-ignore
    this.freightAir.transist_oneWay_2 = null
    //@ts-ignore
    this.freightAir.transist_oneWay_3 = null

    //@ts-ignore
    this.freightAir.destinationAirportOneWay = null
    //@ts-ignore
    this.freightAir.destinationCountryOneWay = null
    //@ts-ignore
    this.freightAir.departureAirportOneWay = null
    //@ts-ignore
    this.freightAir.departureCountryOneWay = null

  }

  async onChangeClearTwo() {
    this.pcodesTwo = [];
    this.pcodesTwoFull = [];


    this.freightAir.downDistance = 0;
    this.freightAir.downWeight = 0;
    this.downWeight_unit = null;
    this.downDistance_unit = null;
    this.freightAir.downCostPerKM = 0;
    this.freightAir.downCost = 0;

    //@ts-ignore
    this.freightAir.transist_twoWay_1 = null
    //@ts-ignore
    this.freightAir.transist_twoWay_2 = null
    //@ts-ignore
    this.freightAir.transist_twoWay_3 = null

    //@ts-ignore
    this.freightAir.destinationAirportTwoWay = null
    //@ts-ignore
    this.freightAir.destinationCountryTwoWay = null
    //@ts-ignore
    this.freightAir.departureAirportTwoWay = null
    //@ts-ignore
    this.freightAir.departureCountryTwoWay = null
  }


  async onChangePushOne() {

    this.pcodesOne = [
      this.freightAir.departureAirportOneWay?.code,
      this.freightAir.transist_oneWay_1?.code,
      this.freightAir.transist_oneWay_2?.code,
      this.freightAir.transist_oneWay_3?.code,
      this.freightAir.destinationAirportOneWay?.code
    ]

    this.pcodesOneFull = [];
    for (var pcode of this.pcodesOne) {
      if (pcode !== undefined && Object.keys(pcode).length !== 0 && pcode !== null) {
        this.pcodesOneFull.push(pcode)
      }
    }
    this.getAirDis.getDisByAirportcodes(this.pcodesOneFull).subscribe(
      (res: any) => {
        this.freightAir.upDistance = res
      },
      (error: any) => {
        this.freightAir.upDistance = 0;
        const coutomErrorMsg = error.message.substring(22, 34) + "Not Available";
        this.messageService.add({
          severity: 'info',
          summary: 'Distance Not Available',
          detail: coutomErrorMsg,
          closable: false,
        })
      }
    )
  }



  async onChangePushTwo() {
    this.pcodesTwo = [
      this.freightAir.departureAirportTwoWay?.code,
      this.freightAir.transist_twoWay_1?.code,
      this.freightAir.transist_twoWay_2?.code,
      this.freightAir.transist_twoWay_3?.code,
      this.freightAir.destinationAirportTwoWay?.code
    ]
    this.pcodesTwoFull = [];
    for (var pcode of this.pcodesTwo) {
      if (pcode != undefined) { this.pcodesTwoFull.push(pcode) }
    }

    this.getAirDis.getDisByAirportcodes(this.pcodesTwoFull).subscribe((res: any) => {
      this.freightAir.downDistance = res
    },

      (error: any) => {
        this.freightAir.downDistance = 0;
        const coutomErrorMsg = error.message.substring(22, 34) + "Not Available";
        this.messageService.add({
          severity: 'info',
          summary: 'Distance Not Available',
          detail: coutomErrorMsg,
          closable: false,
        });
      },)
  }


  async onChangeDepCountryOne(country: any) {
    let countryId = country.id;
    // console.log(this.freightAir.departureCountryOneWay);
    const res = await this.serviceProxy.getManyBaseAirPortControllerAirPort(
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
    this.depAirPorts_1 = res.data
    this.depAirPorts_1.sort((a, b) => a.name.localeCompare(b.name));
  }

  async onChangeDesCountryOne(country: any) {
    let countryId = country.id;
    const res = await this.serviceProxy.getManyBaseAirPortControllerAirPort(
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
    this.desAirPorts_1 = res.data
    this.desAirPorts_1.sort((a, b) => a.name.localeCompare(b.name));


  }


  async onChangeDepCountryTwo(country: any) {
    let countryId = country.id;
    const res = await this.serviceProxy.getManyBaseAirPortControllerAirPort(
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
    this.depAirPorts_2 = res.data
  }

  async onChangeDesCountryTwo(country: any) {
    let countryId = country.id;
    const res = await this.serviceProxy.getManyBaseAirPortControllerAirPort(
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
    this.desAirPorts_2 = res.data

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
      this.freightAir.user = this.creator;
    }
  }

  onUpdateUnit(unit: Unit) {
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Freight_air)
  }

  async setUnit() {
    if (!this.selectedUnit) {
      if (this.isNewEntry) { // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit();
        if (u) {
          this.selectedUnit = u;
        }
      } else {
        if (this.freightAir.unit && this.freightAir.unit.id) {
          this.selectedUnit = this.freightAir.unit;
        }
      }
    }
    this.freightAir.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit);
  }

  async setPUESData() {
    if (this.isNewEntry) {
      this.freightAir.mobile = false;
      this.freightAir.stationary = false;

      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.freightAir.project, PuesDataReqDtoSourceName.Freight_air, this.selectedUnit);
  }

  isMobileChange() {
    this.freightAir.mobile = this.isMobile;
    this.freightAir.stationary = !this.isMobile;
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
      PuesDataReqDtoSourceName.Freight_air.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.freightAir.year.toString(), this.month.value, this.freightAir)
    let e = this.freightAir.project;
    if (this.month && this.month.value === 12 && e) {
      this.freightAir.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e: Project) {
    this.selectedProject = e;
    this.freightAir.project = e;
    this.freightAir.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
    super.changeAccess(PuesDataReqDtoSourceName.Freight_air)

  }

  async save(freightAirForm: NgForm) {
    this.creating = true;
    this.removeNull();

    // console.log(this.freightAir);


    if (freightAirForm.valid && this.freightAir.project.id) {

      this.freightAir.month = this.month.value
      this.freightAir.method = this.method.name
      this.freightAir.ownership = this.ownership.name
      this.freightAir.distance_unit = JSON.stringify(this.distance)
      this.freightAir.upDistance_unit = this.upDistance_unit.code
      this.freightAir.downDistance_unit = this.downDistance_unit.code
      this.freightAir.upWeight_unit = this.upWeight_unit.code
      this.freightAir.downWeight_unit = this.downWeight_unit.code
      this.freightAir.domOrInt = this.domesticInternational.code
      this.freightAir.cargoType = this.cargoType.code


      if (this.isNewEntry) {
        this.serviceProxy
          .createOneBaseFreightAirActivityDataControllerFreightAirActivityData(this.freightAir)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            // console.log('Freight Air', res);
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
        this.serviceProxy.updateOneBaseFreightAirActivityDataControllerFreightAirActivityData(this.freightAir.id, this.freightAir)
          .subscribe(
            (res: { emission: any; }) => {
              this.freightAir.emission = res.emission;

              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              // console.log('FreightAir', res)
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

    // // console.log(user)
    // this.cooking.user = user
  }

  onBackClick() {
    this.router.navigate(['app/emission/transport-list'], { state: { mainTabIndex: 0, subTabIndex: 0,subTabIndexCode: IndexCode.F_AIR } });
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(this.freightAir.id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseFreightAirActivityDataControllerFreightAirActivityData(id)
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
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Freight_air);
    }
  }

  check() {
    this.freightAir.paidByCompany = this.checked[0]
  }

  removeNull() {
    let a = 0;
    //@ts-ignore
    !this.freightAir.transist_oneWay_1?.id ? this.freightAir.transist_oneWay_1 = null : a = 1;
    //@ts-ignore
    !this.freightAir.transist_oneWay_2?.id ? this.freightAir.transist_oneWay_2 = null : a = 1;
    //@ts-ignore
    !this.freightAir.transist_oneWay_3?.id ? this.freightAir.transist_oneWay_3 = null : a = 1;

    //@ts-ignore
    !this.freightAir.transist_twoWay_1?.id ? this.freightAir.transist_twoWay_1 = null : a = 1;
    //@ts-ignore
    !this.freightAir.transist_twoWay_2?.id ? this.freightAir.transist_twoWay_2 = null : a = 1;
    //@ts-ignore
    !this.freightAir.transist_twoWay_3?.id ? this.freightAir.transist_twoWay_3 = null : a = 1;


    //@ts-ignore
    !this.freightAir.destinationAirportTwoWay?.id ? this.freightAir.destinationAirportTwoWay = null : a = 1;
    //@ts-ignore
    !this.freightAir.destinationCountryTwoWay?.id ? this.freightAir.destinationCountryTwoWay = null : a = 1;
    //@ts-ignore
    !this.freightAir.departureAirportTwoWay?.id ? this.freightAir.departureAirportTwoWay = null : a = 1;
    //@ts-ignore
    !this.freightAir.departureCountryTwoWay?.id ? this.freightAir.departureCountryTwoWay = null : a = 1;



  }

}
