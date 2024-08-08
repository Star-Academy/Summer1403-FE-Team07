import { TestBed } from '@angular/core/testing';

import { FetchBookService } from './fetch-book.service';
import { Book } from '../../models/Book';

describe('FetchBookService', () => {
  let service: FetchBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchBookService);
  });

  it('service SHOULD be created WHEN ever', () => {
    expect(service).toBeTruthy();
  });

  it('fetchBooks method SHOULD fetch books successfully WHEN called', async () => {
    // Arrange
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

    // Act
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve({ books: mockBooks }),
      } as Response),
    );

    // Assert
    const books = await service.fetchBooks();
    expect(books).toEqual(mockBooks);
  });

  it('fetchBooks method SHOULD handle fetch errors WHEN called', async () => {
    // Arrange
    spyOn(window, 'fetch').and.returnValue(
      Promise.reject(new Error('Fetch error')),
    );

    // Act
    const books = await service.fetchBooks();

    // Assert
    expect(books).toEqual([]);
  });
});
