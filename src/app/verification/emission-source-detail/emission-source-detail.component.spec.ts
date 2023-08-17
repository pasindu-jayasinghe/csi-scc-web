import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionSourceDetailComponent } from './emission-source-detail.component';

describe('EmissionSourceDetailComponent', () => {
  let component: EmissionSourceDetailComponent;
  let fixture: ComponentFixture<EmissionSourceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmissionSourceDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionSourceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
