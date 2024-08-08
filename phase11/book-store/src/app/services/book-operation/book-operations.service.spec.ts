import { TestBed } from '@angular/core/testing';
import { BookOperationsService } from './book-operations.service';
import SpyObj = jasmine.SpyObj;
import { BookProviderService } from '../book-provider/book-provider.service';
import { Book } from '../../models/Book';

describe('BookOperationsService', () => {
  let service: BookOperationsService;
  let bookProviderSpy: SpyObj<BookProviderService>;

  beforeEach(() => {
    bookProviderSpy = jasmine.createSpyObj('BookProviderService', ['getBooks']);

    TestBed.configureTestingModule({
      providers: [{ provide: BookProviderService, useValue: bookProviderSpy }],
    }).compileComponents();

    service = TestBed.inject(BookOperationsService);
  });

  it('service SHOULD be created WHEN ever', () => {
    expect(service).toBeTruthy();
  });

  it('addBook method SHOULD add a book WHEN called', () => {
    // Arrange
    const newBook: Book = {
      name: 'Nightmare in the Woods',
      image: 'https://picsum.photos/id/323/200/300',
      genre: ['Horror'],
      author: 'H.P. Lovecraft',
      publishData: '2018-09-21',
      price: 1900,
    };
    const books: Book[] = [];
    bookProviderSpy.getBooks.and.returnValue(books);

    // Act
    service.addBook(newBook);

    // Assert
    expect(books[0]).toEqual(newBook);
  });

  it('deleteBook method SHOULD delete the book WHEN called', () => {
    // Arrange
    const bookName: string = 'Nightmare in the Woods';
    const books: Book[] = [
      {
        name: 'Nightmare in the Woods',
        image: 'https://picsum.photos/id/323/200/300',
        genre: ['Horror'],
        author: 'H.P. Lovecraft',
        publishData: '2018-09-21',
        price: 1900,
      },
    ];
    bookProviderSpy.getBooks.and.returnValue(books);

    // Act
    service.deleteBook(bookName);

    // Assert
    expect(books.length).toBe(0);
  });

  it('updateBook method SHOULD update a book WHEN called', () => {
    // Arrange
    const oldBook: Book = {
      name: 'Nightmare in the Woods',
      image: 'https://picsum.photos/id/323/200/300',
      genre: ['Horror'],
      author: 'H.P. Lovecraft',
      publishData: '2018-09-21',
      price: 1900,
    };
    const newBook: Book = {
      name: 'Green Arrow',
      image: 'https://picsum.photos/id/323/200/300',
      genre: ['Fiction', 'Drama'],
      author: 'H.P. Lovecraft',
      publishData: '2018-09-21',
      price: 2500,
    };
    const books: Book[] = [
      {
        name: 'Nightmare in the Woods',
        image: 'https://picsum.photos/id/323/200/300',
        genre: ['Horror'],
        author: 'H.P. Lovecraft',
        publishData: '2018-09-21',
        price: 1900,
      },
    ];
    bookProviderSpy.getBooks.and.returnValue(books);

    // Act
    service.updateBook(oldBook, newBook);

    // Assert
    expect(books[0]).toEqual(newBook);
  });
});
