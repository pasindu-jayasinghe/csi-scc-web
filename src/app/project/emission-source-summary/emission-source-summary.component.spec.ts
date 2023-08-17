import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionSourceSummaryComponent } from './emission-source-summary.component';

describe('EmissionSourceSummaryComponent', () => {
  let component: EmissionSourceSummaryComponent;
  let fixture: ComponentFixture<EmissionSourceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmissionSourceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionSourceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
