import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private readonly subject: Subject<any> = new Subject<any>();

  constructor() {
  }

  send(data: any) {
    this.subject.next(data);
  }

  onDataEmit() {
    return this.subject.asObservable();
  }
}
