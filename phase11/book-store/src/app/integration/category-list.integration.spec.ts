import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BookOperationsService } from '../services/book-operation/book-operations.service';
import { BookSearchService } from '../services/search/book-search.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { GenreBooks } from '../models/GenreBooks';
import { Book } from '../models/Book';
import { SearchType } from '../models/SearchType';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { BookCatListComponent } from '../components/book-cat-list/book-cat-list.component';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { SearchComponent } from '../components/search/search.component';
import { BookProviderService } from '../services/book-provider/book-provider.service';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import {GenreBooksComponent} from "../components/genre-books/genre-books.component";

describe('CategoryList Integration', () => {
  let component: GenreBooksComponent;
  let fixture: ComponentFixture<GenreBooksComponent>;
  let bookProviderService: jasmine.SpyObj<BookProviderService>;
  let bookOperationsService: jasmine.SpyObj<BookOperationsService>;
  let bookSearchService: jasmine.SpyObj<BookSearchService>;
  const searchResultsSubject = new BehaviorSubject<SearchType>({
    query: '',
    results: [],
  });
  const bookAddedSubject = new Subject<Book>();

  beforeEach(async () => {
    const mockActivatedRoute = {
      paramMap: of({}),
    };

    const bookProviderServiceSpy = jasmine.createSpyObj('BookProviderService', [
      'getBooksByGenre',
    ]);

    const bookOperationsServiceSpy = jasmine.createSpyObj(
      'BookOperationsService',
      [],
      { onAddBook: bookAddedSubject.asObservable() },
    );
    const bookSearchServiceSpy = jasmine.createSpyObj('BookSearchService', [], {
      searchResults$: searchResultsSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [
        GenreBooksComponent,
        NavbarComponent,
        BookCatListComponent,
        CarouselComponent,
        SearchComponent,
      ],
      providers: [
        { provide: BookProviderService, useValue: bookProviderServiceSpy },
        { provide: BookOperationsService, useValue: bookOperationsServiceSpy },
        { provide: BookSearchService, useValue: bookSearchServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    bookProviderService = TestBed.inject(
      BookProviderService,
    ) as jasmine.SpyObj<BookProviderService>;
    bookOperationsService = TestBed.inject(
      BookOperationsService,
    ) as jasmine.SpyObj<BookOperationsService>;
    bookSearchService = TestBed.inject(
      BookSearchService,
    ) as jasmine.SpyObj<BookSearchService>;

    fixture = TestBed.createComponent(GenreBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  it('SHOULD display search results WHEN new search results are emitted', fakeAsync(() => {
    // Arrange
    const mockSearchResults: SearchType = {
      query: 'Dune',
      results: [
        {
          name: 'Dune',
          image: 'dune.jpg',
          genre: ['Science Fiction'],
          author: 'Frank Herbert',
          publishData: '1965-08-01',
          price: 9.99,
        },
      ],
    };

    // Act
    searchResultsSubject.next(mockSearchResults);
    tick();
    fixture.detectChanges();

    // Assert
    expect(component.results).toEqual(mockSearchResults);

    expect(fixture.debugElement.query(By.css('.search-books'))).toBeTruthy();
  }));
});
