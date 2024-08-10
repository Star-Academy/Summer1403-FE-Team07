import {Component} from '@angular/core';
import {RouterOutlet, RouterModule} from '@angular/router';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {SearchComponent} from "./components/search/search.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent, SearchComponent],
  providers: [ConfirmationService, MessageService, PrimeNGConfig],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'book-store';

  constructor(private readonly primeNGConfig: PrimeNGConfig, private confirmationService: ConfirmationService, private messageService: MessageService) {
    primeNGConfig.ripple = true;
  }
}
