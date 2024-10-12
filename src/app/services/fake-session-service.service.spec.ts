import { TestBed } from '@angular/core/testing';

import { FakeSessionServiceService } from './fake-session-service.service';

describe('FakeSessionServiceService', () => {
  let service: FakeSessionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FakeSessionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
