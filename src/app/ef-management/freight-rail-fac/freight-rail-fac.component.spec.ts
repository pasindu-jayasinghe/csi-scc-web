import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightRailFacComponent } from './freight-rail-fac.component';

describe('FreightRailFacComponent', () => {
  let component: FreightRailFacComponent;
  let fixture: ComponentFixture<FreightRailFacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightRailFacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightRailFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
