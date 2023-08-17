import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerRailListComponent } from './passenger-rail-list.component';

describe('PassengerRailListComponent', () => {
  let component: PassengerRailListComponent;
  let fixture: ComponentFixture<PassengerRailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerRailListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerRailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
