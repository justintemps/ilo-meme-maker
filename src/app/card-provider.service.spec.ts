import { TestBed } from '@angular/core/testing';

import { CardProvider } from './card-provider.service';

describe('MemeProviderService', () => {
  let service: CardProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
