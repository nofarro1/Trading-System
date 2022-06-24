import { Component, Input, OnInit } from '@angular/core';
import { api } from 'src/backendService/Service';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  items: MenuItem[];
  @Input() isLoggedIn = false;

  constructor() { }

  async ngOnInit() {
    this.items = [
      {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          routerLink:"/"
      },
      {
          label: 'Shops',
          icon: 'pi pi-fw pi-shop',
          routerLink:"/shops"
      },
      {
        label: 'Cart',
        icon: 'pi pi-fw pi-shop',
        routerLink:"/cart"

    }
  ];
  }

  clickedShops(){
  }

}
