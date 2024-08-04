import {Injectable} from '@angular/core';
import {Book} from "../models/Book";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {searchType} from "../models/SearchType";
import {FetchBookService} from "./fetch-book.service";

@Injectable({
  providedIn: 'root'
})

export class BookProviderService {

  protected books: Book[] = [];

  public readonly onAddBook: Subject<Book> = new Subject();
  public readonly onDeleteBook: Subject<Book> = new Subject();
  public readonly onUpdateBook: Subject<Book> = new Subject();
  private searchResultsSubject = new BehaviorSubject<searchType>({
    query: '',
    results: []
  });
  searchResults$ = this.searchResultsSubject.asObservable();
  private initializationPromise: Promise<void>;

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

    const groupedBooks: { [genre: string]: Book[] } = this.books.reduce((acc: {
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

    return Object.keys(groupedBooks).map(genre => ({
      genreName: genre,
      booksList: groupedBooks[genre]
    }));
  }

  public findBookByName(name: string) {
    return this.books.find(b => b.name.toLowerCase() === name);
  }

  public addBook(newBook: Book) {
    if (this.books.findIndex(book => book.name === newBook.name) === -1) {
      this.books.push(newBook);
      this.onAddBook.next(newBook);
    }
  }

  public deleteBook(newBook: string) {
    const index = this.books.findIndex(book => book.name.toLowerCase() === newBook.replaceAll('-', ' '));
    const book = this.books[index];
    if (index !== -1) {
      this.books.splice(index, 1);
      this.onDeleteBook.next(book);
    }
  }

  public updateBook(oldBook: Book, newBook: Book) {
    const index = this.books.findIndex(book => book.name === oldBook.name);
    if (index !== -1) {
      this.books[index] = newBook;
      this.onUpdateBook.next(newBook);
    }
  }

  public search(query: string, genre: string = ''): Observable<Book[]> {
    if (!query.trim())
      return of([]);

    if (genre == '')
      return of(this.books.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    else
      return of(this.books
        .filter(item => item.name.toLowerCase().includes(query.toLowerCase())
          && item.genre.join(' ').toLowerCase().includes(genre.toLowerCase())));
  }

  updateSearchResults(results: Book[], query: string): void {
    const param: searchType = {query, results}
    this.searchResultsSubject.next(param);
  }

}
