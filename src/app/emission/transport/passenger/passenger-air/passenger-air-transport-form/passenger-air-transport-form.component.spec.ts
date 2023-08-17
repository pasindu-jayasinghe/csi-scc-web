import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerAirTransportFormComponent } from './passenger-air-transport-form.component';

describe('PassengerAirTransportFormComponent', () => {
  let component: PassengerAirTransportFormComponent;
  let fixture: ComponentFixture<PassengerAirTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerAirTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerAirTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
