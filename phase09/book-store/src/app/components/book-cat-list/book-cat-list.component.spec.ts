import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCatListComponent } from './book-cat-list.component';

describe('BookCatListComponent', () => {
  let component: BookCatListComponent;
  let fixture: ComponentFixture<BookCatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCatListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
