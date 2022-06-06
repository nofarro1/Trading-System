import { Component, OnInit } from '@angular/core';
import {ProductCategory, ProductRate} from "../../../../../utilities/Enums";
import {Product} from "../shop/shop.component";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  id: number;
  name: string;
  products: Product[];

  constructor() {
    this.id = 2;
    this.name = 'jkjk';
    this.products = [];

    let p1: Product = {
      id: 1,
      name: "phone",
      shopId: 2,
      category: ProductCategory.A,
      rate: ProductRate.NotRated,
      description: "very good phone",
      discountPrice: 1300
    };
    let p2: Product = {
      id: 1,
      name: "hut",
      shopId: 2,
      category: ProductCategory.B,
      rate: ProductRate.NotRated,
      description: "hut",
      discountPrice: 500
    };
    let p3: Product = {
      id: 1,
      name: "phone case",
      shopId: 2,
      category: ProductCategory.A,
      rate: ProductRate.NotRated,
      description: "very good phone case",
      discountPrice: 47
    };
    this.products.push(p1);
    this.products.push(p2);
    this.products.push(p3);
  }
  ngOnInit(): void {
  }

}
