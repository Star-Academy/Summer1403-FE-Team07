import {Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {CategoryListComponent} from "./components/category-list/category-list.component";
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
    path: 'genre/:category',
    component: CategoryListComponent,
    title: "Genre"
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
