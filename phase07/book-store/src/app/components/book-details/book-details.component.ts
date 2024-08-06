import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BookProviderService} from "../../services/book-provider.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Book} from "../../models/Book";
import {Location, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ToastModule} from "primeng/toast";
import {Button} from "primeng/button";
import {ConfirmationService, MessageService} from "primeng/api";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {InputNumberModule} from "primeng/inputnumber";
import {Subscription} from "rxjs";
import {searchType} from "../../models/SearchType";
import {SearchComponent} from "../search/search.component";
import {ThemeService} from "../../services/theme.service";
import {BookModalComponent} from "../book-modal/book-modal.component";

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ToastModule,
    ConfirmPopupModule,
    Button,
    FormsModule,
    CalendarModule,
    DialogModule,
    InputNumberModule,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    SearchComponent,
    BookModalComponent
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class BookDetailsComponent implements OnInit {
  book: Book | undefined;
  bookName: string = "";
  isLiked: boolean = false;
  visible: boolean = false;
  private subscription: Subscription = new Subscription();
  results: searchType = {
    query: '',
    results: []
  };
  isLight: boolean = false;

  constructor(private bookProviderService: BookProviderService, private route: ActivatedRoute,
              private titleService: Title, private router: Router, private location: Location,
              private confirmationService: ConfirmationService, private messageService: MessageService,
              private themeService: ThemeService) {
  }

  ngOnInit(): void {

    this.themeService.onToggle.subscribe(val => {
      this.isLight = val;
    });

    this.bookProviderService.searchResults$.subscribe(output => {
      this.results = output;
    });

    this.subscription.add(
      this.bookProviderService.onUpdateBook.subscribe(value => {
        this.book = value;
        this.bookName = value.name.toLowerCase().replaceAll(' ', '-');
        this.router.navigate(['/details', this.bookName]).then(() => {
          this.titleService.setTitle(value.name.toLowerCase());
        });
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Book is successfully updated',
          life: 3000
        });
      })
    );

    this.route.paramMap.subscribe(params => {
      const newBookName = params.get('name');
      const theme = document.body.getAttribute('data-theme');
      this.isLight = theme === 'light';
      if (newBookName && this.bookName !== newBookName) {
        this.bookName = newBookName;
        this.book = this.bookProviderService.findBookByName(this.bookName.replaceAll('-', ' '));
        this.titleService.setTitle(this.bookName);
        this.titleService.setTitle(newBookName.replaceAll("-", ' '));
      }
    });
  }

  goBack() {
    this.location.back();
  }

  deleteConfirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.bookProviderService.deleteBook(this.bookName)
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Book is successfully deleted',
          life: 3000
        });
        this.router.navigate(['']).then(() => {
          return
        });
      },
      reject: () => {
        return;
      }
    });
  }

  onClickFavorite() {
    this.isLiked = !this.isLiked;
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }


}
