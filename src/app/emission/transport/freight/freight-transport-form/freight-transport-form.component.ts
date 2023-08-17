import { Component, OnInit } from '@angular/core';
import { Project, ServiceProxy, User } from "../../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import {MasterDataService} from "../../../../shared/master-data.service";
import { AppService } from 'shared/AppService';

@Component({
  selector: 'app-freight-transport-form',
  templateUrl: './freight-transport-form.component.html',
  styleUrls: ['./freight-transport-form.component.css']
})
export class FreightTransportFormComponent implements OnInit {

  // freight: FreightTransportActivityData = new FreightTransportActivityData();
  creator: User;

  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public methods_freightTransport: {name: string, id: number}[] = []
  public units: {name: string, id: number}[] = []
  public freightModes: {name: string, id: number}[] = []
  public ownership_freightTransport: {name: string, id: number}[] = []
  public depatureCountry_freightTransport: {name: string, id: number}[] = []
  public departureAirport_freightTransport: {name: string, id: number}[] = []
  public destinationCountry_freightTransport: {name: string, id: number}[] = []
  public destinationAirport_freightTransport: {name: string, id: number}[] = []
  public transient_freightTransport: {name: string, id: number}[] = []
  public distanceTravelledUnits_freightTransport: {name: string, id: number}[] = []
  public domesticInternationals: {name: string, id: number}[] = []
  public unit: any
  public freightTypes_freightTransport: {name: string, id: number}[] = []
  public departurePort_freightTransport: {name: string, id: number}[] = []
  public destinationPort_freightTransport: {name: string, id: number}[] = []
  public departureStation_freightTransport: {name: string, id: number}[] = []
  public destinationStation_freightTransport: {name: string, id: number}[] = []
  public fuelType1: {name: string, id: number}[] = []
  public vehicleModel_freightTransport: {name: string, id: number}[] = []

