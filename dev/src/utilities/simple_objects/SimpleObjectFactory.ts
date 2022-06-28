import {SimpleProduct} from "./marketplace/SimpleProduct";
import {Product} from "../../domain/marketplace/Product";
import {SimpleShop} from "./marketplace/SimpleShop";
import {SimpleGuest} from "./user/SimpleGuest";
import {SimpleMember} from "./user/SimpleMember";
import {SimpleShoppingCart} from "./user/SimpleShoppingCart";
import {Shop} from "../../domain/marketplace/Shop";
import {Guest} from "../../domain/user/Guest";
import {Member} from "../../domain/user/Member";
import {ShoppingCart} from "../../domain/user/ShoppingCart";
import {DiscountComponent} from "../../domain/marketplace/DiscountAndPurchasePolicies/Components/DiscountComponent";
import {SimpleDiscountDescriber} from "./marketplace/SimpleDiscountDescriber";
import {Role} from "../../domain/user/Role";
import {SimpleRole} from "./user/SimpleRole";
import { ShoppingBag } from "../../domain/user/ShoppingBag";


export function toSimpleProduct(product: Product): SimpleProduct {
    return new SimpleProduct(product.id, product.name, product.shopId,
        product.fullPrice, product.category, product.rate, product.description);
}

export function toSimpleProducts(products: Product[]): SimpleProduct[] {
    const simpleProducts: SimpleProduct[] = new Array<SimpleProduct>();

    for (const product of <Product[]>products) {
        const simpleProduct: SimpleProduct = toSimpleProduct(product);
        simpleProducts.push(simpleProduct);
    }

    return simpleProducts;
}

export function toSimpleShop(shop: Shop): SimpleShop {
    const products: {product:SimpleProduct, quantity:number}[] = [];
    for (const [domainProduct, quantity] of shop.products.values()) {
        const product: SimpleProduct = new SimpleProduct(domainProduct.id, domainProduct.name, domainProduct.shopId,
            domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
        products.push({product:product, quantity:quantity});
    }

    return new SimpleShop(shop.id, shop.name,shop.shopFounder,shop.status,products);
}

export function toSimpleGuest(guest: Guest): SimpleGuest {
    return new SimpleGuest(guest.session);
}

export function toSimpleMember(member: Member): SimpleMember {
    const simpleRoles = [...member.roles.values()].map(toSimpleRole);
    return new SimpleMember(member.username, simpleRoles);
}

function toSimpleRole(role: Role): SimpleRole {
    return new SimpleRole(role.shopId,role.permissions)
}

export function toSimpleShoppingCart(userID: string, shoppingCart: ShoppingCart): SimpleShoppingCart {
    const simpleProducts: {product:SimpleProduct, quantity:number}[] = [];
    shoppingCart.bags.forEach((bag : ShoppingBag)=> {
        bag.products.forEach((value :[product: Product, quantity: number]) => {
            let simpleProduct: SimpleProduct = new SimpleProduct(value[0].id, value[0].name, value[0].shopId,
                value[0].fullPrice, value[0].category, value[0].rate, value[0].description);
            simpleProducts.push({product:simpleProduct, quantity:value[1]});
        })
    })
    return new SimpleShoppingCart(userID, simpleProducts, 0);
}

export function toSimpleDiscountDescriber(discount: DiscountComponent): SimpleDiscountDescriber {
    return new SimpleDiscountDescriber(discount.id, discount.description);
}
