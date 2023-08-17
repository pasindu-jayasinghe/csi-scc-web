import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingGasFormComponent } from './cooking-gas-form.component';

describe('CookingGasFormComponent', () => {
  let component: CookingGasFormComponent;
  let fixture: ComponentFixture<CookingGasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookingGasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookingGasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
