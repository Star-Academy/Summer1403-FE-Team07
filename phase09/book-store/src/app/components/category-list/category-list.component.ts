import {Component, OnInit} from '@angular/core';
import {GroupByGenrePipe} from "../../pipes/group-by-genre.pipe";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Book} from "../../models/Book";
import {BookProviderService} from "../../services/book-provider/book-provider.service";
import {GenreBooksComponent} from "../genre-books/genre-books.component";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {GenreBooks} from "../../models/GenreBooks";
import {BookOperationsService} from "../../services/book-operation/book-operations.service";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    GroupByGenrePipe,
    NgForOf,
    GenreBooksComponent,
    AsyncPipe
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  books: GenreBooks[] = [];
  genreCategory: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(private bookProviderService: BookProviderService, private bookOperation: BookOperationsService,
              private route: ActivatedRoute, private titleService: Title) {
  }

  ngOnInit(): void {
    this.initializeSubscriptions();
    this.loadBooksByGenre();
    this.setPageTitle();
  }

  private initializeSubscriptions(): void {
    this.subscriptions.add(
      this.bookOperation.onAddBook.subscribe(value => {
        this.updateBooks(value);
      })
    );
  }

  private async loadBooksByGenre(): Promise<void> {
    try {
      this.books = await this.bookProviderService.getBooksByGenre();
    } catch (e) {
      console.log(e);
    }
  }

  private setPageTitle(): void {
    this.genreCategory = this.route.snapshot.params['category'];
    this.titleService.setTitle(this.titleService.getTitle() + ' ' + this.genreCategory.replaceAll('-', ' '));
  }

  private updateBooks(value: Book): void {
    const groupedBooksMap: { [genre: string]: Book[] } = this.books
      .reduce((acc, group) => {
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
  }
}
