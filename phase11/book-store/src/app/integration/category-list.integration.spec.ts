import {ComponentFixture, fakeAsync, TestBed, tick,} from '@angular/core/testing';
import {BookOperationsService} from '../services/book-operation/book-operations.service';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {Book} from '../models/Book';
import {SearchType} from '../models/SearchType';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {SearchComponent} from '../components/search/search.component';
import {BookProviderService} from '../services/book-provider/book-provider.service';
import {ActivatedRoute} from '@angular/router';
import {By, Title} from '@angular/platform-browser';
import {CategoryListComponent} from "../components/category-list/category-list.component";

describe('CategoryList Integration', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let bookProviderService: jasmine.SpyObj<BookProviderService>;
  let bookOperationsService: jasmine.SpyObj<BookOperationsService>;
  const searchResultsSubject = new BehaviorSubject<SearchType>({
    query: '',
    results: [],
  });
  const bookAddedSubject = new Subject<Book>();
  let titleService: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {
        params: {
          category: 'Science Fiction',
        },
      },
    };

    const bookProviderServiceSpy = jasmine.createSpyObj('BookProviderService', [
      'getBooksByGenre',
    ]);

    const bookOperationsServiceSpy = jasmine.createSpyObj(
      'BookOperationsService',
      [],
      { onAddBook: bookAddedSubject.asObservable() },
    );

    titleService = jasmine.createSpyObj('Title', ['setTitle', 'getTitle']);

    await TestBed.configureTestingModule({
      imports: [
        CategoryListComponent,
        NavbarComponent,
        SearchComponent,
      ],
      providers: [
        { provide: Title, useValue: titleService },
        { provide: BookProviderService, useValue: bookProviderServiceSpy },
        { provide: BookOperationsService, useValue: bookOperationsServiceSpy },
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

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });
});
