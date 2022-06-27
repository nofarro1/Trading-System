import { Component, Input, OnInit } from '@angular/core';
import {ProductCategory, ProductRate} from "../../../../../utilities/Enums";
import {SimpleProduct} from "../../../../../utilities/simple_objects/marketplace/SimpleProduct";
import {api} from "../../backendService/Service";
import {SimpleShoppingCart} from "../../../../../utilities/simple_objects/user/SimpleShoppingCart";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() session: string;
  totalprice: number;
  name: string;
  products: SimpleProduct[];

  constructor(private service: api,) {
    this.products=[];
    this.name="";
    this.totalprice=0;
    // this.service.checkShoppingCart().then((cart)=> {
    //     if (cart instanceof SimpleShoppingCart) {
    //       this.products = Array.from(cart.products.keys());
    //       this.name = cart.userId;
    //       this.totalprice = cart.totalPrice;
    //     }
    //   }
    // )
  }
  
  ngOnInit(): void {
  }


}
