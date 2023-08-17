import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSpecificMethodComponent } from './supplier-specific-method.component';

describe('SupplierSpecificMethodComponent', () => {
  let component: SupplierSpecificMethodComponent;
  let fixture: ComponentFixture<SupplierSpecificMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierSpecificMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSpecificMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
