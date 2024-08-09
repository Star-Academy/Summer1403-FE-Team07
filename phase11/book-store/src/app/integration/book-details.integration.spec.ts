import {ComponentFixture, fakeAsync, TestBed, tick,} from '@angular/core/testing';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {Book} from '../models/Book';
import {BookDetailsComponent} from "../components/book-details/book-details.component";
import {BookProviderService} from "../services/book-provider/book-provider.service";
import {BookOperationsService} from "../services/book-operation/book-operations.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ActivatedRoute, convertToParamMap} from "@angular/router";
import {SearchType} from "../models/SearchType";
import {By} from "@angular/platform-browser";
import {BookSearchService} from "../services/search/book-search.service";

describe('BookDetailsComponent Integration', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;
  let mockBookProviderService: jasmine.SpyObj<BookProviderService>;
  let mockBookOperationsService: jasmine.SpyObj<BookOperationsService>;
  let messageService: MessageService;
  let confirmationService: ConfirmationService;
  let bookSearchServiceSpy: jasmine.SpyObj<BookSearchService>;
  const searchResultsSubject = new BehaviorSubject<SearchType>({
    query: '',
    results: [],
  });

  beforeEach(async () => {
    mockBookProviderService = jasmine.createSpyObj('BookProviderService', ['findBookByName']);
    mockBookOperationsService = jasmine.createSpyObj(
      'BookOperationsService',
      ['deleteBook'],
      {
        onDeleteBook: new Subject<Book>(),
        onUpdateBook: new Subject<Book>(),
      },
    );
    bookSearchServiceSpy = jasmine.createSpyObj('BookSearchService', [], {
      searchResults$: searchResultsSubject.asObservable(),
    });

    messageService = new MessageService();
    confirmationService = new ConfirmationService();

    mockBookProviderService.findBookByName.and.callFake((name: string) => {
      if (name === 'test book 1') {
        return {
          name: 'Test Book 1',
          genre: ['Fiction'],
          author: 'Author 1',
          publishData: '2023-01-01',
          price: 10,
        } as Book;
      }
      return undefined;
    });

    await TestBed.configureTestingModule({
      imports: [BookDetailsComponent],
      providers: [
        {provide: BookProviderService, useValue: mockBookProviderService},
        {provide: BookOperationsService, useValue: mockBookOperationsService},
        {provide: ActivatedRoute, useValue: {paramMap: of(convertToParamMap({name: 'test-book-1'}))}},
        { provide: BookSearchService, useValue: bookSearchServiceSpy },
        MessageService, ConfirmationService,
      ],
    }).compileComponents();

    bookSearchServiceSpy = TestBed.inject(
      BookSearchService,
    ) as jasmine.SpyObj<BookSearchService>;

    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('SHOULD find and display the book details WHEN navigated to', () => {
    expect(component.book).toBeDefined();
    expect(component.book?.name).toEqual('Test Book 1');
  });

  it('SHOULD delete the book and display success message WHEN called', () => {
    component.deleteConfirm({target: {}} as Event);

    expect(confirmationService.confirm).toHaveBeenCalled();
    // const confirmArgs = confirmationService.confirm.calls.mostRecent().args[0];
    // confirmArgs.accept();

    expect(mockBookOperationsService.deleteBook).toHaveBeenCalledWith('test-book-1');

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Book is successfully deleted',
      life: 3000,
    });
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
