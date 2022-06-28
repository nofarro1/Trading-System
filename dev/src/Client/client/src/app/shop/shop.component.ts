import { Component, Input, OnInit } from '@angular/core';
import { api } from 'src/backendService/Service';
import { SimpleShop } from '../../../../../utilities/simple_objects/marketplace/SimpleShop';
import { SimpleMember } from '../../../../../utilities/simple_objects/user/SimpleMember';
import { MessageService } from 'primeng/api';
import { Result } from '../../../../../utilities/Result';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [MessageService],
})
export class ShopComponent implements OnInit {
  @Input() member: SimpleMember | void;
  @Input() shop: SimpleShop;
  @Input() session: string;
  memberRoleType: any;
  shopName: string;

  wantToAddDiscount: boolean = false;
  wantToAddProduct: boolean = false;

  products: Product[] = [];
  productsWithAmount: Map<number, number>[] = [];


  constructor(private service: api, private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.service
      .getShopInfo(this.session, this.shop.ID)
      .then((shop: Result<SimpleShop>) => {
        this.shopName = shop['_name'];
        shop['_products'].forEach(
          (element: { products: Object; quantity: number }) => {
            let product: {
              _category: string;
              _description: string;
              _price: number;
              _productID: number;
              _productName: string;
              _rating: number;
              _shopID: number;
            } = element['product'];
            this.products.push(
              new Product(
                product._productID,
                product._shopID,
                product._productName,
                product._category,
                product._rating,
                product._description,
                product._price,
                element.quantity
              )
            );
          }
        );
      });
  }

  addProductToCart(productId: number, productName: string, quantity: number) {
    let ans = this.service.addToCart(this.session, productId ,this.shop.ID,  quantity);
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
    this.service
      .removeProductFromShop(this.session, this.shop.ID, productId)
      .then((value) => {
        if (value) {
          this.showSuccessMsg(`The shop closed successfully`);
        } else {
          this.showErrorMsg(`Error happend, shop not closed`);
        }
      });
  }

  closeShop() {
    // onlyFounder!
    console.log(this.member);
    if(this.member){
      this.service.closeShop(this.session, this.shop.ID, this.member.username).then((value) => {
        console.log(value);
        if (value) {
          this.showSuccessMsg(`The shop closed successfully`);
        } else {
          this.showErrorMsg(`Error happend, shop not closed`);
        }
      });
    }
    else{
      this.showErrorMsg(`Guest dont have permission to close shop`);
    }
  }

  finishAddProduct($event) {
    this.wantToAddProduct = false;
  }

  finishAddDiscount($event) {
    this.wantToAddDiscount = false;
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

export class Product {
  id: any;
  shopId: number;
  name: string;
  category: string;
  rate: string;
  description: string;
  price: number;
  quantity: number;
  quantityToCart: number;

  constructor(
    id: any,
    shopId: number,
    name: string,
    category: any,
    rate: any,
    description: string,
    price: number,
    quantity: number
  ) {
    this.id = id;
    this.shopId = shopId;
    this.name = name;
    this.category = category;
    this.rate = rate;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.quantityToCart = 0;
  }
}
