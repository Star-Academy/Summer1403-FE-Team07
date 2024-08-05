import {Injectable} from '@angular/core';
import {Book} from "../models/Book";
import {BookResponse} from "../models/BookResponse";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class FetchBookService {
  private apiUrl: string = "/api/books";

  constructor(private http: HttpClient) {
  }

  public async fetchBooks(): Promise<Book[]> {
    try {
      const response = await fetch(`${this.apiUrl}?page=100&page_size=40`);
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

  public getBooksByPage(page: number, page_size: number) {
    const params = {page: page.toString(), page_size: page_size.toString()};
    const headers = new HttpHeaders({
      'access-control-allow-origin': '*'
    });
    return this.http.get<{ books: BookResponse[], pages: number }>(this.apiUrl, {params, headers});
  }
}
