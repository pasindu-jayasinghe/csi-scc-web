import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTravelListComponent } from './business-travel-list.component';

describe('BusinessTravelListComponent', () => {
  let component: BusinessTravelListComponent;
  let fixture: ComponentFixture<BusinessTravelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTravelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTravelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
