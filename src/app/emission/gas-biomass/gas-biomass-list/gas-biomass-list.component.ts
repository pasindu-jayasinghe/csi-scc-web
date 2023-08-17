// import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
// import {GasBiomassActivityData, Project, ServiceProxy, Unit} from "../../../../shared/service-proxies/service-proxies";
// import {Router, ActivatedRoute} from "@angular/router";
// import {ConfirmationService, LazyLoadEvent} from "primeng/api";
// import { AppService, RecordStatus } from 'shared/AppService';


// @Component({
//   selector: 'app-gas-biomass-list',
//   templateUrl: './gas-biomass-list.component.html',
//   styleUrls: ['./gas-biomass-list.component.css']
// })
// export class GasBiomassListComponent implements OnInit { // THIS ES is not using now

//   rows: number = 10;
//   loading: boolean;
//   gasBiomassData: GasBiomassActivityData[];
//   // customers: User[];

//   totalRecords: number;

//   searchText: string = '';
//   searchEmailText: string;
//   searchLastText: string;


//   searchBy: any = {
//     text: null,
//     usertype: null,
//   };

//   isAnyAdmin: boolean = false;
//   selectedUnit: Unit;
//   selectedProject: Project;

//   constructor(
//     private serviceProxy: ServiceProxy, 
//     private router: Router,
//     private cdr: ChangeDetectorRef,
//     // private userControllerService: UsersControllerServiceProxy,
//     private confirmationService: ConfirmationService,
//     private activatedRoute: ActivatedRoute,
//     public appService: AppService,

//   ) {}

//   ngAfterViewInit(): void {
//     this.cdr.detectChanges();
//   }

//   async ngOnInit() {
//     this.isAnyAdmin = this.appService.isAnyAdmin()
//     if(!this.isAnyAdmin){
//       let u = await this.appService.getLogedUnit(); 
//         if(u){
//           this.selectedUnit = u;
//         }
//     }
//     this.load({})
//   }


//   onSearch() {
//     let event: any = {};
//     event.rows = this.rows;
//     event.first = 0;

//     this.load(event);
//   }

//   load(event: LazyLoadEvent) {
//     console.log('loadgasbiomassData===', event);
//     this.loading = true;

//     this.totalRecords = 0;


//     let typeId = this.searchBy.userType ? this.searchBy.userType.id : 0;
//     let filterText = this.searchBy.text ? this.searchBy.text : '';

//     let pageNumber = event.first === 0 || event.first == undefined ? 1
//       :event.first / (event.rows == undefined ? 1 : event.rows) + 1;
//     this.rows = event.rows == undefined ? 10 : event.rows;

//     let filters = [ "status||$ne||"+RecordStatus.Deleted];
//     if(this.selectedProject){
//       filters.push("project.id||$eq||"+this.selectedProject.id);
//     }
//     if(this.selectedUnit){
//       filters.push("unit.id||$eq||"+this.selectedUnit.id);
//     }

//     this.serviceProxy
//     .getManyBaseGasBiomassActivityDataControllerGasBiomassActivityData(
//       undefined,
//       undefined,
//       filters,
//       undefined,
//       undefined,
//       ['unit','project'],
//       this.rows,
//       0,
//       pageNumber,
//       0
//     ).subscribe((res:any) => {
//     this.gasBiomassData = res.data;
//     this.totalRecords = res.total;
//     this.loading = false;
//     console.log('GasBiomassData--',this.gasBiomassData)
//     console.log('total..',this.totalRecords)
//   })

//   }


//   edit(id: number) {
//     this.router.navigate(['../gas-biomass-edit', id], {queryParams: { id: id }, relativeTo:this.activatedRoute });
//   }

//   view(id: number) {
//     this.router.navigate(['../gas-biomass-view', id], { queryParams: { id: id } , relativeTo:this.activatedRoute });
//   }

//   new() {
//     this.router.navigate(['../gas-biomass-add'], {relativeTo:this.activatedRoute});
//   }

//   onTypeChange(event: any){
//     console.log('loading.....')
//     this.onSearch()
//     console.log('result.....',event)
//   }

//   onDeleteClick(id: number) {
//     // this.delete(id);
//     this.confirmationService.confirm({
//       message: 'Are you sure you want to delete the record?',
//       header: 'Delete Confirmation',
//       acceptIcon: 'icon-not-visible',
//       rejectIcon: 'icon-not-visible',
//       accept: () => {
//         this.delete(id);
//       },
//       reject: () => { },
//     });
//   }

//   delete(id: number) {
//     this.serviceProxy.deleteOneBaseGasBiomassActivityDataControllerGasBiomassActivityData(id)
//     .subscribe(res => {
//       this.onSearch();
//     },error => {
      
//     })
//     // this.router.navigate(['/emission/gas-biomass-list']);
//   }

//   onUpdateUnit(unit:Unit){
//     this.selectedUnit = unit;
//     this.load({});
//   }


//   onChangeProject(e:Project){
//     this.selectedProject = e;
//     this.load({});
//   }

// }
