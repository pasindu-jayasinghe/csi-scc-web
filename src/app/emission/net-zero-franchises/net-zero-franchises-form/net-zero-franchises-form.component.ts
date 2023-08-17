import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { MasterDataService, SourceType } from 'app/shared/master-data.service';
import { AppService } from 'shared/AppService';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EmissionCreateBaseComponent } from 'app/emission/emission-create-base/emission-create-base.component';
import { ServiceProxy, FranchisesActivityDataDto, User, Unit, PuesDataDto, Project, Country, ProjectUnitEmissionSourceControllerServiceProxy, FranchisesActivityDataControllerServiceProxy, PuesDataReqDtoSourceName, FranchisesActivityDataDtoMethod, FreightAirActivityData, SpecificMethodParameters, SampleGroupParameters, AverageDataMethodFloorSpaceDataParameters, AverageDataMethodNotFloorSpaceDataParameters, NotSubMeteredParameters } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-net-zero-franchises-form',
  templateUrl: './net-zero-franchises-form.component.html',
  styleUrls: ['./net-zero-franchises-form.component.css']
})
export class NetZeroFranchisesFormComponent extends EmissionCreateBaseComponent implements OnInit {



  franchises: FranchisesActivityDataDto = new FranchisesActivityDataDto();
  creator: User;
  selectedUnit: Unit;

  
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  groupNumber: string;
  puesData: PuesDataDto;
  isProjectSelected: boolean = false;

  public institutions: any[] = [];
  public projects: Project[] = [];
  public years: any[] = [];
  public months: {name: string, value: number}[] = []
  public fuel:any[] = []
  public units:any
  public types:any
  month: any;
  fuelType:any;
  unit:any
  isMobile: boolean;
  ownerships:{id: number, name: string}[] = []


  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  creating: boolean = false;

  building_types:any
  method: any;
  countries: Country[] = [];
  public genUnits: any;
  public genUnit: any

