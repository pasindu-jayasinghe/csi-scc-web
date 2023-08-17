import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityDataService } from 'app/shared/activity-data/activity-data.service';
import { MasterDataService } from 'app/shared/master-data.service';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { EvidenceRequestComponent } from 'app/verification/evidence-request/evidence-request.component';
import { environment } from 'environments/environment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { User, EvidenceRequestEsCode, ServiceProxy, EvidenceRequestEvidenceStatus, ProjectStatus, Project, Unit, EmissionSource, PuesDataDtoSourceType, PuesDataReqDtoSourceName } from 'shared/service-proxies/service-proxies';
import { ReqeustDetailComponent } from '../request-detail/request-detail.component';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {

  @Input() title: string;
  @Input() type: string;

  public roles = Roles
  public userActions = UserActions

  public loading: boolean;
  public totalRecords: number;
  public rows: number;
  public requestList: any[] = [];
  public ref: DynamicDialogRef;
  public addEvidenceDialog:boolean = false
  public uploadedFile: any;
  public baseUrl:any = environment.baseUrlAPI;
  public comment:string = ""
  public evidence:any;

  private logedUser: User;
  public selectedProject: Project;
  public selectedUnit: Unit;
  public isAnyAdmin: boolean;
  public isCSIUser: boolean;
  public isAuditor: boolean;

  public emissionSourceList:EmissionSource[];
  public statusList: EvidenceRequestEvidenceStatus[]=[EvidenceRequestEvidenceStatus.Pending, EvidenceRequestEvidenceStatus.Uploaded, EvidenceRequestEvidenceStatus.Returned, EvidenceRequestEvidenceStatus.Approved, EvidenceRequestEvidenceStatus.Rejected];

  public selectedEmissionSource:EvidenceRequestEsCode
  public selectedStatus: EvidenceRequestEvidenceStatus 
  public units: Unit[];
  public projects: Project[];

  constructor(
    public serviceProxy: ServiceProxy,
    public dialogService: DialogService,
    public http: HttpClient,
    public messageService: MessageService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public appService: AppService,
    private activityDataService: ActivityDataService,
    private masterDataService: MasterDataService
  ) { }

  async ngOnInit() {
    this.isAnyAdmin = this.appService.isAnyAdmin()
    this.isCSIUser = this.appService.isCSIUser()

    console.log(this.isAnyAdmin, this.isAuditor)
    

    let u = await this.appService.getUser();
    if (u) {
      this.logedUser = u;
    }
    this.load({})
    await this.getESList()

    await this.getUnits()
  }

  async getESList(){
    try{
      let res = await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
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
  
      this.emissionSourceList = res.data;
    }catch(err){
      this.emissionSourceList = [];
    }
  }

  load(event: LazyLoadEvent) {
    this.loading = true;
    this.totalRecords = 0;

    let pageNumber = event.first === 0 || event.first == undefined ? 1
      :event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;


    let filterText = [
       "status||$ne||"+RecordStatus.Deleted, 
      //  "project.projectStatus||$in||"+[ProjectStatus.Verification_Pending, ProjectStatus.Evidence_Pending],
        "evidenceStatus||$ne||"+EvidenceRequestEvidenceStatus.Rejected
      ]

    if (this.logedUser) {
      if (!this.isCSIUser){
        if (this.type == 'other') {
          filterText.push("requestFrom.id||$eq||" + this.logedUser.id)
        } else {
          filterText.push("verifier.id||$eq||" + this.logedUser.id)
        }
      }

      if (this.selectedProject){
        filterText.push("project.id||$eq||" + this.selectedProject.id)
      }

      if (this.selectedEmissionSource){
        filterText.push("esCode||$eq||" + this.selectedEmissionSource)
      }

      if (this.selectedStatus){
        filterText.push("evidenceStatus||$eq||" + this.selectedStatus)
      }

      this.serviceProxy.getManyBaseEvidenceRequestControllerEvidenceRequest(
        undefined,
        undefined,
        filterText,
        undefined,
        undefined,
        ['requestFrom', 'verifier','project'],
        this.rows,
        0,
        pageNumber,
        0).subscribe(async (res: any) => {
          this.requestList = res.data;
          this.totalRecords = res.total;
          this.loading = false;

          this.requestList = await Promise.all(
            this.requestList.map(async req => {
              let activityData
              = await this.activityDataService.getOneActivityData(req.activityDataId, req.esCode)
              if (req.esCode === PuesDataReqDtoSourceName.Fire_extinguisher){
                let project_id = activityData?.project.id
                if (project_id){
                  let project = await this.serviceProxy.getOneBaseProjectControllerProject(project_id, undefined, undefined, 0). toPromise()
                  if (project){
                    return ({ ...req, ...{ project: project, activityData: activityData } })
                  } else {
                    return ({ ...req, ...{ project: activityData?.project, activityData: activityData } })
                  }
                } else { return ({ ...req, ...{ project: activityData?.project, activityData: activityData } }) }
              } else {return ({ ...req, ...{ project: activityData?.project, activityData: activityData } })}
            })
          ).then(_res => { return _res; })
        })
    }
  }

  view(data: any) {
    this.addEvidenceDialog = true
    this.evidence = data

    this.ref = this.dialogService.open(ReqeustDetailComponent, {
      header: this.title,
      width: '45%',
      contentStyle: { 'max-height': '600px', overflow: 'auto' },
      baseZIndex: 10000,
      data: {data:data},
      closable: false
    });

    this.ref.onClose.subscribe(r => {
      this.load({})
    })
  }

  async onUpdateUnit(unit: Unit){
    this.selectedUnit = unit;
  }

  async getUnits(){
    let filter = [ "status||$ne||"+RecordStatus.Deleted]
    if(this.appService.isOnlyOperationalAdmin()){
      let ids = this.appService.getAllowedUnitIds()
      if(ids.length > 0){
        filter.push("id||$in||"+ids.join(","))
      }
    }
    let res = await this.serviceProxy.getManyBaseUnitControllerUnit(
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      ['country','industry'],
      3000,
      0,
      0,
      0
    ).toPromise()
    this.units = res.data;
  }

  onChangeProject(e: Project){
    this.selectedProject = e;
    this.load({});
  }
  onChangeProject_(){
    this.load({});
  }

  async gotoVerify(data: any){
    console.log("data---", data)
    // let es = await this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
    //   undefined,
    //   undefined,
    //   ['code||$eq||' + data.esCode],
    //   undefined,
    //   undefined,
    //   undefined,
    //   1000,
    //   0,
    //   1,
    //   0
    // ).toPromise()
    // this.router.navigate(['/app/verification/emission-source-detail'],
    //   {
    //     queryParams: { id: es.data[0].id, projectId: data.project.id },
    //     state: { user: 1 },
    //     // relativeTo: this.activatedRoute
    //   });
    let _data = {data: data.activityData, unit: data.activityData.unit.name , type:data.esCode, parameter: data.parameter, project: data.project, user: this.logedUser, isRequest: false}
    this.dialogService.open(EvidenceRequestComponent, {
      header: data.esCode.replace(/\b([a-zÁ-ú]{3,})/g, (w: string) => w.charAt(0).toUpperCase() + w.slice(1)),
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: _data,
      closable: false
    })
  }

  async download(data: any){
    let docs = await this.serviceProxy.getManyBaseEvidenceDocumentControllerEvidenceDocument(
      undefined, undefined, ['evidenceRequest.id||$eq||'+ data.id, 'evidenceRequest.esCode||$eq||'+ data.esCode],
      undefined,undefined,['evidenceRequest'],1000,0,1,0
    ).toPromise()
    this.http.get(`${this.baseUrl + docs.data[0].document.relativePath}`, {
      responseType: 'arraybuffer'
    }
    ).subscribe((response: any) => this.downLoadFile(response, docs.data[0].document.mimeType))
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    const e = document.createElement('a');
    e.href = url;
    e.download = url.substr(url.lastIndexOf('/') + 1);
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
  }

}
