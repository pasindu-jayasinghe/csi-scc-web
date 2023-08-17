import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqeustDetailComponent } from './request-detail.component';

describe('ReqeustDetailComponent', () => {
  let component: ReqeustDetailComponent;
  let fixture: ComponentFixture<ReqeustDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqeustDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqeustDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
