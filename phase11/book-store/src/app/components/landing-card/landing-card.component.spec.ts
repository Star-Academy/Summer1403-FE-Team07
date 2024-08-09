import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingCardComponent } from './landing-card.component';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Book } from '../../models/Book';

describe('LandingCardComponent', () => {
  let sut: LandingCardComponent;
  let fixture: ComponentFixture<LandingCardComponent>;
  let debugElement: DebugElement;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LandingCardComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingCardComponent);
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

  it('SHOULD display the correct book details WHEN book input is set', () => {
    // Arrange
    const expectedBook: Book = {
      name: 'Test Book',
      image: 'test-image.jpg',
      genre: ['Fiction'],
      author: 'Test Author',
      publishData: '2021-01-01',
      price: 20,
    };
    sut.book = expectedBook;

    // Act
    fixture.detectChanges();

    // Assert
    const imgElement = debugElement.query(
      By.css('.genre__book-image'),
    ).nativeElement;
    const nameElement = debugElement.query(
      By.css('.genre__book-title'),
    ).nativeElement;
    const authorElement = debugElement.query(
      By.css('.genre__book-author'),
    ).nativeElement;
    const priceElement = debugElement.query(
      By.css('.genre__book-price'),
    ).nativeElement;

    expect(imgElement.src).toContain(expectedBook.image);
    expect(imgElement.alt).toBe(expectedBook.name);
    expect(nameElement.textContent).toBe(expectedBook.name);
    expect(authorElement.textContent).toBe(expectedBook.author);
    expect(priceElement.textContent).toBe(`$ ${expectedBook.price}`);
  });

  it('SHOULD navigate to book details WHEN clicked', () => {
    // Arrange
    const expectedBook: Book = {
      name: 'Test Book',
      image: 'test-image.jpg',
      genre: ['Fiction'],
      author: 'Test Author',
      publishData: '2021-01-01',
      price: 20,
    };
    sut.book = expectedBook;
    fixture.detectChanges();

    // Act
    const cardElement = debugElement.query(By.css('.genre__book'));
    cardElement.triggerEventHandler('click', null);

    // Assert
    const expectedFormattedName = expectedBook.name
      .toLowerCase()
      .replaceAll(' ', '-');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/details',
      expectedFormattedName,
    ]);
  });
});
