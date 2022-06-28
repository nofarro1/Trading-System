import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
} from '@angular/core';
import { api } from 'src/backendService/Service';
import { discountTypes, productCatagories } from 'src/models/countries_data';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DiscountData,
  SimpleDiscountData,
} from '../../../../../utilities/DataObjects';
import { DiscountType, ProductCategory } from '../../../../../utilities/Enums';
import { timeStamp } from 'console';
import { Product } from '../shop/shop.component';

@Component({
  selector: 'app-add-discount',
  templateUrl: './addDiscount.component.html',
  styleUrls: ['./addDiscount.component.scss'],
  providers: [MessageService],
})
export class AddDiscountComponent implements OnInit {
  @Input() shopId: number;
  @Input() session: string;
  @Input() products: Product[] = [];
  @Output() finishAddDiscount = new EventEmitter<any>();
  newDiscountType: DiscountType;
  DiscountTypeThatWasChosen: string;
  newDiscountPercent: number;
  newDiscountObj: number | ProductCategory;
  productCatagory: any = productCatagories;
  discountTypes: any = discountTypes;
  discountObjRolldown: any;

  constructor(private messageService: MessageService, private service: api) {}

  async ngOnInit() {}

  addNewDiscount() {
    console.log('addNewDiscount');
    let discount: DiscountData = new SimpleDiscountData(
      this.newDiscountType,
      this.newDiscountObj,
      this.newDiscountPercent
    );
    this.service
      .addDiscount(this.session, this.shopId, discount)
      .then((num) => {
        if (typeof num === 'number') {
          this.showSuccessMsg(`New discount added to the shop`);
          this.newDiscountType;
          this.newDiscountPercent;
          this.newDiscountObj;
          this.finishAddDiscount.emit();
        } else {
          this.showErrorMsg(`New discount wasn't added to the shop`);
        }
      });
  }

  chosenDiscountType() {
    if (this.newDiscountType === DiscountType["Product"]){
      this.DiscountTypeThatWasChosen = 'product';
      this.discountObjRolldown = this.products;
    }
    else if (this.newDiscountType === DiscountType["Category"]){
      this.DiscountTypeThatWasChosen = 'category';
      this.discountObjRolldown = this.productCatagory;
    }
    else{
      this.DiscountTypeThatWasChosen = '';
    }
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
