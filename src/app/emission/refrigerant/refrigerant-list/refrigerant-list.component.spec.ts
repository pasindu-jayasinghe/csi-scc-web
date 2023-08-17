import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefrigerantListComponent } from './refrigerant-list.component';

describe('RefrigerantListComponent', () => {
  let component: RefrigerantListComponent;
  let fixture: ComponentFixture<RefrigerantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefrigerantListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefrigerantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
