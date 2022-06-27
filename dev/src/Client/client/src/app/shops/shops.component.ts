import { Component, EventEmitter, OnInit } from '@angular/core';
import { api } from '../../backendService/Service';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { JobType, ShopStatus } from '../../../../../utilities/Enums';
import { SimpleMember } from '../../../../../utilities/simple_objects/user/SimpleMember';
import { SimpleShop } from '../../../../../utilities/simple_objects/marketplace/SimpleShop';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss'],
  providers: [MessageService],
})
export class ShopsComponent implements OnInit {
  @Output() shopIdClicked: any = new EventEmitter<any>();
  @Output() shopToShow: any = new EventEmitter<SimpleShop>();
  @Input() member: SimpleMember | any;
  @Input() session: string;
  memberRoleType: any;
  newShopName: string = '';
  shops: SimpleShop[] = [];
  shopStatus: Map<number, string> = new Map<number, string>();
  ADMIN = JobType.admin;
  FOUNDER = JobType.Founder;
  OWNER = JobType.Owner;
  MANAGER = JobType.Manager;

  constructor(private service: api, private messageService: MessageService) {}

  ngOnInit(): void {
    this.memberRoleType = this.member?.getJobTypeValue();
    this.service.getAllShops(this.session).then((retShops) => {
      retShops.forEach((shop: any) => {
        this.shops.push(
          new SimpleShop(
            shop['_ID'],
            shop['_name'] || 'SHLOAM',
            shop['_founder'],
            shop['_status'],
            shop['_products']
          )
        );
        this.shopStatus.set(shop['_ID'], ShopStatus[shop['_status']]);
      });
    });
    console.log(this.shops);
  }

  showProducts(shop: SimpleShop) {
    this.shopToShow.emit(shop);
  }

  addShop() {
    this.service
      .setUpShop(this.member.username, this.newShopName)
      .then((shop) => {
        if (shop instanceof SimpleShop) {
          this.showSuccessMsg(`The shop ${shop.name} opened`);
        } else {
          this.showErrorMsg(`Error happend, shop not opened`);
        }
      });
    this.newShopName = '';
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
