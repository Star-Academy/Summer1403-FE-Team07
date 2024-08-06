import { TestBed } from '@angular/core/testing';

import { BookOperationsService } from './book-operations.service';

describe('BookOperationsService', () => {
  let service: BookOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
