import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowUnitComponent } from './allow-unit.component';

describe('AllowUnitComponent', () => {
  let component: AllowUnitComponent;
  let fixture: ComponentFixture<AllowUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
