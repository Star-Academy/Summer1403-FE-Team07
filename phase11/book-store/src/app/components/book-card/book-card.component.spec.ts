import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCardComponent } from './book-card.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('BookCardComponent', () => {
  let sut: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BookCardComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    sut = fixture.componentInstance;
  });

  it('SHOULD create the component WHEN initialized', () => {
    expect(sut).toBeTruthy();
  });

  it('SHOULD render book details WHEN @Input book is provided', () => {
    // Arrange
    sut.book = {
      name: 'Test Book',
      image: 'test-image.jpg',
      genre: ['Fiction'],
      author: 'Test Author',
      publishData: '2023-01-01',
      price: 25,
    };

    // Act
    fixture.detectChanges();

    // Assert
    const nameElement = fixture.debugElement.query(By.css('.genre-book__name'));
    const authorElement = fixture.debugElement.query(
      By.css('.genre-book__author'),
    );
    const priceElement = fixture.debugElement.query(
      By.css('.genre-book__price'),
    );
    const imageElement = fixture.debugElement.query(
      By.css('.genre-book__image'),
    );

    expect(nameElement.nativeElement.textContent).toBe('Test Book');
    expect(authorElement.nativeElement.textContent).toBe('Test Author');
    expect(priceElement.nativeElement.textContent).toContain('25');
    expect(imageElement.nativeElement.getAttribute('src')).toBe(
      'test-image.jpg',
    );
  });

  it('SHOULD navigate to book details WHEN clicked', () => {
    // Arrange
    sut.book = {
      name: 'Test Book',
      image: 'test-image.jpg',
      genre: ['Fiction'],
      author: 'Test Author',
      publishData: '2023-01-01',
      price: 25,
    };

    // Act
    fixture.detectChanges();
    const cardElement = fixture.debugElement.query(By.css('.genre-book'));
    cardElement.triggerEventHandler('click', null);

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/details', 'test-book']);
  });
});
