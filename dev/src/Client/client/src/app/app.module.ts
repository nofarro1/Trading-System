import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ShopsComponent } from './shops/shops.component';
import { MainComponent } from './main/main.component';
import { ShopComponent } from './shop/shop.component';
import { CartComponent } from './cart/cart.component';
import { TableModule } from 'primeng/table';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    LoginComponent,
    MenuComponent,
    ShopsComponent,
    MainComponent,
    ShopComponent,
    CartComponent,  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
