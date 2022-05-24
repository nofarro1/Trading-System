import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {DiscountType, ProductCategory} from "../../../../src/utilities/Enums";
import {ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {discountInf, SimpleDiscount} from "../../../../src/domain/marketplace/CompositePattern/leaves/SimpleDiscount";
import {
    AndDiscounts
} from "../../../../src/domain/marketplace/CompositePattern/Containers/DiscountsContainers/LogicComposiotions/AndDiscounts";
import {
    OrDiscounts
} from "../../../../src/domain/marketplace/CompositePattern/Containers/DiscountsContainers/LogicComposiotions/OrDiscounts";
import {
    MaxDiscounts
} from "../../../../src/domain/marketplace/CompositePattern/Containers/DiscountsContainers/NumericConditions/MaxDiscounts";
import {
    AdditionDiscounts
} from "../../../../src/domain/marketplace/CompositePattern/Containers/DiscountsContainers/NumericConditions/AdditionDiscounts";
import {ConditionalDiscount} from "../../../../src/domain/marketplace/CompositePattern/leaves/ConditionalDiscount";

describe('SimpleShop- products', function() {

    let p1: Product = new Product("Ski", 0, ProductCategory.A, 5.9,undefined, "Yami chees");
    let p2: Product = new Product("Cottage", 0, ProductCategory.B, 6, undefined, "Yami chees");
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
        let p3 = s1.addProduct("cottage", s1.id, ProductCategory.A, 5.9,1, undefined, "Yami chees");
        expect(s1.products.keys()).toContain(p3.id);
        expect(s1.products.get(p3.id)).toEqual([p3, 1]);
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

    test('calculateBagPrice- simple scenario with one discount', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 2]);
        bag.products.set(1, [p2, 1]);
        let discountInf: discountInf = {type:DiscountType.Product, object:p1} as discountInf;
        let disc1 = new SimpleDiscount(discountInf, 20);
        s1.addDiscount(disc1);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(15.44, 4);
    })

    test('calculateBagPrice- simple scenario with 2 discounts', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 2]);
        bag.products.set(1, [p2, 1]);
        let discountInf1: discountInf = {type:DiscountType.Product, object:p1} as discountInf;
        let disc1 = new SimpleDiscount(discountInf1, 20);
        s1.addDiscount(disc1);
        let discountInf2: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc2 = new SimpleDiscount(discountInf2, 10);
        s1.addDiscount(disc2);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(13.66);
    })

    test('calculateBagPrice- AndDiscount, needs to apply', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 2]);
        bag.products.set(1, [p2, 1]);
        let discountInf1: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc1 = new SimpleDiscount(discountInf1, 5);
        let discountInf2: discountInf = {type:DiscountType.Product, object:p1} as discountInf;
        let disc2 = new SimpleDiscount(discountInf2, 5);
        let pred1 = (products: [Product, number, number][])=> {let p= products.find(([p, price, quantity]:[Product, number, number]) =>  p.id === 0 && quantity >= 2);
            return p!=undefined;}
        let pred2 = (products: [Product, number, number][])=> {let p= products.find(([p, price, quantity]:[Product, number, number]) =>  p.id === 1 && quantity >= 1);
            return p!=undefined;}
        let cond1 = new ConditionalDiscount(disc1, pred1);
        let cond2 = new ConditionalDiscount(disc2, pred2);
        let andDisc = new AndDiscounts([cond1, cond2]);
        s1.addDiscount(andDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(16.32);
    })

    test('calculateBagPrice- AndDiscount, does not need to apply', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 1]);
        bag.products.set(1, [p2, 1]);
        let discountInf1: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc1 = new SimpleDiscount(discountInf1, 5);
        let discountInf2: discountInf = {type:DiscountType.Product, object:p1} as discountInf;
        let disc2 = new SimpleDiscount(discountInf2, 5);
        let pred1 = (products: [Product, number, number][])=> {let p= products.find(([p, price, quantity]:[Product, number, number]) =>  p.id === 0 && quantity >= 2);
            return p!=undefined;}
        let pred2 = (products: [Product, number, number][])=> {let p= products.find(([p, price, quantity]:[Product, number, number]) =>  p.id === 1 && quantity >= 1);
            return p!=undefined;}
        let cond1 = new ConditionalDiscount(disc1, pred1);
        let cond2 = new ConditionalDiscount(disc2, pred2);
        let andDisc = new AndDiscounts([cond1, cond2]);
        s1.addDiscount(andDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(11.9);
    })

    test('calculateBagPrice- OrDiscount, needs to apply', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 1]);
        bag.products.set(1, [p2, 1]);
        let discountInf1: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc1 = new SimpleDiscount(discountInf1, 5);
        let pred1 = (products: [Product, number, number][])=> {let p= products.find(([p, price, quantity]:[Product, number, number]) =>  p.id === 0 && quantity >= 2);
            return p!=undefined;}
        let discountInf2: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let cond1 = new ConditionalDiscount(disc1, pred1);
        let disc2 = new SimpleDiscount(discountInf2, 5);
        let pred2 = (products: [Product, number, number][])=> {let p= products.find(([p, price, quantity]:[Product, number, number]) =>  p.id === 1 && quantity >= 1);
            return p!=undefined;}
        let cond2 = new ConditionalDiscount(disc2, pred2);
        let OrDisc = new OrDiscounts([cond1, cond2]);
        s1.addDiscount(OrDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(11.605);
    })

    test('calculateBagPrice- OrDiscount, does not need to apply', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 1]);
        bag.products.set(1, [p2, 0]);
        let discountInf1: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc1 = new SimpleDiscount(discountInf1, 5);
        let pred1 = (products: [Product, number, number][])=> {let p= products.find(([p, price, quantity]:[Product, number, number]) =>  p.id === 0 && quantity >= 2);
           return p!=undefined;}
        let discountInf2: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let cond1 = new ConditionalDiscount(disc1, pred1);
        let disc2 = new SimpleDiscount(discountInf2, 5);
        let pred2 = (products: [Product, number, number][])=> {let p= products.find(([p, price, quantity]:[Product, number, number]) =>  p.id === 1 && quantity >= 1);
            return p!=undefined;}
        let cond2 = new ConditionalDiscount(disc2, pred2);
        let OrDisc = new OrDiscounts([cond1, cond2]);
        s1.addDiscount(OrDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(5.9);
    })

    test('calculateBagPrice- MaxDiscount', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 1]);
        bag.products.set(1, [p2, 1]);
        let discountInf1: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let disc1 = new SimpleDiscount(discountInf1, 5);
        let discountInf2: discountInf = {type:DiscountType.Category, object:ProductCategory.B} as discountInf;
        let disc2 = new SimpleDiscount(discountInf2, 10);
        let maxDisc = new MaxDiscounts();
        maxDisc.addDiscountElement(disc1);
        maxDisc.addDiscountElement(disc2);
        s1.addDiscount(maxDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(11.3, 1);
    })

    test('calculateBagPrice- AdditionDiscount', ()=>{
        let bag = new ShoppingBag(0);
        bag.products.set(0,[p1, 1]);
        bag.products.set(1, [p2, 1]);
        let discountInf1: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let disc1 = new SimpleDiscount(discountInf1, 5);
        let discountInf2: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc2 = new SimpleDiscount(discountInf2, 10);
        let additionDisc = new AdditionDiscounts();
        additionDisc.addDiscountElement(disc1);
        additionDisc.addDiscountElement(disc2);
        s1.addDiscount(additionDisc);
        let totalPrice=0;
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(10.415);
    })
})



