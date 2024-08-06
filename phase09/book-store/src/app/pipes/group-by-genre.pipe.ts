import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../models/Book';
import {GenreBooks} from "../models/GenreBooks";

@Pipe({
  standalone: true,
  name: 'groupByGenre'
})
export class GroupByGenrePipe implements PipeTransform {
  transform(books: Book[]): GenreBooks[] {
    if (!books) {
      return [];
    }

    const groupedBooks: { [genre: string]: Book[] } = books.reduce((acc: { [genre: string]: Book[] }, book: Book) => {
      book.genre.forEach((genre: string) => {
        if (!acc[genre]) {
          acc[genre] = [];
        }
        acc[genre].push(book);
      });
      return acc;
    }, {});

    return Object.keys(groupedBooks).map(genre => ({
      genreName: genre,
      booksList: groupedBooks[genre]
    }));
  }
}
