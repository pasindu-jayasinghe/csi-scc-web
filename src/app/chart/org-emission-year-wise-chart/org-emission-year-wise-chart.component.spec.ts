import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgEmissionYearWiseChartComponent } from './org-emission-year-wise-chart.component';

describe('OrgEmissionYearWiseChartComponent', () => {
  let component: OrgEmissionYearWiseChartComponent;
  let fixture: ComponentFixture<OrgEmissionYearWiseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgEmissionYearWiseChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgEmissionYearWiseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