  public methods: { name: string, code: FranchisesActivityDataDtoMethod}[] = []
  public methods_franchise: { name: string, value:string }[] = []


  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private masterDataService: MasterDataService,
    private activatedRoute:ActivatedRoute,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService,
    protected projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    protected franchisesActivityDataControllerServiceProxy: FranchisesActivityDataControllerServiceProxy,
  
  ) { 
    super(appService, serviceProxy, projectUnitEmissionSourceControllerServiceProxy, messageService);
  }
  public get franchisesActivityDataDtoMethod(): typeof FranchisesActivityDataDtoMethod {
    return FranchisesActivityDataDtoMethod; 
  }

  async ngOnInit() {  

    this.months = this.masterDataService.months;
    this.fuel = this.masterDataService.fuel;
    this.units = this.masterDataService.net_zero_franchises_units;
    this.ownerships =this.masterDataService.ownership_freightTransport;
    this.methods_franchise = this.masterDataService.methods_franchise
    this.building_types = this.masterDataService.building_types;

    let keys = Object.keys(FranchisesActivityDataDtoMethod);
    for(let i = 1; i < keys.length; i = i+2){
      this.methods.push({
        name: keys[i].toLowerCase(),
        code: keys[i] as unknown as FranchisesActivityDataDtoMethod
      })
    }
    

    this.setAction();
    await this.setInitialState();
    await this.setUnit();
   
    console.log('this.franchises',this.franchises)
    this.isAnyAdmin = this.appService.isAnyAdmin(); 
    this.isProjectSelected = true;

    await super.ngOnInit();
  }

  async getCountries(){
    const res = await this.serviceProxy.getManyBaseCountryControllerCountry(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res: any) => {
      this.countries = res.data
    })
  }

  public get sourceType(): typeof SourceType {
    return SourceType; 
  }
  
  setAction(){
    this.route.url.subscribe(r => {
      if(r[0].path.includes("view")){
        this.isView =true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if(id){
      // this.editEntryId = parseInt(id);
      this.groupNumber=id;
      this.isNewEntry = false;
    }
  }
  
  async setCreator(){
    let u = await this.appService.getUser();
    if(u){
      this.creator = u;
      this.franchises.user = this.creator;
    }
  }

  onUpdateUnit(unit:Unit){
    
    this.selectedUnit = unit;
    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Franchises)

  }

  async setUnit(){
    if(!this.selectedUnit){
      if(this.isNewEntry){ // unit is not seleted form dropdown when creating. Then it will set from current user's unit
        let u = await this.appService.getLogedUnit(); 
        if(u){
          this.selectedUnit = u;
        }
      }else{        
        if(this.franchises.unit && this.franchises.unit.id){
          this.selectedUnit = this.franchises.unit;
        }
      }
    }
    this.franchises.unit = this.selectedUnit;
    this.projectAndSelectService.onChangeUnit(this.selectedUnit); 
  }

  async setPUESData(){
    if(this.isNewEntry){
      this.franchises.mobile = false;
      this.franchises.stationary = false;
      
      //@ts-ignore
      this.isMobile = null;
    }
    await this.setUnit();
    this.puesData = await this.appService.getPUESData(this.franchises.project, PuesDataReqDtoSourceName.Franchises, this.selectedUnit);    
  }

  isMobileChange(){
    this.franchises.mobile = this.isMobile;
    this.franchises.stationary = !this.isMobile;
  }



  async monthCgange(){
    await this.validateMonth(
      PuesDataReqDtoSourceName.Franchises.toString(), this.selectedProject.id, this.selectedUnit.id, 
      this.franchises.year.toString(), this.month.value, this.franchises)
    let e = this.franchises.project;
    if(this.month && this.month.value === 12 && e){
      this.franchises.year = this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo, true);
    }
  }

  onChangeProject(e:Project){
    this.selectedProject = e;
    this.franchises.project = e;
    this.franchises.year =  this.appService.getYear(e.isFinancialYear, e.year, e.fyFrom, e.fyTo);

    this.setPUESData();
    this.checkAccess();
   super.changeAccess(PuesDataReqDtoSourceName.Franchises)
  }

  removeRow(data:any,index:number){
  
    if(this.groupNumber){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this data?',
        header: 'Delete Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: () => {
         this.franchisesActivityDataControllerServiceProxy.deleteOneRow(data[index].id).subscribe(a=>{

          data.splice(index, 1);
         });
        },
        reject: () => { },
      });
    }else{

      data.splice(index, 1);
    }
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

  async setInitialState(){
    if (this.groupNumber ) {
      let res = await this.franchisesActivityDataControllerServiceProxy.getOneFranchisesDataSet(
        this.groupNumber,       
      ).toPromise();

      this.franchises = res;
      let project = await this.getProject(this.franchises.project.id);
      if (project){
        this.franchises.project = project;
        this.isMobile = this.franchises.mobile;
        await this.setPUESData();
      }
      this.month = this.months.find(m=>m.value===this.franchises.month);
    }else{    
      this.setCreator();
    }
  }





  hasEnterEnyValue(){
    console.log("DISSSSS")
    let av = this.franchises.average_data_method_floor_space_data.data.length > 0;
    let avn = this.franchises.average_data_method_not_floor_space_data.data.length > 0;
    let samp = this.franchises.sample_groups_data.data.length > 0;
    let spec = this.franchises.specific_method_data.data.length > 0;
    let nsm = this.franchises.not_sub_metered_data.data.length > 0;

    console.log(av,avn,samp,this.franchises.specific_method_data.data,nsm)

    return av || avn || samp || spec || nsm;
  }


  async save(genForm: NgForm) {
    await this.setUnit();
    this.creating=true;

    if(genForm.valid && this.franchises.project.id){
      this.franchises.month = this.month.value
      // this.generator.fuelType = this.fuelType.code
      // this.franchises.fc_unit = this.unit.code


      console.log("ssss",this.franchises)

      if (this.isNewEntry) {

        this.franchisesActivityDataControllerServiceProxy
          .createOne(this.franchises)
          .subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            this.creating = false;
            setTimeout(() => {
              this.onBackClick();
            }, 500);
            },
            (error) => {
              this.creating = false
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
              this.creating = false;
            },
            () => {
              this.creating = false;
            }
          );


      } else {
        this.franchisesActivityDataControllerServiceProxy
        .createOne(this.franchises)
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          this.creating = false;
          setTimeout(() => {
            this.onBackClick();
          }, 500);
          },
          (error) => {
            this.creating = false
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
            console.log('Error', error);
            this.creating = false;
          },
          () => {
            this.creating = false;
          }
        );
      }
    } else{
      this.creating = false
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      
     }
  }

  async onSelectMethod(selected:any){
    console.log(selected.value);
    // await this.getCountries();
    switch(this.franchises.method){
      case FranchisesActivityDataDtoMethod.SPECIFICMETHOD:
        this.franchises.specific_method_data.data.push(new SpecificMethodParameters());
        break;
      case FranchisesActivityDataDtoMethod.NOTSUBMETERED:
        this.franchises.not_sub_metered_data.data.push(new NotSubMeteredParameters());
        break;
      case FranchisesActivityDataDtoMethod.SAMPLEGROUPS:
        this.franchises.sample_groups_data.data.push(new SampleGroupParameters());
        break;
      case FranchisesActivityDataDtoMethod.AVERAGEDATAMETHODFLOORSPACE:
        this.franchises.average_data_method_floor_space_data.data.push(new AverageDataMethodFloorSpaceDataParameters());
        break;
      case FranchisesActivityDataDtoMethod.AVERAGEDATAMETHODNOTFLOORSPACE:
        this.franchises.average_data_method_not_floor_space_data.data.push(new AverageDataMethodNotFloorSpaceDataParameters());
        break;

    }
    console.log("FFF",this.franchises.specific_method_data.data)

  }
  addNewDataObject(method:FranchisesActivityDataDtoMethod){
    switch(this.franchises.method){
      case FranchisesActivityDataDtoMethod.SPECIFICMETHOD:
        this.franchises.specific_method_data.data.push(new SpecificMethodParameters());
        break;
      case FranchisesActivityDataDtoMethod.NOTSUBMETERED:
        this.franchises.not_sub_metered_data.data.push(new NotSubMeteredParameters());
        break;
      case FranchisesActivityDataDtoMethod.SAMPLEGROUPS:
        this.franchises.sample_groups_data.data.push(new SampleGroupParameters());
        break;
      case FranchisesActivityDataDtoMethod.AVERAGEDATAMETHODFLOORSPACE:
        this.franchises.average_data_method_floor_space_data.data.push(new AverageDataMethodFloorSpaceDataParameters());
        break;
      case FranchisesActivityDataDtoMethod.AVERAGEDATAMETHODNOTFLOORSPACE:
        this.franchises.average_data_method_not_floor_space_data.data.push(new AverageDataMethodNotFloorSpaceDataParameters());
        break;
    }   
    console.log("ADD", this.franchises.not_sub_metered_data.data)
     
  }









  onBackClick() {
    this.router.navigate(['app/emission/net-zero-franchises-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        // this.deleteWholeGroup();
      },
      reject: () => { },
    });
  }

  deleteWholeGroup() {

    this.franchisesActivityDataControllerServiceProxy.deleteWholeGroup(this.franchises.groupNo)
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      },error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred, please try again',
          closable: true,
        });
      }, ()=> {
        this.onBackClick();
      })
  }

  async checkAccess(){
    if(this.selectedProject && this.selectedUnit){
      await this.hasPUES(this.selectedUnit.id, this.selectedProject, PuesDataReqDtoSourceName.Franchises);
    }
  }

  onUpdateFuel(event: string,fuel:any) {
    fuel.fuel_type = event;
  }

}
