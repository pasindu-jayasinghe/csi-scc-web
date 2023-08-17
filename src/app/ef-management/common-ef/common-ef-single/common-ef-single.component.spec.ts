import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEfSingleComponent } from './common-ef-single.component';

describe('CommonEfSingleComponent', () => {
  let component: CommonEfSingleComponent;
  let fixture: ComponentFixture<CommonEfSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonEfSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonEfSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
