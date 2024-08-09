import { Component, Input, OnInit } from '@angular/core';
import { Location, NgForOf, NgOptimizedImage } from '@angular/common';
import { GenreBooks } from '../../models/GenreBooks';
import { Router, RouterLink } from '@angular/router';
import { SearchType } from '../../models/SearchType';
import { SearchComponent } from '../search/search.component';
import { ThemeService } from '../../services/theme/theme.service';
import { BookSearchService } from '../../services/search/book-search.service';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'app-genre-books',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterLink,
    SearchComponent,
    BookCardComponent,
  ],
  templateUrl: './genre-books.component.html',
  styleUrl: './genre-books.component.scss',
})
export class GenreBooksComponent implements OnInit {
  @Input() books: GenreBooks = { genreName: '', booksList: [] };
  results: SearchType = {
    query: '',
    results: [],
  };
  isLight: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
    private seacrhService: BookSearchService,
    private themeService: ThemeService,
  ) {}

  goBack() {
    this.location.back();
  }

  goToDetails(name: string) {
    this.router
      .navigate(['/details', name.toLowerCase().replaceAll(' ', '-')])
      .then(() => {
        return;
      });
  }

  ngOnInit(): void {
    this.seacrhService.searchResults$.subscribe((output) => {
      this.results = output;
    });

    this.themeService.onToggle.subscribe((val) => {
      this.isLight = val;
    });
  }
}
