import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerOffroadTransportFormComponent } from './passenger-offroad-transport-form.component';

describe('PassengerOffroadTransportFormComponent', () => {
  let component: PassengerOffroadTransportFormComponent;
  let fixture: ComponentFixture<PassengerOffroadTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerOffroadTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerOffroadTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
