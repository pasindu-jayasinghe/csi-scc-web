import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionListBaseComponent } from './emission-list-base.component';

describe('EmissionListBaseComponent', () => {
  let component: EmissionListBaseComponent;
  let fixture: ComponentFixture<EmissionListBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmissionListBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionListBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
