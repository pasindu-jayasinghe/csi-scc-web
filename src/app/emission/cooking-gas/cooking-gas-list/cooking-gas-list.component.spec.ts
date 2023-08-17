import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingGasListComponent } from './cooking-gas-list.component';

describe('CookingGasListComponent', () => {
  let component: CookingGasListComponent;
  let fixture: ComponentFixture<CookingGasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookingGasListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookingGasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
