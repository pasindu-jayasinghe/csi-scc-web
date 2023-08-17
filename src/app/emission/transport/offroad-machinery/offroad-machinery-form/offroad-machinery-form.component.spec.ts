import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffroadMachineryFormComponent } from './offroad-machinery-form.component';

describe('OffroadMachineryFormComponent', () => {
  let component: OffroadMachineryFormComponent;
  let fixture: ComponentFixture<OffroadMachineryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffroadMachineryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffroadMachineryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
