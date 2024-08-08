import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CarouselModule} from 'primeng/carousel';
import {NgOptimizedImage} from "@angular/common";

export type Banner = {
  id: number,
  src: string
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule, NgOptimizedImage],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements OnInit {
  banners: Banner[] = []

  ngOnInit(): void {
    this.banners = [
      {
        id: 0,
        src: "/banners/banner2.jpg"
      },
      {
        id: 1,
        src: "/banners/banner1.jpg"
      },
      {
        id: 2,
        src: "/banners/banner3.jpg"
      }
    ]
  }
}
