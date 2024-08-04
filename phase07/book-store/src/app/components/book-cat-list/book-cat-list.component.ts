import {Component, Input} from '@angular/core';
import {GroupByGenrePipe} from "../../pipes/group-by-genre.pipe";
import {Location, NgForOf, NgOptimizedImage} from "@angular/common";
import {GenreBooks} from "../../models/GenreBooks";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-book-cat-list',
  standalone: true,
  imports: [
    GroupByGenrePipe,
    NgForOf,
    NgOptimizedImage,
    RouterModule
  ],
  templateUrl: './book-cat-list.component.html',
  styleUrl: './book-cat-list.component.scss',
})

export class BookCatListComponent {
  @Input() books: GenreBooks = {genreName: '', booksList: []};

  constructor(private router: Router) {
  }

  goToDetails(name: string) {
    this.router.navigate(['/details', name.toLowerCase().replaceAll(' ', '-')])
      .then(() => {
        return;
      });
  }
}
