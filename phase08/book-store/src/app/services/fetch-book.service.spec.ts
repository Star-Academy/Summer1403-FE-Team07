import { TestBed } from '@angular/core/testing';

import { FetchBookService } from './fetch-book.service';

describe('FetchBookService', () => {
  let service: FetchBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
