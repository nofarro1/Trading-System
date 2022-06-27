import { Component, EventEmitter, Input, OnInit, Output, Type } from '@angular/core';
import { api } from 'src/backendService/Service';
import { productCatagories } from 'src/models/countries_data';
import { MessageService } from 'primeng/api';
import { SimpleProduct } from '../../../../../utilities/simple_objects/marketplace/SimpleProduct';
import { BrowserAnimationsModule } from
    "@angular/platform-browser/animations";

@Component({
  selector: 'app-Add-Product',
  templateUrl: './addProduct.component.html',
  styleUrls: ['./addProduct.component.scss'],
  providers: [MessageService],
})
export class AddProductComponent implements OnInit {
  @Input() shopId: number;
  @Input() session: string;
  @Output() finishAddProduct = new EventEmitter<any>();
  newProductName: string = '';
  newProductPrice: number;
  newProductQuantity: number;
  newProductDescription: any = '';
  productCatagory: any = productCatagories;
  selectedCatagory: any = '';

  constructor(private messageService: MessageService, private service: api) {}

  async ngOnInit() {}

  addNewProduct() {
    console.log('addNewProduct');
    if (!(this.selectedCatagory instanceof Object)) {
      this.showErrorMsg(`Product must have catagory`);
    } else {
      this.service
        .addProductToShop(
          this.session,
          this.shopId,
          this.selectedCatagory,
          this.newProductName,
          this.newProductPrice,
          this.newProductQuantity,
          this.newProductDescription
        )
        .then((product) => {
          if (product instanceof SimpleProduct) {
            this.showSuccessMsg(
              `The product ${this.newProductName} was added to the shop`
            );
            this.newProductName = '';
            this.newProductQuantity;
            this.newProductDescription = '';
            this.newProductPrice;
            this.selectedCatagory = '';
            this.finishAddProduct.emit();
          } else {
            this.showErrorMsg(
              `The product ${this.newProductName} wasn't added to the shop`
            );
          }
        });
    }
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
