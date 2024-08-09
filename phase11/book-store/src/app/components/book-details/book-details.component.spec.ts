import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookDetailsComponent } from './book-details.component';
import { BookProviderService } from '../../services/book-provider/book-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ThemeService } from '../../services/theme/theme.service';
import { BookOperationsService } from '../../services/book-operation/book-operations.service';
import { BookSearchService } from '../../services/search/book-search.service';
import { of, Subject } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Button } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Book } from '../../models/Book';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;
  let mockBookProviderService: jasmine.SpyObj<BookProviderService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let mockBookOperationsService: jasmine.SpyObj<BookOperationsService>;
  let mockBookSearchService: jasmine.SpyObj<BookSearchService>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockBookProviderService = jasmine.createSpyObj('BookProviderService', [
      'findBookByName',
    ]);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', [
      'confirm',
    ]);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      onToggle: new Subject<boolean>(),
    });
    mockBookOperationsService = jasmine.createSpyObj(
      'BookOperationsService',
      ['onUpdateBook', 'deleteBook'],
      {
        onUpdateBook: new Subject<Book>(),
      },
    );
    mockBookSearchService = jasmine.createSpyObj('BookSearchService', [], {
      searchResults$: of({
        query: '',
        results: [],
      }),
    });
    mockActivatedRoute = {
      paramMap: of({ get: (key: string) => 'test-book' }),
    };
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        BookDetailsComponent,
        ToastModule,
        ConfirmPopupModule,
        Button,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: BookProviderService, useValue: mockBookProviderService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: BookOperationsService, useValue: mockBookOperationsService },
        { provide: BookSearchService, useValue: mockBookSearchService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        Title,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
  });

  it('SHOULD create the component WHEN initialized', () => {
    expect(component).toBeTruthy();
  });

  it('SHOULD initialize with the correct book details WHEN book name is provided in route', () => {
    // Arrange
    const mockBook: Book = {
      name: 'Test Book',
      image: 'test-image.jpg',
      genre: ['Fiction'],
      author: 'Test Author',
      publishData: '2023-01-01',
      price: 10,
    };
    mockBookProviderService.findBookByName.and.returnValue(mockBook);

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.book).toEqual(mockBook);
    expect(mockBookProviderService.findBookByName).toHaveBeenCalledWith(
      'test book',
    );
  });

  it('SHOULD navigate back WHEN goBack is called', () => {
    // Act
    component.goBack();

    // Assert
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('SHOULD display confirmation popup and delete book WHEN deleteConfirm is called', () => {
    // Arrange
    component.bookName = 'test-book';

    // Mock the confirm method to immediately call the accept function
    // mockConfirmationService.confirm.and.callFake((confirmation) => {
    //   confirmation.accept();
    // });

    // Act
    component.deleteConfirm(new MouseEvent('click'));

    // Assert
    expect(mockBookOperationsService.deleteBook).toHaveBeenCalledWith(
      'test-book',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    expect(mockMessageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'info',
        summary: 'Confirmed',
        detail: 'Book is successfully deleted',
        life: 3000,
      }),
    );
  });

  it('SHOULD update the book and display a success message WHEN onUpdateBook emits', () => {
    // Arrange
    const updatedBook: Book = {
      name: 'Updated Book',
      image: 'updated-image.jpg',
      genre: ['Drama'],
      author: 'Updated Author',
      publishData: '2023-01-01',
      price: 15,
    };

    // Act
    fixture.detectChanges();
    (mockBookOperationsService.onUpdateBook as Subject<Book>).next(updatedBook);
    fixture.detectChanges();

    // Assert
    expect(component.book).toEqual(updatedBook);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/details',
      'updated-book',
    ]);
    expect(mockMessageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'info',
        summary: 'Confirmed',
        detail: 'Book is successfully updated',
        life: 3000,
      }),
    );
  });

  it('SHOULD toggle theme WHEN onToggle emits', () => {
    // Act
    fixture.detectChanges();
    (mockThemeService.onToggle as Subject<boolean>).next(false);

    // Assert
    expect(component.isLight).toBeFalse();
  });

  it('SHOULD show dialog WHEN showDialog is called', () => {
    // Act
    component.showDialog();

    // Assert
    expect(component.visible).toBeTrue();
  });

  it('SHOULD close dialog WHEN closeDialog is called', () => {
    // Arrange
    component.visible = true;

    // Act
    component.closeDialog();

    // Assert
    expect(component.visible).toBeFalse();
  });

  it('SHOULD toggle favorite WHEN onClickFavorite is called', () => {
    // Arrange
    component.isLiked = false;

    // Act
    component.onClickFavorite();

    // Assert
    expect(component.isLiked).toBeTrue();

    // Act again
    component.onClickFavorite();

    // Assert
    expect(component.isLiked).toBeFalse();
  });
});
