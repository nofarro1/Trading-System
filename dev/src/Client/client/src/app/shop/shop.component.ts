import { Component, Input, OnInit } from '@angular/core';
import {
  JobType,
  ProductCategory,
  ProductRate,
  ShopRate,
} from '../../../../../utilities/Enums';
import { ActivatedRoute } from '@angular/router';
import { api } from 'src/backendService/Service';
import { SimpleProduct } from '../../../../../utilities/simple_objects/marketplace/SimpleProduct';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { SimpleShop } from '../../../../../utilities/simple_objects/marketplace/SimpleShop';
import { AnyForUntypedForms } from '@angular/forms';
import { SimpleMember } from '../../../../../utilities/simple_objects/user/SimpleMember';
import { productCatagories } from 'src/models/countries_data';
import { MessageService } from 'primeng/api';
import { checkRes } from '../../../../../utilities/Result';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [MessageService],
})
export class ShopComponent implements OnInit {
  @Input() member: SimpleMember;
  @Input() session: string;
  memberRoleType: any;
  shopId: number;
  shopName: string;

  productCatagory: any = productCatagories;
  selectedCatagory: any = '';
  wantToAddProduct: boolean = false;
  newProductName: string = '';
  newProductPrice: number;
  newProductQuantity: number;
  newProductDescription: any = '';

  products: Map<SimpleProduct, number> = new Map<SimpleProduct, number>();
  productsToShow: Product[] = [];

  ADMIN = JobType.admin;
  FOUNDER = JobType.Founder;
  OWNER = JobType.Owner;
  MANAGER = JobType.Manager;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: api,
    private messageService: MessageService
  ) {
    let p1 = new SimpleProduct(
      123,
      'phone',
      this.shopId,
      1300,
      ProductCategory.A,
      ProductRate.NotRated,
      'very good phone!'
    );
    let p2 = new SimpleProduct(
      456,
      'candy',
      this.shopId,
      25,
      ProductCategory.B,
      ProductRate.NotRated,
      'very yammi candy!'
    );
    let p3 = new SimpleProduct(
      789,
      'car',
      this.shopId,
      100,
      ProductCategory.C,
      ProductRate.NotRated,
      'very fast car!'
    );

    this.products.set(p1, 134);
    this.products.set(p2, 10);
    this.products.set(p3, 4);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.shopId = params['shopId'];
      console.log(`shopId = ${this.shopId}`);
    });

    this.service.getShopInfo(this.shopId).then((shop) => {
      if (shop instanceof SimpleShop) {
        this.shopName = shop.name;
        this.products = shop.products;
      }
    });

    this.initProductList();
  }

  addProductToCart(productId: number, productName:string, quantity: number) {
    let ans = this.service.addToCart(this.session, productId, quantity);
    ans.then((value) => {
      if (value) {
        this.showSuccessMsg(`The product ${productName} was added to cart`);
      } else {
        this.showSuccessMsg(`Error happend, product ${productName} wasn't added to cart`);
      }
    });
  }

  initProductList() {
    console.log(this.products);
    this.products.forEach((quantity, product) => {
      console.log(product);
      this.productsToShow.push(
        new Product(
          product.productID,
          product.productName,
          ProductCategory[product.category],
          ShopRate[product.rating],
          product.description || '',
          product.price,
          quantity
        )
      );
    });
  }

  addNewProduct() {
    if (this.newProductPrice > 0 || this.newProductQuantity < 0)
    this.showErrorMsg(`The product ${this.newProductName} wasn't added to the shop`);
    else {
      this.service.addProductToShop(
        this.session,
        this.shopId,
        this.selectedCatagory,
        this.newProductName,
        this.newProductPrice,
        this.newProductQuantity,
        this.newProductDescription
      );
      this.showSuccessMsg(`The product ${this.newProductName} was added to the shop`);
      this.newProductName = '';
      this.newProductQuantity;
      this.newProductDescription = '';
      this.newProductPrice;
      this.selectedCatagory = '';
      this.wantToAddProduct = false;
    }
  }

  removeProductFromShop(productId: number){
    this.service.removeProductFromShop(this.session, this.shopId, productId);
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

  showSuccessMsg(msg : string) {
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
  category: any;
  rate: any;
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
    amount: number
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.rate = rate;
    this.description = description;
    this.price = price;
    this.quantity = amount;
    this.quantityToCart = 0;
  }
}
