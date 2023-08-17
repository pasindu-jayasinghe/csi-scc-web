import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelFactorFormComponent } from './fuel-factor-form.component';

describe('FuelFactorFormComponent', () => {
  let component: FuelFactorFormComponent;
  let fixture: ComponentFixture<FuelFactorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelFactorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelFactorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
