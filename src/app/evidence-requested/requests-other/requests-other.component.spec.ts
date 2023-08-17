import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqeustsOtherComponent } from './requests-other.component';

describe('ReqeustsOtherComponent', () => {
  let component: ReqeustsOtherComponent;
  let fixture: ComponentFixture<ReqeustsOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqeustsOtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqeustsOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
