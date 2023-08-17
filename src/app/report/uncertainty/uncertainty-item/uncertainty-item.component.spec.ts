import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UncertaintyItemComponent } from './uncertainty-item.component';

describe('UncertaintyItemComponent', () => {
  let component: UncertaintyItemComponent;
  let fixture: ComponentFixture<UncertaintyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UncertaintyItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UncertaintyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
