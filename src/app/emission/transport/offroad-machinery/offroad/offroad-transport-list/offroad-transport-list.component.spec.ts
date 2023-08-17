import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffroadTransportListComponent } from './offroad-transport-list.component';

describe('OffroadTransportListComponent', () => {
  let component: OffroadTransportListComponent;
  let fixture: ComponentFixture<OffroadTransportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffroadTransportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffroadTransportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
