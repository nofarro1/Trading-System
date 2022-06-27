import { Component, OnInit } from '@angular/core';
import { api } from '../../backendService/Service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private service: api) { }

  ngOnInit(): void {
  }

}
