import { TestBed } from '@angular/core/testing';

import { ProjectAndSelectService } from './project-and-select.service';

describe('ProjectAndSelectService', () => {
  let service: ProjectAndSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectAndSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
