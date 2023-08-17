import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerWaterListComponent } from './passenger-water-list.component';

describe('PassengerWaterListComponent', () => {
  let component: PassengerWaterListComponent;
  let fixture: ComponentFixture<PassengerWaterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerWaterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerWaterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
