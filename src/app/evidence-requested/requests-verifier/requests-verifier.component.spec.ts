import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqeustsVerifierComponent } from './requests-verifier.component';

describe('ReqeustsVerifierComponent', () => {
  let component: ReqeustsVerifierComponent;
  let fixture: ComponentFixture<ReqeustsVerifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqeustsVerifierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqeustsVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
