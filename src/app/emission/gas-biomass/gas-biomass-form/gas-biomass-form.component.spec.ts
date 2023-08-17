import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasBiomassFormComponent } from './gas-biomass-form.component';

describe('GasBiomassFormComponent', () => {
  let component: GasBiomassFormComponent;
  let fixture: ComponentFixture<GasBiomassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasBiomassFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GasBiomassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
