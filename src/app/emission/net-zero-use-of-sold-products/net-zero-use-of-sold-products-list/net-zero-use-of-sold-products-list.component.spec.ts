import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetZeroUseOfSoldProductsListComponent } from './net-zero-use-of-sold-products-list.component';

describe('NetZeroUseOfSoldProductsListComponent', () => {
  let component: NetZeroUseOfSoldProductsListComponent;
  let fixture: ComponentFixture<NetZeroUseOfSoldProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetZeroUseOfSoldProductsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetZeroUseOfSoldProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
