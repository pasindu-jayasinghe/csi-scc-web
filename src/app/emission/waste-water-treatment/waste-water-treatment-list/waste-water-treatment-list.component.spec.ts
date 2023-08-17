import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteWaterTreatmentListComponent } from './waste-water-treatment-list.component';

describe('WasteWaterTreatmentListComponent', () => {
  let component: WasteWaterTreatmentListComponent;
  let fixture: ComponentFixture<WasteWaterTreatmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteWaterTreatmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteWaterTreatmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
