import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkliftsFormComponent } from './forklifts-form.component';

describe('ForkliftsFormComponent', () => {
  let component: ForkliftsFormComponent;
  let fixture: ComponentFixture<ForkliftsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForkliftsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForkliftsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
