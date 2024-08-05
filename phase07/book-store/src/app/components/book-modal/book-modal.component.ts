import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {InputNumberModule} from "primeng/inputnumber";
import {NgClass, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {Book} from "../../models/Book";
import {MessageService} from "primeng/api";
import {BookProviderService} from "../../services/book-provider.service";
import {BookPost, BookResponse} from "../../models/BookResponse";

@Component({
  selector: 'app-book-modal',
  standalone: true,
  imports: [
    Button,
    CalendarModule,
    DialogModule,
    InputNumberModule,
    NgIf,
    ReactiveFormsModule,
    ToastModule,
    NgClass
  ],
  templateUrl: './book-modal.component.html',
  styleUrl: './book-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class BookModalComponent implements OnInit {
  bookForm: FormGroup;
  submitted: boolean = false;
  @Input() visible: boolean = false;
  @Input() book: Book | null = {
    name: '',
    image: '',
    genre: [],
    author: '',
    publishData: '',
    price: 0
  };

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleVisibility() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  constructor(private fb: FormBuilder,
              private messageService: MessageService,
              private bookProviderService: BookProviderService,) {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      publishData: ['', Validators.required],
      genre: [''],
      publisher: ['', Validators.required],
      author: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    if (this.book) {
      this.bookForm.patchValue(this.book);
      this.bookForm.get('publishData')?.setValue(new Date(this.book.publishData));
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.bookForm.invalid) {
      return;
    }
    if (this.book !== null) {
      this.updateBook();
    } else {
      this.addBook();
    }
    this.toggleVisibility();
  }

  addBook() {
    this.submitted = true;

    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;

      if (formValue.genre.length !== 0) {
        formValue.genre = formValue.genre!.split(", ");
      }

      const book: BookPost = {
        isbn: this.generateISBN10(),
        book_title: formValue.name,
        book_author: formValue.author,
        year_of_publication: formValue.publishData.getFullYear().toString(),
        publisher: formValue.publisher,
        image_url_s: formValue.image,
        image_url_m: formValue.image,
        image_url_l: formValue.image
      }
      this.visible = false;
      this.submitted = false;

      this.bookProviderService.addBook(book).subscribe({
        next: response => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'Book is successfully added',
              life: 3000
            });
          }
          else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              life: 3000,
              detail: 'Something went wrong while creating the book. Please try again later',
            });
          }
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            life: 3000,
            detail: 'Something went wrong while creating the book.',
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        life: 3000,
        detail: 'Form is invalid. Please fill out all required fields.'
      });
      this.submitted = false;
    }
  }

  generateISBN10() {
    const generateRandomDigits = (length: number): string => {
      let digits = '';
      for (let i = 0; i < length; i++) {
        digits += Math.floor(Math.random() * 10);
      }
      return digits;
    };

    const calculateISBN10CheckDigit = (digits: string): string => {
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += (i + 1) * parseInt(digits[i]);
      }
      const checkDigit = sum % 11;
      return checkDigit === 10 ? 'X' : checkDigit.toString();
    };

    const digits = generateRandomDigits(9);
    const checkDigit = calculateISBN10CheckDigit(digits);
    return digits + checkDigit;
  }

  updateBook() {
    this.submitted = true;
    console.log(this.book);

    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      formValue.publishData = this.formatDate(formValue.publishData);

      if (typeof formValue.genre === 'string') {
        formValue.genre = formValue.genre.split(", ");
      }

      const newBook: Book = formValue;

      if (this.book) {
        this.bookProviderService.updateBook(this.book, newBook);
        this.visible = false;
        this.submitted = false;
      }

    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        life: 3000,
        detail: 'Form is invalid. Please fill out all required fields.'
      });
      this.submitted = false;
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
