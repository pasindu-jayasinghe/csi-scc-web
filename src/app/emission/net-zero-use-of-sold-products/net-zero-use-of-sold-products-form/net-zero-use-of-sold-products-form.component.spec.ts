import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetZeroUseOfSoldProductsFormComponent } from './net-zero-use-of-sold-products-form.component';

describe('NetZeroUseOfSoldProductsFormComponent', () => {
  let component: NetZeroUseOfSoldProductsFormComponent;
  let fixture: ComponentFixture<NetZeroUseOfSoldProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroUseOfSoldProductsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroUseOfSoldProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
