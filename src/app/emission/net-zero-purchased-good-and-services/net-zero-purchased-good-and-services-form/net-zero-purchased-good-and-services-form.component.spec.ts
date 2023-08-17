import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetZeroPurchasedGoodAndServicesFormComponent } from './net-zero-purchased-good-and-services-form.component';

describe('NetZeroPurchasedGoodAndServicesFormComponent', () => {
  let component: NetZeroPurchasedGoodAndServicesFormComponent;
  let fixture: ComponentFixture<NetZeroPurchasedGoodAndServicesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroPurchasedGoodAndServicesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroPurchasedGoodAndServicesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
