import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerRoadListComponent } from './passenger-road-list.component';

describe('PassengerRoadListComponent', () => {
  let component: PassengerRoadListComponent;
  let fixture: ComponentFixture<PassengerRoadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerRoadListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerRoadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
