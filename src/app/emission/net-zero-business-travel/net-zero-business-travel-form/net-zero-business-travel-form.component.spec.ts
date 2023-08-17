import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetZeroBusinessTravelFormComponent } from './net-zero-business-travel-form.component';

describe('NetZeroBusinessTravelFormComponent', () => {
  let component: NetZeroBusinessTravelFormComponent;
  let fixture: ComponentFixture<NetZeroBusinessTravelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroBusinessTravelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroBusinessTravelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
