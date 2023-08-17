import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPuesDataComponent } from './select-pues-data.component';

describe('SelectPuesDataComponent', () => {
  let component: SelectPuesDataComponent;
  let fixture: ComponentFixture<SelectPuesDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPuesDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPuesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
