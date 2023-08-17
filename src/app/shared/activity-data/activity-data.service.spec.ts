import { TestBed } from '@angular/core/testing';

import { ActivityDataService } from './activity-data.service';

describe('ActivityDataService', () => {
  let service: ActivityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
