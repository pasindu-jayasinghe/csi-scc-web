import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetZeroBusinessTravelViewComponent } from './net-zero-business-travel-view.component';

describe('GeneratorViewComponent', () => {
  let component: NetZeroBusinessTravelViewComponent;
  let fixture: ComponentFixture<NetZeroBusinessTravelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroBusinessTravelViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroBusinessTravelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
