import { TestBed } from '@angular/core/testing';

import { ModuleExtensionService } from './module-extension.service';

describe('ModuleExtensionService', () => {
  let service: ModuleExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
