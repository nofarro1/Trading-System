import axios from 'axios';
import { checkRes, Result } from '../../../../utilities/Result';
import { inject, injectable, interfaces } from 'inversify';
import SimpleFactory = interfaces.SimpleFactory;
import { SimpleGuest } from '../../../../utilities/simple_objects/user/SimpleGuest';
import { SimpleShop } from '../../../../utilities/simple_objects/marketplace/SimpleShop';
import { SimpleMember } from '../../../../utilities/simple_objects/user/SimpleMember';
import { Permissions } from '../../../../utilities/Permissions';
import { SimpleProduct } from '../../../../utilities/simple_objects/marketplace/SimpleProduct';
import { ProductCategory } from '../../../../utilities/Enums';
import { SimpleShoppingCart } from '../../../../utilities/simple_objects/user/SimpleShoppingCart';
import { Injectable } from '@angular/core';

const base = 'https://localhost:3000/api';
@Injectable({
  providedIn: 'root',
})
export class api {
  btnDisabled = true;
  constructor() {
    axios.defaults.httpsAgent = { rejectUnauthorized: false };
  }

  async accessMarketPlace() {
    try {
      const res = await axios.get(base + '/access');
      const data: Result<void | SimpleGuest> = res.data;
      return checkRes(data) ? data.data._guestID : '';
    } catch (e: any) {
      console.log(
        '[Service/accessMarketPlace] Error in accessing to the market place'
      );
      return null;
    }
  }

  async register(
    session: string | undefined,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    country: string
  ) {
    try {
      const res = await axios.post(base + '/guest/register', {
        session,
        username,
        password,
        firstName,
        lastName,
        email,
        country,
      });
      const data = res.data;
      console.log('end of register - we get back: ');
      console.log(data);
      return data.data;
    } catch (e: any) {
      console.log(`error in register: ${e.message}`);
      return undefined;
    }
  }

  async adminRegister(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    country: string
  ) {
    const res = await axios.post(base + 'admin/register', {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        country: country,
    });
    const data: Result<void | SimpleMember> = res.data;
    return data.data;
  }

  async login(session: string, username: string, password: string) {
    const res = await axios.post(base + '/guest/login', {
      session,
      username,
      password,
    });
    const data: Result<void | SimpleMember> = res.data;
    return data.data;
  }

  async logout(username: string) {
    const res = await axios.get(base + '/' + username);
    const data: Result<void | SimpleGuest> = res.data;
    return data.data;
  }

  async logoutMember(session: string, username: string) {
    const res = await axios.get(
      base + `/member/logout/:${username}/:${session}`
    );
    const data: Result<void | SimpleGuest> = res.data;
    return data.data;
  }

  async appointShopOwner(
    owner: string,
    shopId: number,
    newOwnerId: string,
    title: string
  ) {
    const res = await axios.post(base + '/member/shopManagement/assignOwner', {
        owner: owner,
        shopId: shopId,
        newOwnerId: newOwnerId,
        title: title,
    });
    const data: Result<void> = res.data;
    return data.ok;
  }

  async appointShopManager(
    owner: string,
    shopId: number,
    newManager: string,
    title: string
  ) {
    const res = await axios.post(
      base + '/member/shopManagement/assignManager',
      {
          owner: owner,
          shopId: shopId,
          newManager: newManager,
          title: title,
      }
    );
    const data: Result<void> = res.data;
    return data.ok;
  }

  async addPermissions(
    owner: string,
    shopId: number,
    manager: string,
    permissions: Permissions[]
  ) {
    const res = await axios.post(base + '/member/shopManagement/Permissions', {
        owner: owner,
        shopId: shopId,
        manager: manager,
        permissions: permissions,
    });
    const data: Result<void> = res.data;
    return data.ok;
  }

  async removePermissions(
    owner: string,
    shopId: number,
    manager: string,
    permissions: Permissions[]
  ) {
    const res = await axios.delete(
      base + '/member/shopManagement/Permissions',
      {
        data: {
          owner: owner,
          shopId: shopId,
          manager: manager,
          permissions: permissions,
        },
      }
    );
    const data: Result<void> = res.data;
    return data.ok;
  }

  async shopPersonnelInfo(username: string, shopId: number) {
    const res = await axios.get(
      base + '/member/shopManagement/Personnel/' + username + '/' + shopId
    );
    const data: Result<void | SimpleMember[]> = res.data;
    return data.data;
  }

  async exitMarketplace() {
    const res = await axios.get(base + '/exit');
    const data: Result<void> = res.data;
    return data.ok;
  }

  async searchProducts(term: string, type: string, filter: any) {
    const res = await axios.post(base + '/product/search', {
        term: term,
        type: type,
        filter: filter,
    });
    const data: Result<void | SimpleProduct[]> = res.data;
    return data.data;
  }

  async addProductToShop(
    session: string,
    shopId: number,
    category: ProductCategory,
    name: string,
    price: number,
    quantity: number,
    description: string
  ) {
    const res = await axios.post(base + '/product/' + shopId, {
        session: session,
        category: category,
        name: name,
        price: price,
        quantity: quantity,
        description: description,
    });
    const data: Result<void | SimpleProduct> = res.data;
    return data.data;
  }

  async removeProductFromShop(
    session: string,
    shopId: number,
    productId: number
  ) {
    const res = await axios.delete(
      base + '/product/' + shopId + '/' + productId, {data: {session}}
    );
    const data: Result<void | SimpleProduct> = res.data;
    return data.data;
  }

  async modifyProductQuantityInShop(
    shopId: number,
    username: string,
    productId: number,
    quantity: number
  ) {
    const res = await axios.patch(
      base + '/product/' + shopId + '/' + productId, { username, quantity });
    const data: Result<void> = res.data;
    return data.ok;
  }

  async setUpShop(username: string, shopName: string) {
    const res = await axios.post(base + '/shop/setup', {
        username,
        shopName,
    });
    const data: Result<void | SimpleShop> = res.data;
    return data.data;
  }

  async getAllShops(session: string) {
    const res = await axios.get(base + `/shops/${session}`);
    const data = res.data;
    return data.data;
  }

  async getShopInfo(shopId: number) {
    const res = await axios.get(base + '/shop/' + shopId);
    const data: Result<void | SimpleShop> = res.data;
    return data.data;
  }

  async closeShop(session: string, shopId: number) {
    const res = await axios.patch(base + '/shop/close', {
      session: session,
      shopIp: shopId,
    });
    const data: Result<void> = res.data;
    return data.ok;
  }

  async getShopPurchaseHistory(
    shopId: number,
    ownerUsername: string,
    from: Date,
    to: Date,
    filters: any
  ) {
    const res = await axios.get(
      base + `shop/orders/${shopId}/${ownerUsername}/${from}/${to}`,filters);
    const data: Result<void | string[]> = res.data;
    return data.data;
  }

  async checkShoppingCart() {
    const res = await axios.get(base + '/cart');
    const data: Result<void | SimpleShoppingCart> = res.data;
    return data.data;
  }

  async addToCart(session: string, product: number, quantity: number) {
    const res = await axios.post(base + '/cart/add', {session, product, quantity});
    const data: Result<void> = res.data;
    return data.ok;
  }

  async removeFromCart(product: number) {
    const res = await axios.delete(base + '/cart/remove', {
      data: {
        product: product,
      },
    });
    const data: Result<void> = res.data;
    return data.ok;
  }

  async editProductInCart(product: number, quantity: number) {
    const res = await axios.patch(base + '/cart/modify', {
        product: product,
        quantity: quantity
    });
    const data: Result<void> = res.data;
    return data.ok;
  }
}
