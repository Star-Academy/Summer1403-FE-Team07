import {Injectable} from '@angular/core';
import {Book} from "../../models/Book";
import {FetchBookService} from "../fetch-book/fetch-book.service";

@Injectable({
  providedIn: 'root'
})

export class BookProviderService {

  protected books: Book[] = [];

  private readonly initializationPromise: Promise<void>;

  constructor(private fetchBookService: FetchBookService) {
    this.fetchBookService = fetchBookService;
    this.initializationPromise = this.initializeBooks();
  }

  private async initializeBooks() {
    try {
      this.books = await this.fetchBookService.fetchBooks();
    } catch (error) {
      console.error('Error initializing books:', error);
    }
  }

  private async ensureInitialized() {
    await this.initializationPromise;
  }

  public async getBooksByGenre() {
    await this.ensureInitialized();

    const groupedBooks: { [genre: string]: Book[] } = this.groupBooksByGenre()

    return Object.keys(groupedBooks).map(genre => ({
      genreName: genre,
      booksList: groupedBooks[genre]
    }));
  }

  private groupBooksByGenre() {
    return this.books.reduce((acc: {
      [genre: string]: Book[]
    }, book: Book) => {
      book.genre.forEach((genre: string) => {
        if (!acc[genre]) {
          acc[genre] = [];
        }
        acc[genre].push(book);
      });
      return acc;
    }, {});
  }

  public findBookByName(name: string) {
    return this.books.find(b => b.name.toLowerCase() === name);
  }

  public getBooks() {
    return this.books
  }
}
