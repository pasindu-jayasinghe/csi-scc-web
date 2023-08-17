import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEmissionChartComponent } from './project-emission-chart.component';

describe('ProjectEmissionChartComponent', () => {
  let component: ProjectEmissionChartComponent;
  let fixture: ComponentFixture<ProjectEmissionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectEmissionChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEmissionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
