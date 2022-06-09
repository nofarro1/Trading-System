import {ShoppingCartController} from "../../../../src/domain/user/ShoppingCartController";
import {Member} from "../../../../src/domain/user/Member";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";
import {Result} from "../../../../src/utilities/Result";


let shoppingCartController: ShoppingCartController;
const member: Member = new Member("1", "Mario");
const quantity: number = 10;
const product1: Product = new Product("Pizza", 1, 0, ProductCategory.A, 15);
const product2: Product = new Product("Sparkling Water", 1, 0, ProductCategory.A, 7);

describe("Shopping Cart - unit tests", function () {
    beforeEach(function () {
        shoppingCartController = new ShoppingCartController();
    })

    test("Add Product - valid input", () => {
        //prepare
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();

        //act
        shoppingCartController.addProduct(member.username, product1, quantity);

        //assert
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product1.shopId)?.products.get(product1.id)).toStrictEqual([product1, quantity]);
    })

    test("Add Product", () => {
        //TODO test with sales
    })

    test("Remove Product - valid input empty bag", () => {
        //prepare
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();
        //add product
        shoppingCartController.addProduct(member.username, product1, quantity);
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product1.shopId)?.products.get(product1.id)).toStrictEqual([product1, quantity]);

        //act
        shoppingCartController.removeProduct(member.username, product1);

        //assert
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product1.shopId)).toBeUndefined();
    })

    test("Remove Product - valid input non-empty bag", () => {
        //prepare
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();
        //add products
        shoppingCartController.addProduct(member.username, product1, quantity);
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product1.shopId)?.products.get(product1.id)).toStrictEqual([product1, quantity]);
        shoppingCartController.addProduct(member.username, product2, quantity);
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product2.shopId)?.products.get(product2.id)).toStrictEqual([product2, quantity]);

        //act
        shoppingCartController.removeProduct(member.username, product1);

        //assert
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product2.shopId)?.products.get(product2.id)).toStrictEqual([product2, quantity]);
    })

    test("Remove Product - invalid bag no bags", () => {
        //prepare
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();

        //act
        //assert
        expect(shoppingCartController.removeProduct(member.username, product1).ok).toBeFalsy();
    })

    test("Remove Product - invalid bag existing bags", () => {
        //prepare
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();
        //add product
        shoppingCartController.addProduct(member.username, product2, quantity);
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product2.shopId)?.products.get(product2.id)).toStrictEqual([product2, quantity]);

        //act
        shoppingCartController.removeProduct(member.username, product1);
        //assert
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product1.id)).toBeUndefined();
    })

    test("Update Product Quantity - valid input", () => {
        //prepare
        const newQuantity: number = 100;
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();
        //add product
        shoppingCartController.addProduct(member.username, product1, quantity);
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product1.shopId)?.products.get(product1.id)).toStrictEqual([product1, quantity]);

        //act
        shoppingCartController.updateProductQuantity(member.username, product1, newQuantity);

        //assert
        expect(shoppingCartController.carts.get(member.username)?.bags.get(product1.shopId)?.products.get(product1.id)).toStrictEqual([product1, newQuantity]);
    })

    test("Update Product Quantity - invalid bag", () => {
        //prepare
        const newQuantity: number = 100;
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();

        //act
        //assert
        expect(shoppingCartController.updateProductQuantity(member.username, product1, newQuantity).ok).toBeFalsy();
    })

    test("Empty Cart - valid input", () => {
        //prepare
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();

        //act
        //assert
        expect(shoppingCartController.emptyCart(member.username)).toStrictEqual(new Result(true,  undefined, `${member.username}'s cart was successfully emptied.`));
        expect(shoppingCartController.carts.get(member.username)?.bags.size).toBe(0);
    })

    test("Empty Bag - valid input", () => {
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();
    })
})