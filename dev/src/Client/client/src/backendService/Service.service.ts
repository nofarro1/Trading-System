import axios from 'axios';
import { Inject, Injectable } from '@angular/core';
import { Result } from '../../../../utilities/Result';
import { interfaces } from 'inversify';
import SimpleFactory = interfaces.SimpleFactory;
import { SimpleGuest } from '../../../../utilities/simple_objects/user/SimpleGuest';
import { SimpleShop } from '../../../../utilities/simple_objects/marketplace/SimpleShop';
import { SimpleMember } from '../../../../utilities/simple_objects/user/SimpleMember';
import { Permissions } from '../../../../utilities/Permissions';
import { SimpleProduct } from '../../../../utilities/simple_objects/marketplace/SimpleProduct';
import { ProductCategory } from '../../../../utilities/Enums';
import { SimpleShoppingCart } from '../../../../utilities/simple_objects/user/SimpleShoppingCart';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';  
import { catchError } from 'rxjs';
import {io} from 'socket.io-client'

//const socket = io('http://localhost:3000');


@Injectable({
  providedIn: 'root',
})
export class api {
  baseUrl: string = 'https://localhost:3000';

  constructor(
    private http: HttpClient,
    // private socket: Socket
    // @Inject('https://localhost:3000')
    // private baseUrl: string
  ) {
    // const agent = new Agent({ rejectUnauthorized: false });
    // axios.defaults.httpsAgent(agent);
  }

  // async accessMarketPlace(){
  //   const res = await axios.get(base);
  //   const data: Result<void | SimpleGuest> = res.data
  //   return data.data?.guestID
  // }

  register(username: string, password: string, firstName: string, lastName: string, email: string, country: string) {
    console.log('in register in service');
    console.log(`${this.baseUrl}/guest/register`);
    const test = this.http.post(`${this.baseUrl}/guest/register`, {username, password, firstName, lastName, email, country}).pipe();
    console.log(`test: ${test}`);
    return this.http.post(`${this.baseUrl}/guest/register`, {username, password, firstName, lastName, email, country});
  }

  // async register(username: string, password: string, firstName: string, lastName: string, email: string, country: string){
  //   console.log("in register in service");
  //   const res = await axios.post(base + "guest/register", {
  //     data: {
  //       username: username,
  //       password: password,
  //       firstName: firstName,
  //       lastName: lastName,
  //       email: email,
  //       country: country
  //     }
  //   });
  //   const data: Result<void | SimpleMember> = res.data
  //   return data.data
  // }

  // async adminRegister(
  //   username: string,
  //   password: string,
  //   firstName: string,
  //   lastName: string,
  //   email: string,
  //   country: string
  // ) {
  //   const res = await axios.post(base + 'admin/register', {
  //     data: {
  //       username: username,
  //       password: password,
  //       firstName: firstName,
  //       lastName: lastName,
  //       email: email,
  //       country: country,
  //     },
  //   });
  //   const data: Result<void | SimpleMember> = res.data;
  //   return data.data;
  // }

  // async login(username: string, password: string){
  //   const res = await axios.post(base + "/guest/login", {
  //     data: {
  //       username: username,
  //       password: password
  //     }
  //   });
  //   const data: Result<void | SimpleMember> = res.data
  //   const res = await axios.get(base + "/" + username);
  //   return data.data
  // }

  // async logout(username: string){
  //   const data: Result<void | SimpleGuest> = res.data
  //   const res = await axios.post(base + "/member/shopManagement/assignOwner", {
  //   return data.data
  // }

  // async appointShopOwner( owner: string, shopId: number, newOwnerId: string, title: string){
  //     data: {
  //       owner: owner,
  //       shopId: shopId,
  //       newOwnerId: newOwnerId,
  //       title: title,
  //     }
  //   });
  //   const data: Result<void> = res.data
  //   const res = await axios.post(base + "/member/shopManagement/assignManager", {
  //   return data.ok
  // }

  // async appointShopManager(owner: string, shopId: number, newManager: string, title: string){
  //     data: {
  //       owner: owner,
  //       shopId: shopId,
  //       newManager: newManager,
  //       title: title,
  //     }
  //   });
  //   const data: Result<void> = res.data
  //   const res = await axios.post(base + "/member/shopManagement/Permissions", {
  //   return data.ok
  // }

