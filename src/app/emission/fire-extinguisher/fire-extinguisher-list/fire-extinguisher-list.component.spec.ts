import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireExtinguisherListComponent } from './fire-extinguisher-list.component';

describe('FireExtinguisherListComponent', () => {
  let component: FireExtinguisherListComponent;
  let fixture: ComponentFixture<FireExtinguisherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FireExtinguisherListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FireExtinguisherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
