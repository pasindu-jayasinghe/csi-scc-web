import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowProjectsComponent } from './allow-projects.component';

describe('AllowProjectsComponent', () => {
  let component: AllowProjectsComponent;
  let fixture: ComponentFixture<AllowProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
