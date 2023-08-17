import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustrialWwTreatmentDischargeComponent } from './industrial-ww-treatment-discharge.component';

describe('IndustrialWwTreatmentDischargeComponent', () => {
  let component: IndustrialWwTreatmentDischargeComponent;
  let fixture: ComponentFixture<IndustrialWwTreatmentDischargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustrialWwTreatmentDischargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustrialWwTreatmentDischargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
