import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionCreateBaseComponent } from './emission-create-base.component';

describe('EmissionCreateBaseComponent', () => {
  let component: EmissionCreateBaseComponent;
  let fixture: ComponentFixture<EmissionCreateBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmissionCreateBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionCreateBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
