import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCsiSideComponent } from './report-csi-side.component';

describe('ReportCsiSideComponent', () => {
  let component: ReportCsiSideComponent;
  let fixture: ComponentFixture<ReportCsiSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportCsiSideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCsiSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
