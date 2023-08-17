import { Component, DoCheck, EventEmitter, Input, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { AppService } from 'shared/AppService';
import { Roles, UserActions } from 'shared/service-proxies/auth-service-proxies';
import { Unit } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.css']
})
export class UnitSelectComponent implements OnInit, DoCheck {

  public roles = Roles
public userActions = UserActions

  @Input() isView: boolean = false;
  isNewEntry: boolean = true;

  units: Unit[] = [];
  
  @Input() unit: Unit;

  @Output() onUpdateUnit = new EventEmitter<Unit>();

  differ: any;
  displayValue: string; 


  constructor(private projectAndSelectService: ProjectAndSelectService, public appService: AppService, differs: IterableDiffers) { 
    this.differ = differs.find([]).create();
  }

  async ngOnInit() {
    if(!this.unit){
      let u = await this.appService.getLogedUnit();
      if(u){
        this.unit = u;
        this.unitUpdate();
        this.onUpdateUnit.emit(this.unit);
      }
    }
    this.projectAndSelectService.init();
    this.projectAndSelectService.getUnitListener().subscribe(ul => {
      this.units = ul.units;
    });
    var a = this.unit;
  }

  ngDoCheck(): void {
    const change = this.differ.diff(this.units);
    if(change){      
      var a =this.unit;
      setTimeout(()=> {
        let inputU
        if (a){
          inputU = this.units.find(u => u.id === a.id);
        }
        if(inputU){
          this.unit = inputU;
        }    
      },0)
    }
  }

  onChangeUnit(e: {value: Unit}){
    this.onUpdateUnit.emit(e.value);
    this.unitUpdate();
  }

  unitUpdate(){
    this.projectAndSelectService.onChangeUnit(this.unit);
  }

}
