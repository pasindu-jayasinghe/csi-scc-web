import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefrigerantViewComponent } from './refrigerant-view.component';

describe('RefrigerantViewComponent', () => {
  let component: RefrigerantViewComponent;
  let fixture: ComponentFixture<RefrigerantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefrigerantViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefrigerantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
