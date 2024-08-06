import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  NgClass,
  NgForOf,
  NgIf,
  NgOptimizedImage,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet
} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {Button} from "primeng/button";
import {DialogModule} from 'primeng/dialog';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {BookProviderService} from "../../services/book-provider.service";
import {SearchComponent} from "../search/search.component";
import {debounceTime, distinctUntilChanged, filter, switchMap} from "rxjs/operators";
import {ThemeService} from "../../services/theme.service";
import {BookModalComponent} from "../book-modal/book-modal.component";
import {fa} from "@faker-js/faker";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    Button,
    DialogModule,
    ReactiveFormsModule,
    NgIf,
    ToastModule,
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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class NavbarComponent implements OnInit {
  visible: boolean = false;
  searchControl = new FormControl();
  isLight: boolean = false;
  themeSrc: string = '/icons/dark/sun.svg';
  favoriteSrc: string = '/icons/dark/heart-dark.svg';
  addSrc: string = '/icons/dark/add-dark.svg';
  searchSrc: string = '/icons/dark/search-dark.svg';

  constructor(
    private router: Router,
    private bookProviderService: BookProviderService,
    private themeService: ThemeService
  ) {
  }

  ngOnInit(): void {

    this.themeService.onToggle.subscribe(val => {
      this.isLight = val;
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.bookProviderService.search(query))
    ).subscribe(results => {
      this.bookProviderService.updateSearchResults(results, this.searchControl.value);
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.searchControl.setValue('');
    });
  }

  navigate() {
    this.router.navigate(['']).then(() => {
      return
    });
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  changeTheme() {
    this.isLight = !this.isLight;
    this.themeSrc = this.isLight ? '/icons/light/moon.svg' : '/icons/dark/sun.svg';
    this.favoriteSrc = this.isLight ? '/icons/light/heart.svg' : '/icons/dark/heart-dark.svg';
    this.addSrc = this.isLight ? '/icons/light/add.svg' : '/icons/dark/add-dark.svg';
    this.searchSrc = this.isLight ? '/icons/light/search.svg' : '/icons/dark/search-dark.svg';
    this.themeService.toggleTheme(this.isLight);
  }
}
