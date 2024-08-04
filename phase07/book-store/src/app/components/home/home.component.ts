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

// export interface PageEvent {
//   first: number | undefined;
//   rows: number | undefined;
//   page: number | undefined;
//   pageCount: number | undefined;
// }


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
    PaginatorModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
  genreBooks: Book[] = [];
  results: searchType = {
    query: '',
    results: []
  };
  private subscription: Subscription = new Subscription();

  constructor(private bookProviderService: BookProviderService) {
  }

  first: number = 0;
  rows: number = 10;

  onPageChange(event: PaginatorState) {
    if (event.first != null) {
      this.first = event.first;
    }
    if (event.rows != null) {
      this.rows = event.rows;
    }
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
          this.genreBooks = r;
          console.log(r)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
