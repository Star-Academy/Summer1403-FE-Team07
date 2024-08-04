import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BookProviderService} from "../../services/book-provider.service";
import {NgForOf} from "@angular/common";
import {searchType} from "../../models/SearchType";
import {Router} from "@angular/router";

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

  constructor(private bookProviderService: BookProviderService, private router: Router) {
  }

  ngOnInit(): void {
    this.bookProviderService.searchResults$.subscribe(output => {
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
