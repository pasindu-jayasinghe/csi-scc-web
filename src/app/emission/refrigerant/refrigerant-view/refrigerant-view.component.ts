import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-refrigerant-view',
  templateUrl: './refrigerant-view.component.html',
  styleUrls: ['./refrigerant-view.component.css']
})
export class RefrigerantViewComponent implements OnInit {

  constructor(private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  onBackClick() {
    this.router.navigate(['/emission/refrigerant-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete();
      },
      reject: () => {},
    });
  }

  delete() {
    this.router.navigate(['/emission/refrigerant-list']);
  }
}
