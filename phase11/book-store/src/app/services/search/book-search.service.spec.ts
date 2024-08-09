import { TestBed } from '@angular/core/testing';

import { BookSearchService } from './book-search.service';
import { BookProviderService } from '../book-provider/book-provider.service';
import { Book } from '../../models/Book';

describe('BookSearchServiceService', () => {
  let service: BookSearchService;
  let mockBookProviderService: jasmine.SpyObj<BookProviderService>;

  beforeEach(() => {
    const mockBookProviderService = jasmine.createSpyObj(
      'BookProviderService',
      ['getBooks'],
    );
    const mockBooks: Book[] = [
      {
        name: 'Book 1',
        genre: ['genre1', 'genre2'],
        image: 'image1',
        author: 'author1',
        publishData: 'publishData1',
        price: 1,
      },
      {
        name: 'Book 2',
        genre: ['genre2'],
        image: 'image2',
        author: 'author2',
        publishData: 'publishData2',
        price: 2,
      },
      {
        name: 'Book 3',
        genre: ['genre1'],
        image: 'image3',
        author: 'author3',
        publishData: 'publishData3',
        price: 3,
      },
    ];
    mockBookProviderService.getBooks.and.returnValue(mockBooks);

    TestBed.configureTestingModule({
      providers: [
        BookSearchService,
        { provide: BookProviderService, useValue: mockBookProviderService },
      ],
    });

    service = TestBed.inject(BookSearchService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('service SHOULD be created WHEN ever', () => {
    expect(service).toBeTruthy();
  });

  it('service SHOULD return filtered books based on query WHEN called', () => {
    // Arrange
    const query = 'b';

    // Act
    let result: Book[] = [];
    service.search(query).subscribe((books) => (result = books));

    // Assert
    expect(result.length).toBe(3);
  });

  it('service SHOULD update search results correctly WHEN called', () => {
    // Arrange
    const results: Book[] = [];
    const query = 'Book 1';

    // Act
    service.updateSearchResults(results, query);

    // Assert
    service.searchResults$.subscribe((searchResults) => {
      expect(searchResults.query).toBe(query);
      expect(searchResults.results).toEqual(results);
    });
  });
});
