import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShopsComponent} from "./shops/shops.component";
import {MainComponent} from "./main/main.component";
import {CartComponent} from "./cart/cart.component";
import {ShopComponent} from "./shop/shop.component";

const routes: Routes = [
  {path:"",component:MainComponent},
  {path:"shops",component:ShopsComponent,
  children:[{path:":id",component:ShopComponent}]},
  {path:"cart/:id",component:CartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
