import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetVsActualChartComponent } from './target-vs-actual-chart.component';

describe('TargetVsActualChartComponent', () => {
  let component: TargetVsActualChartComponent;
  let fixture: ComponentFixture<TargetVsActualChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetVsActualChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetVsActualChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
