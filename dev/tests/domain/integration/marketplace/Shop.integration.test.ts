import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {
    DiscountRelation,
    DiscountType,
    ProductCategory,
    RelationType,
    SimplePolicyType
} from "../../../../src/utilities/Enums";
import {ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {Guest} from "../../../../src/domain/user/Guest";
import {
    ConditionalDiscountData,
    ContainerDiscountData,
    SimpleDiscountData,
    SimplePurchaseData
} from "../../../../src/utilities/DataObjects";
import {add} from "winston";
import {Offer} from "../../../../src/domain/user/Offer";
import {AppointmentAgreement} from "../../../../src/domain/marketplace/AppointmentAgreement";

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
        expect(()=>{s1.removeProduct(0)}).toThrow(new Error(`Failed to remove product, because product id: ${0} was not found`));
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
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        p2= s1.addProduct("ski", ProductCategory.A, 6,  1, "Yami chees");
        bag.addProduct(p1, 2);
        bag.addProduct(p2, 1);
        let disc1 = new SimpleDiscountData( DiscountType.Product, p1.id, 20);
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
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        p2= s1.addProduct("ski", ProductCategory.A, 6,  1, "Yami chees");
        bag.addProduct(p1, 2);
        bag.addProduct(p2, 1);
        let disc1 = new SimpleDiscountData(DiscountType.Product, p1.id, 20);
        s1.addDiscount(disc1);
        let disc2 = new SimpleDiscountData(DiscountType.Bag, undefined, 10);
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
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        p2= s1.addProduct("ski", ProductCategory.A, 6,  1, "Yami chees");
        bag.addProduct(p1, 2);
        bag.addProduct(p2, 1);
        let disc1 = new SimpleDiscountData(DiscountType.Bag, undefined, 5);
        let disc2 = new SimpleDiscountData(DiscountType.Product, p1.id, 5);
        let cond1 = new ConditionalDiscountData(disc1, DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let cond2 = new ConditionalDiscountData(disc2, DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
        let andDisc = new ContainerDiscountData(DiscountRelation.And, [cond1, cond2]);
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
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        p2= s1.addProduct("ski", ProductCategory.A, 6,  1, "Yami chees");
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 1);
        let disc1 = new SimpleDiscountData(DiscountType.Bag, undefined, 5);
        let disc2 = new SimpleDiscountData(DiscountType.Product, p1.id,5);
        let cond1 = new ConditionalDiscountData(disc1, DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let cond2 = new ConditionalDiscountData(disc2, DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
        let andDisc = new ContainerDiscountData(DiscountRelation.And, [cond1, cond2]);
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
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        p2= s1.addProduct("ski", ProductCategory.A, 6,  1, "Yami chees");
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 1);
        let disc1 = new SimpleDiscountData(DiscountType.Bag, undefined, 5);
        let cond1 = new ConditionalDiscountData(disc1, DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let disc2 = new SimpleDiscountData(DiscountType.Category, ProductCategory.A, 5);
        let cond2 = new ConditionalDiscountData(disc2, DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
        let OrDisc = new ContainerDiscountData(DiscountRelation.Or, [cond1, cond2]);
        s1.addDiscount(OrDisc);
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        let totalPrice=0;
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(11.305);
    })

    test('calculateBagPrice- OrDiscount, does not need to apply', ()=>{
        let bag = new ShoppingBag(0);
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        p2= s1.addProduct("ski", ProductCategory.A, 6,  1, "Yami chees");
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 0);
        let disc1 = new SimpleDiscountData(DiscountType.Bag, undefined, 5);
        let cond1 = new ConditionalDiscountData(disc1, DiscountType.Product, p1.id, RelationType.GreaterThenOrEqual, 2);
        let disc2 = new SimpleDiscountData(DiscountType.Category, ProductCategory.A, 5);
        let cond2 = new ConditionalDiscountData(disc2, DiscountType.Product, p2.id, RelationType.GreaterThenOrEqual, 1);
        let OrDisc = new ContainerDiscountData(DiscountRelation.Or,[cond1, cond2]);
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
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        p2= s1.addProduct("ski", ProductCategory.A, 6,  1, "Yami chees");
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 1);
        let disc1 = new SimpleDiscountData(DiscountType.Category, ProductCategory.A, 5);
        let disc2 = new SimpleDiscountData(DiscountType.Category, ProductCategory.B, 10);
        let maxDisc = new ContainerDiscountData(DiscountRelation.Max, [disc1, disc2]);

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
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        p2= s1.addProduct("ski", ProductCategory.A, 6,  1, "Yami chees");
        bag.addProduct(p1, 1);
        bag.addProduct(p2, 1);
        let disc1 = new SimpleDiscountData(DiscountType.Category, ProductCategory.A, 5);
        let disc2 = new SimpleDiscountData(DiscountType.Bag, undefined, 10);
        let additionDisc = new ContainerDiscountData(DiscountRelation.Addition, [disc1, disc2]);
        s1.addDiscount(additionDisc);
        let totalPrice=0;
        let productsUpdatePrices= s1.calculateBagPrice(bag);
        for( let [p, price, quantity] of productsUpdatePrices){
            totalPrice += price* quantity;
        }
        expect(totalPrice).toBeCloseTo(10.115);
    })

    test('camMakePurchase- simplePurchase. Could make purchase.', ()=>{
        let cart = new ShoppingCart("shopping-cart");
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        cart.addProduct(p1, 2);
        let bag = cart.bags.get(0);
        let user = new Guest("1");
        let simplePolicy = new SimplePurchaseData(SimplePolicyType.Product, p1.id, RelationType.LessThenOrEqual, 5,"Couldn't continue with checkout because the quantity of 'ski' cheese is more the 5.");
        s1.addPurchasePolicy(simplePolicy);
        let ans = s1.canMakePurchase([bag, user]);
        expect(ans.ok).toBe(true);
    })

    test("canMakePurchase- simplePurchase. Couldn't make purchase.", ()=>{
        let cart = new ShoppingCart("shopping-cart");
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        cart.addProduct(p1, 6);
        let bag = cart.bags.get(0);
        let user = new Guest("1");
        let simplePolicy = new SimplePurchaseData(SimplePolicyType.Product, p1.id, RelationType.LessThenOrEqual, 5, "The quantity of 'ski' cheese is more the 5.");
        s1.addPurchasePolicy(simplePolicy);
        let ans = s1.canMakePurchase([bag, user]);
        expect(ans.ok).toBe(false);
        expect(ans.message).toBe("Couldn't make purchase because:\nThe quantity of 'ski' cheese is more the 5.");
    })

    test("canMakePurchase- simplePurchase. Couldn't make purchase.", ()=>{
        let cart = new ShoppingCart("shopping-cart");
        cart.addProduct(p1, 5);
        let bag = cart.bags.get(0);
        let user = new Guest("1");
        let simplePolicy = new SimplePurchaseData(SimplePolicyType.Category, p1.category, RelationType.Equal, 5,"The quantity of 'ski' cheese is more the 5.");
        s1.addPurchasePolicy(simplePolicy);
        let ans = s1.canMakePurchase([bag, user]);
        expect(ans.ok).toBe(true);
    })

    test("offer status - isDone + setAnswer", ()=>{
        let offer = new Offer(s1.offerCounter, "nofar", s1.id, 0, 4.5, s1.shopOwners);
        s1.offers.set(s1.offerCounter, offer);
        expect(offer.isDone()).toBe(false);
        s1.answerOffer(offer.id, s1.shopFounder, true);
        expect(offer.isDone()).toBe(true);
        expect(offer.answer).toBe(true);
        s1.answerOffer(offer.id, s1.shopFounder, false);
        expect(offer.isDone()).toBe(true);
        expect(offer.answer).toBe(false);
    })

    test("Offer's logic- offer approved", ()=>{
        p1= s1.addProduct("cotage", ProductCategory.A, 5.9,  2, "Yami chees");
        let offer: Offer = s1.addOfferPrice2Product("Nofar", p1.id, 3.5);
        expect(s1.offers.has(offer.id));
        s1.answerOffer(offer.id, "ofir", true);
        expect(offer.isDone()).toBe(true);
        expect(offer.answer).toBe(true);
    })

    test("Offer's logic- offer not approved", ()=>{
        p1= s1.addProduct("cottage", ProductCategory.A, 5.9,  2, "Yami chees");
        let offer: Offer = s1.addOfferPrice2Product("Nofar", p1.id, 3.5);
        expect(s1.offers.has(offer.id));
        s1.answerOffer(offer.id, "ofir", false);
        expect(offer.isDone()).toBe(true);
        expect(offer.answer).toBe(false);
    })

    test("Offer's logic-filing counter offer - accepted by member and approved by owner", ()=>{
        p1= s1.addProduct("cottage", ProductCategory.A, 5.9,  2, "Yami chees");
        let offer: Offer = s1.addOfferPrice2Product("Nofar", p1.id, 3.5);
        expect(s1.offers.has(offer.id));
        expect(s1.hasOffer(p1.id)).toBe(3.5);
        expect(s1.answerOffer(offer.id, s1.shopFounder, false));
        expect(offer.isDone()).toBe(true);
        s1.filingCounterOffer(offer.id, "ofir", 2.5);
        expect(offer.price).toBe(2.5);
        s1.acceptCounterOfferByMember(p1.id);
        expect(offer.isDone()).toBe(false);
        s1.answerOffer(offer.id, s1.shopFounder, true);
        expect(offer.isDone()).toBe(true);
        expect(offer.answer).toBe(true);
    })

    test("Appointment agreement submitted - success", ()=>{
        let agreement:AppointmentAgreement | void = s1.submitOwnerAppointment("Nofar", "ofir");
        expect(s1.appointmentAgreements.has(agreement.member)).toBe(true);
        agreement = s1.answerAppointmentAgreement("Nofar", "ofir", true);
        if(agreement){
            expect(agreement.isDone()).toBe(true);
            expect(agreement.getAnswer()).toBe(true);
        }
    })
})



