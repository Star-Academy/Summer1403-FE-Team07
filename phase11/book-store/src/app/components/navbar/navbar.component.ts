import { Component, OnInit } from '@angular/core';
import {
  NgClass,
  NgForOf,
  NgIf,
  NgOptimizedImage,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { SearchComponent } from '../search/search.component';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { ThemeService } from '../../services/theme/theme.service';
import { BookModalComponent } from '../book-modal/book-modal.component';
import { BookSearchService } from '../../services/search/book-search.service';
import { NavbarButtonComponent } from '../navbar-button/navbar-button.component';
import { ButtonData } from '../../models/ButtonData';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    Button,
    DialogModule,
    ReactiveFormsModule,
    NgIf,
    CalendarModule,
    InputNumberModule,
    NgTemplateOutlet,
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase,
    NgClass,
    SearchComponent,
    NgForOf,
    BookModalComponent,
    FormsModule,
    NavbarButtonComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  visible: boolean = false;
  searchControl = new FormControl();
  isLight: boolean = false;
  searchSrc: string = '/icons/dark/search-dark.svg';

  bookAddButton: ButtonData = {
    containerClass: 'add-container',
    imageSrc: '/icons/dark/add-dark.svg',
    alt: 'profile',
    height: 50,
    width: 50,
  };

  favoriteButton: ButtonData = {
    containerClass: 'favorite-container',
    imageSrc: '/icons/dark/heart-dark.svg',
    alt: 'profile',
    height: 50,
    width: 50,
  };

  themeButton: ButtonData = {
    containerClass: 'theme-container',
    imageSrc: '/icons/dark/sun.svg',
    alt: 'profile',
    height: 50,
    width: 50,
  };

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private searchService: BookSearchService,
  ) {}

  ngOnInit(): void {
    this.themeService.onToggle.subscribe((val) => {
      this.isLight = val;
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.searchService.search(query)),
      )
      .subscribe((results) => {
        this.searchService.updateSearchResults(
          results,
          this.searchControl.value,
        );
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.searchControl.setValue('');
      });
  }

  navigate() {
    this.router.navigate(['']).then(() => {
      return;
    });
  }

  closeDialog() {
    this.visible = false;
  }

  showDialog() {
    this.visible = true;
  }

  changeTheme() {
    this.isLight = !this.isLight;
    this.themeButton.imageSrc = this.isLight
      ? '/icons/light/moon.svg'
      : '/icons/dark/sun.svg';
    this.favoriteButton.imageSrc = this.isLight
      ? '/icons/light/heart.svg'
      : '/icons/dark/heart-dark.svg';
    this.bookAddButton.imageSrc = this.isLight
      ? '/icons/light/add.svg'
      : '/icons/dark/add-dark.svg';
    this.searchSrc = this.isLight
      ? '/icons/light/search.svg'
      : '/icons/dark/search-dark.svg';
    this.themeService.toggleTheme(this.isLight);
  }
}
