import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightWaterListComponent } from './freight-water-list.component';

describe('FreightWaterListComponent', () => {
  let component: FreightWaterListComponent;
  let fixture: ComponentFixture<FreightWaterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightWaterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightWaterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
