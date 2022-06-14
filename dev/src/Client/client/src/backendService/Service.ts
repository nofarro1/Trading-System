import axios from "axios";
import {checkRes, Result} from "../../../../utilities/Result";
import {inject, injectable, interfaces} from "inversify";
import SimpleFactory = interfaces.SimpleFactory;
import {SimpleGuest} from "../../../../utilities/simple_objects/user/SimpleGuest";
import {SimpleShop} from "../../../../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleMember} from "../../../../utilities/simple_objects/user/SimpleMember";
import {Permissions} from "../../../../utilities/Permissions";
import {SimpleProduct} from "../../../../utilities/simple_objects/marketplace/SimpleProduct";
import {ProductCategory} from "../../../../utilities/Enums";
import {SimpleShoppingCart} from "../../../../utilities/simple_objects/user/SimpleShoppingCart";
import { Injectable } from "@angular/core";


const base="https://localhost:3000/api";
@Injectable({
  providedIn: "root",
})
export class api {

  constructor() {
    axios.defaults.httpsAgent = { rejectUnauthorized: false };
  }

  async accessMarketPlace(){
    try{
      const res = await axios.get(base + "/access");
      const data: Result<void | SimpleGuest> = res.data
      return checkRes(data)? data.data._guestID : undefined;
    }catch(e:any){
      console.log("error in accessing");
      return undefined;
    }
  }



  async register(username: string, password: string, firstName: string, lastName: string, email: string, country: string){
    try{
      const res = await axios.post(base + "/guest/register", {
        data: {
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email,
          country: country
        }
      });
      const data: Result<void | SimpleMember> = res.data
      return data.data
    }
    catch(e:any){
      console.log(`error in register: ${e.message}`);
      return undefined;
    }
  }

  async adminRegister(username: string, password: string, firstName: string, lastName: string, email: string, country: string){
    const res = await axios.post(base + "admin/register", {
      data: {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        country: country
      }
    });
    const data: Result<void | SimpleMember> = res.data
    return data.data
  }

  async login(username: string, password: string){
    const res = await axios.post(base + "/guest/login", {
      data: {
        username: username,
        password: password
      }
    });
    const data: Result<void | SimpleMember> = res.data
    return data.data
  }

  async logout(username: string){
    const res = await axios.get(base + "/" + username);
    const data: Result<void | SimpleGuest> = res.data
    return data.data
  }

  async appointShopOwner( owner: string, shopId: number, newOwnerId: string, title: string){
    const res = await axios.post(base + "/member/shopManagement/assignOwner", {
      data: {
        owner: owner,
        shopId: shopId,
        newOwnerId: newOwnerId,
        title: title,
      }
    });
    const data: Result<void> = res.data
    return data.ok
  }

  async appointShopManager(owner: string, shopId: number, newManager: string, title: string){
    const res = await axios.post(base + "/member/shopManagement/assignManager", {
      data: {
        owner: owner,
        shopId: shopId,
        newManager: newManager,
        title: title,
      }
    });
    const data: Result<void> = res.data
    return data.ok
  }

  async addPermissions(owner: string, shopId: number, manager: string, permissions: Permissions[]){
    const res = await axios.post(base + "/member/shopManagement/Permissions", {
      data: {
        owner: owner,
        shopId: shopId,
        manager: manager,
        permissions: permissions,
      }
    });
    const data: Result<void> = res.data
    return data.ok
  }

  async removePermissions(owner: string, shopId: number, manager: string, permissions: Permissions[]){
    const res = await axios.delete(base + "/member/shopManagement/Permissions", {
      data: {
        owner: owner,
        shopId: shopId,
        manager: manager,
        permissions: permissions,
      }
    });
    const data: Result<void> = res.data
    return data.ok
  }

  async shopPersonnelInfo(username: string, shopId: number){
    const res = await axios.get(base + "/member/shopManagement/Personnel/" +username+"/"+shopId);
    const data: Result<void | SimpleMember[]> = res.data
    return data.data
  }

  async exitMarketplace(){
    const res = await axios.get(base + "/exit");
    const data: Result<void> = res.data
    return data.ok
  }

  async searchProducts(term: string, type: string, filter: any){
    const res = await axios.post(base + "/product/search", {
      data: {
        term: term,
        type: type,
        filter: filter
      }
    });
    const data: Result<void |SimpleProduct[]> = res.data
    return data.data
  }

  async addProductToShop(shopId: number, username: string, category: ProductCategory, name: string, price: number, quantity: number, description: string){
    const res = await axios.post(base + "/product/" +shopId,{
      data: {
        username: username,
        category: category,
        name: name,
        price: price,
        quantity: quantity,
        description:description
      }
    });
    const data: Result<void |SimpleProduct> = res.data
    return data.data
  }

  async removeProductFromShop(shopId: number, username: string, productId: number){
    const res = await axios.delete(base + "/product/" +shopId+"/"+productId,{
      data: {
        username: username
      }
    });
    const data: Result<void |SimpleProduct> = res.data
    return data.data
  }

  async modifyProductQuantityInShop(shopId: number, username: string, productId: number, quantity: number){
    const res = await axios.patch(base + "/product/" +shopId+"/"+productId,{
      data: {
        username: username,
        quantity:quantity
      }
    });
    const data: Result<void> = res.data
    return data.ok
  }

  async setUpShop(username: string, shopName: string){
    const res = await axios.post(base + "/shop", {
      data: {
        username: username,
        shopName: shopName
      }
    });
    const data: Result<void | SimpleShop> = res.data
    return data.data
  }

  async getShopInfo(shopId: number){
    const res = await axios.get(base + "/shop/" + shopId);
    const data: Result<void | SimpleShop> = res.data
    return data.data
  }


  async closeShop(shopId: number,founder: string){
    const res = await axios.patch(base + "/shop/close/" + shopId,
    {
      founder:founder
    });
    const data: Result<void> = res.data
    return data.ok
  }

  async getShopPurchaseHistory(shopId: number,ownerUsername:string,from:Date,to:Date,filters:any){
    const res = await axios.get(base + "/shop/orders/" + shopId+"/" + ownerUsername+"/" + from+"/" + to,filters);
    const data: Result<void | string[]> = res.data
    return data.data
  }

  async checkShoppingCart(){
    const res = await axios.get(base + "/cart");
    const data: Result<void|SimpleShoppingCart> = res.data
    return data.data
  }

  async addToCart(product: number, quantity: number){
    const res = await axios.post(base + "/cart", {
      data: {
        product: product,
        quantity: quantity
      }
    });
    const data: Result<void> = res.data
    return data.ok
  }

  async removeFromCart(product: number){
    const res = await axios.delete(base + "/cart", {
      data: {
        product: product
      }
    });
    const data: Result<void> = res.data
    return data.ok
  }

  async editProductInCart(product: number, quantity: number){
    const res = await axios.patch(base + "/cart", {
      data: {
        product: product,
        quantity: quantity
      }
    });
    const data: Result<void> = res.data
    return data.ok
  }


}
