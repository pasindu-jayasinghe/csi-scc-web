import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { ProjectControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-emission-source-list',
  templateUrl: './emission-source-list.component.html',
  styleUrls: ['./emission-source-list.component.css']
})
export class EmissionSourceListComponent implements OnInit {

  public roles = Roles
public userActions = UserActions

  public type: string = "verification"
  public title: string = "Verfication"
  public forwardRoute: string = "emission-source-detail"
  public backRoute: string = "project-list"

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public serviceProxy: ServiceProxy,
    public projectServiceProxy: ProjectControllerServiceProxy,
    public appService: AppService
  ) { }

  ngOnInit(): void {
  }

}
