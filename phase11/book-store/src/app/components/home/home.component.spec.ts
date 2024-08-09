import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { BookProviderService } from '../../services/book-provider/book-provider.service';
import { BookOperationsService } from '../../services/book-operation/book-operations.service';
import { BookSearchService } from '../../services/search/book-search.service';
import { Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GenreBooks } from '../../models/GenreBooks';
import { SearchType } from '../../models/SearchType';
import { Book } from '../../models/Book';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let mockBookProviderService: jasmine.SpyObj<BookProviderService>;
  let mockBookOperationsService: jasmine.SpyObj<BookOperationsService>;
  let mockBookSearchService: jasmine.SpyObj<BookSearchService>;
  let searchResultsSubject: Subject<SearchType>;
  let addBookSubject: Subject<Book>;

  beforeEach(async () => {
    mockBookProviderService = jasmine.createSpyObj('BookProviderService', [
      'getBooksByGenre',
    ]);
    addBookSubject = new Subject<Book>();
    mockBookOperationsService = jasmine.createSpyObj(
      'BookOperationsService',
      [],
      {
        onAddBook: addBookSubject.asObservable(),
      },
    );
    searchResultsSubject = new Subject<SearchType>();
    mockBookSearchService = jasmine.createSpyObj('BookSearchService', [], {
      searchResults$: searchResultsSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: BookProviderService, useValue: mockBookProviderService },
        { provide: BookOperationsService, useValue: mockBookOperationsService },
        { provide: BookSearchService, useValue: mockBookSearchService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  it('SHOULD create the component WHEN initialized', () => {
    expect(component).toBeTruthy();
  });

  it('SHOULD subscribe to search results WHEN component is initialized', () => {
    // Arrange
    const expectedSearchResults: SearchType = { query: 'test', results: [] };

    // Act
    fixture.detectChanges();
    searchResultsSubject.next(expectedSearchResults);

    // Assert
    expect(component.results).toEqual(expectedSearchResults);
  });

  it('SHOULD load books by genre WHEN component is initialized', async () => {
    // Arrange
    const expectedGenreBooks: GenreBooks[] = [
      {
        genreName: 'Fiction',
        booksList: [
          {
            name: 'Book 1',
            image: '',
            genre: ['Fiction'],
            author: 'Author 1',
            publishData: '',
            price: 10,
          },
        ],
      },
    ];
    mockBookProviderService.getBooksByGenre.and.returnValue(
      Promise.resolve(expectedGenreBooks),
    );

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.genreBooks).toEqual(expectedGenreBooks);
  });

  it('SHOULD update genre books WHEN a new book is added', () => {
    // Arrange
    const existingGenreBooks: GenreBooks[] = [
      {
        genreName: 'Fiction',
        booksList: [
          {
            name: 'Existing Book',
            image: '',
            genre: ['Fiction'],
            author: 'Author 1',
            publishData: '',
            price: 10,
          },
        ],
      },
    ];
    const newBook: Book = {
      name: 'New Book',
      image: '',
      genre: ['Fiction'],
      author: 'Author 2',
      publishData: '',
      price: 15,
    };
    component.genreBooks = existingGenreBooks;

    // Act
    (component as any).updateGenreBooks(newBook);

    // Assert
    expect(component.genreBooks[0].booksList.length).toBe(2);
    expect(component.genreBooks[0].booksList[1]).toEqual(newBook);
  });

  it('SHOULD display the carousel WHEN search query is empty', () => {
    // Arrange
    component.results.query = '';

    // Act
    fixture.detectChanges();

    // Assert
    const carouselElement = debugElement.query(By.css('app-carousel'));
    expect(carouselElement).toBeTruthy();
  });

  it('SHOULD display the search component WHEN search query is not empty', () => {
    // Arrange
    component.results.query = 'test query';

    // Act
    fixture.detectChanges();

    // Assert
    const searchComponentElement = debugElement.query(By.css('app-search'));
    expect(searchComponentElement).toBeTruthy();
  });

  it('SHOULD handle adding a new book WHEN onAddBook emits a new book', () => {
    // Arrange
    const newBook: Book = {
      name: 'New Book',
      image: '',
      genre: ['Fiction'],
      author: 'Author 2',
      publishData: '',
      price: 15,
    };

    // Act
    fixture.detectChanges(); // Initialize subscriptions
    addBookSubject.next(newBook); // Emit a new book

    // Assert
    const updatedGenreBooks = component.genreBooks.find(
      (gb) => gb.genreName === 'Fiction',
    );
    expect(updatedGenreBooks).toBeDefined();
    expect(updatedGenreBooks!.booksList).toContain(newBook);
  });
});
