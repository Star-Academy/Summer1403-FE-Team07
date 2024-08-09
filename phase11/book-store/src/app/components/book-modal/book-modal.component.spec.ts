import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BookModalComponent } from './book-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BookOperationsService } from '../../services/book-operation/book-operations.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Book } from '../../models/Book';
import { ToastModule } from 'primeng/toast';

describe('BookModalComponent', () => {
  let sut: BookModalComponent;
  let fixture: ComponentFixture<BookModalComponent>;
  let debugElement: DebugElement;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockBookOperationsService: jasmine.SpyObj<BookOperationsService>;

  beforeEach(async () => {
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockBookOperationsService = jasmine.createSpyObj('BookOperationsService', [
      'addBook',
      'updateBook',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        BookModalComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        ToastModule,
      ],
      providers: [
        { provide: MessageService, useValue: mockMessageService },
        { provide: BookOperationsService, useValue: mockBookOperationsService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookModalComponent);
    sut = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('SHOULD create the component WHEN initialized', () => {
    expect(sut).toBeTruthy();
  });

  it('SHOULD initialize the form with default values WHEN no book is provided', fakeAsync(() => {
    // Arrange & Act
    sut.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assert
    expect(sut.bookForm.value).toEqual({
      name: '',
      image: '',
      publishData: '',
      genre: '',
      author: '',
      price: 0,
    });
  }));

  it('SHOULD initialize the form with provided book values WHEN a book is provided', () => {
    // Arrange
    sut.book = {
      name: 'Test Book',
      image: 'test-image.jpg',
      genre: ['Fiction'],
      author: 'Test Author',
      publishData: '2023-01-01',
      price: 25,
    };

    // Act
    sut.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(sut.bookForm.value).toEqual({
      name: 'Test Book',
      image: 'test-image.jpg',
      publishData: '2023-01-01',
      genre: 'Fiction',
      author: 'Test Author',
      price: 25,
    });
  });

  it('SHOULD show validation errors WHEN form is invalid and submitted', () => {
    // Arrange
    sut.ngOnInit();
    fixture.detectChanges();

    // Act
    sut.onSubmit();
    fixture.detectChanges();

    // Assert
    const validationMessages = debugElement.queryAll(
      By.css('.book-form__error'),
    );
    expect(validationMessages.length).toBeGreaterThan(0);
  });

  it('SHOULD call addBook WHEN a new book is submitted', () => {
    // Arrange
    sut.ngOnInit();
    sut.bookForm.setValue({
      name: 'New Book',
      image: 'new-image.jpg',
      publishData: '2023-01-01',
      genre: 'Non-fiction',
      author: 'New Author',
      price: 20,
    });
    fixture.detectChanges();

    // Act
    sut.onSubmit();

    // Assert
    expect(mockBookOperationsService.addBook).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: 'New Book',
        image: 'new-image.jpg',
        publishData: '2023-01-01',
        genre: ['Non-fiction'],
        author: 'New Author',
        price: 20,
      }),
    );
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Book is successfully added',
      life: 3000,
    });
  });

  it('SHOULD call updateBook WHEN an existing book is submitted', () => {
    // Arrange
    const book: Book = {
      name: 'Existing Book',
      image: 'existing-image.jpg',
      genre: ['Drama'],
      author: 'Existing Author',
      publishData: '2022-01-01',
      price: 30,
    };
    sut.book = book;
    sut.ngOnInit();
    sut.bookForm.setValue({
      name: 'Updated Book',
      image: 'updated-image.jpg',
      publishData: '2023-01-01',
      genre: 'Drama',
      author: 'Updated Author',
      price: 35,
    });
    fixture.detectChanges();

    // Act
    sut.onSubmit();

    // Assert
    expect(mockBookOperationsService.updateBook).toHaveBeenCalledWith(
      book,
      jasmine.objectContaining({
        name: 'Updated Book',
        image: 'updated-image.jpg',
        publishData: '2023-01-01',
        genre: ['Drama'],
        author: 'Updated Author',
        price: 35,
      }),
    );
  });

  it('SHOULD emit visibleChange event and close the modal WHEN visibility is toggled', () => {
    // Arrange
    spyOn(sut.visibleChange, 'emit');

    // Act
    sut.toggleVisibility();

    // Assert
    expect(sut.visible).toBeFalse();
    expect(sut.visibleChange.emit).toHaveBeenCalledWith(false);
  });
});
