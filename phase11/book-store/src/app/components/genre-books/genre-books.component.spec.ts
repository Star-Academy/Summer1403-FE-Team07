import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenreBooksComponent } from './genre-books.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BookSearchService } from '../../services/search/book-search.service';
import { ThemeService } from '../../services/theme/theme.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GenreBooks } from '../../models/GenreBooks';
import { Subject } from 'rxjs';
import { SearchType } from '../../models/SearchType';

describe('GenreBooksComponent', () => {
  let sut: GenreBooksComponent;
  let fixture: ComponentFixture<GenreBooksComponent>;
  let debugElement: DebugElement;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBookSearchService: jasmine.SpyObj<BookSearchService>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let searchResultsSubject: Subject<SearchType>;
  let themeToggleSubject: Subject<boolean>;

  beforeEach(async () => {
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    searchResultsSubject = new Subject<SearchType>();
    themeToggleSubject = new Subject<boolean>();
    mockBookSearchService = jasmine.createSpyObj('BookSearchService', [], {
      searchResults$: searchResultsSubject.asObservable(),
    });
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      onToggle: themeToggleSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [GenreBooksComponent],
      providers: [
        { provide: Location, useValue: mockLocation },
        { provide: Router, useValue: mockRouter },
        { provide: BookSearchService, useValue: mockBookSearchService },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenreBooksComponent);
    sut = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  it('SHOULD create the sut WHEN initialized', () => {
    expect(sut).toBeTruthy();
  });

  it('SHOULD display the correct book details WHEN books input is set', () => {
    // Arrange
    const expectedBooks: GenreBooks = {
      genreName: 'Fiction',
      booksList: [
        {
          name: 'Test Book',
          image: 'test-image.jpg',
          genre: ['Fiction'],
          author: 'Test Author',
          publishData: '',
          price: 20,
        },
      ],
    };
    sut.books = expectedBooks;

    // Act
    fixture.detectChanges();

    // Assert
    const bookCardElements = debugElement.queryAll(By.css('app-book-card'));
    expect(bookCardElements.length).toBe(1);
    const genreNameElement = debugElement.query(
      By.css('.genre-container__genre-name'),
    );
    expect(genreNameElement.nativeElement.textContent).toBe(
      expectedBooks.genreName,
    );
  });

  it('SHOULD navigate to book details WHEN book card is clicked', () => {
    // Arrange
    const expectedBooks: GenreBooks = {
      genreName: 'Fiction',
      booksList: [
        {
          name: 'Test Book',
          image: 'test-image.jpg',
          genre: ['Fiction'],
          author: 'Test Author',
          publishData: '',
          price: 20,
        },
      ],
    };
    sut.books = expectedBooks;
    fixture.detectChanges();

    // Act
    const bookCardElement = debugElement.query(By.css('.genre-book'));
    bookCardElement.triggerEventHandler('click', null);

    // Assert
    const expectedFormattedName = expectedBooks.booksList[0].name
      .toLowerCase()
      .replaceAll(' ', '-');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/details',
      expectedFormattedName,
    ]);
  });

  it('SHOULD navigate back WHEN back button is clicked', () => {
    // Arrange
    sut.books = {
      genreName: 'Fiction',
      booksList: [
        {
          name: 'Test Book',
          image: 'test-image.jpg',
          genre: ['Fiction'],
          author: 'Test Author',
          publishData: '',
          price: 20,
        },
      ],
    };
    fixture.detectChanges();

    // Act
    const backButtonElement = debugElement.query(
      By.css('.genre-container__back-button'),
    );
    backButtonElement.triggerEventHandler('click', null);

    // Assert
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('SHOULD update search results WHEN search query changes', () => {
    // Arrange
    const expectedSearchResults: SearchType = { query: 'test', results: [] };

    // Act
    fixture.detectChanges();
    searchResultsSubject.next(expectedSearchResults);

    // Assert
    expect(sut.results).toEqual(expectedSearchResults);
  });

  it('SHOULD update theme WHEN theme is toggled', () => {
    // Arrange
    const isLight = true;

    // Act
    fixture.detectChanges();
    themeToggleSubject.next(isLight);

    // Assert
    expect(sut.isLight).toBe(isLight);
  });

  it('SHOULD display the search sut WHEN search query is not empty', () => {
    // Arrange
    sut.results.query = 'test query';

    // Act
    fixture.detectChanges();

    // Assert
    const searchComponentElement = debugElement.query(By.css('app-search'));
    expect(searchComponentElement).toBeTruthy();
  });

  it('SHOULD display genre books WHEN search query is empty', () => {
    // Arrange
    sut.results.query = '';
    sut.books = {
      genreName: 'Fiction',
      booksList: [
        {
          name: 'Test Book',
          image: 'test-image.jpg',
          genre: ['Fiction'],
          author: 'Test Author',
          publishData: '',
          price: 20,
        },
      ],
    };

    // Act
    fixture.detectChanges();

    // Assert
    const bookCardElements = debugElement.queryAll(By.css('app-book-card'));
    expect(bookCardElements.length).toBe(1);
  });
});
