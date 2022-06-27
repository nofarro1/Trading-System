
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { api } from 'src/backendService/Service';
import { Product } from '../shop/shop.component';
import {discountInf} from "../../../../../utilities/Types";

@Component({
  selector: 'app-add-discount',
  templateUrl: './addDiscount.component.html',
  styleUrls: ['./addDiscount.component.scss']
})
export class AddDiscountComponent implements OnInit {
  @Input() shopId: number;
  @Input() session: string;
  @Input() products: Product[] = [];
  info: discountInf; 
  percent: number;
  descriptions: string;


  constructor(private messageService: MessageService, private service: api) {}

  async ngOnInit() {}

}