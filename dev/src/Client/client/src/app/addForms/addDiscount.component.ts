import { Component, EventEmitter, Input, OnInit, Output, Type } from '@angular/core';
import { api } from 'src/backendService/Service';
import { productCatagories } from 'src/models/countries_data';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from
    "@angular/platform-browser/animations";
import { SimpleDiscountData } from '../../../../../utilities/DataObjects';

@Component({
  selector: 'app-Add-Discount',
  templateUrl: './addDiscount.component.html',
  styleUrls: ['./addDiscount.component.scss'],
  providers: [MessageService],
})
export class AddDiscountComponent implements OnInit {
  @Input() shopId: number;
  @Input() session: string;
  @Output() finishAddDiscount = new EventEmitter<any>();
  newDiscountName: string = '';
  newDiscountPrice: number;
  newDiscountQuantity: number;
  newDiscountDescription: any = '';
  productCatagory: any = productCatagories;
  selectedCatagory: any = '';

  constructor(private messageService: MessageService, private service: api) {}

  async ngOnInit() {}

  addNewDiscount() {
    console.log('addNewDiscount');
    if (!(this.selectedCatagory instanceof Object)) {
      this.showErrorMsg(`Discount must have catagory`);
    } else {
      this.service.(
          this.session,
          this.shopId,
          this.selectedCatagory,
          this.newDiscountName,
          this.newDiscountPrice,
          this.newDiscountQuantity,
          this.newDiscountDescription
        )
        .then((product) => {
          if (product instanceof SimpleDiscountData) {
            this.showSuccessMsg(
              `The product ${this.newDiscountName} was added to the shop`
            );
            this.newDiscountName = '';
            this.newDiscountQuantity;
            this.newDiscountDescription = '';
            this.newDiscountPrice;
            this.selectedCatagory = '';
            this.finishAddDiscount.emit();
          } else {
            this.showErrorMsg(
              `The product ${this.newDiscountName} wasn't added to the shop`
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
