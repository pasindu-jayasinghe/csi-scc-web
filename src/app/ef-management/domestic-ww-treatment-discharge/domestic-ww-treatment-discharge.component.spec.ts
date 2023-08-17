import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticWwTreatmentDischargeComponent } from './domestic-ww-treatment-discharge.component';

describe('DomesticWwTreatmentDischargeComponent', () => {
  let component: DomesticWwTreatmentDischargeComponent;
  let fixture: ComponentFixture<DomesticWwTreatmentDischargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomesticWwTreatmentDischargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomesticWwTreatmentDischargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
