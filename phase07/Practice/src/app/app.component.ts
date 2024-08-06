import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {filter, map, observable, Observable, of} from "rxjs";
import {FetchDataService} from "./services/fetch-data.service";
import {SenderComponent} from "./components/sender/sender.component";
import {ReceiverComponent} from "./components/receiver/receiver.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SenderComponent, ReceiverComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'untitled';
  data: any[] = [];

  constructor(private fetchDataService: FetchDataService) {
    //1.
    const observable = of(1, 2, 3, 4, 5);
    const observer = observable.subscribe(console.log);

    //2.
    const observable2 = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
      .pipe(
        filter((value: number) => value % 2 === 0),
        map((value: number) => value * value)
      );
    const observer2 = observable2.subscribe(console.log);

  }

  ngOnInit(): void {
    //3.
    this.fetchDataService.fetchData().subscribe((data: any[]) => {
      this.data = data;
    });
  }
}
