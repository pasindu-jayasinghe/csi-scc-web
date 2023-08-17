import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEfComponent } from './common-ef.component';

describe('CommonEfComponent', () => {
  let component: CommonEfComponent;
  let fixture: ComponentFixture<CommonEfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonEfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonEfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
