import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { NgOptimizedImage } from '@angular/common';

describe('CarouselComponent', () => {
  let sut: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponent, CarouselModule, NgOptimizedImage],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    sut = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  it('SHOULD create the component WHEN initialized', () => {
    expect(sut).toBeTruthy();
  });

  it('SHOULD initialize banners WHEN component is initialized', () => {
    // Act
    sut.ngOnInit();

    // Assert
    expect(sut.banners.length).toBe(3);
    expect(sut.banners).toEqual([
      { id: 0, src: '/banners/banner2.jpg' },
      { id: 1, src: '/banners/banner1.jpg' },
      { id: 2, src: '/banners/banner3.jpg' },
    ]);
  });

  it('SHOULD render the carousel with correct settings', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const carouselElement = debugElement.query(By.css('p-carousel'));
    expect(carouselElement).toBeTruthy();

    const banners = carouselElement.componentInstance.value;
    expect(banners).toBe(sut.banners);
    expect(carouselElement.componentInstance.numVisible).toBe(1);
    expect(carouselElement.componentInstance.numScroll).toBe(1);
    expect(carouselElement.componentInstance.circular).toBeTrue();
    expect(carouselElement.componentInstance.autoplayInterval).toBe(5000);
  });

  it('SHOULD render images for each banner', () => {
    // Act
    fixture.detectChanges();

    // Assert
    const imgElements = debugElement.queryAll(By.css('img'));
    expect(imgElements.length).toBe(5);
    expect(imgElements[0].nativeElement.src).toContain('/banners/banner3.jpg');
    expect(imgElements[1].nativeElement.src).toContain('/banners/banner2.jpg');
    expect(imgElements[2].nativeElement.src).toContain('/banners/banner1.jpg');
  });

  it('SHOULD render images for each banner', () => {
    // Act
    fixture.detectChanges();

    const imgElements = debugElement
      .queryAll(By.css('img'))
      .map((de) => de.nativeElement.src);

    const expectedSources = sut.banners.map((banner) => banner.src);

    // Assert
    expectedSources.forEach((src) => {
      expect(imgElements.some((imgSrc) => imgSrc.includes(src))).toBeTrue();
    });
  });
});
