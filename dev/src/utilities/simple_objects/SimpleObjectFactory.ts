import { SimpleProduct } from "./marketplace/SimpleProduct";
import {Product} from "../../domain/marketplace/Product";
import { SimpleShop } from "./marketplace/SimpleShop";
import { SimpleShopOrder } from "./purchase/SimpleShopOrder";
import { SimpleGuest } from "./user/SimpleGuest";
import { SimpleMember } from "./user/SimpleMember";
import {SimpleShoppingCart} from "./user/SimpleShoppingCart";
import {Shop} from "../../domain/marketplace/Shop";
import {Guest} from "../../domain/user/Guest";
import {Member} from "../../domain/user/Member";
import {ShoppingCart} from "../../domain/marketplace/ShoppingCart";


export function toSimpleProduct(product: Product): SimpleProduct{
    return new SimpleProduct(product.id, product.name, product.shopId,
        product.fullPrice, product.category, product.rate, product.description);
}

export function toSimpleProducts(products: Product[]): SimpleProduct[]{
    const simpleProducts: SimpleProduct[] = new Array<SimpleProduct>();

    for (const product of <Product[]> products) {
        const simpleProduct: SimpleProduct = toSimpleProduct(product);
        simpleProducts.push(simpleProduct);
    }

    return simpleProducts;
}

export function toSimpleShop(shop: Shop): SimpleShop{
    const products: Map<SimpleProduct, number> = new Map<SimpleProduct, number>();
    for (const [domainProduct, quantity] of shop.products.values()) {
        const product: SimpleProduct = new SimpleProduct(domainProduct.id, domainProduct.name, domainProduct.shopId,
            domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
        products.set(product, quantity);
    }

    return new SimpleShop(shop.id, shop.name, shop.status, products);
}

export function toSimpleGuest(guest: Guest): SimpleGuest{
    return new SimpleGuest(guest.session);
}

export function toSimpleMember(member: Member): SimpleMember{
    return new SimpleMember(member.username);
}

export function toSimpleShoppingCart(userID: string, shoppingCart: ShoppingCart): SimpleShoppingCart{
    const simpleProducts: Map<SimpleProduct, number> = new Map<SimpleProduct, number>();
    for (const [shopID, shoppingBag] of Object.entries(shoppingCart.bags)) {

        //Extract products and quantities from Domain Products
        for (const [product, quantity] of shoppingBag.products.values()) {
            const simpleProduct: SimpleProduct = new SimpleProduct(product.id, product.name, product.shopId,
                product.fullPrice, product.category, product.rate, product.description);
            simpleProducts.set(simpleProduct, quantity);
        }

    }
    return new SimpleShoppingCart(userID, simpleProducts, 0);
}
