import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Book} from "../../models/Book";

@Component({
  selector: 'app-landing-card',
  standalone: true,
  imports: [],
  templateUrl: './landing-card.component.html',
  styleUrl: './landing-card.component.scss'
})
export class LandingCardComponent {

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
