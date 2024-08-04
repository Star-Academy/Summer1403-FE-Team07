import {Component, OnInit} from '@angular/core';
import {ShareDataService} from "../../services/share-data.service";

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [],
  templateUrl: './receiver.component.html',
  styleUrl: './receiver.component.css'
})
export class ReceiverComponent implements OnInit {
  data: any;

  constructor(private shareDataService: ShareDataService) {

  }

  ngOnInit(): void {
    this.shareDataService.onDataEmit().subscribe(data => {
      this.data = data;
    });
  }
}
