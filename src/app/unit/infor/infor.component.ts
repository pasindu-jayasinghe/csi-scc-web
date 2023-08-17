import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterDataService } from 'app/shared/master-data.service';
import { environment } from 'environments/environment';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { filter } from 'rxjs/operators';
import { AppService, RecordStatus, SavedData } from 'shared/AppService';
import { UploadFileType } from 'shared/file-uploader/file-uploader.component';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { NumEmployee, PrevReport, ServiceProxy, Unit, UnitControllerServiceProxy, UnitDetailMessage, UnitDetailMessageMessageAction, UnitDetails, UnitDetailsControllerServiceProxy, UnitStatus } from 'shared/service-proxies/service-proxies';
import { EmployeeUploadComponent } from './employee-upload/employee-upload.component';
import { PreviousEmissionsComponent } from './previous-emissions/previous-emissions.component';
import * as moment from 'moment';

@Component({
  selector: 'app-infor',
  templateUrl: './infor.component.html',
  styleUrls: ['./infor.component.css']
})
export class InforComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions
  selectUnitState: UnitStatus;

  units:Unit[] = [];
  unitDetail:UnitDetails = new UnitDetails();
  private readonly baseUrl: string="";
  readonly imageUrl: string="";
  private readonly bbb: string="";
  addMultipleDialog: boolean=false;
  uploadedImgFile: any;

  baseYearEmission: number = 0
  hasBaseYearEmission: boolean = false
  emissions: number[] = []
  baseyear: any;

  totalEmployees: employeeDto[] = []
  employee: employeeDto;

  preReports: preReportDto[] = []
  uploadedFiles: any[] = [];

  fileType: UploadFileType[] = [UploadFileType.pdf]

  isCSIUser: boolean = false;
  selecteUnit: Unit;


  selecteUnitId: number;

  revenue_units:  { name: string; id: number, code: string, factor: number }[] = []

  unitDetailMessages: UnitDetailMessage[] = []
  unitDetailMessage: UnitDetailMessage = new UnitDetailMessage()
  messageVisible: boolean = false
  messages: Message[] = []
  constructor(
    private serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    private http: HttpClient,
    public appService: AppService,
    private router: Router,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private unitControllerServiceProxy: UnitControllerServiceProxy
  )
  {  
    this.baseUrl = environment.baseUrlAPI
    this.imageUrl = environment.baseUrlAPI
    this.bbb = this.baseUrl+"/unit-details/upload-img"

    const navigation = this.router.getCurrentNavigation();
    if(navigation && navigation['id']){
      this.selecteUnitId = navigation['id'];
    }else{
      this.selecteUnitId = -1;
    }

    
  }


  async ngOnInit() {

    this.revenue_units = this.masterDataService.revenue_units

    if (this.totalEmployees.length > 1) this.totalEmployees.pop()

    this.isCSIUser = this.appService.isCSIUser();
    if(!this.isCSIUser){
      let u = await this.appService.getLogedUnit();
      if(u){
        this.selecteUnit = u;
        let ud = await this.getUnitTedatils(u.id);
        if(ud){
          this.unitDetail = ud;
        } else {
          this.clearUnitDetails()
        }
        this.unitDetail.unit = u;      
      }
    }
  }

  async onUpdateUnit(unit:Unit){
    this.selecteUnit = unit;
    this.unitDetailMessages = [];
    let ud = await this.getUnitTedatils(unit.id);
    if(ud){
      this.unitDetail = ud;
    } else {
      this.clearUnitDetails()
    }
    this.unitDetail.unit = unit;
  }

  async saveForm(formData: NgForm | null) {

    if(!this.isValideSubmission()){
      this.messageService.add({
        severity: 'warn',
        summary: 'Warnning',
        detail: 'Please Fill mandatory fields',
        closable: true,
      });
    }else{
      // this.unitDetail.baseYear = new Date(this.baseyear).getFullYear()
      this.unitDetail.baseYearEmission = this.baseYearEmission
  
      if(this.unitDetail.id){


        let res = await this.serviceProxy.updateOneBaseUnitDetailsControllerUnitDetails(this.unitDetail.id, this.unitDetail).toPromise();

        if(res){
          if(this.unitDetailMessages.length > 0){
            await Promise.all(this.unitDetailMessages.map(async u => {
              u.messageAction = 1;
              try{
                await this.serviceProxy.updateOneBaseUnitDetailMessageControllerUnitDetailMessage(u.id, u).toPromise()
              }catch(err){
                console.log(err);
              }
              return u;
            }))        
          }
          await this.saveTotalEmployee(this.unitDetail.id)
          await this.onReportUpload(this.unitDetail.id)          

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has updated successfully',
            closable: true,
          });
        }else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred, please try again',
            closable: true,
          });
        }
        if(!this.isCSIUser && this.selecteUnit && this.selecteUnit.unitStatus !== UnitStatus.APPROVED){
          this.login();
        }else{
          this.onUpdateUnit(this.selecteUnit);
        }
      }else{
        this.unitDetail.logopath = ''
        this.serviceProxy.createOneBaseUnitDetailsControllerUnitDetails(this.unitDetail)
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            this.onUpload(res.id);
            this.saveTotalEmployee(res.id)
            this.onReportUpload(res.id)
            if(!this.isCSIUser && this.selecteUnit && this.selecteUnit.unitStatus !== UnitStatus.APPROVED){
              this.login();
            }else{
              this.onUpdateUnit(this.selecteUnit);
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
          }
        );
      }    
    }
  }

  addMultiple(){
    this.addMultipleDialog = true;
  }

  onAddFile(event: {index: number, file: File}){
    this.uploadedImgFile = event.file;
    if(this.unitDetail.id){
      this.onUpload(this.unitDetail.id);
    }
  }

  onRemoveFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedImgFile = null;
    if(this.unitDetail.id && this.unitDetail.logopath){
      //@ts-ignore
      this.unitDetail.logopath = '';
      this.saveForm(null);
    }
  }

  async saveTotalEmployee(id: number) {
    await Promise.all(this.totalEmployees.map(async emp => {
      if (emp.revenue > 0 && emp.total > 0){
        let unitDetail = await this.serviceProxy.getOneBaseUnitDetailsControllerUnitDetails(id, undefined, undefined, 0).toPromise()
        let year = (new Date(emp.year).getFullYear()).toString()
  
        let unit = this.revenue_units.find(o => o.code === emp.revenueUnit)
  
        let numEMployee: NumEmployee = new NumEmployee();
        numEMployee.totalEmployees = emp.total
        numEMployee.totalRevenue_unit = emp.revenueUnit
        numEMployee.totalRevenue = emp.revenue * (unit? unit.factor : 1)
        numEMployee.year = year
        numEMployee.unitDetail = unitDetail
        numEMployee.target = emp.target
  
        let filter = ["year||$eq||" + year, "unitDetail.id||$eq||" + unitDetail.id]
        let exist = await this.serviceProxy.getManyBaseNumEmployeesControllerNumEmployee(
          undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
        ).toPromise()
        if (exist.data.length > 0) {
          this.serviceProxy.updateOneBaseNumEmployeesControllerNumEmployee(exist.data[0].id, numEMployee).subscribe(res => console.log(res))
        } else {
          this.serviceProxy.createOneBaseNumEmployeesControllerNumEmployee(numEMployee).subscribe(res => console.log(res))
        }
      }
    }))
  }




  onUpload(Uid:number) {
    if(this.uploadedImgFile){
      const formData = new FormData();
      formData.append('file', this.uploadedImgFile);
      this.http.post(this.baseUrl +'/unit-details/upload-img/'+Uid, formData).subscribe((res: any)=>{
        if(res.logopath){
          this.unitDetail.logopath = res.logopath;
        }
        this.addMultipleDialog=false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Img uploaded successfully',
          closable: true,
        });
      },error=> {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
      })
    }   
  }
  

  async getUnitTedatils(unitId: number){
    this.totalEmployees = [];
    this.preReports = [];
    let filters = [ "status||$ne||"+RecordStatus.Deleted,  "unit.id||$eq||"+unitId];
    let res = await this.serviceProxy.getManyBaseUnitDetailsControllerUnitDetails(
        undefined,
        undefined,
        filters,      
        undefined,
        undefined,
        ['unit'],
        1,
        0,
        0,
        0
      ).toPromise();
    if(res.total === 1){    
      this.selectUnitState = res.data[0].unit.unitStatus
      this.getUnitDetailMessages(unitId);
      let filter = ["unitDetail.id||$eq||" + res.data[0].id]
      let emp = await this.serviceProxy.getManyBaseNumEmployeesControllerNumEmployee(
        undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
      ).toPromise()
      this.totalEmployees = [];
      if (emp.data.length > 0){
        console.log(emp.data);
        emp.data.forEach(e => {
          let unit = this.revenue_units.find(o => o.code === e.totalRevenue_unit)
          let revenue = e.totalRevenue / (unit ? unit.factor : 1)
          this.totalEmployees.push({empId: e.id, total: e.totalEmployees, revenue: revenue, revenueUnit: e.totalRevenue_unit, year: e.year, target: e.target})
        })
      } else {
        this.totalEmployees.push(new employeeDto())
      }

      let report = await this.serviceProxy.getManyBasePrevReportsControllerPrevReport(
        undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
      ).toPromise()
      
      this.preReports = [];
      if (report.data.length > 0){
        report.data.forEach(rep => {
          this.preReports.push({ prvReportId: rep.id, year: rep.year, file: [ {
            id:  rep.document.id,
            path:rep.document.relativePath,
            documentType: "PDF"
          }]})
        })
      } else {
        this.preReports.push(new preReportDto())
      }

      // this.baseyear  = d.setFullYear(res.data[0].baseYear)
      this.setYear(res.data[0])
      this.baseYearEmission = res.data[0].baseYearEmission
      this.setYears();
      return res.data[0];
    }else{
      this.preReports = [];
      this.totalEmployees = [];
      this.totalEmployees.push(new employeeDto())
      this.preReports.push(new preReportDto())
      this.setYears();
      return null;
    }
  }

  setYears(){
    //@ts-ignore
    this.totalEmployees = this.totalEmployees.map(e => {
      const d = new Date();
      if(e.year){
        d.setFullYear(parseInt(e.year));
        return {
          ...e,
          year: d
        }
      }else{
        return e
      }
    })


    //@ts-ignore
    this.preReports = this.preReports.map(e => {
      const d = new Date();
      if(e.year){
        d.setFullYear(e.year)
        return {
          ...e,
          year: d
        }
      }else{
        return e
      }
    })

  }

  getLogo(){
    if(!this.unitDetail.id){
      return [] as {id: number, path: string , documentType: string}[]
    }else{
      return [ {
        id: this.unitDetail.id,
        path:this.unitDetail.logopath,
        documentType: "IMAGE"
      }]
    }
  }

  login(){
    console.log("---------------")
    this.appService.logout()
  }

  async onChangeBaseYear() {
    if (this.baseyear && this.unitDetail.unit) {
      this.unitDetail.baseYear = new Date(this.baseyear).getFullYear()
      let filters = ["status||$ne||" + RecordStatus.Deleted];
      filters.push("unit.id||$eq||" + this.unitDetail.unit.id)
      filters.push("project.year||$eq||" + new Date(this.baseyear).getFullYear())
      let pu = await this.serviceProxy.getManyBaseProjectUnitControllerProjectUnit(
        undefined, undefined, filters, undefined, undefined, undefined, 1000, 0, 1, 0
      ).toPromise()

      if (pu.data.length > 0) {
        this.baseYearEmission = pu.data[0].project.directEmission + pu.data[0].project.indirectEmission + pu.data[0].project.otherEmission
        this.hasBaseYearEmission = true
        this.unitDetail.baseYearEmission = this.baseYearEmission
      } else {
        this.baseYearEmission = 0
        this.hasBaseYearEmission = false
      }
    }
  }

  add(){
    this.totalEmployees.push(new employeeDto())
  }

  remove(index: number){
    let d = this.totalEmployees[index];
    if(d.empId){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this report?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: async () => {
          this.totalEmployees.splice(index, 1);
          await this.serviceProxy.deleteOneBaseNumEmployeesControllerNumEmployee(d.empId).toPromise();
        },
        reject: () => { },
      });
    }else{
      this.totalEmployees.splice(index, 1);
    }
  }

  addReport(){
    this.preReports.push(new preReportDto())
  }

  removeReport(idx: number){
    let d = this.preReports[idx];
    if(d.prvReportId){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this report?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: async () => {
          this.preReports.splice(idx, 1);
          await this.serviceProxy.deleteOneBasePrevReportsControllerPrevReport(d.prvReportId).toPromise();
        },
        reject: () => { },
      });
    }else{
      this.preReports.splice(idx, 1)
    }
  }

  onAddReport(event: { file: any; }, idx: number){
    this.preReports[idx].file = event.file
  }

  onRemoveReport(event: any){
    console.log(event);
  }

  async onReportUpload(id: number){
    let unitDetail = await this.serviceProxy.getOneBaseUnitDetailsControllerUnitDetails(id, undefined, undefined, 0).toPromise()
    await Promise.all(this.preReports.map(report => {
      const formData = new FormData();
      formData.append('file', report.file);
      this.http.post(this.baseUrl + '/document/upload', formData).subscribe(async (res: any) => {
        if(res){
          let document = await this.serviceProxy.getOneBaseDocumentControllerDocuments(res.id, undefined, undefined, undefined).toPromise();
          let prevReport = new PrevReport()
          prevReport.year = (new Date(report.year)).getFullYear();
          prevReport.document = document;
          prevReport.unitDetail = unitDetail;
    
          let filter = ["year||$eq||" + (new Date(report.year)).getFullYear(), "unitDetail.id||$eq||" + id]
          let exist = await this.serviceProxy.getManyBasePrevReportsControllerPrevReport(
            undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
          ).toPromise()
    
          if (exist.data.length > 0){
            this.serviceProxy.updateOneBasePrevReportsControllerPrevReport(exist.data[0].id, prevReport).subscribe(res=> console.log(res))
          } else {
            this.serviceProxy.createOneBasePrevReportsControllerPrevReport(prevReport).subscribe(res => console.log(res))
          }
        }
      })
    }))
  }

  getReport(year: number){
    if(!this.unitDetail.id){
      return [] as {id: number, path: string , documentType: string}[]
    }else{
      let filter = ["unitDetail.id||$eq||"+this.unitDetail.id, "year||$eq||"+year]
      this.serviceProxy.getManyBasePrevReportsControllerPrevReport(
        undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 1, 0
      ).subscribe(res => {
        if (res){
          return [ {
            id: this.unitDetail.id,
            path:res.data[0].document.relativePath,
            documentType: "PDF"
          }]
        } else {
          return [] as {id: number, path: string , documentType: string}[]
        }
      })
    }
    return [] as {id: number, path: string , documentType: string}[]
  }


  setYear(unitDetails: UnitDetails){
    if(unitDetails){
      const d = new Date();
      d.setFullYear(unitDetails.baseYear)
      //@ts-ignore
      this.baseyear = d;
    }
  }

  async requestData(){
    try{
      this.totalEmployees = [];
      this.preReports = [];
      let res = await this.unitControllerServiceProxy.changeStatus(this.unitDetail.unit.id,UnitStatus.DATA_REQUESTED.toString()).toPromise();
      if (res){
        localStorage.removeItem(SavedData.units)
        localStorage.removeItem(SavedData.parentUnits)
        this.onUpdateUnit(this.selecteUnit);
        this.saveUnitDetailMessage();
        this.messageVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Unit is approved successfully',
          closable: true,
        })
      }
    }catch(err){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error in approve unit',
        closable: true,
      })
    }
  }

  async approve(){

    try{
      let res = await this.unitControllerServiceProxy.changeStatusOfAll(this.unitDetail.unit.id, UnitStatus.APPROVED.toString()).toPromise();

      await Promise.all(this.unitDetailMessages.map(async u => {
        u.status = RecordStatus.InActive;
        try{
          await this.serviceProxy.updateOneBaseUnitDetailMessageControllerUnitDetailMessage(u.id, u).toPromise()
        }catch(err){
          console.log(err);
        }
        return u;
      }))     

      if (res){
        localStorage.removeItem(SavedData.units)
        localStorage.removeItem(SavedData.parentUnits)
        this.onUpdateUnit(this.selecteUnit);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Unit is approved successfully',
          closable: true,
        })
      }
    }catch(err){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error in approve unit',
        closable: true,
      })
    }
    
    
    // let unit = await this.serviceProxy.getOneBaseUnitControllerUnit(this.unitDetail.unit.id, undefined, undefined, 0).toPromise()
    // unit.unitStatus = UnitStatus.APPROVED

    // this.serviceProxy.updateOneBaseUnitControllerUnit(unit.id, unit).subscribe(res => {
    //   if (res){
    //     localStorage.removeItem(SavedData.units)
    //     localStorage.removeItem(SavedData.parentUnits)
    //     this.onUpdateUnit(this.selecteUnit);
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Unit is approved successfully',
    //       closable: true,
    //     })
    //   }
    // },error => {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Error in approve unit',
    //     closable: true,
    //   })
    // })
  }

  addPreviousEmission(){
    const ref = this.dialogService.open( PreviousEmissionsComponent, {
      header: 'Add Previous Emission ',
      width: '90%',
      data: {
        unit: this.selecteUnit
      }
  });
  }

  isValideSubmission(){
    return this.unitDetail.telephone &&
    this.unitDetail.code && this.unitDetail.email &&
    this.unitDetail.unit && this.unitDetail.baseYear &&
    this.baseYearEmission !== null && this.baseYearEmission !== undefined ;
  }

  clearUnitDetails(){
    this.unitDetail = new UnitDetails()
    this.baseyear = null
    //@ts-ignore
    this.baseYearEmission = null
  }


  async uploadExcell() {
    let ref = this.dialogService.open(EmployeeUploadComponent, {
      header: 'Upload Excel',
      width: '50%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: {
        unit: this.unitDetail.unit
      },
    });
  }

  saveUnitDetailMessage(){
    this.unitDetailMessage.unit = this.selecteUnit;
    this.unitDetailMessage.date = moment(new Date());
    this.serviceProxy.createOneBaseUnitDetailMessageControllerUnitDetailMessage(this.unitDetailMessage)
    .subscribe(res => {
      console.log(res);      
    })
  }

  getUnitDetailMessages(unitId: number){
    this.serviceProxy.getManyBaseUnitDetailMessageControllerUnitDetailMessage(
      undefined,
      undefined,
      [ "status||$eq||"+RecordStatus.Active, "unit.id||$eq||"+unitId],      
      undefined,
      undefined,
      ['unit'],
      1,
      0,
      0,
      0
    ).subscribe(res => {
      this.unitDetailMessages = res.data;
      this.unitDetailMessages.forEach(m => {
        if(m.messageAction === 1){
          let me = { severity: 'success', summary: 'Submited', detail: m.date.format('YYYY/MM/DD HH:mm') + " - " + m.message }
          this.messages.push(me);
        }else{
          let me = { severity: 'info', summary: 'Info', detail: m.date.format('YYYY/MM/DD HH:mm') + " - " + m.message }
          this.messages.push(me);
        }        
      })
      console.log(this.messages);
    })
  }
}

export class employeeDto{
  empId: number;
  year: string;
  total: number;
  revenue: number;
  revenueUnit: string;
  target: number;
}

export class preReportDto{
  prvReportId: number;
  year: number;
  file: any;
}
