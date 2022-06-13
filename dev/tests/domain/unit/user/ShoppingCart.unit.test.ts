import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";
import {clearMocks, mockDependencies, mockInstance, mockMethod} from "../../../mockHelper";


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


})