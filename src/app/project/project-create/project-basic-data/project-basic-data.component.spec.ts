import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBasicDataComponent } from './project-basic-data.component';

describe('ProjectBasicDataComponent', () => {
  let component: ProjectBasicDataComponent;
  let fixture: ComponentFixture<ProjectBasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectBasicDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