  // async addPermissions(owner: string, shopId: number, manager: string, permissions: Permissions[]){
  //     data: {
  //       owner: owner,
  //       shopId: shopId,
  //       manager: manager,
  //       permissions: permissions,
  //     }
  //   });
  //   const data: Result<void> = res.data
  //   const res = await axios.delete(base + "/member/shopManagement/Permissions", {
  //   return data.ok
  // }

  // async removePermissions(owner: string, shopId: number, manager: string, permissions: Permissions[]){
  //     data: {
  //       owner: owner,
  //       shopId: shopId,
  //       manager: manager,
  //       permissions: permissions,
  //     }
  //   });
  //   const data: Result<void> = res.data
  //   const res = await axios.get(base + "/member/shopManagement/Personnel/" +username+"/"+shopId);
  //   return data.ok
  // }

  // async shopPersonnelInfo(username: string, shopId: number){
  //   const data: Result<void | SimpleMember[]> = res.data
  //   const res = await axios.get(base + "/exit");
  //   return data.data
  // }

  // async exitMarketplace(){
  //   const data: Result<void> = res.data
  //   const res = await axios.post(base + "/product/search", {
  //   return data.ok
  // }

  // async searchProducts(term: string, type: string, filter: any){
  //     data: {
  //       term: term,
  //       type: type,
  //       filter: filter
  //     }
  //   });
  //   const data: Result<void |SimpleProduct[]> = res.data
  //   const res = await axios.post(base + "/product/" +shopId,{
  //   return data.data
  // }

  // async addProductToShop(shopId: number, username: string, category: ProductCategory, name: string, price: number, quantity: number, description: string){
  //     data: {
  //       username: username,
  //       category: category,
  //       name: name,
  //       price: price,
  //       quantity: quantity,
  //       description:description
  //     }
  //   });
  //   const data: Result<void |SimpleProduct> = res.data
  //   const res = await axios.delete(base + "/product/" +shopId+"/"+productId,{
  //   return data.data
  // }

  // async removeProductFromShop(shopId: number, username: string, productId: number){
  //     data: {
  //       username: username
  //     }
  //   });
  //   const data: Result<void |SimpleProduct> = res.data
  //   const res = await axios.patch(base + "/product/" +shopId+"/"+productId,{
  //   return data.data
  // }

  // async modifyProductQuantityInShop(shopId: number, username: string, productId: number, quantity: number){
  //     data: {
  //       username: username,
  //       quantity:quantity
  //     }
  //   });
  //   const data: Result<void> = res.data
  //   const res = await axios.post(base + "/shop", {
  //   return data.ok
  // }

  // async setUpShop(username: string, shopName: string){
  //     data: {
  //       username: username,
  //       shopName: shopName
  //     }
  //   });
  //   const data: Result<void | SimpleShop> = res.data
  //   const res = await axios.get(base + "/shop/" + shopId);
  //   return data.data
  // }

  // async getShopInfo(shopId: number){
  //   const data: Result<void | SimpleShop> = res.data
  //   return data.data
  //   const res = await axios.patch(base + "/shop/close/" + shopId,
  // }

  // async closeShop(shopId: number,founder: string){
  //   {
  //     founder:founder
  //   });
  //   const data: Result<void> = res.data
  //   const res = await axios.get(base + "/shop/orders/" + shopId+"/" + ownerUsername+"/" + from+"/" + to,filters);
  //   return data.ok
  // }

  // async getShopPurchaseHistory(shopId: number,ownerUsername:string,from:Date,to:Date,filters:any){
  //   const data: Result<void | string[]> = res.data
  //   const res = await axios.get(base + "/cart");
  //   return data.data
  // }

  // async checkShoppingCart(){
  //   const data: Result<void|SimpleShoppingCart> = res.data
  //   const res = await axios.post(base + "/cart", {
  //   return data.data
  // }

  // async addToCart(product: number, quantity: number){
  //     data: {
  //       product: product,
  //       quantity: quantity
  //     }
  //   });
  //   const data: Result<void> = res.data
  //   const res = await axios.delete(base + "/cart", {
  //   return data.ok
  // }

  // async removeFromCart(product: number){
  //     data: {
  //       product: product
  //     }
  //   });
  //   const data: Result<void> = res.data
  //   const res = await axios.patch(base + "/cart", {
  //   return data.ok
  // }

  // async editProductInCart(product: number, quantity: number){
  //     data: {
  //       product: product,
  //       quantity: quantity
  //     }
  //   });
  //   const data: Result<void> = res.data
  //   return data.ok
  // }
}
// export class Member{
//   username: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   country: string;
// }
