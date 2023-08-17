import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { MessageService, ConfirmationService, Header } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { IcaoDto, PassengerAirActivityData, PassengerAirActivityDataControllerServiceProxy, PassengerAirPortControllerServiceProxy, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDtoSourceName, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { IndexCode } from 'app/emission/transport/transport-list/transport-list.component';


@Component({
  selector: 'app-passenger-air-transport-form',
  templateUrl: './passenger-air-transport-form.component.html',
  styleUrls: ['./passenger-air-transport-form.component.css']
})
export class PassengerAirTransportFormComponent extends EmissionCreateBaseComponent implements OnInit {

  passengerAir: PassengerAirActivityData = new PassengerAirActivityData();
  creator: User;

  selectedUnit: Unit;
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  isView: boolean = false
  isNewEntry: boolean = true
  creating: boolean = false;
  editEntryId: any;
  type: any;

  checked: any;

  public vehicleNo: any;
  public noOfTrips: any;
  public year: any;

  public month: any;
  public ownership: any
  // public option: any
  public project: any
  public cabin_class: any
  domesticInternational: any;

  public projects: Project[] = [];
  public months: {name: string, value: number}[] = []
  public ownership_freightTransport: {name: string, id: number}[] = []
  public options_passenger_air: {name: string, id: number, code: string}[] = []
  public class_passenger_air: {name: string, id: number, code: string}[] = []
  public domesticInternationals: {name: string, id: number, code: string}[] = []

  public departure_ports:any[] = []
  public destination_ports: any[] = []
  public transist1_ports: any[] = []
  public transist2_ports: any[] = []

  public dept_port:any;
  public dest_port: any;
  public employees: number;

  departure_port: any 
  destination_port: any 
  transist1: any 
  transist2: any
  totalEmission: number

  results: any[];

  addTrans: boolean = false

  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private masterDataService: MasterDataService,
    protected appService: AppService,
    public http: HttpClient,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private passengerAirActivityDataControllerServiceProxy: PassengerAirActivityDataControllerServiceProxy
  ) {
        super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }

  async ngOnInit(): Promise<void> {
    this.months = this.masterDataService.months;
    this.ownership_freightTransport = this.masterDataService.ownership_freightTransport;
    this.options_passenger_air = this.masterDataService.options_passenger_air;
    this.class_passenger_air = this.masterDataService.class_passenger_air;
    this.domesticInternationals = this.masterDataService.domesticInternationals;

    this.ownerships =this.masterDataService.ownership_freightTransport;

    await this.loadAirPorts()

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
       
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();

  }

  async loadAirPorts(){
    this.departure_ports = (await this.serviceProxy.getManyBasePassengerAirPortControllerPassengerAirPort(
      undefined, undefined, undefined, undefined, undefined, undefined, 4000, 0, 1, 0
    ).toPromise()).data
  }

  setAction(){
    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if(id){
      this.editEntryId = parseInt(id);
      this.isNewEntry = false;
    }
  }
  
  async setCreator(){
    let u = await this.appService.getUser();
    if(u){
      this.creator = u;
      this.passengerAir.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_air)
  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.passengerAir.unit && this.passengerAir.unit.id){
          this.selectedUnit = this.passengerAir.unit;
        }
      }
    }
    this.passengerAir.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.passengerAir.mobile = false;
      this.passengerAir.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.passengerAir.project, PuesDataReqDtoSourceName.Passenger_air, this.selectedUnit);    
  }

  isMobileChange(){
    this.passengerAir.mobile = this.isMobile;
    this.passengerAir.stationary = !this.isMobile;
  }

  async getProject(id: number){
    let res = await this.serviceProxy.getOneBaseProjectControllerProject(
      id,
      undefined,
      undefined,
      0
    ).toPromise();
    return res;
  }

  async monthCgange(){
    await this.validateMonth(
      PuesDataReqDtoSourceName.Passenger_air.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.passengerAir.year.toString(), this.month.value, this.passengerAir)
    let e = this.passengerAir.project;
    if(this.month && this.month.value === 12 && e){
      this.passengerAir.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.passengerAir.project = e;
    this.passengerAir.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Passenger_air)
  }

  async setInitialState(){
    if (this.editEntryId && this.editEntryId > 0) {
      let res = await this.serviceProxy.getOneBasePassengerAirActivityDataControllerPassengerAirActivityData(
        this.editEntryId,
        undefined,
        undefined,
        0
      ).toPromise();
      this.passengerAir = res;
      let project = await this.getProject(this.passengerAir.project.id);
      if (project){
        this.passengerAir.project = project;
        this.isMobile = this.passengerAir.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m => m.value === this.passengerAir.month);
      this.ownership = this.ownership_freightTransport.find(o => o.name === this.passengerAir.ownership);

      // this.option = this.options_passenger_air.find(o => o.code === this.passengerAir.option);
      // this.departure_port = this.passengerAir.departurePort
      // this.destination_port = this.passengerAir.destinationPort
      // this.transist1 = await this.getAirport(this.passengerAir.transist1)
      // this.transist2 = await this.getAirport(this.passengerAir.transist2)
      await this.search({value: this.passengerAir.departurePort}, 'departure')
      if (this.passengerAir.transist1) {
         await this.search({ value: this.passengerAir.transist1 }, 'trans1') 
        }
      if (this.passengerAir.transist2){
        await this.search({value: this.passengerAir.transist2}, 'trans2')
        this.addTrans = true
      }
      this.employees = this.passengerAir.noOfEmployees
      this.cabin_class = this.class_passenger_air.find(o => o.code === this.passengerAir.cabinClass)
      this.domesticInternational = this.domesticInternationals.find(o => o.code === this.passengerAir.domOrInt)
      if (this.passengerAir.paidByCompany) this.checked = [this.passengerAir.paidByCompany]

    }else{
      this.setCreator();
    }
  }


  async save(airForm: NgForm){
    this.creating = true;
    try{
      if (airForm.valid && this.passengerAir.project.id) {
        this.computeEmission().then(() => {
          this.passengerAir.e_sc = this.totalEmission
  
          this.passengerAir.month = this.month.value
          this.passengerAir.ownership = this.ownership.name
          // this.passengerAir.option = this.option.codecity_name
          // this.passengerAir.departurePort = this.departure_port
          // this.passengerAir.transist1 = this.transist1 ? this.transist1 : ""
          // this.passengerAir.transist2 = this.transist2 ? this.transist2 : ""
          // this.passengerAir.destinationPort = this.destination_port
          this.passengerAir.cabinClass = this.cabin_class.code
          this.passengerAir.noOfEmployees = this.employees
          this.passengerAir.domOrInt = this.domesticInternational.code
          if (this.isNewEntry) {
            this.serviceProxy
              .createOneBasePassengerAirActivityDataControllerPassengerAirActivityData(this.passengerAir)
              .subscribe((res: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'has saved successfully',
                  closable: true,
                });
                console.log('Freight road', res);
                setTimeout(() => {
                  this.onBackClick();
                }, 500);
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
                  this.creating = false;
                }
              );
          } else {
            this.serviceProxy.updateOneBasePassengerAirActivityDataControllerPassengerAirActivityData(this.passengerAir.id, this.passengerAir)
              .subscribe(
                (res: any) => {
                  this.passengerAir.e_sc = res.e_sc;
  
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'has updated successfully',
                    closable: true,
                  });
                  // console.log('FreightRoad', res)
                  setTimeout(() => {
                    this.onBackClick();
                  }, 500);
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
                  this.creating = false;
                }
              );
          }
        })
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Required',
          detail: 'Fill All Mandatory fields',
          closable: true,
        });
        this.creating = false
      }
    } catch(err){
      console.log(err)
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      this.creating = false
    }

   

  }

  async computeEmission() {
    let num = this.passengerAir.transist1 ? (this.passengerAir.transist2 ? 3: 2) :1
    let obj: any = {}
    if (this.passengerAir.transist2 ){
      obj["arrCode1"] = this.passengerAir.transist1
      obj["arrCode2"] = this.passengerAir.transist2
      obj["arrCode3"] = this.passengerAir.destinationPort
    } else {
      if (this.passengerAir.transist1 ){
        obj["arrCode1"] = this.passengerAir.transist1
        obj["arrCode2"] = this.passengerAir.destinationPort
        obj["arrCode3"] = "#"
      } else {
        obj["arrCode1"] =  this.passengerAir.destinationPort
        obj["arrCode2"] = "#"
        obj["arrCode3"] = "#"
      }
    }
    let triptype = this.options_passenger_air.find(o => o.code === this.passengerAir.option)
    let payload = {
      userID: "ICEC",
      unitofMeasureTag: 1,
      triptype: triptype?.name,
      cabinclass: this.cabin_class.name,
      noofpassenger: this.employees,
      noofArrAirport: num,
      depCode: this.passengerAir.departurePort,
      TypeCargoPassenger: 'Passenger',
      NumberKg: 1,
      BellyFreighter: 'Freighter',
      ...obj
    }

    let body = new IcaoDto();
    body.url = "https://applications.icao.int/icec/Home/Compute";
    body.body = payload;
    try{
      let data = await this.passengerAirActivityDataControllerServiceProxy.icaoApi(body).toPromise();
      data = data.replace(/\s*\<hr.*?\/>\s*/g, '')
      data = data.split('<div class="body-content">')[1]
      
      try{
        var doc = new DOMParser().parseFromString(data, "text/xml");
        var myTab = doc.getElementsByTagName('table')[0]
        let row = myTab.getElementsByTagName('tr')[0]
        let th = row.getElementsByTagName('td')[0]
        let div = th.getElementsByTagName('div')[0]
        let label = div.getElementsByTagName('label')[1]
        if (label.textContent){
          this.totalEmission = parseFloat(label.textContent)
        } else {
          this.passengerAir.e_sc = 0
        }
      }catch(err){
        this.passengerAir.e_sc = 0
      }
    }catch(err){
      this.passengerAir.e_sc = 0
    }
  }

  onBackClick() {
    this.router.navigate(['app/emission/transport-list'],{state: {mainTabIndex: 1, subTabIndex:0, subTabIndexCode: IndexCode.AIR} } );
  }

  onDeleteClick() {
    
  }

  async search(e: any, type: string){
    let payload = {
      depCode:  e.value
    }
    let body = new IcaoDto();
    body.url = "https://applications.icao.int/icec/Home/GetAirportsByDep";
    body.body = payload
    this.passengerAirActivityDataControllerServiceProxy.icaoApi(body).subscribe(res=>{
      if (type === "departure"){
        this.destination_ports = res;
        this.transist1_ports = res;
        this.transist2_ports = res;
      } else if (type === "trans1"){
        this.destination_ports = res;
        this.transist2_ports = res;
      }else if (type === "trans2"){
        this.destination_ports = res;
      }
    },errr=>{

    })
      
  }

  async search2(e: any){
    let payload = {
      keyword1:"ABE",
      keyword2:"h"
    }
    let body = new IcaoDto();
    body.url = "https://applications.icao.int/icec/Home/AutoCompletedByDep";
    body.body = payload
    this.passengerAirActivityDataControllerServiceProxy.icaoApi(body).subscribe(res=>{
      this.results = res;
    },errr=>{

    })

  }

  addTransist(){
    this.addTrans = !this.addTrans
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Passenger_air);
    }
  }

  check(){
    this.passengerAir.paidByCompany = this.checked[0]
  }


}
