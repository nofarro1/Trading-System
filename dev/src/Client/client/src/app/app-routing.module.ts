import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopsComponent } from './shops/shops.component';
import { MainComponent } from './main/main.component';
import { CartComponent } from './cart/cart.component';
import { ShopComponent } from './shop/shop.component';
import {SignupComponent} from "./signup/signup.component";

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'shops', component: ShopsComponent },
  { path: 'shops/:id', component: ShopComponent },
  { path: 'cart/:id', component: CartComponent },
  { path: 'signup', component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
