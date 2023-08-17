import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerTransportListComponent } from './passenger-transport-list.component';

describe('PassengerTransportListComponent', () => {
  let component: PassengerTransportListComponent;
  let fixture: ComponentFixture<PassengerTransportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerTransportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerTransportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
