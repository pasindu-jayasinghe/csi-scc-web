import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEsExcludedComponent } from './report-es-excluded.component';

describe('ReportEsExcludedComponent', () => {
  let component: ReportEsExcludedComponent;
  let fixture: ComponentFixture<ReportEsExcludedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportEsExcludedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEsExcludedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
