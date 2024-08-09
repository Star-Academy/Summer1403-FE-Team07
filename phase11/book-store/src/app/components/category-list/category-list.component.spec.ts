import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryListComponent } from './category-list.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BookProviderService } from '../../services/book-provider/book-provider.service';
import { BookOperationsService } from '../../services/book-operation/book-operations.service';
import { Subject } from 'rxjs';
import { Book } from '../../models/Book';

describe('CategoryListComponent', () => {
  let sut: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let booksProviderSpy: jasmine.SpyObj<BookProviderService>;
  let bookOperationsSpy: jasmine.SpyObj<BookOperationsService>;
  let onAddBookSubject: Subject<Book>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let titleService: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    booksProviderSpy = jasmine.createSpyObj('BookProviderService', [
      'getBooksByGenre',
    ]);

    onAddBookSubject = new Subject<Book>();

    bookOperationsSpy = jasmine.createSpyObj('BookOperationsService', [], {
      onAddBook: onAddBookSubject.asObservable(), // Mock onAddBook as an observable
    });

    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        params: { category: 'test-category' },
      },
    });

    titleService = jasmine.createSpyObj('Title', ['setTitle', 'getTitle']);

    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        { provide: Title, useValue: titleService },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: BookProviderService, useValue: booksProviderSpy },
        { provide: BookOperationsService, useValue: bookOperationsSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    sut = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  it('component SHOULD be created WHEN ever', () => {
    expect(sut).toBeTruthy();
  });

  it('SHOULD update books WHEN onAddBook emits a new book', () => {
    // Arrange
    const newBook: Book = {
      name: 'Test Book',
      genre: ['test'],
      image: 'test.jpg',
      author: 'Test Author',
      publishData: '2021-01-01',
      price: 10,
    };
    sut.books = [{ genreName: 'test', booksList: [] }];

    // Act
    onAddBookSubject.next(newBook);
    fixture.detectChanges();

    // Assert
    expect(sut.books[0].booksList).toContain(newBook);
  });

  it('SHOULD update the page title based on route parameter WHEN navigated to', () => {
    // Arrange
    const newCategory = 'new-category';
    activatedRouteSpy.snapshot.params['category'] = newCategory;

    // Act
    sut.ngOnInit();

    // Assert
    expect(titleService.setTitle).toHaveBeenCalledWith(
      `${titleService.getTitle()} ${newCategory.replaceAll('-', ' ')}`,
    );
  });
});
