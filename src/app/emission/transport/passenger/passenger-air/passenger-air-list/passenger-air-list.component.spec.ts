import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerAirListComponent } from './passenger-air-list.component';

describe('PassengerAirListComponent', () => {
  let component: PassengerAirListComponent;
  let fixture: ComponentFixture<PassengerAirListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerAirListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerAirListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
