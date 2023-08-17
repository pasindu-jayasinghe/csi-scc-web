import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions,ServiceProxy } from 'shared/service-proxies/auth-service-proxies';
import { NumEmployeesControllerServiceProxy, Unit, UnitControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-upload',
  templateUrl: './employee-upload.component.html',
  styleUrls: ['./employee-upload.component.css']
})
export class 
EmployeeUploadComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  constructor(
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    private http: HttpClient,
    public ref: DynamicDialogRef,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    public config: DynamicDialogConfig,
    private appService: AppService

  ) {
    this.baseUrl = environment.baseUrlAPI
   }
  uploadedExcellFile: any;
  creating: boolean = false;
  unit: Unit;

  private readonly baseUrl: string = "";

  ngOnInit(): void {

    if (this.config.data) {
      this.unit = this.config.data.unit;

    }
  }

  async downLoadTemplate() {
    console.log("innnnnn")

    var wb = XLSX.utils.book_new();
    //@ts-ignore
    let urlaa = this.baseUrl + '/num-employees/get-variable-mapping-employee-num/';
    this.http.post<any>(urlaa, "").subscribe({
      next: async data => {

        let res = data
        if (res && res.length > 0) {
          let d: any = {}
          d['UnitId'] = '';
          res.forEach((r: any) => {
            if (r.name) {
              d[r.name] = ''

            }
          });
          console.log("d", d)
          const wsIn: XLSX.WorkSheet = XLSX.utils.json_to_sheet([d], { skipHeader: false });
          XLSX.utils.book_append_sheet(wb, wsIn, 'in');
        }

        let cunits = await this.unitControllerServiceProxy.getChildUnits(this.unit.id).toPromise();
        console.log("ss",cunits)
        let cunitMap = cunits.map((c: { name: any; id: any; }) => { return { name: c.name, id: c.id } });
        cunitMap.push({ name: this.unit.name, id: this.unit.id })
        console.log("ss",cunitMap)

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cunitMap, { skipHeader: false });
        XLSX.utils.book_append_sheet(wb, ws, 'units');

      },

      error: error => {
        console.error('There was an error!', error);
      }
    })

    setTimeout(() => {
      XLSX.writeFile(wb, "num-of-employee" + "-template.xlsx");
    }, 300)


  }


  onUpload(e: any) {

    const formData = new FormData();
    formData.append('file', this.uploadedExcellFile);
    let url = this.baseUrl + '/num-employees/upload-bulk-unit-employee/';

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


  }

  onAddFile(event: { index: number, file: File }) {
    this.uploadedExcellFile = event.file;
  }

  onRemoveFile(event: { id: number | undefined, index: number, file: any }) {
    this.uploadedExcellFile = null;
  }

}
