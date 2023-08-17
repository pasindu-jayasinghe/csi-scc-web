import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerWaterTransportFormComponent } from './passenger-water-transport-form.component';

describe('PassengerWaterTransportFormComponent', () => {
  let component: PassengerWaterTransportFormComponent;
  let fixture: ComponentFixture<PassengerWaterTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerWaterTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerWaterTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
