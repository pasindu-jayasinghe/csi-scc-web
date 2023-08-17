import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivityDataService } from 'app/shared/activity-data/activity-data.service';
import { MasterDataService } from 'app/shared/master-data.service';
import { environment } from 'environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import {User, ElectricityActivityDataActivityDataStatus, EvidenceRequest, EvidenceRequestEsCode, EvidenceRequestEvidenceStatus, ProjectStatus, ServiceProxy, EvidenceRequestControllerServiceProxy, EvidenceRequestDto, GetManyEvidenceRequestResponseDto, GetRequestsDto, GetRequestsDtoEsCode, Parameter, Project, ProjectType } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-evidence-request',
  templateUrl: './evidence-request.component.html',
  styleUrls: ['./evidence-request.component.css']
})
export class EvidenceRequestComponent implements OnInit {
  public roles = Roles
public userActions = UserActions

  public card1: any = []
  public card2: any = []
  public sourceType: string;
  public esCode: EvidenceRequestEsCode;
  public activityData: any;
  public project: any;
  public comment: string = ""
  public isRequested: boolean = false;
  public isApproved: boolean = false;
  public isRejected: boolean = false;
  public isUploaded: boolean = false;
  public isReturned: boolean = false;
  public checking: boolean = false;
  public hasParasToRequest: boolean = true;
  public isProjectVerified: boolean = false;
  public evidenceRequests: any[];
  public evidenceDocuments: any[] = [];
  public baseUrl:any = environment.baseUrlAPI;
  public confirm: boolean = false
  public rejectComment: string = ""
  public requestComment: string;
  public parameter: any;
  public isRequest: boolean = true;
  public parameters: any[];
  public selectedParameters: Parameter[] = [];


  private logeduser: User;
  unit: any;
  reqs: EvidenceRequest[];
  constructor(
    public config: DynamicDialogConfig,
    public serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    public ref: DynamicDialogRef,
    public http: HttpClient,
    private confirmationService: ConfirmationService,
    public appService: AppService,
    private activityDataService: ActivityDataService,
    private masterDataService: MasterDataService,
    private evidenceRequestControllerServiceProxy: EvidenceRequestControllerServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getConfigData()
    if (!this.isRequest){
      await this.checkStatus()
    } else {
      await this.setInitial()
      // await this.getParameterList()
    }
    if (!this.checking){
      await this.getDocuments()
      this.getCardInfo()
    }
  }

  async getConfigData(){
    this.activityData = this.config.data.data
    this.unit = this.config.data.unit
    this.esCode = this.config.data.type
    this.parameter = this.config.data.parameter
    this.sourceType = this.formatSourceName(this.esCode.toString())
    this.project = this.config.data.project
    this.logeduser = this.config.data.user
    this.isRequest = this.config.data.isRequest

    //Do not remove this as it is not able to get eager data from config data
    this.project = await this.serviceProxy.getOneBaseProjectControllerProject(this.project.id, undefined, undefined, 0).toPromise()
  }

  async setInitial(){
    let filter = ['status||$ne||-20', 'esCode||$eq||'+this.esCode, 'activityDataId||$eq||'+this.activityData.id]
    let requests = await this.serviceProxy.getManyBaseEvidenceRequestControllerEvidenceRequest(
      undefined, undefined, filter, undefined, undefined, undefined, 1000, 0, 0, 0 
    ).toPromise()
    await this.getParameterList()
    let count = 0
    this.parameters.map((para: any) => {
      if (requests.data.length > 0){
        // requests.data.forEach(req => {
          for (const req of requests.data){
          if (req.parameter.code === para.code){
            para['isRequested'] = req.evidenceStatus
            if (req.evidenceStatus === EvidenceRequestEvidenceStatus.Returned) count += 1
            break;
          } else {
            para['isRequested'] = null
            count += 1
          }
        }
      } else {
        para['isRequested'] = null
        count += 1 
      }
    })

    if (count <= 0) this.hasParasToRequest = false
  }

  async checkStatus(){
    this.checking = true
    this.isRequested = false
    
    let req = new GetRequestsDto()
    req.activityDataId = this.activityData.id
    req.esCode = this.esCode as unknown as GetRequestsDtoEsCode
    req.month = this.activityData.month
    req.parameterId = this.parameter.id

    let res = await this.evidenceRequestControllerServiceProxy.getRequestsForActivityData(req).toPromise()
    this.reqs = res.requests
    this.isRequested = res.isRequested
    this.isApproved = res.isApproved
    this.isRejected = res.isRejected
    this.isUploaded = res.isUploaded
    this.isReturned = res.isReturned
    if ([ProjectStatus.Unverified, ProjectStatus.Verified].includes(this.project.projectStatus)) {
      this.isProjectVerified = true
    }
    this.checking = false
  }

