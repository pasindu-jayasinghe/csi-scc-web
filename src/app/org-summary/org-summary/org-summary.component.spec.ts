import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSummaryComponent } from './org-summary.component';

describe('OrgSummaryComponent', () => {
  let component: OrgSummaryComponent;
  let fixture: ComponentFixture<OrgSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
