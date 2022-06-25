import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { api } from 'src/backendService/Service';
import {MenuItem} from 'primeng/api';
import { outputAst } from '@angular/compiler';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  items: MenuItem[];
  @Input() isLoggedIn = false;
  @Output() clickedOn = new EventEmitter<string>();

  constructor() { }

  async ngOnInit() {
    this.items = [
      {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          command: (event: Event) => {this.clickedOn.emit("home")}
      },
      {
          label: 'Shops',
          icon: 'pi pi-fw pi-shop',
          command: (event: Event) => {this.clickedOn.emit("shops")}
      },
      {
        label: 'Cart',
        icon: 'pi pi-fw pi-shop',
        command: (event: Event) => {this.clickedOn.emit("cart")}

    }
  ];
  }

  clickedShops(){
  }

}
function output() {
  throw new Error('Function not implemented.');
}