  async getDocuments(){
    if (this.isRequested){
      this.evidenceRequests = this.reqs

      let reqIds = this.evidenceRequests.map(req => { return req.id })
      let docs = await this.serviceProxy.getManyBaseEvidenceDocumentControllerEvidenceDocument(
        undefined, undefined, ["evidenceRequest.id||$in||" + reqIds, "evidenceRequest.esCode||$eq||"+this.esCode], undefined,
        undefined, undefined, 1000, 0, 1, 0
      ).toPromise()
      this.evidenceDocuments = docs.data
      this.evidenceRequests.map(req => {
        this.evidenceDocuments.map((doc, idx) =>{
          if (req.id === doc.evidenceRequest.id){
            this.evidenceDocuments[idx] = {...doc, ...{verifierComment: req.comment}}
          } else {
            this.requestComment = req.comment
          }
        })
      })
    }
  }

  async getParameterList(){
    let filter = ['status||$ne||-20', 'source.code||$eq||'+this.esCode]
    this.parameters = (await this.serviceProxy.getManyBaseParameterControllerParameter(
      undefined, undefined, filter, undefined, undefined, undefined, 100, 0, 0, 0
    ).toPromise()).data
  }
  
  onChangeParameter(event: any, para: Parameter){
    // this.selectedParameters.push(para)
  }

  changeColor(status: any){
    // if (cond){
    //   return 'red'
    // } else {
    //   return 'blue'
      
    // }
    switch(status){
      case EvidenceRequestEvidenceStatus.Pending:
        return '#d0c108'
      case EvidenceRequestEvidenceStatus.Uploaded:
        return '#0000FF'
      case EvidenceRequestEvidenceStatus.Returned:
        return '#FFA500 '
      case EvidenceRequestEvidenceStatus.Rejected:
        return '#DC143C'
      case EvidenceRequestEvidenceStatus.Approved:
        return '#339900'
      default:
        return 'black'
    }
  }

  getCardInfo(){

    console.log("getCardInfo", this.project)
    
    this.card1 = [
      { title: "Company Name", value: this.project.ownerUnit.name },
      { title: "Year", value: this.activityData.year },
      { title: "Project Type", value: this.project.projectType.name },
      { title: "Methodology", value: this.project.methodology.name },
      { title: "Unit", value: this.unit }
    ]

    if (!this.isRequest){
      let data_unit: string = this.activityData[this.parameter.code + '_unit']
      let para_unit: any = this.masterDataService.parameterUnits[data_unit as keyof typeof this.masterDataService.parameterUnits]
      this.card1.push(
        { title: "Entered Value", value: this.activityData[this.parameter.code] + ' ' +  (para_unit !== undefined ? para_unit.label : '')}
     )
    }

    if(this.requestComment){
      this.card1.push({title: "Comment by verfier in request", value: this.requestComment})
    }
  }

  onBackClick() {
    this.ref.close()
  }

