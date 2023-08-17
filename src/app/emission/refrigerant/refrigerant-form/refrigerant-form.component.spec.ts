import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefrigerantFormComponent } from './refrigerant-form.component';

describe('RefrigerantFormComponent', () => {
  let component: RefrigerantFormComponent;
  let fixture: ComponentFixture<RefrigerantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefrigerantFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefrigerantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
