import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightOffroadListComponent } from './freight-offroad-list.component';

describe('FreightOffroadListComponent', () => {
  let component: FreightOffroadListComponent;
  let fixture: ComponentFixture<FreightOffroadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightOffroadListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightOffroadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
