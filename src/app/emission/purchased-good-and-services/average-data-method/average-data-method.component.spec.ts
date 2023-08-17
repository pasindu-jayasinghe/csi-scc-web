import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageDataMethodComponent } from './average-data-method.component';

describe('AverageDataMethodComponent', () => {
  let component: AverageDataMethodComponent;
  let fixture: ComponentFixture<AverageDataMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AverageDataMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageDataMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
