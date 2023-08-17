import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUnitComponent } from './project-unit.component';

describe('ProjectUnitComponent', () => {
  let component: ProjectUnitComponent;
  let fixture: ComponentFixture<ProjectUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
