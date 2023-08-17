import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteWaterTreatmentFormComponent } from './waste-water-treatment-form.component';

describe('WasteWaterTreatmentFormComponent', () => {
  let component: WasteWaterTreatmentFormComponent;
  let fixture: ComponentFixture<WasteWaterTreatmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteWaterTreatmentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteWaterTreatmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
