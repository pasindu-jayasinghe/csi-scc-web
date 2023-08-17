import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousEmissionsComponent } from './previous-emissions.component';

describe('PreviousEmissionsComponent', () => {
  let component: PreviousEmissionsComponent;
  let fixture: ComponentFixture<PreviousEmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousEmissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousEmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
