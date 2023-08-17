import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetZeroPurchasedGoodAndServicesListComponent } from './net-zero-purchased-good-and-services-list.component';

describe('NetZeroPurchasedGoodAndServicesListComponent', () => {
  let component: NetZeroPurchasedGoodAndServicesListComponent;
  let fixture: ComponentFixture<NetZeroPurchasedGoodAndServicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroPurchasedGoodAndServicesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroPurchasedGoodAndServicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
