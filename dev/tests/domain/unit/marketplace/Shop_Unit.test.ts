import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {DiscountType, ProductCategory} from "../../../../src/utilities/Enums";
import {MarketplaceController} from "../../../../src/domain/marketplace/MarketplaceController";
import {mockDependencies, mockInstance, mockMethod} from "../../../mockHelper";
import {ShoppingBag} from "../../../../src/domain/marketplace/ShoppingBag";
import {Discount, discountInf} from "../../../../src/domain/marketplace/CompositePattern/leaves/Discount";

describe('SimpleShop- products', function() {

    let p1: Product = new Product("Ski", 0, ProductCategory.A, 5.9,undefined, "Yami chees");
    let p2: Product = new Product("Cottage", 0, ProductCategory.A, 6, undefined, "Yami chees");
    let s1: Shop;
    let s2: Shop;

    beforeEach(() => {
        s1 = new Shop(0, "OfirPovi", "Ofir's shop");
        s2 = new Shop(1, "NofarRoz", "Nofar's shop");
        // @ts-ignore
       s1.products.set(0, [p1, 1]);
        // @ts-ignore
       s2.products.set(1, [p2, 2]);
    })


    test('add product', () => {
        let p3 = s1.addProduct("cottage", s1.id, ProductCategory.A, 5.9, 5.9, undefined, "Yami chees");
        expect(s1.products.keys()).toContain(p3.id);
        expect(s1.products.get(2)).toEqual([p3, 1]);
    })

    test('remove existing product', () => {
        s1.removeProduct(p1.id)
        expect(s1.products.keys()).not.toContain(p1.id);
    })

    test('remove not existing product', () => {
        s1.products= new Map();
        expect(function () {
            s1.removeProduct(p1.id)
        }).toThrow(new Error(`Failed to remove product, because product id: ${p1.id} was not found`));
    })

    test('update product quantity', () => {
        s1.updateProductQuantity(0, 2);
        expect(s1.products.get(0)).toEqual([p1, 2]);
    })

    test('appointShopOwner', () => {
        s1.appointShopOwner("Nofar");
        expect(s1.shopOwners.values()).toContain("Nofar");
    })

    test('appointShopManager', () => {
        s1.appointShopOwner("Idan");
        expect(s1.shopOwners.values()).toContain("Idan");
    })

    test('calculateBagPrice- simple test', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 2]);
        bag.products.set(1, [p2, 1]);
        let discountInf: discountInf = {type:DiscountType.Product, object:p1} as discountInf;
        let disc1 = new Discount(discountInf, 20);
        s1.addDiscount(disc1);
        let totalPrice = s1.calculateBagPrice(bag);
        expect(totalPrice).toBeCloseTo(15.44, 4);
    })

})



