import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { GroupByGenrePipe } from '../../pipes/group-by-genre.pipe';
import { BookProviderService } from '../../services/book-provider/book-provider.service';
import { BookCatListComponent } from '../book-cat-list/book-cat-list.component';
import { Subscription } from 'rxjs';
import { AsyncPipe, NgForOf } from '@angular/common';
import { GenreBooks } from '../../models/GenreBooks';
import { Book } from '../../models/Book';
import { CarouselComponent } from '../carousel/carousel.component';
import { SearchType } from '../../models/SearchType';
import { SearchComponent } from '../search/search.component';
import { BookSearchService } from '../../services/search/book-search.service';
import { BookOperationsService } from '../../services/book-operation/book-operations.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    GroupByGenrePipe,
    BookCatListComponent,
    AsyncPipe,
    CarouselComponent,
    NgForOf,
    SearchComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  genreBooks: GenreBooks[] = [];
  results: SearchType = {
    query: '',
    results: [],
  };
  private subscription: Subscription = new Subscription();

  constructor(
    private bookProviderService: BookProviderService,
    private bookOperations: BookOperationsService,
    private searchService: BookSearchService,
  ) {}

  ngOnInit(): void {
    this.initSearchResultsSubscription();
    this.initBookOperationsSubscription();
    this.loadBooksByGenre();
  }

  private initSearchResultsSubscription(): void {
    this.searchService.searchResults$.subscribe((output) => {
      this.results = output;
    });
  }

  private initBookOperationsSubscription(): void {
    this.subscription.add(
      this.bookOperations.onAddBook.subscribe((value) => {
        this.updateGenreBooks(value);
      }),
    );
  }

  private async loadBooksByGenre(): Promise<void> {
    try {
      this.genreBooks = await this.bookProviderService.getBooksByGenre();
    } catch (e) {
      console.log(e);
    }
  }

  private updateGenreBooks(value: Book): void {
    const groupedBooksMap: { [genre: string]: Book[] } = this.genreBooks.reduce(
      (acc, group) => {
        acc[group.genreName] = group.booksList;
        return acc;
      },
      {} as { [genre: string]: Book[] },
    );

    value.genre.forEach((genre: string) => {
      if (!groupedBooksMap[genre]) {
        groupedBooksMap[genre] = [];
      }
      groupedBooksMap[genre].push(value);
    });

    this.genreBooks = Object.keys(groupedBooksMap).map((genre) => ({
      genreName: genre,
      booksList: groupedBooksMap[genre],
    }));
  }
}
