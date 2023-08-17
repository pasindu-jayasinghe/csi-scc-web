import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEsDatasourceComponent } from './report-es-datasource.component';

describe('ReportEsDatasourceComponent', () => {
  let component: ReportEsDatasourceComponent;
  let fixture: ComponentFixture<ReportEsDatasourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportEsDatasourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEsDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
