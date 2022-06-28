import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SimpleProduct } from '../../../../../utilities/simple_objects/marketplace/SimpleProduct';
import { api } from '../../backendService/Service';
import { Product } from '../shop/shop.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [MessageService],
})
export class CartComponent implements OnInit {
  @Input() session: string;
  products: Product[] = [];
  totalPrice: number = 0;

  constructor(private service: api, private messageService: MessageService) {}

  ngOnInit() {
    this.initCart();
  }

  removeProductFromCart(productId: number, shopId: number){
    this.service.removeFromCart(this.session, productId, shopId).then((value) => {
      if (value){
        this.initCart();
        this.showSuccessMsg("product removed from cart");
      }
      else
        this.showErrorMsg("product wasn't removed from cart");
    });
  }

  initCart(){
    this.products = [];
    this.totalPrice = 0;
    this.service.checkShoppingCart(this.session).then((cart) => {
      if (cart) {
        cart['_products'].forEach(
          (value: { product: SimpleProduct; quantity: number }) => {
            let product = value['product'];
            this.products.push(
              new Product(
                product['_productID'],
                product['_shopID'],
                product['_productName'],
                product['_category'],
                product['_rating'],
                product['_description'],
                product['_price'],
                value.quantity
              )
            );
            this.totalPrice =
              this.totalPrice +
              Number(product['_price']) * Number(value.quantity);
          }
        );
      }
      this.totalPrice = Math.round(this.totalPrice * 100) / 100;
    });
  }


  showErrorMsg(msg: string) {
    this.messageService.add({
      severity: 'error',
      key: 'tc',
      summary: 'Error',
      detail: msg,
    });
  }

  showSuccessMsg(msg: string) {
    this.messageService.add({
      severity: 'success',
      key: 'tc',
      summary: 'success',
      detail: msg,
    });
  }
}
