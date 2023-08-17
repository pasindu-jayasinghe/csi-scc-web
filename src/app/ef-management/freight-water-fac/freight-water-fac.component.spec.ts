import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightWaterFacComponent } from './freight-water-fac.component';

describe('FreightWaterFacComponent', () => {
  let component: FreightWaterFacComponent;
  let fixture: ComponentFixture<FreightWaterFacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightWaterFacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightWaterFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
