import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsFormComponent } from './investments-form.component';

describe('InvestmentsFormComponent', () => {
  let component: InvestmentsFormComponent;
  let fixture: ComponentFixture<InvestmentsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
