import {Component} from '@angular/core';
import {ShareDataService} from "../../services/share-data.service";

@Component({
  selector: 'app-sender',
  standalone: true,
  imports: [],
  templateUrl: './sender.component.html',
  styleUrl: './sender.component.css'
})
export class SenderComponent {

  constructor(private shareDataService: ShareDataService) {

  }

  public sendData(data: any) {
    this.shareDataService.send(data);
  }
}
