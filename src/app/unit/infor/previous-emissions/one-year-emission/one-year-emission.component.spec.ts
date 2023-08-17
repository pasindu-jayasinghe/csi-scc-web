import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneYearEmissionComponent } from './one-year-emission.component';

describe('OneYearEmissionComponent', () => {
  let component: OneYearEmissionComponent;
  let fixture: ComponentFixture<OneYearEmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneYearEmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneYearEmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
