import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { Router } from '@angular/router';
import { BookSearchService } from '../../services/search/book-search.service';
import { BookCardComponent } from '../book-card/book-card.component';
import { NgForOf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchType } from '../../models/SearchType';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let sut: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockSearchService: jasmine.SpyObj<BookSearchService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockSearchService = jasmine.createSpyObj('BookSearchService', [
      'searchResults$',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SearchComponent,
        ReactiveFormsModule,
        NgForOf,
        BookCardComponent,
      ],
      providers: [
        { provide: BookSearchService, useValue: mockSearchService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    sut = fixture.componentInstance;
  });

  it('SHOULD create the component WHEN initialized', () => {
    expect(sut).toBeTruthy();
  });

  it('SHOULD subscribe to search results WHEN component is initialized', () => {
    // Arrange
    const mockResults: SearchType = { query: 'test', results: [] };
    mockSearchService.searchResults$ = of(mockResults);

    // Act
    fixture.detectChanges();

    // Assert
    expect(sut.results).toEqual(mockResults);
  });

  it('SHOULD navigate to book details WHEN goToDetails is called', () => {
    // Arrange
    const bookName = 'Test Book';
    const formattedName = bookName.toLowerCase().replaceAll(' ', '-');
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    // Act
    sut.goToDetails(bookName);

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/details',
      formattedName,
    ]);
  });

  it('SHOULD display a message WHEN no results are found', () => {
    // Arrange
    const mockResults: SearchType = { query: 'test', results: [] };
    mockSearchService.searchResults$ = of(mockResults);

    // Act
    fixture.detectChanges();

    // Assert
    const debugElement: DebugElement = fixture.debugElement;
    const messageElement = debugElement.query(By.css('.notFound'));
    expect(messageElement).toBeTruthy();
    expect(messageElement.nativeElement.textContent).toContain(
      "Sorry, we couldn't find any results. Try refining your search.",
    );
  });

  it('SHOULD display search results WHEN results are available', () => {
    // Arrange
    const mockResults: SearchType = {
      query: 'test',
      results: [
        {
          name: 'Book 1',
          image: 'image1.jpg',
          genre: ['Fiction'],
          author: 'Author 1',
          publishData: '2021-01-01',
          price: 10,
        },
      ],
    };
    mockSearchService.searchResults$ = of(mockResults);

    // Act
    fixture.detectChanges();

    // Assert
    const debugElement: DebugElement = fixture.debugElement;
    const bookElements = debugElement.queryAll(By.css('app-book-card'));
    expect(bookElements.length).toBe(1);
  });
});
