import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {DiscountType, ProductCategory, RelationType, SimplePolicyType} from "../../../../src/utilities/Enums";
import {ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {SimpleDiscount} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/SimpleDiscount";
import {discountInf} from "../../../../src/utilities/Types"
import {
    AndDiscounts
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicCompositions/AndDiscounts";
import {
    OrDiscounts
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicCompositions/OrDiscounts";
import {
    MaxDiscounts
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/NumericConditions/MaxDiscounts";
import {
    AdditionDiscounts
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Containers/DiscountsContainers/NumericConditions/AdditionDiscounts";
import {
    ConditionalDiscount
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/ConditionalDiscount";
import {SimplePurchase} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/leaves/SimplePurchase";
import {Guest} from "../../../../src/domain/user/Guest";
import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {
    PredicateDiscountPolicy
} from "../../../../src/domain/marketplace/DiscountAndPurchasePolicies/Predicates/PredicateDiscountPolicy";

import {clearMocks, mockDependencies, mockInstance, mockMethod} from "../../../mockHelper";
import {Offer} from "../../../../src/domain/user/Offer";
import mock = jest.mock;
import exp from "constants";

describe('Shop.units', function() {

    let p1: Product = new Product("Ski", 0,0, ProductCategory.A, 5.9, "Yami chees");
    let p2: Product = new Product("Cottage", 0, 1, ProductCategory.B, 6,  "Yami chees");
    let s1: Shop;
    let s2: Shop;
    beforeAll(()=>{
        mockInstance(mockDependencies.Shop);
        mockInstance(mockDependencies.SimpleDiscount);
        mockInstance(mockDependencies.ShoppingBag);
        mockInstance(mockDependencies.ShoppingCart);
        mockInstance(mockDependencies.PredicateDiscountPolicy);
        mockInstance(mockDependencies.ConditionalDiscount);
        mockInstance(mockDependencies.AndDiscounts);
        mockInstance(mockDependencies.OrDiscounts);
        mockInstance(mockDependencies.MaxDiscounts);
        mockInstance(mockDependencies.AdditionDiscounts);
        mockInstance(mockDependencies.Shop);
    })

    beforeEach(() => {
        s1 = new Shop(0, "OfirPovi", "OfirPovi");
        s2 = new Shop(1, "NofarRoz", "NofarRoz");
        // @ts-ignore
       s1.products.set(0, [p1, 1]);
    })


    test('add product', () => {
        let p3 = s2.addProduct("cottage", ProductCategory.A, 5.9,1,  "Yami chees");
        expect(s2.products.keys()).toContain(p3.id);
        expect(s2.products.get(p3.id)).toEqual([p3, 1]);
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
        let discountInf: discountInf = {type:DiscountType.Product, object:p1.id} as discountInf;
        let disc1 = new SimpleDiscount(0,discountInf, 20);

        // const mock_addDiscount = mockMethod(Shop.prototype, "addDiscount", ()=> {
        //     s1.discounts.set(s1.discountCounter, disc1)
        // })
        // s1.addDiscount(disc1);
        s1.discounts.set(disc1.id, disc1);
        const mock_calc = mockMethod(SimpleDiscount.prototype, "calculateProductsPrice", ()=> [[p1, 4.72, 2], [p2, 6, 1]])
        const mock_addProduct = mockMethod(ShoppingBag.prototype, "addProduct", (p, quantity)=>{bag.products.set(s1.productsCounter,[p, quantity]);})
        let bag = new ShoppingBag(0);
        bag.addProduct(p1,2)
        bag.addProduct(p2,1);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(15.44, 4);

        clearMocks(mock_calc, mock_addProduct);
    })

    test('calculateBagPrice- simple scenario with 2 discounts', ()=>{
        const mock_calc = mockMethod(SimpleDiscount.prototype, "calculateProductsPrice", ()=> [[p1, 4.13, 2], [p2, 5.4, 1]])
        const mock_addProduct = mockMethod(ShoppingBag.prototype, "addProduct", (p, quantity)=>{
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
        })

        let bag = new ShoppingBag(0);
        bag.addProduct(p1, 2);
        bag.addProduct(p2, 1);

        let discountInf1: discountInf = {type:DiscountType.Product, object:p1.id} as discountInf;
        let disc1 = new SimpleDiscount(0,discountInf1, 20);

        let discountInf2: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc2 = new SimpleDiscount(1,discountInf2, 10);

        // const mock_addDiscount = mockMethod(Shop.prototype, "addDiscount", (disc)=> {
        //     s1.discounts.set(s1.discountCounter, disc)
        //     s1.discountCounter++;
        // })
        s1.discounts.set(disc1.id, disc1);
        s1.discounts.set(disc2.id, disc2);

        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(13.66 );
        clearMocks(mock_calc, mock_addProduct);
    })

    test('calculateBagPrice- AndDiscount, needs to apply', ()=>{
        const mock_calc = mockMethod(AndDiscounts.prototype, "calculateProductsPrice", ()=> [[p1, 4.13, 2], [p2, 5.4, 1]])
        const mock_addProduct = mockMethod(ShoppingBag.prototype, "addProduct", (p, quantity)=>{
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
            return p;
        })
        // const mock_addDiscount = mockMethod(Shop.prototype, "addDiscount", (disc)=> {
        //     s1.discounts.set(s1.discountCounter, disc)
        //     return s1.discountCounter++;
        // })

        let bag = new ShoppingBag(0);
        bag.addProduct(p1, 2);
        bag.addProduct(p2, 1);

        let discountInf1: discountInf = {type:DiscountType.Product, object:p1.id} as discountInf;
        let disc1 = new SimpleDiscount(0, discountInf1, 20);
        let discountInf2: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc2 = new SimpleDiscount(1, discountInf2, 10);
        let pred1 = new PredicateDiscountPolicy(DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let pred2 = new PredicateDiscountPolicy(DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
        let cond1 = new ConditionalDiscount(3, disc1, pred1);
        let cond2 = new ConditionalDiscount(4,disc2, pred2);
        let andDisc = new AndDiscounts(5, [cond1, cond2]);
        s1.discounts.set(andDisc.id, andDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(13.66);
        clearMocks(mock_calc, mock_addProduct);
    })

    test('calculateBagPrice- AndDiscount, does not need to apply', ()=>{
        const mock_calc = mockMethod(AndDiscounts.prototype, "calculateProductsPrice", ()=> [[p1, 5.9, 1], [p2, 6, 1]])
        const mock_addProduct = mockMethod(ShoppingBag.prototype, "addProduct", (p, quantity)=>{
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
            return p;
        })
        // const mock_addDiscount = mockMethod(Shop.prototype, "addDiscount", (disc)=> {
        //     s1.discounts.set(s1.discountCounter, disc)
        //     return s1.discountCounter++;
        // })

        let bag = new ShoppingBag(0);
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 1);

        let discountInf1: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc1 = new SimpleDiscount(0, discountInf1, 5);
        let discountInf2: discountInf = {type:DiscountType.Product, object:p1.id} as discountInf;
        let disc2 = new SimpleDiscount(1, discountInf2, 5);
        let pred1 = new PredicateDiscountPolicy(DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let pred2 = new PredicateDiscountPolicy(DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
        let cond1 = new ConditionalDiscount(3, disc1, pred1);
        let cond2 = new ConditionalDiscount(4, disc2, pred2);
        let andDisc = new AndDiscounts(5, [cond1, cond2]);
        s1.discounts.set(andDisc.id, andDisc);

        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(11.9);
        clearMocks(mock_calc, mock_addProduct);
    })

    test('calculateBagPrice- OrDiscount, needs to apply', ()=>{
        const mock_calc = mockMethod(OrDiscounts.prototype, "calculateProductsPrice", ()=> [[p1, 5.31, 1], [p2, 5.7, 1]])
        const mock_addProduct = mockMethod(ShoppingBag.prototype, "addProduct", (p, quantity)=>{
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
            return p;
        })

        let bag = new ShoppingBag(0);
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 1);
        let discountInf1: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc1 = new SimpleDiscount(0, discountInf1, 5);
        let pred1 = new PredicateDiscountPolicy(DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);

        let discountInf2: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let cond1 = new ConditionalDiscount(1, disc1, pred1);
        let disc2 = new SimpleDiscount(2, discountInf2, 5);
        let pred2 = new PredicateDiscountPolicy(DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);

        let cond2 = new ConditionalDiscount(4, disc2, pred2);
        let OrDisc = new OrDiscounts(5, [cond1, cond2]);
        s1.discounts.set(OrDisc.id, OrDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(11.01);
        clearMocks(mock_calc, mock_addProduct);
    })

    test('calculateBagPrice- OrDiscount, does not need to apply', ()=>{
        const mock_calc = mockMethod(OrDiscounts.prototype, "calculateProductsPrice", ()=> [[p1, 5.9, 1], [p2, 6, 0]])
        const mock_addProduct = mockMethod(ShoppingBag.prototype, "addProduct", (p, quantity)=>{
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
            return p;
        })

        let bag = new ShoppingBag(0);
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 0);

        let discountInf1: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc1 = new SimpleDiscount(0, discountInf1, 5);
        let pred1 = new PredicateDiscountPolicy(DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let discountInf2: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let cond1 = new ConditionalDiscount(1,disc1, pred1);
        let disc2 = new SimpleDiscount(2, discountInf2, 5);
        let pred2 = new PredicateDiscountPolicy(DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
        let cond2 = new ConditionalDiscount(3, disc2, pred2);
        let OrDisc = new OrDiscounts(4, [cond1, cond2]);
        s1.discounts.set(OrDisc.id, OrDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(5.9);
        clearMocks(mock_calc, mock_addProduct);
    })

    test('calculateBagPrice- MaxDiscount', ()=>{
        const mock_calc = mockMethod(MaxDiscounts.prototype, "calculateProductsPrice", ()=> [[p1,5.9, 1], [p2, 5.4, 1]])
        const mock_addProduct = mockMethod(ShoppingBag.prototype, "addProduct", (p, quantity)=>{
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
            return p;
        })

        let bag = new ShoppingBag(0);
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 1);

        let discountInf1: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let disc1 = new SimpleDiscount(0, discountInf1, 5);
        let discountInf2: discountInf = {type:DiscountType.Category, object:ProductCategory.B} as discountInf;
        let disc2 = new SimpleDiscount(1, discountInf2, 10);
        let maxDisc = new MaxDiscounts(2, []);
        maxDisc.addDiscountElement(disc1);
        maxDisc.addDiscountElement(disc2);
        s1.discounts.set(maxDisc.id, maxDisc);

        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(11.3, 1);
        clearMocks(mock_calc, mock_addProduct);
    })

    test('calculateBagPrice- AdditionDiscount', ()=>{
        const mock_calc = mockMethod(AdditionDiscounts.prototype, "calculateProductsPrice", ()=> [[p1,5.015, 1], [p2, 5.4, 1]])
        const mock_addProduct = mockMethod(ShoppingBag.prototype, "addProduct", (p, quantity)=>{
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
            return p;
        })

        let bag = new ShoppingBag(0);
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 1);

        let discountInf1: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let disc1 = new SimpleDiscount(0, discountInf1, 5);
        let discountInf2: discountInf = {type:DiscountType.Bag, object:undefined} as discountInf;
        let disc2 = new SimpleDiscount(1, discountInf2, 10);
        let additionDisc = new AdditionDiscounts(2, []);
        additionDisc.addDiscountElement(disc1);
        additionDisc.addDiscountElement(disc2);
        s1.discounts.set(additionDisc.id, additionDisc);
        let totalPrice=0;
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(10.415, 4);
        clearMocks(mock_calc, mock_addProduct);
    })

    test('camMakePurchase- simplePurchase. Could make purchase.', ()=>{
        const mock_can = mockMethod(SimplePurchase.prototype, "CanMakePurchase", ()=> {
            return {ok: true, message: "Couldn't continue with checkout because the quantity of 'ski' cheese is more the 5."}
        })
        const mock_addProduct = mockMethod(ShoppingCart.prototype, "addProduct", (p: Product, quantity)=>{
            let bag = new ShoppingBag(p.shopId);
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
            cart.bags.set(p.shopId,bag);
            return p;
        })

        let cart = new ShoppingCart();
        cart.addProduct(p1, 2);
        let bag = cart.bags.get(0);
        let user = new Guest("1");
        let simplePolicy = new SimplePurchase(0, SimplePolicyType.Product, p1.id, RelationType.LessThenOrEqual, 5,"Couldn't continue with checkout because the quantity of 'ski' cheese is more the 5.");
        s1.purchasePolicies.set(simplePolicy.id, simplePolicy);

        let ans = s1.canMakePurchase([bag, user]);
        expect(ans.ok).toBe(true);
        clearMocks(mock_can, mock_addProduct);
    })

    test("canMakePurchase- simplePurchase. Couldn't make purchase.", ()=>{
        const mock_can = mockMethod(SimplePurchase.prototype, "CanMakePurchase", ()=> {
            return {ok: false, message: "The quantity of 'ski' cheese is more the 5."}
        })
        const mock_addProduct = mockMethod(ShoppingCart.prototype, "addProduct", (p: Product, quantity)=>{
            let bag = new ShoppingBag(p.shopId);
            bag.products.set(s1.productsCounter,[p, quantity]);
            s1.productsCounter++;
            cart.bags.set(p.shopId,bag);
            return p;
        })

        let cart = new ShoppingCart();
        cart.addProduct(p1, 6);
        let bag = cart.bags.get(0);
        let user = new Guest("1");
        let simplePolicy = new SimplePurchase(0, SimplePolicyType.Product, p1.id, RelationType.LessThenOrEqual, 5, "The quantity of 'ski' cheese is more the 5.");
        s1.purchasePolicies.set(simplePolicy.id, simplePolicy);
        let ans = s1.canMakePurchase([bag, user]);
        expect(ans.ok).toBe(false);
        expect(ans.message).toBe("Couldn't make purchase because:\nThe quantity of 'ski' cheese is more the 5.");
        clearMocks(mock_can, mock_addProduct);
    })


    test("addOfferPrice2Product", ()=>{
        let offer: Offer = s1.addOfferPrice2Product("nofar", 0, 4.5 );
        expect(s1.offers.get(0)).toBe(offer);
        expect(s1.offersArray).toContain(offer);
        expect(s1.offerCounter).toBe(1);
    } )

    test("answerOffer- offer exist", ()=>{
        let offer: Offer = new Offer(0, "NofarRoz", s1.id, 0,4.5, s1.shopOwners);
        s1.offers.set(0, offer);
        const mock_answerOffer = mockMethod(Offer.prototype, "setAnswer", ()=>{});
        let res = s1.answerOffer(offer.id, offer.user, true);
        expect(mock_answerOffer).toHaveBeenCalled();
        expect(res).toBe(true);
        s1.offers.delete(offer.id);
        res = s1.answerOffer(offer.id, offer.user, true);
        expect(res).toBe(false);
        clearMocks(mock_answerOffer);
    })

    test("answerOffer- offer isn't exist", ()=>{
        const mock_answerOffer = mockMethod(Offer.prototype, "setAnswer", ()=>{});
        let res = s1.answerOffer(0,"NofarRoz", true);
        expect(mock_answerOffer).not.toHaveBeenCalled();
        expect(res).toBe(false);
        clearMocks(mock_answerOffer);
    })

    test("filingCounterOffer", ()=>{
        const mock_resetApproves = mockMethod(Offer.prototype, "resetApproves", ()=>{})
        let offer: Offer = new Offer(0, "NofarRoz", s1.id, 0,4.5, s1.shopOwners);
        s1.offers.set(0, offer);
        s1.filingCounterOffer(offer.id,"NofarRoz" ,4);
        expect(mock_resetApproves).toHaveBeenCalled();
        expect(offer.price).toEqual(4);
        clearMocks(mock_resetApproves);
    })

    test("submit Owner appointment", ()=>{
       s1.submitOwnerAppointment("ofir", "Nofar");
       expect(s1.appointmentAgreements.has("ofir")).toBe(true);
    })

    test("answer appointment agreement - success", ()=>{
    let agreement = s1.answerAppointmentAgreement("Nofar", s1.shopFounder, true);
    expect(agreement).not.toBeNull();
    if(agreement){
        expect(agreement.isDone()).toBe(true);
        expect(agreement.getAnswer()).toBe(true);
    }
    })

    test("answer appointment agreement - success", ()=>{
       expect(s1.answerAppointmentAgreement("Nofar", "Shahar", true)).toThrow("Only an exist shop owner can approve the appointment of a new shop owner");
    })

    test("getDisc", ()=>{
        let discountInf1: discountInf = {type:DiscountType.Category, object:ProductCategory.A} as discountInf;
        let disc1 = new SimpleDiscount(0, discountInf1, 5);
       // s1.discounts.set(disc1.id, disc1);
        let disc = s1.getDiscount(0);
        expect(disc).not.toBeUndefined();
    })
})



