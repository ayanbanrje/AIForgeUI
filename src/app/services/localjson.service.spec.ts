import { TestBed } from '@angular/core/testing';

import { LocaljsonService } from './localjson.service';

describe('LocaljsonService', () => {
  let service: LocaljsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaljsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
