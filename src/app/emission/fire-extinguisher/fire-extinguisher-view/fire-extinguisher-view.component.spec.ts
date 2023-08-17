import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireExtinguisherViewComponent } from './fire-extinguisher-view.component';

describe('FireExtinguisherViewComponent', () => {
  let component: FireExtinguisherViewComponent;
  let fixture: ComponentFixture<FireExtinguisherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FireExtinguisherViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FireExtinguisherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
