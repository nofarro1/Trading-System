import { Component, Input, OnInit } from '@angular/core';
import {
  JobType,
  ProductCategory,
  ProductRate,
  ShopRate,
} from '../../../../../utilities/Enums';
import { api } from 'src/backendService/Service';
import { SimpleShop } from '../../../../../utilities/simple_objects/marketplace/SimpleShop';
import { SimpleMember } from '../../../../../utilities/simple_objects/user/SimpleMember';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [MessageService],
})
export class ShopComponent implements OnInit {
  @Input() member: SimpleMember;
  @Input() shop: SimpleShop;
  @Input() session: string;
  memberRoleType: any;
  // shopId: number;
  shopName: string;

  wantToAddDiscount: boolean = false;
  wantToAddProduct: boolean = false;


  products: Product[] = [];
  productsWithAmount: Map<number, number>[] = [];

  ADMIN = JobType.admin;
  FOUNDER = JobType.Founder;
  OWNER = JobType.Owner;
  MANAGER = JobType.Manager;

  constructor(private service: api, private messageService: MessageService) {
    let p1 = new Product(111, 'phone', 'A', 'ddd', 'very good phone!', 12, 20);
    let p2 = new Product(222, 'candy', 'B', 'ddd', 'very good candy!', 3, 28);
    let p3 = new Product(333, 'car', 'A', 'ddd', 'very good car!', 10000000, 3);

    this.products.push(p1);
    this.products.push(p2);
    this.products.push(p3);
  }

  ngOnInit(): void {
    // this.activatedRoute.params.subscribe((params) => {
    //   this.shopId = params['shopId'];
    //   console.log(`shopId = ${this.shopId}`);
    // });

    // this.service.getShopInfo(this.shopId).then((shop) => {
    //   if (shop instanceof SimpleShop) {
    //     this.shopName = shop.name;
    //     this.products = shop.products;
    //   }
    // });

    Array.prototype.forEach.call(this.shop.products.entries || [], (element) => {
      console.log('product');
      console.log(element);
      this.products.push(
        new Product(
          element[0].productID,
          element[0].productName,
          ProductCategory[element[0].category],
          element[0].description,
          ProductRate[element[0].rating],
          element[0].price,
          element[1]
        )
      );
    });
  }

  addProductToCart(productId: number, productName: string, quantity: number) {
    let ans = this.service.addToCart(this.session, productId, quantity);
    ans.then((value) => {
      if (value) {
        this.showSuccessMsg(`The product ${productName} was added to cart`);
      } else {
        this.showErrorMsg(
          `Error happend, product ${productName} wasn't added to cart`
        );
      }
    });
  }

  removeProductFromShop(productId: number) {
    this.service.removeProductFromShop(this.session, this.shop.ID, productId).then((value) => {
      if (value) {
        this.showSuccessMsg(`The shop closed successfully`);
      } else {
        this.showErrorMsg(
          `Error happend, shop not closed`
        );
      }
    });
  }

  closeShop(){ // onlyFounder!
    this.service.closeShop(this.session, this.shop.ID).then((value) => {
      if (value) {
        this.showSuccessMsg(`The shop closed successfully`);
      } else {
        this.showErrorMsg(
          `Error happend, shop not closed`
        );
      }
    });
  }

  finishAddProduct($event){
    console.log("here?");
    this.wantToAddProduct = false;
  }

  finishAddDiscount($event){
    console.log("here?");
    this.wantToAddDiscount = false;
  }

  showErrorMsg(msg: string) {
    console.log('error add product');
    this.messageService.add({
      severity: 'error',
      key: 'tc',
      summary: 'Error',
      detail: msg,
    });
  }

  showSuccessMsg(msg: string) {
    console.log('success add product');
    this.messageService.add({
      severity: 'success',
      key: 'tc',
      summary: 'success',
      detail: msg,
    });
  }
}

export class Product {
  id: any;
  name: string;
  category: string;
  rate: string;
  description: string;
  price: number;
  quantity: number;
  quantityToCart: number;

  constructor(
    id: any,
    name: string,
    category: any,
    rate: any,
    description: string,
    price: number,
    quantity: number
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.rate = rate;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.quantityToCart = 0;
  }
}
