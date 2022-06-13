import { Component, OnInit } from '@angular/core';
import { api } from 'src/backendService/Service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    new api().accessMarketPlace().then(r => console.log("success " + r))
  }

}
