import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Book} from "../../models/Book";
import {BookProviderService} from "../book-provider/book-provider.service";

@Injectable({
  providedIn: 'root'
})
export class BookOperationsService {
  public readonly onAddBook: Subject<Book> = new Subject();
  public readonly onDeleteBook: Subject<Book> = new Subject();
  public readonly onUpdateBook: Subject<Book> = new Subject();

  constructor(private bookStore: BookProviderService) {}

  addBook(newBook: Book) {
    const books = this.bookStore.getBooks();
    if (!books.some(book => book.name === newBook.name)) {
      books.push(newBook);
      this.onAddBook.next(newBook);
    }
  }

  deleteBook(bookName: string) {
    const books = this.bookStore.getBooks();
    const index = books.findIndex(book => book.name.toLowerCase() === bookName.toLowerCase().replaceAll('-', ' '));
    if (index !== -1) {
      const book = books[index];
      books.splice(index, 1);
      this.onDeleteBook.next(book);
    }
  }

  updateBook(oldBook: Book, newBook: Book) {
    const books = this.bookStore.getBooks();
    const index = books.findIndex(book => book.name === oldBook.name);
    if (index !== -1) {
      books[index] = newBook;
      this.onUpdateBook.next(newBook);
    }
  }
}
