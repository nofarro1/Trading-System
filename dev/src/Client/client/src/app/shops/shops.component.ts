import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  shops:{id: number, name: string, status: boolean}[];

  constructor() {
    this.shops = [
      {id:123, name:"myShop", status: true},
      {id: 222, name: "myShop2", status: true},
      {id: 333, name: "myShop3", status: false}];
  }

  ngOnInit(): void {
  }

}
