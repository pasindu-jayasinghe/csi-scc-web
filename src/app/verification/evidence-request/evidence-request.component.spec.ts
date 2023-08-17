import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceRequestComponent } from './evidence-request.component';

describe('EvidenceRequestComponent', () => {
  let component: EvidenceRequestComponent;
  let fixture: ComponentFixture<EvidenceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
