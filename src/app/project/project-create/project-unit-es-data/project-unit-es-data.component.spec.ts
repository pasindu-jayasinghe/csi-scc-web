import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUnitEsDataComponent } from './project-unit-es-data.component';

describe('ProjectUnitEsDataComponent', () => {
  let component: ProjectUnitEsDataComponent;
  let fixture: ComponentFixture<ProjectUnitEsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectUnitEsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUnitEsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
