import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";


let shoppingCart: ShoppingCart;
let shop1: Shop ;
let product1: Product;
let product11: Product;

describe("Shopping Cart - unit tests", function () {
    beforeEach(function () {
         shoppingCart = new ShoppingCart("username");
         shop1= new Shop(1, "Super Shop", "Mario");
         product1 = new Product("Pizza", 1, 0, ProductCategory.A, 15);
         product11 = new Product("Pizza 2", 1, 1, ProductCategory.A, 15);
    })

    test("Add Product - valid input", () => {
        const quantity: number = 8;
        shoppingCart.addProduct(product1, quantity);
        expect(shoppingCart.bags.get(shop1.id)?.shopId).toBe(shop1.id);
        expect(shoppingCart.bags.get(shop1.id)?.products.get(product1.id)).toEqual([product1, quantity]);
    })

    test("Remove Product - valid input empty bag", () => {
        const quantity: number = 8;

        //add product
        shoppingCart.addProduct(product1, quantity);

        shoppingCart.removeProduct(product1);
        expect(shoppingCart.bags.get(shop1.id)).toBeUndefined();
    })

    test("Remove Product - valid input contains products", () => {
        const quantity: number = 10;

        //add products to shopping bag
        shoppingCart.addProduct(product1, quantity);
        shoppingCart.addProduct(product11, quantity);

        shoppingCart.removeProduct(product11);
        expect(shoppingCart.bags.get(shop1.id).products.keys()).toContain(product1.id);
        expect(shoppingCart.bags.get(shop1.id).products.keys()).not.toContain(product11.id);
    })

    test("Remove Product - invalid input non-existent product", () => {
        const quantity: number = 10;

        //add products to shopping bag
        shoppingCart.addProduct(product11, quantity);

        shoppingCart.removeProduct(product1);
        expect(shoppingCart.bags.get(shop1.id).products.get(product1.id)).toBeUndefined();
    })


    test("Update Product Quantity - valid input", () => {
        const quantity: number = 10;
        const newQuantity: number = 100;

        //add products to shopping bag
        shoppingCart.addProduct(product1, quantity);

        shoppingCart.updateProductQuantity(product1, newQuantity);
        expect(shoppingCart.bags.get(shop1.id)?.products.get(product1.id)).toStrictEqual([product1, newQuantity]);
    })
})