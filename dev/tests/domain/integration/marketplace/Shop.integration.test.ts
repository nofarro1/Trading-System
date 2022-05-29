import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {DiscountType, ProductCategory, RelationType, SimplePolicyType} from "../../../../src/utilities/Enums";
import {ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {SimpleDiscount} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/SimpleDiscount";
import {discountInf} from "../../../../src/utilities/Types";
import {
    PredicateDiscountPolicy
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Predicates/PredicateDiscountPolicy";
import {
    ConditionalDiscount
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/ConditionalDiscount";
import {
    AndDiscounts
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicComposiotions/AndDiscounts";
import {
    OrDiscounts
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicComposiotions/OrDiscounts";
import {
    MaxDiscounts
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/NumericConditions/MaxDiscounts";
import {
    AdditionDiscounts
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/NumericConditions/AdditionDiscounts";
import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {Guest} from "../../../../src/domain/user/Guest";
import {SimplePurchase} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/SimplePurchase";

const mockInstance = (dependency: string) => {
    jest.mock(dependency)
}

const mockMethod = <T extends {}>(obj: T, method: any, todoInstead: ((...args: jest.ArgsType<any>) => ReturnType<any>) | undefined) => {
    return jest.spyOn(obj, method).mockImplementation(todoInstead)
}

const clearMocks = (...mocks: jest.SpyInstance<any, unknown[]>[]) => {
    for (const mock of mocks) {
        mock.mockClear()
    }
}

//mockInstance("../../../src/domain/marketplace/Shop")
let s1:Shop;
let p1: Product;
let p2: Product;


describe('SimpleShop- products', function(){
    beforeEach(function(){
        s1= new Shop(0, "Mega", "ofir");
    })

    test('add un-exist product', ()=>{
        s1.addProduct("cottage", ProductCategory.A, 5.9,  1, "Yami chees");
        expect(s1.products.keys()).toContain(0);
        p1= s1.getProduct(0);
        expect(s1.products.get(0)).toEqual([p1,1]);
    })

    test('remove existing product', ()=>{
        // let removemockMethod = mockMothod(Shop.prototype,'addProduct',()=>{
        //     let products = s1.products
        //     products.push(p1);
        //     return p1;
        // })
        s1.addProduct("cotage", ProductCategory.A, 5.9,  1, "Yami chees",);
        p1= s1.getProduct(0);
        s1.removeProduct(p1.id)
        expect(s1.products.keys()).not.toContain(p1.id);

        //clearMocks(removemockMethod)
    })

    test('remove not existing product', () => {
        expect(function(){s1.removeProduct(p1.id)}).toThrow(new Error(`Failed to remove product, because product id: ${p1.id} was not found`));
    })

    test('update product quantity', ()=>{
        s1.addProduct("cottage", ProductCategory.A, 5.9,  1, "Yami chees");
        s1.updateProductQuantity(0, 2);
        p1= s1.getProduct(0);
        expect(s1.products.get(0)).toEqual([p1, 2]);
    })
})

describe('SimpleShop- Appointed Members', function(){
    beforeEach(function(){
        s1= new Shop(0, "Mega", "ofir");
    })

    test('appointShopOwner', () =>{
        s1.appointShopOwner("Nofar");
        expect(s1.shopOwners.values()).toContain("Nofar");
    })

    test('appointShopManager', () =>{
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
        let pred1 = new PredicateDiscountPolicy(DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let pred2 = new PredicateDiscountPolicy(DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
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
        let pred1 = new PredicateDiscountPolicy(DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let pred2 = new PredicateDiscountPolicy(DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
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
        let pred1 = new PredicateDiscountPolicy(DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let discountInf2: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let cond1 = new ConditionalDiscount(disc1, pred1);
        let disc2 = new SimpleDiscount(discountInf2, 5);
        let pred2 = new PredicateDiscountPolicy(DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
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
        let pred1 = new PredicateDiscountPolicy(DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let discountInf2: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let cond1 = new ConditionalDiscount(disc1, pred1);
        let disc2 = new SimpleDiscount(discountInf2, 5);
        let pred2 = new PredicateDiscountPolicy(DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
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

    test('camMakePurchase- simplePurchase. Could make purchase.', ()=>{
        let cart = new ShoppingCart();
        cart.addProduct(p1, 2);
        let bag = cart.bags.get(0);
        let user = new Guest("1");
        let simplePolicy = new SimplePurchase(SimplePolicyType.Product, p1.id, RelationType.LessThenOrEqual, 5,"Couldn't continue with checkout because the quantity of 'ski' cheese is more the 5.");
        s1.addPurchasePolicy(simplePolicy);
        let ans = s1.canMakePurchase([bag, user]);
        expect(ans.ok).toBe(true);
    })

    test("canMakePurchase- simplePurchase. Couldn't make purchase.", ()=>{
        let cart = new ShoppingCart();
        cart.addProduct(p1, 6);
        let bag = cart.bags.get(0);
        let user = new Guest("1");
        let simplePolicy = new SimplePurchase(SimplePolicyType.Product, p1.id, RelationType.LessThenOrEqual, 5, "The quantity of 'ski' cheese is more the 5.");
        s1.addPurchasePolicy(simplePolicy);
        let ans = s1.canMakePurchase([bag, user]);
        expect(ans.ok).toBe(false);
        expect(ans.message).toBe("Couldn't make purchase because:\nThe quantity of 'ski' cheese is more the 5.");
    })

    test("canMakePurchase- simplePurchase. Couldn't make purchase.", ()=>{
        let cart = new ShoppingCart();
        cart.addProduct(p1, 5);
        let bag = cart.bags.get(0);
        let user = new Guest("1");
        let simplePolicy = new SimplePurchase(SimplePolicyType.Category, p1.category, RelationType.Equal, 5,"The quantity of 'ski' cheese is more the 5.");
        s1.addPurchasePolicy(simplePolicy);
        let ans = s1.canMakePurchase([bag, user]);
        expect(ans.ok).toBe(true);
    })
})



