import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUnitEsComponent } from './project-unit-es.component';

describe('ProjectUnitEsComponent', () => {
  let component: ProjectUnitEsComponent;
  let fixture: ComponentFixture<ProjectUnitEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectUnitEsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUnitEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
