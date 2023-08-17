import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightRailListComponent } from './freight-rail-list.component';

describe('FreightRailListComponent', () => {
  let component: FreightRailListComponent;
  let fixture: ComponentFixture<FreightRailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightRailListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightRailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
