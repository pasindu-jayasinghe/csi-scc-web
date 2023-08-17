// import { Component, OnInit } from '@angular/core';
// import { GasBiomassActivityData, Project, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from "../../../../shared/service-proxies/service-proxies";
// import { ActivatedRoute, Router } from "@angular/router";
// import { ConfirmationService, MessageService } from "primeng/api";
// import { NgForm } from "@angular/forms";
// import { AppService } from 'shared/AppService';
// import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
// import { MasterDataService } from 'app/shared/master-data.service';

// @Component({
//   selector: 'app-gas-biomass-form',
//   templateUrl: './gas-biomass-form.component.html',
//   styleUrls: ['./gas-biomass-form.component.css']
// })
// export class GasBiomassFormComponent implements OnInit {

//   gasBiomass: GasBiomassActivityData = new GasBiomassActivityData();
//   creator: User;

//   selectedUnit: Unit;
//   isMobile: boolean;
//   ownerships:{id: number, name: string}[] = []
//   puesData: PuesDataDto;
//   isAnyAdmin: boolean = false;
//   isProjectSelected: boolean = false;


//   isView: boolean = false;
//   isNewEntry: boolean = true;
//   editEntryId: number;
// ;
//   public institutions: any[] = [];
//   public projects: Project[] = [];
//   public years: any[] = [];
//   public months: any[] = [];
//   public types: any[] = [];
//   year: any = {};
//   month: any = {};
//   type: any = {};


//   alertHeader: string = 'User';
//   alertBody: string;
//   showAlert: boolean = false;

//   coreatingUser: boolean = false;

//   constructor(
//     private serviceProxy: ServiceProxy,
//     private route: ActivatedRoute,
//     protected messageService: MessageService,
//     private router: Router,
//     private confirmationService: ConfirmationService,
//     public appService: AppService,
//     private masterDataService: MasterDataService,
//     private projectAndSelectService: ProjectAndSelectService

//   ) { }

//   async ngOnInit() {
//     this.years = [{ value: 2022, name: "2022" }]
//     this.months = [{ value: 1, name: "January" }, { value: 2, name: "February" }, { value: 3, name: "March" }]
//     this.types = [{ value: "LandfillGas", name: "LandfillGas" }, { value: "SludgeGas", name: "SludgeGas" }, { value: "OtherBiogas", name: "OtherBiogas" }]
//     this.institutions = [{ id: 1, name: "abc" }, { id: 2, name: "abc2" }]

//     this.ownerships =this.masterDataService.ownership_freightTransport;

//     this.setAction();
//     await this.setInitialState();
//     await this.setUnit();
       
//     this.isAnyAdmin = this.appService.isAnyAdmin(); 
//     this.isProjectSelected = true;
//   }


//   setAction(){
//     this.route.url.subscribe(r => {
//       if(r[0].path.includes("view")){
//         this.isView =true;
//       }
//     });

//     const id = this.route.snapshot.queryParamMap.get('id');
//     if(id){
//       this.editEntryId = parseInt(id);
//       this.isNewEntry = false;
//     }
//   }
  
//   async setCreator(){
//     let u = await this.appService.getUser();
//     if(u){
//       this.creator = u;
//       this.gasBiomass.user = this.creator;
//     }
//   }

//   onUpdateUnit(unit:Unit){
//     this.selectedUnit = unit;
//     this.setPUESData();
//   }

//   async setUnit(){
//     if(!this.selectedUnit){
//       if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
//         let u = await this.appService.getLogedUnit(); 
//         if(u){
//           this.selectedUnit = u;
//         }
//       }else{        
//         if(this.gasBiomass.unit && this.gasBiomass.unit.id){
//           this.selectedUnit = this.gasBiomass.unit;
//         }
//       }
//     }
//     this.gasBiomass.unit = this.selectedUnit;
//     this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
//   }

//   async setPUESData(){
//     if(this.isNewEntry){
//       this.gasBiomass.mobile = false;
//       this.gasBiomass.stationary = false;
      
