import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEsComponent } from './project-es.component';

describe('ProjectEsComponent', () => {
  let component: ProjectEsComponent;
  let fixture: ComponentFixture<ProjectEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectEsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
