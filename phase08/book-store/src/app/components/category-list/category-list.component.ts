import {Component, OnInit} from '@angular/core';
import {GroupByGenrePipe} from "../../pipes/group-by-genre.pipe";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Book} from "../../models/Book";
import {BookProviderService} from "../../services/book-provider.service";
import {BookCatListAllComponent} from "../book-cat-list-all/book-cat-list-all.component";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {GenreBooks} from "../../models/GenreBooks";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    GroupByGenrePipe,
    NgForOf,
    BookCatListAllComponent,
    AsyncPipe
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  books: GenreBooks[] = [];
  genreCategory: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(private bookProviderService: BookProviderService, private route: ActivatedRoute, private titleService: Title) {

  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.bookProviderService.onAddBook.subscribe(value => {
        const groupedBooksMap: { [genre: string]: Book[] } = this.books.reduce((acc, group) => {
          acc[group.genreName] = group.booksList;
          return acc;
        }, {} as { [genre: string]: Book[] });

        value.genre.forEach((genre: string) => {
          if (!groupedBooksMap[genre]) {
            groupedBooksMap[genre] = [];
          }
          groupedBooksMap[genre].push(value);
        });

        this.books = Object.keys(groupedBooksMap).map(genre => ({
          genreName: genre,
          booksList: groupedBooksMap[genre]
        }));
      })
    );
    try {
      this.bookProviderService.getBooksByGenre().then((r) => {
        this.books = r;
      })
    }
    catch (e) {
      console.log(e)
    }
    this.genreCategory = this.route.snapshot.params['category'];
    this.titleService.setTitle(this.titleService.getTitle() + ' ' + this.genreCategory.replaceAll('-', ' '));
  }
}
