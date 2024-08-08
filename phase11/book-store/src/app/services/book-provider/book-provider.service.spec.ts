import { fakeAsync, TestBed } from '@angular/core/testing';
import { BookProviderService } from './book-provider.service';
import { FetchBookService } from '../fetch-book/fetch-book.service';
import SpyObj = jasmine.SpyObj;
import { Book } from '../../models/Book';

describe('BookProviderService', () => {
  let service: BookProviderService;
  let FetchBookServiceSpy: SpyObj<FetchBookService>;

  beforeEach(() => {
    // Create a spy object for FetchBookService
    FetchBookServiceSpy = jasmine.createSpyObj('FetchBookService', [
      'fetchBooks',
    ]);

    // Define the return value for the fetchBooks method
    FetchBookServiceSpy.fetchBooks.and.returnValue(
      Promise.resolve([
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
      ]),
    );

    TestBed.configureTestingModule({
      providers: [
        BookProviderService,
        { provide: FetchBookService, useValue: FetchBookServiceSpy }, // Provide the spy object
      ],
    });

    service = TestBed.inject(BookProviderService);
  });

  it('service SHOULD be created WHEN ever', () => {
    expect(service).toBeTruthy();
  });

  it('getBooksByGenre SHOULD return grouped books by genre WHEN called', async () => {
    // Arrange
    // Act
    const result = await service.getBooksByGenre();

    // Assert
    expect(result.length).toBe(2);
  });

  it('getBooks SHOULD return all books WHEN called', async () => {
    // Arrange
    // Act
    await service.getBooksByGenre();
    const result = service.getBooks();

    // Assert
    expect(result.length).toBe(3);
  });

  it('findBookByName SHOULD return the book with the given name WHEN called', () => {
    // Arrange
    const bookName = 'Book 1';
    // Act
    const result = service.findBookByName(bookName);

    // Assert
    expect(result).toBe(service.getBooks()[0]);
  });
});
