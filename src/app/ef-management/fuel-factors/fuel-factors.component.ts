import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterDataService } from "app/shared/master-data.service";
import { ConfirmationService, LazyLoadEvent, MessageService } from "primeng/api";
import { filter } from "rxjs/operators";
import { AppService, ProjectTypes, RecordStatus } from "shared/AppService";
import { Fuel, FuelFactor, FuelPrice, FuelSpecific } from "shared/service-proxies/es-service-proxies";
import { ServiceProxy } from "shared/service-proxies/es-service-proxies";
import { Country, EmissionSource } from "shared/service-proxies/service-proxies";
import { Industry, ServiceProxy as ComonServiceProxy } from "shared/service-proxies/service-proxies";
import { FormControl, Validators } from '@angular/forms';
import { DialogService } from "primeng/dynamicdialog";
import { ExcellUploadEfComponent } from "../excell-upload-ef/excell-upload-ef.component";
import { efType } from "../enum/ef-types.enum";
import { Roles, UserActions } from "shared/service-proxies/auth-service-proxies";


enum TabName{
  FUEL="FUEL",
  FUELFAC="FUELFAC",
  FUELPRICE="FUELPRICE",
  FUELSPEC="FUELSPEC"
}

@Component({
  selector: 'app-fuel-factors-form',
  templateUrl: './fuel-factors.component.html',
  styleUrls: ['./fuel-factors.component.css']
})
export class FuelFactorsComponent implements OnInit {
  public roles = Roles
  public userActions = UserActions

  display: boolean = false;
  displayFuel: boolean = false;
  displayFuelPrice: boolean = false;
  displayFuelSpecification: boolean = false;
  fuelFactorData: FuelFactor[];
  fuelsData: Fuel[]
  fuelTypes: Fuel[]
  fuelsPriceData: FuelPrice[];
  fuelSpecificData: FuelSpecific[];
  id: number;
  editEntryId: number;

  loading: boolean;
  rows: number = 10;
  totalRecords: number;
  totalRecordsFuelFactor: number;
  totalRecordsFuelPrice: number;
  totalRecordsFuelSpecific: number;
  creating: boolean
  months: any
  month: any

  isNewEntry: boolean = true;
  isNewEntryFuel: boolean = true;
  isNewEntryFuelPrice: boolean = true;
  isNewEntryFuelSpecific: boolean = true;
  isView: boolean = false;
  inputField = new FormControl(0, [Validators.min(0)]);

  //--*
  fuelFactor: FuelFactor = new FuelFactor();
  fuel: Fuel = new Fuel();
  fuelPrice: FuelPrice = new FuelPrice();
  fuelSpecific: FuelSpecific = new FuelSpecific();
  countries: Country[] = [];
  sources: any
  industries: Industry[] = [];
  tiers: any
  units: any
  ef_units: any
  currencies: any
  emsources: EmissionSource[] = [];
  strokes: any
  year: string;
  unit_ncv: any
  unit_density: any
  consumption_units:any
  years: string[] = []

  offroad: string[] = ['freight_offroad', 'passenger_offroad', 'offroad_machinery_offroad']



  searchBy: any = {
    text: null,
    usertype: null,
  };

  
  currentTab: TabName= TabName.FUEL;
  countryFilter: string;
  yearFilter: string;
  fuelFilter: string;
  esFilter: string;
  projectType: ProjectTypes;

  constructor(
    protected messageService: MessageService,
    private serviceProxy: ServiceProxy,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute, // {relativeTo:this.activatedRoute}
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private route: ActivatedRoute,
    private comonServiceProxy: ComonServiceProxy,
    protected dialogService: DialogService,
    public appService: AppService


  ) { }

  public get tabName(): typeof TabName {
    return TabName; 
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    this.appService.projectType.subscribe(p => {
      this.projectType = p;      
    });


    await this.getESList();
    for (let i = 2015; i < 2030; i++) {
      this.years.push(i+'');
    }


    this.load({});
    this.loadFuel({});
    await this.getFuelTypes();
    await this.getIndustries("");

    // this.countries = this.masterDataService.countries;
    this.sources = this.masterDataService.sources;
    this.tiers = this.masterDataService.tieres;
    // this.industries = this.masterDataService.industries;
    this.months = this.masterDataService.months;
    this.currencies = this.masterDataService.currencies;
    // this.emsources = this.masterDataService.emsources;
    this.strokes = this.masterDataService.strokes;
    this.units = this.masterDataService.units_Marine;
    this.ef_units = this.masterDataService.ef_units;
    this.unit_ncv = this.masterDataService.unit_ncv;
    this.unit_density = this.masterDataService.unit_density;
    this.consumption_units = this.masterDataService.water_freight_units.fuel;

    this.getCountries()






    this.route.url.subscribe(r => {
      if (r[0].path.includes("view")) {
        // console.log("vvvvvvvvv")
        this.isView = true;
      }
    });
    this.setInitialState();

  }