  month: any = {};
  method: any = {};
  freightType: any = {};
  freightMode: any ={};
  ownership: any ={};
  depatureCountry: any ={};
  departureAirport: any ={};
  departurePort: any ={};
  destinationCountry: any ={};
  destinationAirport: any ={};
  destinationPort: any ={};
  transient: any ={};
  distanceTravelledUnits: any ={};
  domesticInternational: any ={};


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute:ActivatedRoute,
    public appService: AppService,
    
  ) { }


  async ngOnInit() {
    this.months = this.masterDataService.months;
    this.freightModes = this.masterDataService.freightModes;
    this.domesticInternationals = this.masterDataService.domesticInternationals;
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.depatureCountry_freightTransport = this.masterDataService.depatureCountry_freightTransport;
    this.departureAirport_freightTransport = this.masterDataService.departureAirport_freightTransport;
    this.destinationCountry_freightTransport =this.masterDataService.destinationCountry_freightTransport;
    this.destinationAirport_freightTransport = this.masterDataService.destinationAirport_freightTransport;
    this.transient_freightTransport = this.masterDataService.transient_freightTransport;
    this.distanceTravelledUnits_freightTransport =this.masterDataService.distanceTravelledUnits_freightTransport;
    this.methods_freightTransport = this.masterDataService.methods_freightTransport;
    this.freightTypes_freightTransport =this.masterDataService.freightTypes_freightTransport;
    this.destinationPort_freightTransport = this.masterDataService.destinationPort_freightTransport;
    this.departurePort_freightTransport = this.masterDataService.departurePort_freightTransport;
    this.destinationStation_freightTransport = this.masterDataService.destinationStation_freightTransport;
    this.departureStation_freightTransport = this.masterDataService.departureStation_freightTransport;
    this.fuelType1 = this.masterDataService.fuelType1;
    this.vehicleModel_freightTransport =this.masterDataService.vehicleModel_freightTransport;
    //this.onSelect(this.selectedSource.id);
    

    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });
    // this.setInitialState();
  }

  onSelectMode(selected:any){
    this.freightMode = this.freightModes
    .find(f=> 
     f.id === selected.value.id);
    console.log("Freight mode",this.freightMode.id)
    console.log("selected",selected)
  }



  // async setCreator(){
  //   let u = await this.appService.getUser();
  //   if(u){
  //     this.creator = u;
  //     this.freight.user = this.creator;
  //   }
  // }

  // setInitialState(){
  //   this.route.queryParams.subscribe((params) => {
  //     this.editEntryId = params['id'];
  //     if (this.editEntryId && this.editEntryId > 0) {
  //       this.isNewEntry = false;
  //       this.serviceProxy.getOneBaseFreightTransportActivityDataControllerFreightTransportActivityData(
  //         this.editEntryId,
  //         undefined,
  //         undefined,
  //         0
  //       ).subscribe((res: any) => {
  //         this.freight = res;
  //         let project = this.projects.find(p =>p.id ===this.freight.project.id);
  //         if (project){
  //           this.freight.project = project;
  //         }
  //         this.month = this.months.find(m=>m.value===this.freight.month);
  //         //this.freightMode = this.freightModes.find(f=>f.name===this.freight.freightMode);
  //         //this.domesticInternational = this.domesticInternationals.find(d=>d.name===this.freight.domesticInternational);
          
          
  //       });
  //     }else{
  //       this.setCreator();
  //     }
  //   });
  // }

  cleanString(str:string) {

    str = str.replace(/}",/gi, '},');
    str = str.replace(/:"{/gi , ':{');
    str = str.replace(/[\/\\]/g, '');
   return str;
 }

  onChangeProject(e:any){
    const p = e.value as Project;
    // this.freight.year = p.year;
  }

  // async save(freightForm: NgForm) {
  //   this.creating=true;

  //   this.freight.month = this.month.value
  //   // this.freight.freightMode = this.freightMode.name
  //   // this.freight.domesticInternational = this.domesticInternational.name
  //   //this.freight.consumption_unit = this.unit.name

  //   if(freightForm.valid){

  //     if (this.isNewEntry) {

  //       this.serviceProxy
  //         .createOneBaseFreightTransportActivityDataControllerFreightTransportActivityData(this.freight)
  //         .subscribe((res: any) => {
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Success',
  //             detail: 'has saved successfully',
  //             closable: true,
  //           });
  //           console.log('freight Transport',res);
  //           setTimeout(() => {
  //             this.onBackClick();}, 500);
  //           },
  //           (error) => {
  //             this.messageService.add({
  //               severity: 'error',
  //               summary: 'Error',
  //               detail: 'An error occurred, please try again',
  //               closable: true,
  //             });
  //             console.log('Error', error);
  //           },
  //           () => {
  //             this.creating = false;
  //           }
  //         );


  //     } else {
  //       this.serviceProxy.updateOneBaseFreightTransportActivityDataControllerFreightTransportActivityData(this.freight.id, this.freight)
  //         .subscribe(
  //           (res: { emission: any; }) => {
  //             this.freight.emission = res.emission;
  //             this.messageService.add({
  //               severity: 'success',
  //               summary: 'Success',
  //               detail: 'has updated successfully',
  //               closable: true,
  //             });
  //             console.log('freight',res)
  //           },
  //           (error) => {
  //             this.messageService.add({
  //               severity: 'error',
  //               summary: 'Error',
  //               detail: 'An error occurred, please try again',
  //               closable: true,
  //             });
  //             console.log('Error', error);
  //           },
  //           () => {
  //             this.creating = false;
  //           }
  //         );
  //     }
  //   } else{
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Required',
  //       detail: 'Fill All Mandatory fields',
  //       closable: true,
  //     });
  //     }
     

  // }

  onBackClick() {
    this.router.navigate(['app/emission/transport-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        // this.delete(this.freight.id);
      },
      reject: () => { },
    });
  }

  // delete(id: number) {
  //   this.serviceProxy.deleteOneBaseFreightTransportActivityDataControllerFreightTransportActivityData(id)
  //     .subscribe((res: any) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'has deleted successfully',
  //         closable: true,
  //       });
  //     },(error: any) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'An error occurred, please try again',
  //         closable: true,
  //       });
  //     }, ()=> {
  //       this.router.navigate(['../freight-transport-list'], {relativeTo:this.activatedRoute});
  //     })
  // }

}
