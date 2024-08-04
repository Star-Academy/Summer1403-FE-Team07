import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  data$: Observable<any>;

  constructor(private httpClient: HttpClient) {
    this.data$ = this.httpClient.get('https://jsonplaceholder.typicode.com/posts');
  }

  fetchData() {
    return this.data$;
  }
}
