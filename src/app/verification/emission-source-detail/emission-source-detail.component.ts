import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { EvidenceRequestEsCode, GetManyElectricityActivityDataResponseDto, Project, ProjectStatus, ServiceProxy, Unit, User } from 'shared/service-proxies/service-proxies';
import { EvidenceRequestComponent } from '../evidence-request/evidence-request.component';

@Component({
  selector: 'app-emission-source-detail',
  templateUrl: './emission-source-detail.component.html',
  styleUrls: ['./emission-source-detail.component.css']
})
export class EmissionSourceDetailComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  public type = "verification"
  public title = "Verfication Details"
  public backRoute = "emission-source-list"

  public card1 = [
    { title: "Net Calerific Value of Diesel", value: "9245634" },
    { title: "Emission Factors for CO₂ of Mobile Combustion of Diesel", value: "9245634, 9245634, 9245634, 9245634, 9245634, 9245634" },
    { title: "Density of Petrol", value: "9245634" },
    { title: "Emission Factors for CO₂ of Mobile Combustion of Petrol", value: "9245634, 9245634, 9245634, 9245634, 9245634, 9245634" }
  ]

  public ref: DynamicDialogRef;
  projectId: any;
  public logeduser: User;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public dialogService: DialogService,
    public serviceProxy: ServiceProxy,
    protected messageService: MessageService,
    public activatedRoute: ActivatedRoute,
    public appService: AppService
  ) {
    let name = this.router.getCurrentNavigation()?.extras.state;
  }

  async ngOnInit(): Promise<void> {
    let u = await this.appService.getUser();
    if(u){
      this.logeduser = u;
    }
  }


  async verify(project: Project) {
    project.projectStatus = ProjectStatus.Verified;

    this.serviceProxy.updateOneBaseProjectControllerProject(project.id, project)
      .subscribe(res => {
        if (res) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project verified successfully',
            closable: true,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Verification failed',
            closable: true,
          });
        }
      })
  }

  reject(project: Project) {
    project.projectStatus = ProjectStatus.Unverified

    this.serviceProxy.updateOneBaseProjectControllerProject(project.id, project)
      .subscribe(res => {
        if (res) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project rejected successfully',
            closable: true,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Verification failed',
            closable: true,
          });
        }
      })
  }

  /**This verification path not using now. */
  onValueClick(event: any) {
    // this.activatedRoute.queryParams.subscribe(async (params) => {
    //   this.projectId = params['projectId'];
    //   let project = await this.serviceProxy.getOneBaseProjectControllerProject(this.projectId, undefined, undefined, 0).toPromise()
    //   let data = {data: event.data, unit: event.unit, type:event.type, project: project, user: this.logeduser, isRequest: true} //parameter: event.parameter
    //   this.ref = this.dialogService.open(EvidenceRequestComponent, {
    //     header: event.name.replace(/\b([a-zÁ-ú]{3,})/g, (w: string) => w.charAt(0).toUpperCase() + w.slice(1)),
    //     width: '50%',
    //     contentStyle: { 'max-height': '500px', overflow: 'auto' },
    //     baseZIndex: 10000,
    //     data: data,
    //     closable: false
    //   });
    // })
  }


}
