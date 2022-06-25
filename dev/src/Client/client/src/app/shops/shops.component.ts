import { Component, EventEmitter, OnInit } from '@angular/core';
import {TableModule} from 'primeng/table';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CartComponent } from '../cart/cart.component';
import {api} from "../../backendService/Service"
import { Product } from '../shop/shop.component';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { JobType } from '../../../../../utilities/Enums';
import { SimpleMember } from '../../../../../utilities/simple_objects/user/SimpleMember';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  @Output() shopIdClicked: any = new EventEmitter<any>();
  @Input() member: SimpleMember | any;
  @Input() session: string;
  memberRoleType: any;
  newShopName: string = '';
  shops: {id: string, name: string, status: boolean}[] = [];
  ADMIN = JobType.admin;
  FOUNDER = JobType.Founder;
  OWNER = JobType.Owner;
  MANAGER = JobType.Manager;


  constructor(private service: api) {

  }

  ngOnInit(): void {
    this.memberRoleType = this.member?.getJobTypeValue();
    this.service.getAllShops().then((retShops)=>{
      console.log(retShops);
      retShops.forEach((item: any)=>{
        this.shops.push({id: item["ID"], name: item["name"], status: item["status"]});
        // this.shopsProducts.push({shopId: item["_ID"], products: item["products"]});
      })
      if (this.shops.length === 0){
        this.shops.push({id: '123', name: 'myShop1', status: true});
        this.shops.push({id: 'dsfdsfg', name: 'Adika', status: true});
        this.shops.push({id: 'dfse3eed43', name: 'Renuar', status: false});
      }
    });
  }

  showProducts(shopId: string){
    this.shopIdClicked.emit(shopId);
  }

  addShop(){
    this.service.setUpShop(this.member.username, this.newShopName);
    this.newShopName='';
  }

  closeShop(shopId: any){
    this.service.closeShop(shopId, this.member.username);
  }

}

export class Shop {
  id: number;
  name: string;
  status: boolean;
  products: [];
}
