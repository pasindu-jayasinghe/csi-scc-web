import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBurningOfWasteComponent } from './open-burning-of-waste.component';

describe('OpenBurningOfWasteComponent', () => {
  let component: OpenBurningOfWasteComponent;
  let fixture: ComponentFixture<OpenBurningOfWasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenBurningOfWasteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBurningOfWasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
