import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerOffroadListComponent } from './passenger-offroad-list.component';

describe('PassengerOffroadListComponent', () => {
  let component: PassengerOffroadListComponent;
  let fixture: ComponentFixture<PassengerOffroadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerOffroadListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerOffroadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
