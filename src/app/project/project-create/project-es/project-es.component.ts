import { Component, Input, OnInit } from '@angular/core';
import { AppService, ProjectTypes, RecordStatus } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { EmissionSource, EmissionSourceOfProject, Project, ProjectControllerServiceProxy, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-project-es',
  templateUrl: './project-es.component.html',
  styleUrls: ['./project-es.component.css']
})
export class ProjectEsComponent implements OnInit {
  @Input() isView: boolean = false;
  @Input() isNewEntry: boolean = true;
  @Input() editEntryId: number;
  @Input() project: Project;

  public roles = Roles
public userActions = UserActions

  selectedEmissionSource: EmissionSource[] = [];
  emissionSources: EmissionSource[] = []
  
  projectType: ProjectTypes;
  constructor(
    private serviceProxy: ServiceProxy,
    private projectServiceProxy: ProjectControllerServiceProxy,
    public appService: AppService
  ) { }

  async ngOnInit() {
    this.appService.projectType.subscribe(p => this.projectType = p);
    this.getEmissionSources();
    await this.setInitialValues();
  }

  async setInitialValues(){
    if(this.editEntryId){
      await this.getProjectES();
    }
  }

  onChangeProjectES(e: any, id: number){
    const isAdded = e.checked.find((es: { id: number; }) => es.id === id);
    if(isAdded){
      this.add(id);
    }else{
      this.remove(id);
    }
  }

  getName(es: EmissionSource){
    if(this.projectType === ProjectTypes.GHG){
      return es.name
    }else{
      return es.sbtName
    }
  }

  getEmissionSources(){
    this.serviceProxy.getManyBaseEmissionSourceControllerEmissionSource(
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
    ).subscribe(res=>{
      this.emissionSources = res.data;
    })

  }

  async getProjectES(){
    const res = await this.serviceProxy.getManyBaseProjectEmissionSourceControllerProjectEmissionSource(
      undefined,
      undefined,
      [ "project.id||$eq||" + this.editEntryId , "status||$ne||"+RecordStatus.Deleted],      
      undefined,
      undefined,
      ['project'],
      100,
      0,
      0,
      0
    ).toPromise()
    this.selectedEmissionSource = res.data.map(pes => pes.emissionSource);
  }

  add(id: number){
    const body = new EmissionSourceOfProject();
    body.emissionSourceId = id;
    body.projetId = this.editEntryId;
    this.projectServiceProxy.addEmissionSourceOfProject(body).subscribe(res => {

    })
  }

  remove(id: number){
    const body = new EmissionSourceOfProject();
    body.emissionSourceId = id;
    body.projetId = this.editEntryId;
    this.projectServiceProxy.removeEmissionSourceOfProject(body).subscribe(res => {

    })
  }

}
