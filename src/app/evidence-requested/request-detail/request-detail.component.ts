import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Documents, EvidenceDocument, EvidenceRequestControllerServiceProxy, EvidenceRequestEvidenceStatus, GetRequestsDto, GetRequestsDtoEsCode, GetRequestsDtoStatus, ServiceProxy, UploadDto } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class ReqeustDetailComponent implements OnInit {
  public roles = Roles
  public userActions = UserActions

  public uploadedFile: any;
  public comment: string = "";
  public baseUrl:any = environment.baseUrlAPI;
  public evidence: any
  public rejectedDocs: any[]

  evidenceProvidable: boolean = false

  constructor(
    public serviceProxy: ServiceProxy,
    public http: HttpClient,
    public messageService: MessageService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public evidenceRequestControllerServiceProxy: EvidenceRequestControllerServiceProxy,
    public appService: AppService
  ) { }

  async ngOnInit(): Promise<void> {
    this.evidence = this.config.data.data
    if (this.evidence.evidenceStatus === EvidenceRequestEvidenceStatus.Returned){
      await this.getRejectedDocs()
    }

    this.evidenceProvidable = this.appService.hasUserActionAccessTo(UserActions.PROVIDE_EVIDENCE)
    
  }

  async getRejectedDocs() {
    let req = new GetRequestsDto()
    req.activityDataId = this.evidence.activityData.id
    req.esCode = this.evidence.esCode
    req.month = this.evidence.activityData.month
    req.parameterId = this.evidence.parameter.id
    req.status = EvidenceRequestEvidenceStatus.Rejected as unknown as GetRequestsDtoStatus

    let res = await this.evidenceRequestControllerServiceProxy.getRequestsForActivityData(req).toPromise()
    let rejectedReqs = res.requests
    let reqIds = rejectedReqs.map(req => { return req.id })
    let docs = await this.serviceProxy.getManyBaseEvidenceDocumentControllerEvidenceDocument(
      undefined, undefined, ["evidenceRequest.id||$in||" + reqIds, "evidenceRequest.esCode||$eq||" + this.evidence.esCode], undefined,
      undefined, undefined, 1000, 0, 1, 0
    ).toPromise()
    this.rejectedDocs = docs.data
    rejectedReqs.map(req => {
      this.rejectedDocs.map((doc, idx) => {
        if (req.id === doc.evidenceRequest.id) {
          this.rejectedDocs[idx] = { ...doc, ...{ verifierComment: req.comment } }
        }
      })
    })
  }

  onAddFile(event: any){
    this.uploadedFile = event.file;
  }

  onRemoveFile(event: {id: number|undefined,index: number, file: any}){
    this.uploadedFile = null;
  }

  onHide(){
    this.uploadedFile = "";
    this.ref.close()
  }

  onUpload(e: any) {
    const formData = new FormData();
    formData.append('file', this.uploadedFile);
    this.http.post(this.baseUrl + '/document/upload', formData).subscribe(async (res: any) => {
      this.uploadedFile = "";

      if (res){
        let req = new UploadDto()
        req.comment = this.comment
        req.documentId = res.id
        req.evidenceId =  this.evidence.id
        console.log(req)
        let _res = await  this.evidenceRequestControllerServiceProxy.uploadEvidenceDocument(req).toPromise()
  
        if (_res.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Evidence uploaded successfully',
            closable: true,
          });
          // window.location.reload()
          this.ref.close()
          
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Uploading evidence failed',
            closable: true,
          });
          // window.location.reload()
          this.ref.close()
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Uploading document failed` });
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
      // window.location.reload()
      this.ref.close()
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

}
