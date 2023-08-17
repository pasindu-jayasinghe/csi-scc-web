// import { Component, OnInit } from '@angular/core';
// import {Router} from "@angular/router";
// import {ConfirmationService} from "primeng/api";

// @Component({
//   selector: 'app-gas-biomass-view',
//   templateUrl: './gas-biomass-view.component.html',
//   styleUrls: ['./gas-biomass-view.component.css']
// })
// export class GasBiomassViewComponent implements OnInit {

//   constructor(private router: Router, private confirmationService: ConfirmationService) { }

//   ngOnInit(): void {
//   }

//   onBackClick() {
//     this.router.navigate(['/emission/gas-biomass-list']);
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
//       reject: () => {},
//     });
//   }

//   delete() {
//     this.router.navigate(['/emission/gas-biomass-list']);
//   }

// }
