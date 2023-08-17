import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetZeroBusinessTravelListComponent } from './net-zero-business-travel-list.component';

describe('GeneratorListComponent', () => {
  let component: NetZeroBusinessTravelListComponent;
  let fixture: ComponentFixture<NetZeroBusinessTravelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroBusinessTravelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroBusinessTravelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
