import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressDetailComponent } from './progress-detail.component';

describe('ProgressDetailComponent', () => {
  let component: ProgressDetailComponent;
  let fixture: ComponentFixture<ProgressDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
