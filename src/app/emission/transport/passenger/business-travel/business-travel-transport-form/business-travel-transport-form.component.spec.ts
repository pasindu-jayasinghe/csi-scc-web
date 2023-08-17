import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelTransportFormComponent } from './business-travel-transport-form.component';

describe('BusinessTravelTransportFormComponent', () => {
  let component: BusinessTravelTransportFormComponent;
  let fixture: ComponentFixture<BusinessTravelTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTravelTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTravelTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
