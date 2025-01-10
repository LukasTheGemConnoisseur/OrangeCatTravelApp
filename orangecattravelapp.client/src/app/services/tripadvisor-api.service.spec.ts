import { TestBed } from '@angular/core/testing';

import { TripadvisorApiService } from './tripadvisor-api.service';

describe('TripadvisorApiService', () => {
  let service: TripadvisorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripadvisorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
