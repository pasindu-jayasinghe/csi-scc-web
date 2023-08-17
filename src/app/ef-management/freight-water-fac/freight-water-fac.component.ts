import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterDataService } from 'app/shared/master-data.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { FreightWaterFac, ServiceProxy } from 'shared/service-proxies/es-service-proxies';
import { efType } from '../enum/ef-types.enum';
import { ExcellUploadEfComponent } from '../excell-upload-ef/excell-upload-ef.component';

@Component({
  selector: 'app-freight-water-fac',
  templateUrl: './freight-water-fac.component.html',
  styleUrls: ['./freight-water-fac.component.css']
})
export class FreightWaterFacComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  fwTypesaaa:any
  gasTypes: any
  wasteBasis: any
  tieres: any
  biologicalTreatments: any
  wasteCategories: any
  wasteTypes: any
  fwTypes:any
  fwSizes:any
  countries: any
  activities:any
  id: any;
  freightWFacs: FreightWaterFac[];
  freightWFac: FreightWaterFac = new FreightWaterFac()
  freightWFacactivity:any
  // freightWFactype:any

  constructor(

    private masterDataService: MasterDataService,
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    private cdr: ChangeDetectorRef,
    protected dialogService: DialogService,
    public appService: AppService

  ) {


  }
  fuelsData: any
  rows: any
  totalRecords: any;
  loading: any
  displayFuel: boolean;
  isNewEntry: boolean;
  isView: boolean;
  editEntryId: number
  years:string[] = []

  @ViewChild('op') overlay: any;

  ngAfterViewInit(): void {
    this.cdr.detectChanges();

  }



  async ngOnInit(): Promise<void> {
    this.gasTypes = this.masterDataService.gasTypes;
    this.wasteBasis = this.masterDataService.wasteBasis;
    this.tieres = this.masterDataService.tieres;
    this.biologicalTreatments = this.masterDataService.biologicalTreatments;
    this.wasteCategories = this.masterDataService.wasteCategories;
    this.countries = this.masterDataService.countries;
    this.activities = this.masterDataService.activities;
    this.fwTypes = null;
    this.fwSizes = null;

    this.onChangeAct('ss');
    this.onChangeType('ss')


    for (let i = 2015; i < 2030; i++) {
      this.years.push(i+'');
    }

    if (this.id == -1) {
      this.freightWFac = new FreightWaterFac()
    }

    if (this.id > 0) {
      this.editEntryId = this.id
      if (this.editEntryId && this.editEntryId > 0) {

        this.isNewEntry = false;
        this.freightWFac =  await this.serviceProxy.getOneBaseFreightWaterFacControllerFreightWaterFac(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).toPromise(); 

        console.log('before', this.freightWFac)


      // this.freightWFactype =  this.fwTypes.find((c: { code: string | undefined; }) => c.code == this.freightWFac.type)

        console.log('fwTypes--',this.fwTypes)

        console.log('after--',this.freightWFac.type)




      


        // });
      }

    }
  }

 


  newEF() {
    this.isNewEntry = true
    this.isView = false
    this.displayFuel = true;
    this.id = -1;
    this.ngOnInit()

  }

  viewEF(id: number) {
    this.displayFuel = true;
    this.isView = true
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }

  editEF(id: number) {
    this.isNewEntry = false;
    this.displayFuel = true;
    this.isView = false
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }


  onChangeWasteCat(value: any) {
    this.masterDataService.getWasteTypes(value).subscribe(d => {
      this.wasteTypes = d;
    })
  }


  async onChangeAct(value: any) {
  

   this.fwTypes = await this.masterDataService.getfwTypes(value).toPromise();
      
    
  }

  onChangeType(value: any) {

    
    this.masterDataService.getfwSizes(value).subscribe(d => {
      this.fwSizes = d;
    })
  }




  loadEF(event: LazyLoadEvent) {
    console.log(event);
    this.loading = true;
    this.totalRecords = 0;


    // let typeId = this.searchBy.userType ? this.searchBy.userType.id : 0;
    // let filterText = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber = event.first === 0 || event.first == undefined
      ? 1
      : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    this.serviceProxy
      .getManyBaseFreightWaterFacControllerFreightWaterFac(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        100,
        0,
        pageNumber,
        0
      ).subscribe((res: any) => {
        this.freightWFacs = res.data;
        this.totalRecords = res.total;
        this.loading = false;
        console.log('total..', this.totalRecords)
      })

  }

  async saveWasteFac(wasteFacForm: NgForm) {

    if (wasteFacForm.valid) {
      console.log("isvalidate")


      if (this.isNewEntry) {
        console.log("jsoninside2")

        this.serviceProxy
          .createOneBaseFreightWaterFacControllerFreightWaterFac(this.freightWFac)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.loadEF({});
              this.displayFuel = false;
            }, 500);
          },
            (error: any) => {
              console.log(error)
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
            }
          );


      } else {
        console.log("hhhhh")
        this.serviceProxy.updateOneBaseFreightWaterFacControllerFreightWaterFac(this.freightWFac.id, this.freightWFac)
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
              console.log('Error', error);
            },
            () => {
              this.loadEF({});
              this.displayFuel = false;
            }
          );
      }
    } else {
      console.log("notValidate")

      this.messageService.add({
        severity: 'alert',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
    }




  }

  onBackClick() { 
    this.displayFuel = false;
  }

  async uploadExcell() {
    let ref = this.dialogService.open(ExcellUploadEfComponent, {
      header: 'Upload Excel',
      width: '50%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        efType: efType.FreightWater,
      },
  });}

}




