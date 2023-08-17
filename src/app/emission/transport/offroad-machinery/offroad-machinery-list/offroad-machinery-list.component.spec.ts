import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffroadMachineryListComponent } from './offroad-machinery-list.component';

describe('OffroadMachineryListComponent', () => {
  let component: OffroadMachineryListComponent;
  let fixture: ComponentFixture<OffroadMachineryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffroadMachineryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffroadMachineryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
