import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreBooksComponent } from './genre-books.component';

describe('BookCatListAllComponent', () => {
  let component: GenreBooksComponent;
  let fixture: ComponentFixture<GenreBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
