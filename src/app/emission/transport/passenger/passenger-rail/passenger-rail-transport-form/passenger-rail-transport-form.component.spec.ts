import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerRailTransportFormComponent } from './passenger-rail-transport-form.component';

describe('PassengerRailTransportFormComponent', () => {
  let component: PassengerRailTransportFormComponent;
  let fixture: ComponentFixture<PassengerRailTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerRailTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerRailTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
