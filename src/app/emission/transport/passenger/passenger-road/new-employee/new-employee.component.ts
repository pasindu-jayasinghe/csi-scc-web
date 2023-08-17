import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeeName, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {
  empName: any
  empCode:any
  unit: any

  @Input() employeeName: EmployeeName = new EmployeeName();

  constructor(

    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    protected serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    protected dialogService: DialogService,
    private router: Router,



  ) { }

  ngOnInit(): void {

    if (this.config.data) {
      this.unit = this.config.data.unit

    }
  }


  async save() {
    console.log("aadsfsfsa")

    this.empName = this.employeeName.name.replace(/\s+/g, '_').toUpperCase();
    let unitName = this.unit.name.replace(/\s+/g, '_').toUpperCase();
    let empId = this.employeeName.empId.replace(/\s+/g, '_').toUpperCase();

    this.employeeName.unit = this.unit;

    this.employeeName.code = this.empName + "_" + unitName+"_"+empId
console.log("aaa",this.employeeName)

    this.serviceProxy
      .createOneBaseEmployeeNameControllerEmployeeName(this.employeeName)
      .subscribe((res: any) => {
       if(res.code != undefined){
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee saved successfully',
          closable: true,
        });
        setTimeout(() => {
           this.onBackClick();
        

        }, 500);
        

       }else{
        this.messageService.add({
          severity: 'warn',
          summary: 'Warn',
          detail: 'Employee Already Exisits',
          closable: true,
        });
        setTimeout(() => {
           this.onBackClick();

        }, 500);

       }
      
      },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred, please try again',
            closable: true,
          });
          console.log('Error', error);
        },
        () => {
          // this.creating = false;
        }
      );

  }
  onBackClick(){

    this.ref.close("Closed")
    
  }

}

