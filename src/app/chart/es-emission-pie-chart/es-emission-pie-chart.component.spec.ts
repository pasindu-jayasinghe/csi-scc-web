import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsEmissionPieChartComponent } from './es-emission-pie-chart.component';

describe('EsEmissionPieChartComponent', () => {
  let component: EsEmissionPieChartComponent;
  let fixture: ComponentFixture<EsEmissionPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsEmissionPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsEmissionPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
