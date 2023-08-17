import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerTransportFormComponent } from './passenger-transport-form.component';

describe('PassengerTransportFormComponent', () => {
  let component: PassengerTransportFormComponent;
  let fixture: ComponentFixture<PassengerTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
