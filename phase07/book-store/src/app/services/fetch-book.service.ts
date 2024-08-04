import {Injectable} from '@angular/core';
import {Book} from "../models/Book";
import {BookResponse} from "../models/BookResponse";

@Injectable({
  providedIn: 'root'
})

export class FetchBookService {

  constructor() {
  }



  public async fetchBooks(): Promise<Book[]> {
    try {
      const response = await fetch('/books.json');
      // const response = await fetch('http://192.168.23.22:3000/books?page=5&page_size=100');
      const data = await response.json();

      const books: Book[] = [];
      if (!data.books) {
        return [];
      }

      data.books.map((b: BookResponse) => {
        let book: Book = {
          name: '',
          image: '',
          genre: [],
          author: '',
          publishData: '',
          price: 0
        };
        book.name = b.book_title;
        book.author = b.book_author;
        book.price = Math.ceil(Math.random() * 1000 + 1);
        book.publishData = this.getRandomDateInYear(parseInt(b.year_of_publication));
        book.genre = [];
        book.image = b.image_url_l;
        books.push(book);
      });

      return books;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  public getRandomDateInYear(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const yyyy = randomDate.getFullYear();
    const mm = String(randomDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(randomDate.getDate()).padStart(2, '0');

    return `${yyyy}/${mm}/${dd}`;
  }
}
