import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerRoadTransportFormComponent } from './passenger-road-transport-form.component';

describe('PassengerRoadTransportFormComponent', () => {
  let component: PassengerRoadTransportFormComponent;
  let fixture: ComponentFixture<PassengerRoadTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerRoadTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerRoadTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
