import { Component, OnInit } from '@angular/core';
import { ProductCategory, ProductRate } from '../../../../../utilities/Enums';
import { sample } from 'rxjs';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
    id: number;
    name: string;
    status: string;
    shopFounder: string;
    shopOwners: Set<string>;
    shopManagers: Set<string>;
    products: Product[];
    rate: number;

  constructor() {
    this.id = 2;
    this.name = 'jkjk';
    this.status = "open";
    this.shopFounder = "founder";
    this.shopManagers = new Set<string>();
    this.shopOwners = new Set<string>();
    this.products = [];
    this.rate = 3;

    let p1: Product = {id: 1, name: "phone", shopId: 2, category: ProductCategory.A, rate: ProductRate.NotRated, description: "very good phone", discountPrice: 1300};
    let p2: Product = {id: 1, name: "hut", shopId: 2, category: ProductCategory.B, rate: ProductRate.NotRated, description: "hut", discountPrice: 500};
    let p3: Product = {id: 1, name: "phone case", shopId: 2, category: ProductCategory.A, rate: ProductRate.NotRated, description: "very good phone case", discountPrice: 47};
    this.products.push(p1);
    this.products.push(p2);
    this.products.push(p3);
  }

  ngOnInit(): void {
  }

}

export class Product {
  id!: number;
  name!: string;
  shopId!: number;
  category!: ProductCategory;
  rate!: ProductRate;
  description!: string;
  discountPrice!: number;
  //relatedSale!: Sale;
}
