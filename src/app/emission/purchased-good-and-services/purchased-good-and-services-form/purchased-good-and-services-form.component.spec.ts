import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedGoodAndServicesFormComponent } from './purchased-good-and-services-form.component';

describe('PurchasedGoodAndServicesFormComponent', () => {
  let component: PurchasedGoodAndServicesFormComponent;
  let fixture: ComponentFixture<PurchasedGoodAndServicesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasedGoodAndServicesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedGoodAndServicesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
