import { Component, DoCheck, EventEmitter, Input, IterableDiffers, KeyValueDiffers, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { AppService, SavedData } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Project, ProjectStatus, Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-project-select',
  templateUrl: './project-select.component.html',
  styleUrls: ['./project-select.component.css']
})
export class ProjectSelectComponent implements OnInit, DoCheck, OnChanges {
  @Input() isView: boolean = false;
  isNewEntry: boolean = true;
  isAuditor: boolean = false;

  public roles = Roles
  public userActions = UserActions


  projects: Project[] = [];
  
  @Input() project: Project;
  @Input() unit: Unit;
  @Input() data: NgForm;
  @Input() withoutUnit: boolean =false;


  @Output() onUpdateProject = new EventEmitter<Project>();
  

  allDiffer: any;
  differ: any;
  isEmited: boolean = false;
  loading: boolean = false;

  constructor(
    private projectAndSelectService: ProjectAndSelectService,
    differs: IterableDiffers,
    public appService: AppService,
    private allDiffers: KeyValueDiffers,
  ) {
    this.differ = differs.find([]).create();
    this.allDiffer = this.allDiffers.find({}).create();

  }

  ngOnInit(): void {

    this.appService.loadingSub
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.isEmited = false;
    this.isAuditor = this.appService.isAuditor()
    if (this.isAuditor) this.projectAndSelectService.init()
    this.projectAndSelectService.getProjectListener(this.withoutUnit).subscribe(pl => this.projects = pl.projects);

  }

  /**
   * listern a chaanges oin inputs
   */
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if(propName === 'project'){
        const project = changes[propName].currentValue as Project;
        this.project = project;
        // console.log("1",this.project);
        this.setProject(this.project);
      }
    }
  }

  /**
   * listern a chaanges oin array
   */
  ngDoCheck(): void {
    const change = this.differ.diff(this.projects);
    const allChange = this.allDiffer.diff(this);

    if (allChange) {
      allChange.forEachChangedItem((item: any) => {
        if(item.key === "loading" && item.currentValue){          
          this.setProject();
        }
        if(item.key === "project"){          
          if(item.currentValue){
            this.setProject(this.project);
          }
        }
        // console.log('item changed', item.key, item.previousValue, item.currentValue);
      });
    }

    if(change){
      if(this.project){
        var a =this.project;
        let inputP = change.collection.find((p: { id: number; }) => p.id === a.id);
        if(inputP){
          this.project = inputP;
          if(!this.isEmited){
            this.isEmited =true;
            this.onUpdateProject.emit(this.project);
          }
        }             
      }else{
        let activeprojects = this.projects.filter(p => p.projectStatus === ProjectStatus.DataEntry).sort((a,b)=> {
          if(a.isFinancialYear){
            let ay = parseInt(a.year.split("/")[0])
            let by = parseInt(b.year.split("/")[0])
            return ay>by?-1:1;
          }else{
            return parseInt(a.year) > parseInt(b.year)? -1:1
          }
        });
        // console.log("activeprojects", activeprojects);
        if(activeprojects.length>0){
          let ltsP = activeprojects[0];
          this.project =ltsP;
          this.saveActiveProject(ltsP);
        }
      }
    }
  }


  setProject(pr: Project | undefined = undefined){
    setTimeout(()=> {
      if(!pr){
        pr = this.project;
      }
      // console.log("2",pr?.id, this.project?.id, this.projects);
      if(pr !== null && pr !== undefined && this.projects.length > 0){  
        let p = this.projects.find(_p => _p.id === pr?.id);
        if(p){
          this.project = p;
        }
      }
    },1500)
  }

  saveActiveProject(p: Project){
    localStorage.setItem(SavedData.SelectedProject, JSON.stringify(p))
    this.onUpdateProject.emit(p);
  }

  onChangeProject(e: {value: Project}){
    localStorage.setItem(SavedData.SelectedProject, JSON.stringify(e.value))
    this.onUpdateProject.emit(e.value);
  }

}


