import {Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {BookDetailsComponent} from "./components/book-details/book-details.component";

const routeConfig: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: HomeComponent,
    title: "Home page"
  },
  {
    path: 'details/:name',
    component: BookDetailsComponent,
    title: "Book"
  },
  {
    path: '**',
    redirectTo: '/landing',
    pathMatch: 'full'
  }
];

export default routeConfig;
