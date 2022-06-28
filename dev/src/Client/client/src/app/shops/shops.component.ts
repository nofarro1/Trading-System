import { Component, EventEmitter, OnInit } from '@angular/core';
import { api } from '../../backendService/Service';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { JobType, ShopStatus } from '../../../../../utilities/Enums';
import { SimpleMember } from '../../../../../utilities/simple_objects/user/SimpleMember';
import { SimpleShop } from '../../../../../utilities/simple_objects/marketplace/SimpleShop';
import { MessageService } from 'primeng/api';
import { ThisReceiver } from '@angular/compiler';

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
  // ADMIN = JobType.admin;
  // FOUNDER = JobType.Founder;
  // OWNER = JobType.Owner;
  // MANAGER = JobType.Manager;

  wantToAddShop: boolean = false;

  constructor(private service: api, private messageService: MessageService) {}

  ngOnInit(): void {
    this.initShops();
  }

  initShops(){
    this.service.getAllShops(this.session).then((retShops) => {
      console.log("shops");
      console.log(retShops);
      retShops?.forEach((shop: any) => {
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
  }

  showProducts(shop: SimpleShop) {
    this.shopToShow.emit(shop);
  }

  // addShop() {
  //   this.service
  //     .setUpShop(this.session, this.member.username, this.newShopName)
  //     .then((shop) => {
  //       this.showSuccessMsg(`The shop opened`)
  //       this.initShops();
  //     });
  //   this.newShopName = '';
  // }

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
