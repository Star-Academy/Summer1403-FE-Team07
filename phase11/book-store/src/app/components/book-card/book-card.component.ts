import {Component, Input, input} from '@angular/core';
import {Book} from "../../models/Book";
import {Router} from "@angular/router";

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  @Input() book: Book = {
    name: '',
    image: '',
    genre: [],
    author: '',
    publishData: '',
    price: 0
  };

  constructor(private router: Router) {
  }

  goToDetails(name: string) {
    this.router.navigate(['/details', name.toLowerCase().replaceAll(' ', '-')])
      .then(() => {
        return;
      });
  }
}
