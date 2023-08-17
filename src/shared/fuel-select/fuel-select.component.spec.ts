import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelSelectComponent } from './fuel-select.component';

describe('FuelSelectComponent', () => {
  let component: FuelSelectComponent;
  let fixture: ComponentFixture<FuelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
