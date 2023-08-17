import { ComponentFixture, TestBed } from '@angular/core/testing';


import { NetZeroEmployeeCommutingListComponent } from './net-zero-employee-commuting-list.component';

describe('GeneratorListComponent', () => {
  let component: NetZeroEmployeeCommutingListComponent;
  let fixture: ComponentFixture<NetZeroEmployeeCommutingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroEmployeeCommutingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroEmployeeCommutingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
