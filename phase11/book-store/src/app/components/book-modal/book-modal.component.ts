import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { Book } from '../../models/Book';
import { MessageService } from 'primeng/api';
import { BookOperationsService } from '../../services/book-operation/book-operations.service';

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
    NgClass,
    NgForOf,
  ],
  templateUrl: './book-modal.component.html',
  styleUrl: './book-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
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
    price: 0,
  };

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private bookOperations: BookOperationsService,
  ) {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      publishData: ['', Validators.required],
      genre: ['', Validators.required],
      author: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
    });
  }

  toggleVisibility() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  ngOnInit() {
    if (this.book) {
      this.bookForm.patchValue(this.book);
      this.bookForm
        .get('publishData')
        ?.setValue(new Date(this.book.publishData));
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.bookForm.invalid) {
      return;
    }
    if (this.book) {
      this.updateBook();
    } else {
      this.addBook();
    }
    this.toggleVisibility();
  }

  addBook() {
    this.submitted = true;
    const formValue = this.bookForm.value;
    formValue.publishData = this.formatDate(formValue.publishData);
    formValue.genre = formValue.genre.split(', ');
    const book: Book = formValue;
    this.bookOperations.addBook(book);
    this.visible = false;
    this.submitted = false;

    this.messageService.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Book is successfully added',
      life: 3000,
    });
  }

  updateBook() {
    this.submitted = true;
    const formValue = this.bookForm.value;
    formValue.publishData = this.formatDate(formValue.publishData);

    if (typeof formValue.genre === 'string') {
      formValue.genre = formValue.genre.split(', ');
    }

    const newBook: Book = formValue;

    if (this.book) {
      this.bookOperations.updateBook(this.book, newBook);
      this.visible = false;
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
