import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public readonly onToggle: Subject<boolean> = new Subject();
  private isLight: boolean = true;

  constructor() {
  }

  public toggleTheme(newIsLight: boolean) {
    this.isLight = newIsLight;

    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);

    this.onToggle.next(this.isLight);
  }

  setTheme(theme: string) {
    document.body.setAttribute('data-theme', theme);
  }
}
