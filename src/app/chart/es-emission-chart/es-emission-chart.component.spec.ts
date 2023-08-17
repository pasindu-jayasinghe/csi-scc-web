import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsEmissionChartComponent } from './es-emission-chart.component';

describe('EsEmissionChartComponent', () => {
  let component: EsEmissionChartComponent;
  let fixture: ComponentFixture<EsEmissionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsEmissionChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsEmissionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
