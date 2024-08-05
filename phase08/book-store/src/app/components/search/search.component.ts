import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from "@angular/common";
import {searchType} from "../../models/SearchType";
import {Router} from "@angular/router";
import {BookSearchService} from "../../services/book-search.service";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  results: searchType = {
    query: '',
    results: []
  };

  constructor(private searchService: BookSearchService, private router: Router) {
  }

  ngOnInit(): void {
    this.searchService.searchResults$.subscribe(output => {
      this.results = output;
    });
  }

  goToDetails(name: string) {
    this.router.navigate(['/details', name.toLowerCase().replaceAll(' ', '-')]).then(() => {
        return;
      }
    );
  }
}
