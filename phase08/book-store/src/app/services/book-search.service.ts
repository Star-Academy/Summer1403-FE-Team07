import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {searchType} from "../models/SearchType";
import {BookProviderService} from "./book-provider.service";
import {Book} from "../models/Book";

@Injectable({
  providedIn: 'root'
})
export class BookSearchService {
  private searchResultsSubject = new BehaviorSubject<searchType>({
    query: '',
    results: []
  });

  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(private bookProviderService: BookProviderService) {}

  public search(query: string, genre: string = ''): Observable<Book[]> {
    if (!query.trim())
      return of([]);

    const books = this.bookProviderService.getBooks();
    if (genre === '') {
      return of(books.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      return of(books.filter(item => item.name.toLowerCase().includes(query.toLowerCase())
        && item.genre.join(' ').toLowerCase().includes(genre.toLowerCase())));
    }
  }

  public updateSearchResults(results: Book[], query: string): void {
    const param: searchType = {query, results};
    this.searchResultsSubject.next(param);
  }
}
