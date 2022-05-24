import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";


let shoppingCart: ShoppingCart;
let shop1: Shop = new Shop(1, "Super Shop", "Mario");
let shop2: Shop = new Shop(2, "Mega Shop", "Luigi");
let shoppingBag1: ShoppingBag = new ShoppingBag(1);
let product1: Product = new Product("Pizza", 1, ProductCategory.A, 15);
let product11: Product = new Product("Sparkling Water", 1, ProductCategory.A, 7);

describe("Shopping Cart - unit tests", function () {

    beforeEach(function () {
        shoppingCart = new ShoppingCart();
    })

    test("Remove Product - invalid input non-existent bag", () => {
        expect(function() { shoppingCart.removeProduct(product1) }).toThrow(new Error("Failed to remove product because the needed bag wasn't found"));
    })

    test("Empty Bag - valid input", () => {
        const quantity: number = 10;

        //add shopping bags
        shoppingCart.bags.set(shop1.id, shoppingBag1);
        shoppingCart.bags.set(shop2.id, shoppingBag1);
        //add products to shopping bag
        shoppingCart.bags.get(shop1.id)?.products.set(product1.id, [product1, quantity]);
        shoppingCart.bags.get(shop1.id)?.products.set(product11.id, [product11, quantity]);

        shoppingCart.emptyBag(shop1.id);
        expect(shoppingCart.bags.get(shop1.id)).toBeUndefined();
        expect(shoppingCart.bags.get(shop2.id)).toBeDefined();
    })

    test("Empty Bag - invalid shop ID", () => {
        let invalidShopID: number = 15;

        shoppingCart.emptyBag(invalidShopID);
        expect(shoppingCart.bags.get(invalidShopID)).toBeUndefined();
    })

    test("Empty Cart", () => {
        const quantity: number = 10;

        //add shopping bags
        shoppingCart.bags.set(shop1.id, shoppingBag1);
        shoppingCart.bags.set(shop2.id, shoppingBag1);
        //add products to shopping bag
        shoppingCart.bags.get(shop1.id)?.products.set(product1.id, [product1, quantity]);
        shoppingCart.bags.get(shop1.id)?.products.set(product11.id, [product11, quantity]);

        shoppingCart.emptyCart();
        expect(shoppingCart.bags.get(shop1.id)).toBeUndefined();
        expect(shoppingCart.bags.get(shop2.id)).toBeUndefined();
    })

    test("Update Product Quantity - non-existent bag", () => {
        const quantity: number = 10;

        expect(function() { shoppingCart.updateProductQuantity(product1, quantity) }).toThrow(new Error("Failed to update product's quantity because the needed bag wasn't found"));
    })
})