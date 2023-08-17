import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffroadTransportFormComponent } from './offroad-transport-form.component';

describe('OffroadTransportFormComponent', () => {
  let component: OffroadTransportFormComponent;
  let fixture: ComponentFixture<OffroadTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffroadTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffroadTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
