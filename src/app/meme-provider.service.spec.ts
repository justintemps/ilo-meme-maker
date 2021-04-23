import { TestBed } from '@angular/core/testing';

import { MemeProviderService } from './meme-provider.service';

describe('MemeProviderService', () => {
  let service: MemeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
