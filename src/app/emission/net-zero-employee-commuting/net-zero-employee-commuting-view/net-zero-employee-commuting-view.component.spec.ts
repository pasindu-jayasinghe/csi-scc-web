import { ComponentFixture, TestBed } from '@angular/core/testing';


import { NetZeroEmployeeCommutingViewComponent } from './net-zero-employee-commuting-view.component';

describe('GeneratorViewComponent', () => {
  let component: NetZeroEmployeeCommutingViewComponent;
  let fixture: ComponentFixture<NetZeroEmployeeCommutingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroEmployeeCommutingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroEmployeeCommutingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
