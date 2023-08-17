import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBasicInfoComponent } from './report-basic-info.component';

describe('ReportBasicInfoComponent', () => {
  let component: ReportBasicInfoComponent;
  let fixture: ComponentFixture<ReportBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportBasicInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
