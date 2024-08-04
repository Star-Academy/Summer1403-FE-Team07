import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {GroupByGenrePipe} from "../../pipes/group-by-genre.pipe";
import {BookProviderService} from "../../services/book-provider.service";
import {BookCatListComponent} from "../book-cat-list/book-cat-list.component";
import {Subscription} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";
import {GenreBooks} from "../../models/GenreBooks";
import {Book} from "../../models/Book";
import {CarouselComponent} from "../carousel/carousel.component";
import {searchType} from "../../models/SearchType";
import {SearchComponent} from "../search/search.component";

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
    SearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  genreBooks: GenreBooks[] = [];
  results: searchType = {
    query: '',
    results: []
  };
  private subscription: Subscription = new Subscription();

  constructor(private bookProviderService: BookProviderService) {
  }

  ngOnInit(): void {

    this.bookProviderService.searchResults$.subscribe(output => {
      this.results = output;
    });

    this.subscription.add(
      this.bookProviderService.onAddBook.subscribe(value => {
        const groupedBooksMap: { [genre: string]: Book[] } = this.genreBooks.reduce((acc, group) => {
          acc[group.genreName] = group.booksList;
          return acc;
        }, {} as { [genre: string]: Book[] });

        value.genre.forEach((genre: string) => {
          if (!groupedBooksMap[genre]) {
            groupedBooksMap[genre] = [];
          }
          groupedBooksMap[genre].push(value);
        });

        this.genreBooks = Object.keys(groupedBooksMap).map(genre => ({
          genreName: genre,
          booksList: groupedBooksMap[genre]
        }));
      })
    );
    try {
      this.bookProviderService.getBooksByGenre().then((r) => {
        this.genreBooks = r;
      })
    }
    catch (e) {
      console.log(e)
    }
  }
}
