import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionSourceListComponent } from './emission-source-list.component';

describe('EmissionSourceListComponent', () => {
  let component: EmissionSourceListComponent;
  let fixture: ComponentFixture<EmissionSourceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmissionSourceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionSourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
