import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  NetZeroEmployeeCommutingFormComponent } from './net-zero-employee-commuting-form.component';

describe('NetZeroBusinessTravelFormComponent', () => {
  let component: NetZeroEmployeeCommutingFormComponent;
  let fixture: ComponentFixture<NetZeroEmployeeCommutingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroEmployeeCommutingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroEmployeeCommutingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
