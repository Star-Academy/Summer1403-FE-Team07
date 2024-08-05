import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

const routeConfig: Routes = [
  {
    path: '/about',
    component: AboutComponent,
  },
  {
    path: '/contact',
    component: ContactComponent,
  },
];

export default routeConfig;
