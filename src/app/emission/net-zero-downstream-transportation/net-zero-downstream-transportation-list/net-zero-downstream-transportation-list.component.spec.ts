import { ComponentFixture, TestBed } from '@angular/core/testing';


import { NetZeroFranchisesListComponent } from './net-zero-franchises-list.component';

describe('GeneratorListComponent', () => {
  let component: NetZeroFranchisesListComponent;
  let fixture: ComponentFixture<NetZeroFranchisesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroFranchisesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroFranchisesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
