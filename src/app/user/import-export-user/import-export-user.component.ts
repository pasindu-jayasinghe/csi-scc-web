import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ServiceProxy, Unit, UnitControllerServiceProxy, UsersControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-import-export-user',
  templateUrl: './import-export-user.component.html',
  styleUrls: ['./import-export-user.component.css']
})
export class ImportExportUserComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions
  selectedUnit: Unit;
  uploadedExcellFile: any;
  baseUrl: any;
  isAllBranches:boolean=true;

  constructor(
    private userServiceProxy: UsersControllerServiceProxy,
    private unitControllerServiceProxy: UnitControllerServiceProxy,
    private http: HttpClient,
    public appService: AppService
  ) { this.baseUrl = environment.baseUrlAPI}

  ngOnInit(): void {
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
  }

  onAddFile(event: {index: number, file: File}){
    this.uploadedExcellFile = event.file;
  }

  onRemoveFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedExcellFile = null;
  }

  upload(){
    if (this.selectedUnit && this.uploadedExcellFile) {
      const formData = new FormData();
      formData.append('file', this.uploadedExcellFile);
      this.http.post(this.baseUrl + '/users/import-users', formData).subscribe(async (res: any) => { 
        console.log(res)
        this.exportResult(res)
      })
    }
  }

  exportResult(res: any){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res, {skipHeader: false});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, 'Result.xlsx');

  }

  async export() {
    if (this.selectedUnit) {
      let isAll = this.isAllBranches ? "true" : "false"
      let users = await this.userServiceProxy.exportUsers((this.selectedUnit.id).toString(), isAll).toPromise()
      console.log(users)
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(users.users, { skipHeader: false });
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
      XLSX.writeFile(wb, 'Users.xlsx');
    }
  }


  async getClildUnitsMap(){
    let units = await this.unitControllerServiceProxy.getChildUnits(this.selectedUnit.id).toPromise();
    return units.map(u => {
      return {
        id: u.id, 
        name: u.name
      }
    })
  }

  async downloadTemp() {
    let data  = {
      'unit id': '',
      'name': '',
      'email': '',
      'role': ''
    }

    let roles = [
      {
        Name: 'User',
        Code: 'DEO'
      },
      {
        Name: 'Admin',
        Code: 'COM_ADMIN'
      }
    ]

    var wb = XLSX.utils.book_new();
    const wsIn: XLSX.WorkSheet = XLSX.utils.json_to_sheet([data], {skipHeader: false});
    XLSX.utils.book_append_sheet(wb, wsIn, 'USERS');


    const r: XLSX.WorkSheet = XLSX.utils.json_to_sheet(roles, {skipHeader: false});
    XLSX.utils.book_append_sheet(wb, r, 'Roles');


    let units = await this.getClildUnitsMap();
    units.push({
      id: this.selectedUnit.id, 
      name: this.selectedUnit.name
    })

    const u: XLSX.WorkSheet = XLSX.utils.json_to_sheet(units, {skipHeader: false});
    XLSX.utils.book_append_sheet(wb, u, 'Units');


    XLSX.writeFile(wb, this.selectedUnit.name + "-"  +"-template.xlsx");

  }

}
