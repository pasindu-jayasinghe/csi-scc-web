import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgEmissionChartComponent } from './org-emission-chart.component';

describe('OrgEmissionChartComponent', () => {
  let component: OrgEmissionChartComponent;
  let fixture: ComponentFixture<OrgEmissionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgEmissionChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgEmissionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
