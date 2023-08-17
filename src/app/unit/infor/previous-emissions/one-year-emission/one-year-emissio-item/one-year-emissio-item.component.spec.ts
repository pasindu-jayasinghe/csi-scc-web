import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneYearEmissioItemComponent } from './one-year-emissio-item.component';

describe('OneYearEmissioItemComponent', () => {
  let component: OneYearEmissioItemComponent;
  let fixture: ComponentFixture<OneYearEmissioItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneYearEmissioItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneYearEmissioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