//       //@ts-ignore
//       this.isMobile = null;
//     }
//     await this.setUnit();
//     this.puesData = await this.appService.getPUESData(this.gasBiomass.project, PuesDataReqDtoSourceName.Gas_biomass, this.selectedUnit);    
//   }

//   isMobileChange(){
//     this.gasBiomass.mobile = this.isMobile;
//     this.gasBiomass.stationary = !this.isMobile;
//   }

//   async getProject(id: number){
//     let res = await this.serviceProxy.getOneBaseProjectControllerProject(
//       id,
//       undefined,
//       undefined,
//       0
//     ).toPromise();
//     return res;
//   }

//   onChangeProject(e:Project){
//     this.gasBiomass.project = e;
//     this.gasBiomass.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

//     this.setPUESData();
//   }




//   async setInitialState(){
//     if (this.editEntryId && this.editEntryId > 0) {
//       let res = await this.serviceProxy.getOneBaseGasBiomassActivityDataControllerGasBiomassActivityData(
//         this.editEntryId,
//         undefined,
//         undefined,
//         0
//       ).toPromise();
//       this.gasBiomass = res;
//       let project = await this.getProject(this.gasBiomass.project.id);
//       if (project){
//         this.gasBiomass.project = project;
//         this.isMobile = this.gasBiomass.mobile;
//         await this.setPUESData();
//       }
//     }else{
//       this.setCreator();
//     }
//   }

//   onChangeUser(event: any) {

//   }

//   async save(gasBiomassForm: NgForm) {
//     this.gasBiomass.year = this.year.value;
//     this.gasBiomass.type = this.type.value;
//    // this.gasBiomass.month = this.month.value
//    // this.gasBiomass.emission = 123;
//     if(gasBiomassForm.valid){

//     if (this.isNewEntry) {

//       this.serviceProxy
//         .createOneBaseGasBiomassActivityDataControllerGasBiomassActivityData(this.gasBiomass)
//         .subscribe(
//           (res) => {
//             this.messageService.add({
//               severity: 'success',
//               summary: 'Success',
//               detail: 'has saved successfully',
//               closable: true,
//             });
//             setTimeout(() => {
//             this.onBackClick();
//           }, 500);


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
//             this.coreatingUser = false;
//           }
//         );


//     } else {

//       console.log("uuuuuuu",this.gasBiomass)
      
//       this.serviceProxy
//         .updateOneBaseGasBiomassActivityDataControllerGasBiomassActivityData(this.gasBiomass.id, this.gasBiomass)
//         .subscribe(
//           (res) => {
//             console.log("gggg",res)
//             this.confirmationService.confirm({
//               message: 'User is updated successfully!',
//               header: 'Confirmation',
//               //acceptIcon: 'icon-not-visible',
//               rejectIcon: 'icon-not-visible',
//               rejectVisible: false,
//               acceptLabel: 'Ok',
//               accept: () => {
//                 // this.onBackClick();
//               },

//               reject: () => { },
//             });
//           },
//           (error) => {
//             this.messageService.add({
//               severity: 'error',
//               summary: 'Error',
//               detail: 'An error occurred, please try again',
//               closable: true,
//             });
//             console.log('Error', error);
//           }
//         );
//     }
//      } else{

//       this.messageService.add({
//         severity: 'warn',
//         summary: 'Requried',
//         detail: 'Fill All Mandetory fields',
//         closable: true,
//       });
//      }
//   }

//   onBackClick() {
//     this.router.navigate(['../gas-biomass-list'],  {relativeTo:this.route});
//   }

//   onDeleteClick() {
//     this.confirmationService.confirm({
//       message: 'Are you sure you want to delete the record?',
//       header: 'Delete Confirmation',
//       acceptIcon: 'icon-not-visible',
//       rejectIcon: 'icon-not-visible',
//       accept: () => {
//         this.delete();
//       },
//       reject: () => { },
//     });
//   }

//   delete() {
//     this.router.navigate(['../gas-biomass-list'], {relativeTo:this.route});
//   }

  

// }
