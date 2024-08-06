import { TestBed } from '@angular/core/testing';

import { BookProviderService } from './book-provider.service';

describe('BookProviderService', () => {
  let service: BookProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
