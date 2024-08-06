import {Component, Input} from '@angular/core';
import {GroupByGenrePipe} from "../../pipes/group-by-genre.pipe";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {GenreBooks} from "../../models/GenreBooks";
import {RouterModule} from "@angular/router";
import {LandingCardComponent} from "../landing-card/landing-card.component";

@Component({
  selector: 'app-book-cat-list',
  standalone: true,
  imports: [
    GroupByGenrePipe,
    NgForOf,
    NgOptimizedImage,
    RouterModule,
    LandingCardComponent
  ],
  templateUrl: './book-cat-list.component.html',
  styleUrl: './book-cat-list.component.scss',
})

export class BookCatListComponent {
  @Input() books: GenreBooks = {genreName: '', booksList: []};
}
