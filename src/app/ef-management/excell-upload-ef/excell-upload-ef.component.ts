import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'app/shared/master-data.service';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { AppService } from 'shared/AppService';
import { EmissionFacBaseControllerServiceProxy, Fuel, FuelFactorControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { Country, ServiceProxy as ComonServiceProxy } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx';
import { WasteDisposal } from '../defra/waste-disposal.enum';
import { efType } from '../enum/ef-types.enum';

@Component({
  selector: 'app-excell-upload-ef',
  templateUrl: './excell-upload-ef.component.html',
  styleUrls: ['./excell-upload-ef.component.css']
})
export class ExcellUploadEfComponent implements OnInit {


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public appService: AppService,
    private masterDataService: MasterDataService,
    private http: HttpClient,
    protected messageService: MessageService,
    private emissionFacBaseController: EmissionFacBaseControllerServiceProxy,
    private comonServiceProxy: ComonServiceProxy,
    private serviceProxy: ServiceProxy



  ) {
    this.baseUrl = environment.esbaseUrlAPI
  }

  private readonly baseUrl: string = "";
  creating: boolean = false;
  countries: Country[] = [];
  fFacType: any;
  fuelFactypes: any;
  fuels: any;
  efType: efType;
  uploadedExcellFile: any;


  ownerships: { id: number, name: string }[] = []

  async ngOnInit() {
    this.fuelFactypes = this.masterDataService.fuelFacTypes;


    if (this.config.data) {

      if (this.config.data.efType) {
        this.efType = this.config.data.efType;
        console.log(this.efType)

      }
    }
  }



  async downLoadTemplate() {

    var wb = XLSX.utils.book_new();

    //@ts-ignore
    let urlaa = this.baseUrl + '/ef-base/get-variable-mapping/';
    urlaa = `${urlaa}?efType=` + this.efType;


    this.http.post<any>(urlaa, efType).subscribe({
      next: async data => {
        let res = data.arr
        if (res && res.length > 0) {
          let d: any = {}

          res.forEach((r: any) => {
            if (r.name) {
              d[r.name] = ''

            }
          });
          const wsIn: XLSX.WorkSheet = XLSX.utils.json_to_sheet([d], { skipHeader: false });
          XLSX.utils.book_append_sheet(wb, wsIn, 'in');
        }
        if (this.efType == efType.Common || this.efType == efType.FuelFactor
          || this.efType == efType.FuelPrice || this.efType == efType.FuelSpecification) {

          await this.getCountries();
          let cou = this.countries.map(c => { return { name: c.name, code: c.code } });

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cou, { skipHeader: false });

          XLSX.utils.book_append_sheet(wb, ws, 'countries');

        }


        let dropdownInformations: any = await this.getDropdownInformations();

        Object.keys(dropdownInformations).forEach(key => {

          const we: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dropdownInformations[key], { skipHeader: false });

          XLSX.utils.book_append_sheet(wb, we, key);

        });

      },

      error: error => {
        console.error('There was an error!', error);
      }
    })



    setTimeout(() => {
      XLSX.writeFile(wb, this.efType + "-template.xlsx");
    }, 500)
  }



  async getCountries() {

    const res = await this.comonServiceProxy.getManyBaseCountryControllerCountry(
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
    this.countries = res.data;

    return this.countries;

  }

  async getFuels() {

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
    this.fuels = res.data;
    let fuelmap = this.fuels.map((c: { name: any; code: any; }) => { return { name: c.name, code: c.code } });


    return fuelmap;

  }


  download() {
    if (this.efType == efType.Fuel || this.efType == efType.FuelFactor || this.efType == efType.FuelPrice || this.efType == efType.FuelSpecification) {
      this.efType = this.fFacType
    }
    this.downLoadTemplate();
  }

  async getDropdownInformations() {

    let data: any = {};
    if (this.efType) {
      switch (this.efType) {
        case efType.FuelFactor:
          data['fuels'] = await this.getFuels();
          data['Emsources'] = this.masterDataService.emsources;
          data['Industries '] = this.masterDataService.industries;
          data['Tiers '] = this.masterDataService.tieres;
          data['Consumption Units '] = this.masterDataService.consumption_units;
          break;

        case efType.FuelPrice:
          data['fuels'] = await this.getFuels();
          data['month'] = this.masterDataService.months;
          data['currency '] = this.masterDataService.currencies;
          break;

        case efType.FuelSpecification:
          data['fuels'] = await this.getFuels();
          data['month'] = this.masterDataService.months;
          data['unit ncv'] = this.masterDataService.unit_ncv;
          data['unit density'] = this.masterDataService.unit_density;
          break;

        case efType.FreightWater:
          data['activity'] = this.masterDataService.activities;
          data['types'] = this.masterDataService.fwTypes;
          data['sizes'] = this.masterDataService.fwSizes;
          break;

        case efType.FreightRail:
          data['activity'] = this.masterDataService.railActivities;
          data['types'] = this.masterDataService.railTypes;
          break;

        case efType.MunicipalWaterTariff:
          data['categories'] = this.masterDataService.municipal_water_categories;
          break;

        case efType.Defra:

          let disarr = this.masterDataService.disposalWasteTypes;
          let codes = [
            ...new Map(disarr.map((item) => [item["code"], item])).values(),
          ];

          let codemap = codes.map((c: { name: any; code: any; }) => { return { name: c.name, code: c.code } });

          data['codes'] = codemap;
          data['Tiers '] = this.masterDataService.tieres;


          break;
      }
      console.log(data)
      return data;
    }
  }


  hasValideInputs() {
    return this.efType

  }

  onUpload(e: any) {

    if (this.efType == efType.Fuel || this.efType == efType.FuelFactor || this.efType == efType.FuelPrice || this.efType == efType.FuelSpecification) {
      this.efType = this.fFacType
    }
    console.log("uploaded-eftype---", this.efType)




    this.creating = true;
    const formData = new FormData();
    formData.append('file', this.uploadedExcellFile);
    let url = this.baseUrl + '/ef-base/upload-bulk/';
    url = `${url}?efType=` + this.efType;


    if (this.hasValideInputs()) {
      this.http.post(url, formData).subscribe((res: any) => {
        this.creating = false;
        console.log("resstatus", res)
        if (res.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.uploadedExcellFile.name + 'is uploaded and unit list is created successfully',
            closable: true,
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
        this.ref.close();
      }, error => {
        this.creating = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
        this.ref.close();
      })
    } else {
      this.creating = false;
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Missing fields` });
    }

  }


  onAddFile(event: { index: number, file: File }) {
    this.uploadedExcellFile = event.file;
  }

  onRemoveFile(event: { id: number | undefined, index: number, file: any }) {
    this.uploadedExcellFile = null;
  }


}
