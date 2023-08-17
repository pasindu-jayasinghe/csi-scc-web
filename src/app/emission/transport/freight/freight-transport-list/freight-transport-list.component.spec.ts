import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightTransportListComponent } from './freight-transport-list.component';

describe('FreightTransportListComponent', () => {
  let component: FreightTransportListComponent;
  let fixture: ComponentFixture<FreightTransportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightTransportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightTransportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
