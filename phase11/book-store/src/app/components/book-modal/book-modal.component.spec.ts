import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookModalComponent } from './book-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BookOperationsService } from '../../services/book-operation/book-operations.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { Book } from '../../models/Book';
import { ToastModule } from 'primeng/toast';

describe('BookModalComponent', () => {
  let sut: BookModalComponent;
  let fixture: ComponentFixture<BookModalComponent>;
  let debugElement: DebugElement;
  let mockBookOperationsService: jasmine.SpyObj<BookOperationsService>;

  beforeEach(async () => {
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
        { provide: BookOperationsService, useValue: mockBookOperationsService },
        FormBuilder,
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookModalComponent);
    sut = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  it('SHOULD create the component WHEN initialized', () => {
    expect(sut).toBeTruthy();
  });

  it('SHOULD initialize the form with book data WHEN a book is provided', () => {
    // Arrange
    const book: Book = {
      name: 'Test Book',
      image: 'test-image.jpg',
      genre: ['Fiction'],
      author: 'Test Author',
      publishData: '2023-08-09',
      price: 29.99,
    };

    // Act
    sut.book = book;
    fixture.detectChanges();

    // Assert
    const form = sut.bookForm;

    const expectedValue = {
      name: book.name,
      image: book.image,
      genre: book.genre,
      author: book.author,
      publishData: new Date(book.publishData),
      price: book.price,
    };

    expect(form.value).toEqual(expectedValue);
  });

  it('SHOULD initialize the form with empty values WHEN no book is provided', () => {
    // Arrange
    sut.book = null;

    // Act
    fixture.detectChanges();

    // Assert
    const form = sut.bookForm;
    const expectedValue = {
      name: '',
      image: '',
      genre: '',
      author: '',
      publishData: '',
      price: '',
    };

    expect(form.value).toEqual(expectedValue);
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
