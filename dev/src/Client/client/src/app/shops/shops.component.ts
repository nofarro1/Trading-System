import { Component, OnInit } from '@angular/core';
import {TableModule} from 'primeng/table';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CartComponent } from '../cart/cart.component';
import {api} from "../../backendService/Service"
import { Product } from '../shop/shop.component';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  shops: {id: string, name: string, status: boolean}[] = [];
  constructor(private service: api) {
    // let shop1: Shop = {id: 123, name: 'myShop1', status: true, rate: 3};
    // let shop2: Shop = {id: 124, name: 'myShop2', status: true, rate: 4};
    // let shop3: Shop = {id: 125, name: 'myShop3', status: false, rate: 2};
    // this.shops.push(shop1);
    // this.shops.push(shop2);
    // this.shops.push(shop3);
  }

  ngOnInit(): void {
    this.service.getAllShops().then((retShops)=>{
      console.log(retShops);
      retShops.forEach((item: any)=>{
        this.shops.push({id: item["_ID"], name: item["name"], status: item["status"]});
      })
      if (this.shops.length === 0){
        this.shops.push({id: '123', name: 'myShop1', status: true});
        this.shops.push({id: 'dsfdsfg', name: 'Adika', status: true});
        this.shops.push({id: 'dfse3eed43', name: 'Renuar', status: false});
      }


    });
  }

}

export class Shop {
  id: number;
  name: string;
  status: boolean;
  products: [];
}
