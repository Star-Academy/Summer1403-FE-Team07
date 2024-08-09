import {ComponentFixture, TestBed,} from '@angular/core/testing';
import {of} from 'rxjs';
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
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

  beforeEach(async () => {
    mockBookProviderService = jasmine.createSpyObj('BookProviderService', ['findBookByName']);
    mockBookOperationsService = jasmine.createSpyObj('BookOperationsService', ['deleteBook']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

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
      declarations: [BookDetailsComponent],
      providers: [
        {provide: BookProviderService, useValue: mockBookProviderService},
        {provide: BookOperationsService, useValue: mockBookOperationsService},
        {provide: ActivatedRoute, useValue: {paramMap: of(convertToParamMap({name: 'test-book-1'}))}},
        {provide: MessageService, useValue: mockMessageService},
        {provide: ConfirmationService, useValue: mockConfirmationService},
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

    expect(mockConfirmationService.confirm).toHaveBeenCalled();
    const confirmArgs = mockConfirmationService.confirm.calls.mostRecent().args[0];
    confirmArgs.accept();

    expect(mockBookOperationsService.deleteBook).toHaveBeenCalledWith('test-book-1');

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Book is successfully deleted',
      life: 3000,
    });
  });
});
