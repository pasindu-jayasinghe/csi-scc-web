import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightAirListComponent } from './freight-air-list.component';

describe('FreightAirListComponent', () => {
  let component: FreightAirListComponent;
  let fixture: ComponentFixture<FreightAirListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightAirListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightAirListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
