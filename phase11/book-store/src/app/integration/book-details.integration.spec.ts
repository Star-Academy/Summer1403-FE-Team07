import {ComponentFixture, TestBed,} from '@angular/core/testing';
import {of, Subject} from 'rxjs';
import {Book} from '../models/Book';
import {BookDetailsComponent} from "../components/book-details/book-details.component";
import {BookProviderService} from "../services/book-provider/book-provider.service";
import {BookOperationsService} from "../services/book-operation/book-operations.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ActivatedRoute, convertToParamMap} from "@angular/router";

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;
  let mockBookProviderService: jasmine.SpyObj<BookProviderService>;
  let mockBookOperationsService: jasmine.SpyObj<BookOperationsService>;
  let messageService: MessageService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    mockBookProviderService = jasmine.createSpyObj('BookProviderService', ['findBookByName']);
    mockBookOperationsService = jasmine.createSpyObj(
      'BookOperationsService',
      ['deleteBook'],
      {
        onDeleteBook: new Subject<Book>(),
        onUpdateBook: new Subject<Book>(),
      },
    );

    messageService = new MessageService();
    confirmationService = new ConfirmationService();

    mockBookProviderService.findBookByName.and.callFake((name: string) => {
      if (name === 'test book 1') {
        return {
          name: 'Test Book 1',
          genre: ['Fiction'],
          author: 'Author 1',
          publishData: '2023-01-01',
          price: 10,
        } as Book;
      }
      return undefined;
    });

    await TestBed.configureTestingModule({
      imports: [BookDetailsComponent],
      providers: [
        {provide: BookProviderService, useValue: mockBookProviderService},
        {provide: BookOperationsService, useValue: mockBookOperationsService},
        {provide: ActivatedRoute, useValue: {paramMap: of(convertToParamMap({name: 'test-book-1'}))}},
        MessageService, ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should find and display the book details', () => {
    expect(component.book).toBeDefined();
    expect(component.book?.name).toEqual('Test Book 1');
  });

  it('should delete the book and display success message', () => {
    component.deleteConfirm({target: {}} as Event);

    expect(confirmationService.confirm).toHaveBeenCalled();
    // const confirmArgs = confirmationService.confirm.calls.mostRecent().args[0];
    // confirmArgs.accept();

    expect(mockBookOperationsService.deleteBook).toHaveBeenCalledWith('test-book-1');

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Book is successfully deleted',
      life: 3000,
    });
  });
});