  onChangeType(value:String){
  
    let filter = ['type||$eq||'+ value]

    this.getIndustries(filter)


  }

  async getCountries(){
    const res = this.comonServiceProxy.getManyBaseCountryControllerCountry(
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
      this.countries = res.data;
    })
  }

  async getIndustries(filter:any) {
    
    const res = await this.comonServiceProxy.getManyBaseIndustryControllerIndustry(
      undefined,
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();
    this.industries = res.data;
  }



  setInitialState() {
    //this.route.queryParams.subscribe((params) => {

    // console.log("iddd", this.id)
    if (this.id == -1) {
      this.fuelFactor = new FuelFactor()
      this.fuel = new Fuel();
      this.fuelPrice = new FuelPrice();
      this.fuelSpecific = new FuelSpecific();

    }
    if (this.id > 0) {

      this.editEntryId = this.id
      if (this.editEntryId && this.editEntryId > 0) {
        this.isNewEntry = false;
        this.isNewEntryFuel = false;
        this.isNewEntryFuel = false;

        //fuelfac--*
        this.serviceProxy.getOneBaseFuelFactorControllerFuelFactor(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.fuelFactor = res;


        });

        //newfuel--*
        this.serviceProxy.getOneBaseFuelControllerFuel(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.fuel = res
        });

        //price--*
        this.serviceProxy.getOneBaseFuelPriceControllerFuelPrice(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.fuelPrice = res;
        });


        //specific--*
        this.serviceProxy.getOneBaseFuelSepecificControllerFuelSpecific(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.fuelSpecific = res;
          // console.log("prfuelSpecificice--", this.fuelSpecific)

        });
      }

    }
  }

  load(event: LazyLoadEvent) {
    // console.log(event);
    this.loading = true;
    this.totalRecordsFuelFactor = 0;

    let pageNumber = (event.first === 0 || event.first == undefined) ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    let filters = [ "status||$ne||"+RecordStatus.Deleted];

    if(this.countryFilter){
      filters.push("countryCode||$eq||"+this.countryFilter)
    }
    if(this.yearFilter){
      filters.push("year||$eq||"+this.yearFilter)
    }
    if(this.fuelFilter){
      filters.push("code||$eq||"+this.fuelFilter)
    }
    if(this.esFilter){
      filters.push("emsource||$eq||"+this.esFilter)
    }



    this.serviceProxy
      .getManyBaseFuelFactorControllerFuelFactor(
        undefined,
        undefined,
        filters,
        undefined,
        undefined,
        undefined,
        this.rows,
        0,
        pageNumber,
        0
      ).subscribe((res: any) => {
        // console.log(res);
        this.fuelFactorData = res.data;
        this.totalRecordsFuelFactor = res.total;
        this.loading = false;
        // // console.log('electricityData--',this.electricityData)
        // console.log('total..', this.totalRecordsFuelFactor)
      })

  }


  loadFuel(event: LazyLoadEvent) {
    // console.log(event);
    this.loading = true;
    this.totalRecords = 0;


    let pageNumber = (event.first === 0 || event.first == undefined) ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;
    let filters = [ "status||$ne||"+RecordStatus.Deleted];

    
    this.serviceProxy
      .getManyBaseFuelControllerFuel(
        undefined,
        undefined,
        filters,
        undefined,
        undefined,
        undefined,
        this.rows,
        0,
        pageNumber,
        0
      ).subscribe((res: any) => {
        this.fuelsData = res.data;
        // console.log(this.fuelsData);
        this.totalRecords = res.total;
        this.loading = false;
        // // console.log('electricityData--',this.electricityData)
        // console.log('total..', this.totalRecords)
      })

  }




  loadFuelPrice(event: LazyLoadEvent) {
    // console.log(event);
    this.loading = true;
    this.totalRecordsFuelPrice = 0;


    let pageNumber = (event.first === 0 || event.first == undefined) ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;
    let filters = [ "status||$ne||"+RecordStatus.Deleted];

    if(this.countryFilter){
      filters.push("country||$eq||"+this.countryFilter)
    }
    if(this.yearFilter){
      filters.push("year||$eq||"+this.yearFilter)
    }
    if(this.fuelFilter){
      filters.push("code||$eq||"+this.fuelFilter)
    }

    this.serviceProxy
      .getManyBaseFuelPriceControllerFuelPrice(
        undefined,
        undefined,
        filters,
        undefined,
        undefined,
        undefined,
        this.rows,
        0,
        pageNumber,
        0
      ).subscribe((res: any) => {
        this.fuelsPriceData = res.data;
        this.totalRecordsFuelPrice = res.total;
        this.loading = false;
        // // console.log('electricityData--',this.electricityData)
        // console.log('total..', this.totalRecordsFuelPrice)
      })

  }


  loadFuelSpecification(event: LazyLoadEvent) {
    // console.log(event);
    this.loading = true;
    this.totalRecordsFuelSpecific = 0;


    let pageNumber = (event.first === 0 || event.first == undefined) ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;


    let filters = [ "status||$ne||"+RecordStatus.Deleted];

    if(this.countryFilter){
      filters.push("country||$eq||"+this.countryFilter)
    }
    if(this.yearFilter){
      filters.push("year||$eq||"+this.yearFilter)
    }
    if(this.fuelFilter){
      filters.push("code||$eq||"+this.fuelFilter)
    }

    this.serviceProxy
      .getManyBaseFuelSepecificControllerFuelSpecific(
        undefined,
        undefined,
        filters,
        undefined,
        undefined,
        undefined,
        this.rows,
        0,
        pageNumber,
        0
      ).subscribe((res: any) => {
        this.fuelSpecificData = res.data;
        this.totalRecordsFuelSpecific = res.total;
        this.loading = false;
        // // console.log('electricityData--',this.electricityData)
        // console.log('total..', this.totalRecordsFuelSpecific)
      })

  }

  new() {
    this.router.navigate(['../fuel-factors-add'], { relativeTo: this.activatedRoute });


  }






  //------------fuel factor add---

  showDialog() {
    this.isNewEntry = true
    this.isView = false
    this.display = true;
    this.id = -1;
    this.ngOnInit()


  }

  view(id: number) {
    //  this.router.navigate(['../electricity-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });

    // this.router.navigate(['../fuel-factors', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });

    this.display = true;
    this.isView = true
    this.id = id;
    // console.log("id--", id)
    this.ngOnInit()

  }

  edit(id: number) {
    this.isNewEntry = false;

    this.display = true;
    this.isView = false
    this.id = id;
    // console.log("id--", id)
    this.ngOnInit()

  }

  deleteff(id: number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the fuel factor?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deletefuelFac(id);
        this.load({})
      },
      reject: () => { },
    });
  }

  deletefuelFac(id: number) {
    this.serviceProxy.deleteOneBaseFuelFactorControllerFuelFactor(id)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Fuel factor is deleted successfully',
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
        this.router.navigate(['/app/emission-factor/fuel-factors']);
      })
  }



  viewFuel(id: number) {
    //  this.router.navigate(['../electricity-view', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });

    // this.router.navigate(['../fuel-factors', id], { queryParams: { id: id }, relativeTo:this.activatedRoute  });

    this.displayFuel = true;
    this.isView = true
    this.id = id;
    // console.log("id--", id)
    this.ngOnInit()

  }

  editFuel(id: number) {
    this.isNewEntryFuel = false;

    this.displayFuel = true;
    this.isView = false
    this.id = id;
    // console.log("id--", id)
    this.ngOnInit()

  }

  onDeleteFuel(id: number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the fuel?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(id);
        this.loadFuel({})
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseFuelControllerFuel(id)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Fuel is deleted successfully',
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
        this.router.navigate(['/app/emission-factor/fuel-factors']);
      })
  }


  viewPrice(id: number) {

    this.displayFuelPrice = true;
    this.isView = true
    this.id = id;
    // console.log("id--", id)
    this.ngOnInit()

  }

  editPrice(id: number) {
    this.isNewEntryFuelPrice = false;

    this.displayFuelPrice = true;
    this.isView = false
    this.id = id;
    // console.log("id--", id)
    this.ngOnInit()

  }

  deletefp(id: number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the fuel price?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deletefuelPrice(id);
        this.loadFuelPrice({})
      },
      reject: () => { },
    });
  }

  deletefuelPrice(id: number) {
    this.serviceProxy.deleteOneBaseFuelPriceControllerFuelPrice(id)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Fuel price is deleted successfully',
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
        this.router.navigate(['../fuel-factors'], {relativeTo:this.activatedRoute});
      })
  }


  editSpecify(id: number) {
    this.isNewEntryFuelSpecific = false;

    this.displayFuelSpecification = true;
    this.isView = false
    this.id = id;
    // console.log("id--", id)
    this.ngOnInit()

  }

  viewSpecify(id: number) {

    this.displayFuelSpecification = true;
    this.isView = true
    this.id = id;
    // console.log("id--", id)
    this.ngOnInit()

  }

  deletefs(id: number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the fuel specification?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deletefuelSpecific(id);
        this.loadFuelSpecification({})
      },
      reject: () => { },
    });
  }

  deletefuelSpecific(id: number) {
    this.serviceProxy.deleteOneBaseFuelSepecificControllerFuelSpecific(id)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Fuel specification is deleted successfully',
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
        // this.router.navigate(['../freight-transport-list'], {relativeTo:this.activatedRoute});
      })
  }


  onBackClickNF() {
    this.displayFuel = false
  }

  onBackClick() {
    this.display = false
  }

  onBackClickFP() {
    this.displayFuelPrice = false
  }

  onBackClickFS() {
    this.displayFuelSpecification = false
  }

  onDeleteClick() { }

  newFuel() {
    this.isNewEntryFuel = true
    this.isView = false
    this.displayFuel = true;
    this.id = -1;
    this.ngOnInit()

  }

  newFuelPrice() {

    this.isNewEntryFuelPrice = true
    this.isView = false
    this.displayFuelPrice = true;
    this.id = -1;
    this.ngOnInit()
  }


  newFuelSpecialize() {
    this.isNewEntryFuel = true
    this.isView = false
    this.displayFuelSpecification = true;
    this.id = -1;
    this.ngOnInit()

  }




  async save(fuelFacForm: NgForm) {
    this.creating = true;
    //this.fuelFactor.year = new Date(this.year).getFullYear();
    this.fuelFactor.reference = this.fuelFactor.reference
    this.fuelFactor.name = this.fuelFactor.code

    // console.log("fuel--", this.fuelFactor)

    // this.serviceProxy.getOneBaseUsersControllerUser(1, undefined, undefined, undefined)
    // .subscribe((res: any) => {
    // // console.log(res)
    // this.electricity.user = res
    if (fuelFacForm.valid) {
      // console.log("validated")
      if (this.isNewEntry) {
        // console.log("is new")

        this.serviceProxy
          .createOneBaseFuelFactorControllerFuelFactor(this.fuelFactor)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.displayFuel = false
              this.load({})
              //window.location.reload()
            }, 500);
          },
            (error: any) => {
              // console.log(error)
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              // console.log('Error', error);
            },
            () => {
              // this.creating = false;
            }
          );


      } else {
        this.serviceProxy.updateOneBaseFuelFactorControllerFuelFactor(this.fuelFactor.id, this.fuelFactor)
          .subscribe(
            (res) => {
              // this.electricity.emission = res.emission;
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
              // console.log('Error', error);
            },
            () => {
              this.load({})
              this.displayFuel = false
              // this.creating = false;
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
    }
    // })
    // // console.log(user)
    // this.electricity.user = user
    //}

  }


  async saveFuel(fuelForm: NgForm) {
    this.creating = true;
   // this.fuelFactor.year = new Date(this.year).getFullYear();
    this.fuelFactor.reference = this.fuelFactor.reference

    if (fuelForm.valid) {

      if (this.isNewEntryFuel) {
        this.serviceProxy
          .createOneBaseFuelControllerFuel(this.fuel)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.display = false
              this.loadFuel({});
              //this.onSearchLoadFuel();
              //window.location.reload()

            }, 500);
          },
            (error: any) => {
              // console.log(error)
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              // console.log('Error', error);
            },
            () => {
            }
          );


      } else {
        this.serviceProxy.updateOneBaseFuelControllerFuel(this.fuel.id, this.fuel)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'fuel has updated successfully',
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
              // console.log('Error', error);
            },
            () => {
              this.display = false
              this.loadFuel({});
              //this.onSearchLoadFuel();
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
    }

  }



  //saveFuelPrice
  async saveFuelPrice(fuelPriceForm: NgForm) {
    this.creating = true;


    // console.log("fuelprice--", this.fuelPrice)

    // this.serviceProxy.getOneBaseUsersControllerUser(1, undefined, undefined, undefined)
    // .subscribe((res: any) => {
    // // console.log(res)
    // this.electricity.user = res
    if (fuelPriceForm.valid) {
      // console.log("validated")
      if (this.isNewEntryFuelPrice) {
        // console.log("is new")

        this.serviceProxy
          .createOneBaseFuelPriceControllerFuelPrice(this.fuelPrice)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.displayFuelPrice = false
              this.loadFuelPrice({});
              //window.location.reload()
            }, 500);
          },
            (error: any) => {
              // console.log(error)
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              // console.log('Error', error);
            },
            () => {
              // this.creating = false;
            }
          );


      } else {
        this.serviceProxy.updateOneBaseFuelPriceControllerFuelPrice(this.fuelPrice.id, this.fuelPrice)
          .subscribe(
            (res) => {
              // this.electricity.emission = res.emission;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'fuel price has updated successfully',
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
              // console.log('Error', error);
            },
            () => {
              this.displayFuelPrice = false
              this.loadFuelPrice({});
              // this.creating = false;
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
    }
    // })
    // // console.log(user)
    // this.electricity.user = user
    //}

  }


  async saveFuelSpecific(fuelPriceForm: NgForm) {
    this.creating = true;

    // console.log("pp", this.fuelSpecific)

    // this.serviceProxy.getOneBaseUsersControllerUser(1, undefined, undefined, undefined)
    // .subscribe((res: any) => {
    // // console.log(res)
    // this.electricity.user = res
    if (fuelPriceForm.valid) {
      // console.log("validated")
      if (this.isNewEntryFuelSpecific) {
        // console.log("is new")

        this.serviceProxy
          .createOneBaseFuelSepecificControllerFuelSpecific(this.fuelSpecific)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.displayFuelSpecification = false
              this.loadFuelSpecification({});
              // window.location.reload()
            }, 500);
          },
            (error: any) => {
              // console.log(error)
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
        this.serviceProxy.updateOneBaseFuelSepecificControllerFuelSpecific(this.fuelSpecific.id, this.fuelSpecific)
          .subscribe(
            (res) => {
              // this.electricity.emission = res.emission;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'fuel price has updated successfully',
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
              // console.log('Error', error);
            },
            () => {
              this.creating = false;
              this.displayFuelSpecification = false
              this.isNewEntryFuelSpecific = true
              this.loadFuelSpecification({});
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
    }
    // })
    // // console.log(user)
    // this.electricity.user = user
    //}

  }




  async getFuelTypes() {
    const res = await this.serviceProxy.getManyBaseFuelControllerFuel(
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
    ).toPromise();
    this.fuelTypes = res.data

  }

  async getESList(){
    try{
      let res = await this.comonServiceProxy.getManyBaseEmissionSourceControllerEmissionSource(
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
      ).toPromise();
  
      this.emsources = res.data;
    }catch(err){
      this.emsources = [];
    }
  }

  mapSource(str: string){
    if (str === 'S'){
      return 'Stationary'
    } else {
      return 'Mobile'
    }
  }

  changeFilter(){
    switch(this.currentTab){
      case TabName.FUEL:
        this.loadFuel({})
        break;
      case TabName.FUELFAC:
        this.load({});
        break;
      case TabName.FUELPRICE:
        this.loadFuelPrice({});
        break;
      case TabName.FUELSPEC:
        this.loadFuelSpecification({});
        break;
    }
  }


  handleChange(e: any) {
    let index = e.index;
    switch(index){
      case 0:
        this.currentTab = TabName.FUEL;
        break;
      case 1:
        this.currentTab = TabName.FUELFAC;
        break;
      case 2:
        this.currentTab = TabName.FUELPRICE;
        break;
      case 3:
        this.currentTab = TabName.FUELSPEC;
        break;
    }

    this.changeFilter();
  }


  async uploadExcell() {
    let ref = this.dialogService.open(ExcellUploadEfComponent, {
      header: 'Upload Excel',
      width: '50%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        efType: efType.Fuel,
      },
  });}

  getESNamrVariable(){
    if(this.projectType === ProjectTypes.GHG){
      return 'name'
    }else{
      return 'sbtName'
    }
  }

}

