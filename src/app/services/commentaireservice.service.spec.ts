import { TestBed } from '@angular/core/testing';

import { CommentaireserviceService } from './commentaireservice.service';

describe('CommentaireserviceService', () => {
  let service: CommentaireserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentaireserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
