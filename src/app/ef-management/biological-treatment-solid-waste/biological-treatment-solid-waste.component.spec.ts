import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalTreatmentSolidWasteComponent } from './biological-treatment-solid-waste.component';

describe('BiologicalTreatmentSolidWasteComponent', () => {
  let component: BiologicalTreatmentSolidWasteComponent;
  let fixture: ComponentFixture<BiologicalTreatmentSolidWasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiologicalTreatmentSolidWasteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalTreatmentSolidWasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
