import { TestBed } from '@angular/core/testing';

import { UpdateinterventionService } from './updateintervention.service';

describe('UpdateinterventionService', () => {
  let service: UpdateinterventionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateinterventionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
