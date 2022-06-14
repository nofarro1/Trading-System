import { Component, OnInit } from '@angular/core';
import {TableModule} from 'primeng/table';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CartComponent } from '../cart/cart.component';
import {api} from "../../backendService/Service.service"

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  shops: Shop[] = [];
  constructor() {
    let shop1: Shop = {id: 123, name: 'myShop1', status: true, rate: 3};
    let shop2: Shop = {id: 124, name: 'myShop2', status: true, rate: 4};
    let shop3: Shop = {id: 125, name: 'myShop3', status: false, rate: 2};
    this.shops.push(shop1);
    this.shops.push(shop2);
    this.shops.push(shop3);
  }

  ngOnInit(): void {

  }

}

export class Shop {
  id!: number;
  name!: string;
  status!: boolean;
  rate!: number;
}
