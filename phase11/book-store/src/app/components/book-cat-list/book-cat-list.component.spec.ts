import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCatListComponent } from './book-cat-list.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BookCatListComponent', () => {
  let sut: BookCatListComponent;
  let fixture: ComponentFixture<BookCatListComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      paramMap: of({
        get: (param: string) => (param === 'genre' ? 'Fiction' : null),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [BookCatListComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCatListComponent);
    sut = fixture.componentInstance;
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

  it('SHOULD update genre title WHEN route param "genre" is provided', () => {
    // Arrange
    sut.books = {
      genreName: 'salam',
      booksList: [],
    };

    // Act
    fixture.detectChanges();

    // Assert
    expect(sut.books.genreName).toBe('salam');
    const genreTitleElement = fixture.debugElement.query(
      By.css('.genre__title'),
    );

    expect(genreTitleElement.nativeElement.textContent).toContain(
      sut.books.genreName,
    );
  });

  it('SHOULD navigate to the correct genre page WHEN "View All" is clicked', () => {
    // Arrange
    sut.books = {
      genreName: 'Science Fiction',
      booksList: [],
    };

    // Act
    fixture.detectChanges();

    // Assert
    const viewAllLink = fixture.debugElement.query(By.css('.genre__view-all'));
    expect(viewAllLink.nativeElement.getAttribute('href')).toBe(
      '/genre/science-fiction',
    );
  });

  it('SHOULD display up to four books WHEN booksList has more than four items', () => {
    // Arrange
    const mockBooks = Array.from({ length: 5 }, (_, index) => ({
      name: `Book ${index + 1}`,
      image: `image${index + 1}.jpg`,
      genre: ['Genre'],
      author: `Author ${index + 1}`,
      publishData: '2023-01-01',
      price: 10,
    }));
    sut.books = {
      genreName: 'Drama',
      booksList: mockBooks,
    };

    // Act
    fixture.detectChanges();

    // Assert
    const bookCardElements = fixture.debugElement.queryAll(
      By.css('app-landing-card'),
    );
    expect(bookCardElements.length).toBe(4);
  });

  [1, 2, 3].forEach((test) =>
    it('SHOULD display all books WHEN booksList has fewer than four items', () => {
      // Arrange
      const mockBooks = Array.from({ length: test }, (_, index) => ({
        name: `Book ${index + 1}`,
        image: `image${index + 1}.jpg`,
        genre: ['Genre'],
        author: `Author ${index + 1}`,
        publishData: '2023-01-01',
        price: 10,
      }));
      sut.books = {
        genreName: 'Adventure',
        booksList: mockBooks,
      };

      // Act
      fixture.detectChanges();

      // Assert
      const bookCardElements = fixture.debugElement.queryAll(
        By.css('app-landing-card'),
      );
      expect(bookCardElements.length).toBe(test);
    }),
  );

  it('SHOULD handle empty booksList gracefully', () => {
    // Arrange
    sut.books = {
      genreName: 'Mystery',
      booksList: [],
    };

    // Act
    fixture.detectChanges();

    // Assert
    const bookCardElements = fixture.debugElement.queryAll(
      By.css('app-landing-card'),
    );
    expect(bookCardElements.length).toBe(0);
  });
});
