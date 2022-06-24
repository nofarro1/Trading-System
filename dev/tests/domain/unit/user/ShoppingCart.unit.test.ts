import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";
import {clearMocks, mockDependencies, mockInstance, mockMethod} from "../../../mockHelper";
import {Offer} from "../../../../src/domain/user/Offer";


let cart: ShoppingCart;
let shop1: Shop = new Shop(1, "Super Shop", "Mario");
let shop2: Shop = new Shop(2, "Mega Shop", "Luigi");
let bag1: ShoppingBag = new ShoppingBag(1);
let product1: Product ;
let product11: Product = new Product("Sparkling Water", 1,1, ProductCategory.A, 7);

describe("Shopping Cart - unit tests", ()=> {
    let cart: ShoppingCart;
    beforeAll(()=>{
        mockInstance(mockDependencies.ShoppingBag);
    })

    beforeEach(()=>{
      cart = new ShoppingCart();
      product1  = new Product("Pizza", 1, 0, ProductCategory.A, 15);
    })

    test("Add Product", ()=>{
        const mock_p2b = mockMethod(ShoppingBag.prototype, "addProduct", (toAdd: Product, quantity: number)=>
            bag1.products.set(toAdd.id, [toAdd, quantity]));
        cart.bags = cart.bags.set(1, bag1);
        cart.addProduct(product1, 2);
        expect(cart.bags.get(product1.shopId).products).toEqual((new Map()).set(0, [product1, 2]));
        clearMocks(mock_p2b);
    })

    test("Remove Product", () => {
        const mock_p2b = mockMethod(ShoppingBag.prototype, "addProduct", (toAdd: Product, quantity: number)=>
            bag1.products.set(toAdd.id, [toAdd, quantity]));
        cart.bags = cart.bags.set(1, bag1);
        cart.addProduct(product1, 2);
        cart.removeProduct(product1);
        expect(cart.bags).not.toContain(product1.shopId);
        clearMocks(mock_p2b);
    })

    test("Remove Product - invalid input non-existent bag", () => {
        expect(()=> { cart.removeProduct(product1) }).toThrow(new Error("Failed to remove product because the needed bag wasn't found"));
    })

    test("Empty Bag - valid input", () => {
        const quantity: number = 10;

        //add shopping bags
        cart.bags.set(shop1.id, bag1);
        cart.bags.set(shop2.id, bag1);
        //add products to shopping bag
        cart.bags.get(shop1.id)?.products.set(product1.id, [product1, quantity]);
        cart.bags.get(shop1.id)?.products.set(product11.id, [product11, quantity]);

        cart.emptyBag(shop1.id);
        expect(cart.bags.get(shop1.id)).toBeUndefined();
        expect(cart.bags.get(shop2.id)).toBeDefined();
    })

    test("Empty Bag - invalid shop ID", () => {
        let invalidShopID: number = 15;
        cart.emptyBag(invalidShopID);
        expect(cart.bags.get(invalidShopID)).toBeUndefined();
    })

    test("Empty Cart", () => {
        const quantity: number = 10;

        //add shopping bags
        cart.bags.set(shop1.id, bag1);
        cart.bags.set(shop2.id, bag1);
        //add products to shopping bag
        cart.bags.get(shop1.id)?.products.set(product1.id, [product1, quantity]);
        cart.bags.get(shop1.id)?.products.set(product11.id, [product11, quantity]);

        cart.emptyCart();
        expect(cart.bags.get(shop1.id)).toBeUndefined();
        expect(cart.bags.get(shop2.id)).toBeUndefined();
    })

    test("Update Product Quantity - non-existent bag", () => {
        const mock_p2b = mockMethod(ShoppingBag.prototype, "addProduct", (toAdd: Product, quantity: number)=>
            bag1.products.set(toAdd.id, [toAdd, quantity]));
        cart.bags = cart.bags.set(1, bag1);
        cart.addProduct(product1, 2);

        const mock_update = mockMethod(ShoppingBag.prototype, "updateProductQuantity", (toUpdate: Product, quantity: number)=>
            bag1.products.set(toUpdate.id, [toUpdate, quantity]));
        const quantity: number = 10;
        cart.updateProductQuantity(product1, quantity)
        expect(cart.bags.get(product1.shopId).products.get(product1.id)[1]).toEqual(10);
        clearMocks(mock_p2b,mock_update);
    })

    test("Update Product Quantity - non-existent bag", () => {
        const mock_update = mockMethod(ShoppingBag.prototype, "updateProductQuantity", (toUpdate: Product, quantity: number)=>
            bag1.products.set(toUpdate.id, [toUpdate, quantity]));
        const quantity: number = 10;
        expect(function() { cart.updateProductQuantity(product1, quantity) }).toThrow(new Error("Failed to update product's quantity because the needed bag wasn't found"));
        clearMocks(mock_update);
    })

    test("add offer to cart", ()=>{
        let offer = new Offer(0, "NofarRoz", shop1.id, 0, 4.5, shop1.shopOwners)
        cart.addOffer(offer);
        expect(cart.offers).toHaveLength(1);
        expect(cart.offers).toContain(offer);
    })

    test("remove offer from cart", ()=>{
        let offer1= new Offer(0, "NofarRoz", shop1.id, 0, 4.5, shop1.shopOwners)
        let offer2 = new Offer(0, "NofarRoz", shop1.id, 1, 15.5, shop1.shopOwners)
        cart.offers.push(offer1);
        cart.offers.push(offer2);
        cart.removeOffer(offer1);
        expect(cart.offers).not.toContain(offer1);
        expect(cart.offers).toContain(offer2);
    })

    test("chechOffers", ()=>{
        let offer1= new Offer(0, "NofarRoz", shop1.id, 0, 4.5, shop1.shopOwners)
        let offer2 = new Offer(1, "NofarRoz", shop1.id, 1, 15.5, shop1.shopOwners)
        offer1.getApproves().set("Mario", [true, false]);
        cart.offers.push(offer1);
        cart.offers.push(offer2);
        let res:[Offer[],Offer[]] = cart.checksOffers();
        let res0 = res[0];
        let res1 = res[1];
        expect(res[0]).toContain(offer2);
        expect(res[1]).toContain(offer1);

    })
})