  async request() {
    console.log(this.selectedParameters)
    this.selectedParameters.forEach(para => {
      let _para = new Parameter();
      _para.id = para.id
      
      let requestFrom = new User()
      requestFrom.id = this.activityData.user.id
      // let project = new Project()
      // project.id = this.activityData.project.id
      let projectType = new ProjectType()
      projectType.id = this.project.projectType.id
      this.project.projectType = projectType
  
      let evidence = new EvidenceRequest();
      evidence.activityDataId = this.activityData.id;
      evidence.comment = this.comment;
      evidence.evidenceStatus = EvidenceRequestEvidenceStatus.Pending;
      evidence.esCode = this.esCode;
      evidence.month = this.activityData.month;
      evidence.parameter = _para
      evidence.requestFrom = requestFrom;
      evidence.verifier = this.logeduser;
      evidence.project = this.project
  
      let req = new EvidenceRequestDto()
      req.activityDataId = this.activityData.id
      req.code = this.esCode.toString()
      req.projectId = this.project.id
      req.req = evidence
  
      this.evidenceRequestControllerServiceProxy.requestEvidence(req).subscribe(res => {
        if (res){
          this.isRequested = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Evidence Requested successfully',
            closable: true,
          });
          this.ref.close()
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Request failed',
            closable: true,
          });
          this.ref.close()
        }
      })
    })

  }

  formatSourceName(name: string) {
    return ((name.replace("_", " "))
      .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))
      .replace(" ", "") + 'ActivityData'
  }

  async approve() {
    // update EvidenceRequest -> evidenceStatus approved
    // update activitydata activityDataStatus -> Evidence Approved
    this.confirmationService.confirm({
      message: 'Are you sure you want to accept the evidence?',
      header: 'Verification Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.evidenceRequests.map(async evidenceRequest => {
          if (evidenceRequest.evidenceStatus === EvidenceRequestEvidenceStatus.Uploaded) {
            evidenceRequest.evidenceStatus = EvidenceRequestEvidenceStatus.Approved
            let res1 = await this.serviceProxy.updateOneBaseEvidenceRequestControllerEvidenceRequest(
              evidenceRequest.id, evidenceRequest
            ).toPromise()

            let evreqs = await this.serviceProxy.getManyBaseEvidenceRequestControllerEvidenceRequest(
              undefined, undefined, ['activityDataId||$eq||' + this.activityData.id, 'id||$ne||' + evidenceRequest.id], undefined, undefined, undefined, 1000, 0, 1, 0
            ).toPromise()

            let pending = evreqs.data.filter(o => {
              return (o.evidenceStatus === EvidenceRequestEvidenceStatus.Pending) ||
                (o.evidenceStatus === EvidenceRequestEvidenceStatus.Returned) ||
                (o.evidenceStatus === EvidenceRequestEvidenceStatus.Uploaded)
            })
            let res2

            if (pending.length === 0) {
              let activitydata = this.activityData
              activitydata.activityDataStatus = ElectricityActivityDataActivityDataStatus.Evidence_Approved

              let res = this.activityDataService.updateOneActivityData(activitydata.id, activitydata, evidenceRequest.esCode)
              res2 = (await res).res
            } else {
              res2 = true
            }

            if (res1 && res2) {
              this.isApproved = true
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Evidence Approved successfully',
                closable: true,
              });
              this.ref.close()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed',
                closable: true,
              });
              this.ref.close()
            }
          }
        })
      },
      reject: () => { },
    })

    
  }

  onReject(){
    this.confirm = true
  }

  async reject() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject the evidence?',
      header: 'Verification Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.evidenceRequests.map(async evidenceRequest => {
          if (evidenceRequest.evidenceStatus !== EvidenceRequestEvidenceStatus.Rejected) {
            evidenceRequest.evidenceStatus = EvidenceRequestEvidenceStatus.Rejected
            let res1 = await this.serviceProxy.updateOneBaseEvidenceRequestControllerEvidenceRequest(
              evidenceRequest.id, evidenceRequest
            ).toPromise()

          }
        })
        let para = new Parameter()
        para.id = this.parameter.id

        let requestFrom = new User()
        requestFrom.id = this.activityData.user.id

        let returnRequest = new EvidenceRequest()
        returnRequest.activityDataId = this.evidenceRequests[0].activityDataId;
        returnRequest.esCode = this.evidenceRequests[0].esCode;
        returnRequest.evidenceStatus = EvidenceRequestEvidenceStatus.Returned;
        returnRequest.comment = this.rejectComment
        returnRequest.month = this.evidenceRequests[0].month
        returnRequest.parameter = para
        returnRequest.requestFrom = requestFrom;
        returnRequest.verifier = this.logeduser;
        returnRequest.project = this.activityData.project

        let req = new EvidenceRequestDto()
        req.activityDataId = this.activityData.id
        req.code = this.esCode.toString()
        req.projectId = this.project.id
        req.req = returnRequest

        this.evidenceRequestControllerServiceProxy.requestEvidence(req)
          .subscribe(res => {
            if (res) {
              this.isRequested = true;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Evidence rejected and returned',
                closable: true,
              });
              this.ref.close()
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Request failed',
                closable: true,
              });
              this.ref.close()
            }
          }, error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred, please try again',
              closable: true,
            });
            this.ref.close()
          },)
      },
      reject: () => { },
    })

  }

  download(doc: any) {
    this.http.get(`${this.baseUrl + doc.relativePath}`, {
      responseType: 'arraybuffer'
    }
    ).subscribe(response => this.downLoadFile(response, doc.mimeType))
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

  OnShowOerlayDR(){
    this.rejectComment = ""
  }

}
