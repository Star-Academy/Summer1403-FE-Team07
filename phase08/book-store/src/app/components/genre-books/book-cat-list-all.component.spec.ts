import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCatListAllComponent } from './book-cat-list-all.component';

describe('BookCatListAllComponent', () => {
  let component: BookCatListAllComponent;
  let fixture: ComponentFixture<BookCatListAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCatListAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCatListAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
