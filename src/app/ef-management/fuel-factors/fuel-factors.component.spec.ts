import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelFactorsComponent } from './fuel-factors.component';

describe('FuelFactorsComponent', () => {
  let component: FuelFactorsComponent;
  let fixture: ComponentFixture<FuelFactorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelFactorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelFactorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
