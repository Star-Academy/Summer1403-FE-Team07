import {Injectable} from '@angular/core';
import {Book} from "../models/Book";

@Injectable({
  providedIn: 'root'
})
export class FetchBookService {

  constructor() {
  }

  public async fetchBooks(): Promise<Book[]> {
    try {
      const response = await fetch('/books.json');
      const data = await response.json();
      return data.books || data;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }
}
