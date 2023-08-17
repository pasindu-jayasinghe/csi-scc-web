import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionCategoryComponent } from './emission-category.component';

describe('EmissionCategoryComponent', () => {
  let component: EmissionCategoryComponent;
  let fixture: ComponentFixture<EmissionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmissionCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
