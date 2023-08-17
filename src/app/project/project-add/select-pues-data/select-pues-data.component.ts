import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'shared/AppService';
import { EmissionSource, ProjectUnitEmissionSource, ProjectUnitEmissionSourceClasification, ProjectUnitEmissionSourceTier } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-select-pues-data',
  templateUrl: './select-pues-data.component.html',
  styleUrls: ['./select-pues-data.component.css']
})
export class SelectPuesDataComponent implements OnInit {

  @Input() isView: boolean;
  @Input() emissionSource: EmissionSource;
  @Input() pues: ProjectUnitEmissionSource;

  mobile: boolean[]= [];
  stationary: boolean[]= [];
  
  @Output() onChangeData = new EventEmitter<{
    clasification: ProjectUnitEmissionSourceClasification,
    tier: ProjectUnitEmissionSourceTier,
    es: EmissionSource,
    mobile: boolean, 
    stationary: boolean
  }>();

  public clasifications: ProjectUnitEmissionSourceClasification[] = [ProjectUnitEmissionSourceClasification.Direct, ProjectUnitEmissionSourceClasification.Indirect, ProjectUnitEmissionSourceClasification.Other,ProjectUnitEmissionSourceClasification.Any];
  public tiers: ProjectUnitEmissionSourceTier[] = [ProjectUnitEmissionSourceTier.ONE, ProjectUnitEmissionSourceTier.TWO, ProjectUnitEmissionSourceTier.THREE];

  public clasification: ProjectUnitEmissionSourceClasification;
  public tier: ProjectUnitEmissionSourceTier;

  constructor(
    public appService: AppService
  ) { }

  ngOnInit(): void {    
    if(!this.pues){
      this.pues = new ProjectUnitEmissionSource();      

      this.mobile = this.pues.mobile? [true]: [];
      this.stationary = this.pues.stationery? [true]: [];
    }
  }

  
  change(){    
    if(this.pues.tier && this.pues.clasification){
      this.onChangeData.emit({
        tier: this.pues.tier, 
        clasification: this.pues.clasification, 
        es: this.emissionSource,
        mobile: this.mobile.length>0, 
        stationary: this.stationary.length>0
      });
    }
  }

  public clear(){
    //@ts-ignore
    this.clasification = undefined;
    //@ts-ignore
    this.tier = undefined;
  }

}
