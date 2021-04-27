import { TestBed } from '@angular/core/testing';

import { StorageProvider } from './storage-provider.service';

describe('CardCollectionProviderService', () => {
  let service: StorageProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
