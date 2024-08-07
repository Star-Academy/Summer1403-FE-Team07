import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Button} from "primeng/button";
import {NgOptimizedImage} from "@angular/common";
import {ButtonData} from "../../models/ButtonData";

@Component({
  selector: 'app-navbar-button',
  standalone: true,
    imports: [
        Button,
        NgOptimizedImage
    ],
  templateUrl: './navbar-button.component.html',
  styleUrl: './navbar-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NavbarButtonComponent {
  @Input() buttonDate: ButtonData = {
    containerClass: '',
    imageSrc: '',
    alt: '',
    height: 0,
    width: 0
  };
}
