import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightRoadListComponent } from './freight-road-list.component';

describe('FreightRoadListComponent', () => {
  let component: FreightRoadListComponent;
  let fixture: ComponentFixture<FreightRoadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightRoadListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightRoadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
