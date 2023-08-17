import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitMultipleComponent } from './add-unit-multiple.component';

describe('AddUnitMultipleComponent', () => {
  let component: AddUnitMultipleComponent;
  let fixture: ComponentFixture<AddUnitMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUnitMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnitMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
