import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AppService,   RecordStatus, SavedData } from 'shared/AppService';
import { Methodology, Project, ProjectControllerServiceProxy, ProjectStatus, ProjectType, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import {Roles, ServiceProxy as AuthServiceProxy, UserActions} from 'shared/service-proxies/auth-service-proxies'
import { MasterDataService } from 'app/shared/master-data.service';

@Component({
  selector: 'app-project-basic-data',
  templateUrl: './project-basic-data.component.html',
  styleUrls: ['./project-basic-data.component.css']
})
export class ProjectBasicDataComponent implements OnInit {

  public roles = Roles
  public userActions = UserActions

  creator: User;

  @Input() isView: boolean = false;
  @Input() isNewEntry: boolean = true;
  @Input() editEntryId: number;
  @Input() project: Project;

  @Output() onSaveBasicProject = new EventEmitter<Project>();
  @Output() onChangeOwnerUnit = new EventEmitter<Unit>();


  isSetOwnerUnit: boolean = false;
  
  year: number;
  methodologies: Methodology[] = []
  projectTypes: ProjectType[] = []
  auditors: User[] = []

  parentUnits: Unit[] = [];
  parentUnit: Unit;
  responsibleUsers: User[] = []

  orgBoundaries: {name: string, code: string}[] 
  controlApproaches:  {name: string, code: string}[] 

  selectedUser: string = ''

  nameExist:boolean = false

  thisyear: number;
  maxDateVal: Date;

  
  constructor(
    private projectServiceProxy: ProjectControllerServiceProxy,
    private messageService: MessageService,
    private serviceProxy: ServiceProxy, 
    private route: ActivatedRoute,
    private router: Router,
    public appService: AppService,
    private authServiceProxy: AuthServiceProxy,
    private masterdataService: MasterDataService
  ) {

  }

  async ngOnInit(): Promise<void> {

    let today = new Date();
    this.thisyear = today.getFullYear();

    this.maxDateVal = new Date();
    this.maxDateVal.setFullYear(this.thisyear);
    this.maxDateVal.setMonth(11);
    this.maxDateVal.setDate(31);
    
    this.orgBoundaries = this.masterdataService.orgBoundaries;
    this.controlApproaches = this.masterdataService.controlApproaches;

    await this.getAuditors();
    await this.getResponsibleUsers();
    await this.geyMethodologies();
    await this.getProjectTypes();
    await this.setInitialValues();
    await this.getUnits();


  
  }

  setYear(){
    if(this.project.year){
      const d = new Date();
      if(!this.project.isFinancialYear){
        d.setFullYear(parseInt(this.project.year))
        //@ts-ignore
        this.year = d;
      }    
    } else {
      // this.project.year = this.project.fyFrom
      let from = new Date(moment(this.project.fyFrom).format("YYYY-MM-DD HH:mm:ss"));
      let to = new Date(moment(this.project.fyTo).format("YYYY-MM-DD HH:mm:ss"));
      // this.project.year = from.getFullYear() + "/" + from.getFullYear() 
    }
  }

  setFyFrom(){
    if(this.project.fyFrom){  
      let convertTime = moment(this.project.fyFrom).format("YYYY-MM-DD HH:mm:ss");
      let convertTimeObject = new Date(convertTime);
      //@ts-ignore
      this.project.fyFrom = convertTimeObject;
    }
  }

  setFyTo(){
    if(this.project.fyTo){
      let convertTime = moment(this.project.fyTo).format("YYYY-MM-DD HH:mm:ss");
      let convertTimeObject = new Date(convertTime);
      //@ts-ignore
      this.project.fyTo = convertTimeObject;
    }
  }

  async setInitialValues(){
    if(this.editEntryId){
      await this.getProject(this.editEntryId);
    }else{
      this.project = new Project()
      this.setCreator();
    }
  }

  async getProjectTypes(){
    try{
      let data = localStorage.getItem(SavedData.projectTypes);
      if(data){
        let str = JSON.parse(data) as any[];
        let list: ProjectType[] = [];
        str.forEach(uu => {
          let nu = new ProjectType();
          nu.init(uu)
          list.push(nu);
        })
        this.projectTypes = list;
      }else{
        let res = await this.serviceProxy.getManyBaseProjectTypeControllerProjectType(
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
        ).toPromise();
        this.projectTypes = res.data;
        localStorage.setItem(SavedData.projectTypes, JSON.stringify(this.projectTypes));
      }      
    }catch(err){
      this.projectTypes = []
    }
  }

  async geyMethodologies(){
    try{
      let data = localStorage.getItem(SavedData.methodologies);
      if(data){
        let str = JSON.parse(data) as any[];
        let list: Methodology[] = [];
        str.forEach(uu => {
          let nu = new Methodology();
          nu.init(uu)
          list.push(nu);
        })
        this.methodologies = list;
      }else{
        let res = await this.serviceProxy.getManyBaseMethodologyControllerMethodology(
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
        ).toPromise();
        this.methodologies = res.data;
        localStorage.setItem(SavedData.methodologies, JSON.stringify(this.methodologies));
      }
    }catch(err){
      this.methodologies = []
    }
  }

  async setCreator(){
    let u = await this.appService.getUser();
    if(u){
      this.creator = u;
      this.project.enteredBy = this.creator;
    }
  }

  async getProject(id: number){

    try{
      this.project = await this.serviceProxy.getOneBaseProjectControllerProject(id, undefined, undefined, 0).toPromise();
      
      this.setFyFrom();
      this.setFyTo();

      if(this.project.verifier && this.project.verifier.id){
        let v = this.auditors.find(a => a.id ===this.project.verifier.id)
        if(v){
          this.project.verifier = v;
        }
      }

      if(this.project.methodology && this.project.methodology.id){
        let m=this.methodologies.find(m =>m.id === this.project.methodology.id);
        if(m){
          this.project.methodology = m;
        }
      }

      this.setYear();   
      this.setResp();
    }catch(err){
      console.error(err);
    }
  }


  async change(){

    if(this.project.ownerUnit && this.project.ownerUnit.id){
      this.getResponsibleUsers();
      this.isSetOwnerUnit = true;
      this.onChangeOwnerUnit.emit(this.project.ownerUnit);
    }

    if (this.isNewEntry) this.setName();

    let filters = ['name||$eq||'+ this.project.name, 'projectStatus||$ne||Initial',"status||$ne||"+RecordStatus.Deleted,]
    // if(this.appService.isOnlyForcalPoint()){
    //   let ids = this.appService.getAllowedFtProjectIds();
    //   if(ids.length > 0){
    //     filters.push("id||$in||"+ids.join(","))
    //   }
    // }
    let res = await this.serviceProxy.getManyBaseProjectControllerProject(
      undefined, 
      undefined,
      filters,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      1,
      0
    ).toPromise();

    if (res.data.length > 0){
      if(res.data.length ===1){
        if(res.data[0].id === this.project.id){
          this.nameExist = false;
        }else{
          this.nameExist = true
        }
      }else{
        this.nameExist = true
      }
    } else {
      this.nameExist = false
    }
    
    if (this.project.organizationalBoundary === 'Equity share'){[
      this.project.controlApproach = ''
    ]}

    if(this.project.isFinancialYear){
      let f = new Date(moment(this.project.fyFrom).format("YYYY-MM-DD HH:mm:ss")).getFullYear().toString();
      let t = new Date(moment(this.project.fyTo).format("YYYY-MM-DD HH:mm:ss")).getFullYear().toString();
      let y = f +"/"+ t.slice(2);
      this.project.year = y;
    }

    if(this.year && !this.project.isFinancialYear){
      this.project.year = new Date(this.year).getFullYear().toString();  

      //@ts-ignore
      this.project.fyFrom = null;
       //@ts-ignore
      this.project.fyTo = null;
    }


    if(
      this.project.ownerUnit && this.project.ownerUnit.id &&
      this.project.name && 
      this.project.projectType && 
      this.project.projectType.id  && 
      this.project.methodology &&
      this.project.methodology.id      
      && !this.isInFuture() &&
      !this.nameExist
    ){
      if(this.project.isFinancialYear){
        if(this.project.fyFrom && this.project.fyTo){          
          this.save();
        }
      }else{
        if(this.project.year){
          this.save();
        }
      }
    }
  }

  async save(){
    console.log(this.project);
    try{

      if(this.project && ((this.project.responsiblePerson && !this.project.responsiblePerson.id) || !this.project.responsiblePerson)){
        //@ts-ignore
        this.project.responsiblePerson = null;
      }

      this.isSetOwnerUnit = false;
      if(this.isNewEntry){
        this.project.projectStatus = ProjectStatus.Initial;
                
        this.project = await this.serviceProxy.createOneBaseProjectControllerProject(this.project).toPromise();
        this.editEntryId = this.project.id;
        this.isNewEntry = false;
        this.getUnits();
      }else{
        this.project = await this.serviceProxy.updateOneBaseProjectControllerProject(this.editEntryId, this.project).toPromise();
        this.getUnits();
      }
      this.setInitialValues();
      this.onSaveBasicProject.emit(this.project);
    }catch(err){
      console.log(err);
    }
  }

  async getAuditors(){
    let filter = [ "status||$ne||"+RecordStatus.Deleted, "roles.code||$eq||"+Roles.AUDITOR];

    let auditors = await this.authServiceProxy.getManyBaseLoginProfileControllerLoginProfile(
      ["id"],
      undefined,
      filter,
      undefined,
      undefined,
      ['roles'],
      1000,
      0,
      0,
      0
    ).toPromise();
    let auditorsIds = auditors.data.map(a => a.id);
    if (auditorsIds.length > 0){

      let userFilter = [ "status||$ne||"+RecordStatus.Deleted, "loginProfile||$in||"+auditorsIds.join(',')];
  
      let userRes = await this.serviceProxy.getManyBaseUsersControllerUser(
        undefined,
        undefined,
        userFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).toPromise();
      this.auditors = userRes.data;
    }
  }

  fyStartChaange(){
    let d = moment(this.project.fyFrom).add(1, 'years');
    this.project.fyTo = d;
    this.setFyTo()
    this.change();
  }

  async getUnits(){
    try{
      let list: Unit[] = [];
      let data = localStorage.getItem(SavedData.parentUnits);
      if(data){
        let str = JSON.parse(data) as any[];
        str.forEach(uu => {
          let nu = new Unit();
          nu.init(uu)
          list.push(nu);
        })
      }else{
        let res = await this.serviceProxy.getManyBaseUnitControllerUnit(
          undefined,
          undefined,
          [ "status||$ne||"+RecordStatus.Deleted,  "parentUnit.id||$isnull"],
          undefined,
          undefined,
          undefined,
          3000,
          0,
          0,
          0
        ).toPromise();
        list = res.data;
      }
      let units = list.filter((u: any) => u.parentUnit.id === undefined);
      this.parentUnits = units;      
      if(!data){
        localStorage.setItem(SavedData.parentUnits, JSON.stringify(this.parentUnits));
      }
      if(this.project && this.project.ownerUnit.id){
        let u = this.parentUnits.find(u => u.id === this.project.ownerUnit.id) 
        if(u){
          this.parentUnit = u;
          this.project.ownerUnit = u;
          this.isSetOwnerUnit = true;
          this.onChangeOwnerUnit.emit(this.parentUnit);
        }
      }
    }catch(err){
      console.error(err);
    }
  }

  setName(){
    if(this.project.ownerUnit && this.project.methodology){
      if(this.project.isFinancialYear && this.project.fyFrom && this.project.fyTo){

        let sy = moment(this.project.fyFrom).year()
        let ey = moment(this.project.fyTo).year()

        let name = `${this.project.projectType.name} Calculation for ${this.project.ownerUnit.name} for ${sy}/${ey.toString().slice(-2)}`
        this.project.name = name;

      }else if(!this.project.isFinancialYear && this.project.year){
        let name = `${this.project.projectType.name} Calculation for ${this.project.ownerUnit.name} for ${this.project.year}`
        this.project.name = name;
      }
    }
  }
  async getResponsibleUsers () {
    let filter = [ "status||$ne||"+RecordStatus.Deleted];
    if(this.project && this.project.ownerUnit && this.project.ownerUnit.id){
      filter.push("unit.id||$eq||"+this.project.ownerUnit.id)
    }

    let currentResUserId;
    if(this.responsibleUsers.length > 0){
      currentResUserId = this.responsibleUsers[0].unit.id;
    }

    if(!(currentResUserId && this.project && this.project.ownerUnit.id === currentResUserId)){
      let userRes = await this.serviceProxy.getManyBaseUsersControllerUser(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        ['unit'],
        1000,
        0,
        0,
        0
      ).toPromise();
      this.responsibleUsers = userRes.data;
      this.setResp();
    }
  }

  setResp(){
    if(this.project && this.project.responsiblePerson && this.project.responsiblePerson.id && this.responsibleUsers){
        let rp = this.responsibleUsers.find(r=> r.id === this.project.responsiblePerson.id);
        if(rp){
          this.project.responsiblePerson = rp;
        }
    }
  }

  setUser(e: any){
    this.change();
  }


  isInFuture(){
    if(this.project.isFinancialYear){
      return false;
    }
    return this.thisyear < new Date(this.year).getFullYear();
  }

}
