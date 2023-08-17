import { Component, Input, OnInit } from '@angular/core';
import { AppService, ProjectTypes, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { AssignedES, EmissionSource, ProjectUnitEmissionSource, ServiceProxy, User } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-es-access-single',
  templateUrl: './es-access-single.component.html',
  styleUrls: ['./es-access-single.component.css']
})
export class EsAccessSingleComponent implements OnInit {
  public roles = Roles
  public userActions = UserActions

  assignedES: AssignedES;
  @Input() pues: ProjectUnitEmissionSource;
  @Input() user: User;

  edit: boolean[] = [];
  add: boolean[] = [];
  deleteEs: boolean[] = [];

  projectType: ProjectTypes;
  
  constructor(
    private serviceProxy: ServiceProxy,
    public appService: AppService
  ) { }

  async ngOnInit(): Promise<void> {
    this.appService.projectType.subscribe(p => this.projectType = p);
    await this.getAssignedES();

    if(!this.assignedES){
      this.assignedES = new AssignedES();
      this.assignedES.pues = this.pues;
      this.assignedES.user = this.user;
    }
    if(this.assignedES.add){
      this.add = [true];
    }
    if(this.assignedES.edit){
      this.edit = [true];
    }
    if(this.assignedES.delete){
      this.deleteEs = [true];
    }
  }

  getName(es: EmissionSource){
    if(this.projectType === ProjectTypes.GHG){
      return es.name
    }else{
      return es.sbtName
    }
  }

  changeAdd(){
    if(this.add.length > 0){
      this.assignedES.add = true;
    }else{
      this.assignedES.add = false;
    }

    this.save();
  }

  changeEdit(){
    if(this.edit.length > 0){
      this.assignedES.edit = true;
    }else{
      this.assignedES.edit = false;
    }

    this.save();
  }

  changeDelete(){
    if(this.deleteEs.length > 0){
      this.assignedES.delete = true;
    }else{
      this.assignedES.delete = false;
    }

    this.save();
  }

  async getAssignedES(){
    try{
      const res = await this.serviceProxy.getManyBaseAssignedESsControllerAssignedES(
        undefined,
        undefined,
        [ "user.id||$eq||" + this.user.id, "pues.id||$eq||" + this.pues.id , "status||$ne||"+RecordStatus.Deleted],      
        undefined,
        undefined,
        ['user','pues'],
        1,
        0,
        0,
        0
      ).toPromise();
      if(res.data.length > 0){
        this.assignedES = res.data[0];
      }
    }catch(err){
      console.log(err);
    }
  }

  save(){
    console.log(this.assignedES);
    if(this.assignedES.id){
      this.serviceProxy.updateOneBaseAssignedESsControllerAssignedES(this.assignedES.id, this.assignedES)
      .subscribe(res => {
        console.log(res);
      })
    }else{
      this.serviceProxy.createOneBaseAssignedESsControllerAssignedES(this.assignedES)
      .subscribe(res => {
        this.assignedES = res;
      })
    }
  }

}
