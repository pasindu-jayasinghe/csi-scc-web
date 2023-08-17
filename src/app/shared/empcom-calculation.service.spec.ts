import { TestBed } from '@angular/core/testing';

import { EmpcomCalculationService } from './empcom-calculation.service';

describe('EmpcomCalculationService', () => {
  let service: EmpcomCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpcomCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
