import { TestBed } from '@angular/core/testing';

import { MaintenancepreventiveService } from './maintenancepreventive.service';

describe('MaintenancepreventiveService', () => {
  let service: MaintenancepreventiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenancepreventiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
