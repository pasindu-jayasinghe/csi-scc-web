import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedGoodAndServicesListComponent } from './purchased-good-and-services-list.component';

describe('PurchasedGoodAndServicesListComponent', () => {
  let component: PurchasedGoodAndServicesListComponent;
  let fixture: ComponentFixture<PurchasedGoodAndServicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasedGoodAndServicesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedGoodAndServicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
