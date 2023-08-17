import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  NetZeroFranchisesFormComponent } from './net-zero-franchises-form.component';

describe('NetZeroBusinessTravelFormComponent', () => {
  let component: NetZeroFranchisesFormComponent;
  let fixture: ComponentFixture<NetZeroFranchisesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroFranchisesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroFranchisesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
