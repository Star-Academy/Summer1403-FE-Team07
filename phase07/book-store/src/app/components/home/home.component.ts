import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {GroupByGenrePipe} from "../../pipes/group-by-genre.pipe";
import {BookProviderService} from "../../services/book-provider.service";
import {Subscription} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Book} from "../../models/Book";
import {CarouselComponent} from "../carousel/carousel.component";
import {searchType} from "../../models/SearchType";
import {SearchComponent} from "../search/search.component";
import {BookCardComponent} from "../book-card/book-card.component";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {FetchBookService} from "../../services/fetch-book.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    GroupByGenrePipe,
    AsyncPipe,
    CarouselComponent,
    NgForOf,
    SearchComponent,
    BookCardComponent,
    PaginatorModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
  books: Book[] = [];
  results: searchType = {
    query: '',
    results: []
  };
  private subscription: Subscription = new Subscription();

  constructor(private bookProviderService: BookProviderService,
              private fetchBookService: FetchBookService) {
  }

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 271377;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.fetchBooks();
  }

  fetchBooks() {
    const page = this.first / this.rows;
    this.fetchBookService
      .getBooksByPage(page, this.rows)
      .subscribe(response => {
        console.log(response);
        this.books = response.books.map(b => {
          return {
            name: b.book_title,
            genre: ['horror'],
            image: b.image_url_l,
            author: b.book_author,
            price: Math.ceil(Math.random() * 1000 + 1),
            publishData: b.year_of_publication.toString()
          } as Book;
        });
        this.totalRecords = Math.ceil(response.pages) * this.rows;
      });
  }

  ngOnInit(): void {
    this.bookProviderService.searchResults$.subscribe(output => {
      this.results = output;
    });

    // this.subscription.add(
    //   this.bookProviderService.onAddBook.subscribe(value => {
    //     const groupedBooksMap: { [genre: string]: Book[] } = this.genreBooks.reduce((acc, group) => {
    //       acc[group.genreName] = group.booksList;
    //       return acc;
    //     }, {} as { [genre: string]: Book[] });
    //
    //     value.genre.forEach((genre: string) => {
    //       if (!groupedBooksMap[genre]) {
    //         groupedBooksMap[genre] = [];
    //       }
    //       groupedBooksMap[genre].push(value);
    //     });
    //
    //     this.genreBooks = Object.keys(groupedBooksMap).map(genre => ({
    //       genreName: genre,
    //       booksList: groupedBooksMap[genre]
    //     }));
    //   })
    // );

    try {
      this.bookProviderService.getBooksByGenre().then((r: Book[] | void) => {
        if (r !== undefined) {
          this.books = r;
          console.log(r)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
