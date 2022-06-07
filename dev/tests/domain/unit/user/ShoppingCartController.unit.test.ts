import {ShoppingCartController} from "../../../../src/domain/user/ShoppingCartController";
import {Member} from "../../../../src/domain/user/Member";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Result} from "../../../../src/utilities/Result";


let shoppingCartController: ShoppingCartController;
const member: Member = new Member("1", "Mario");
const shop: Shop = new Shop(1, "THE Shop", "Luigi");
const quantity: number = 10;
const product: Product = new Product("Pizza", 1, ProductCategory.A, 15);

describe("Shopping Cart - unit tests", function () {
    beforeEach(function () {
        shoppingCartController = new ShoppingCartController();
    })

    test("Add Product - invalid cart", () => {
        expect(shoppingCartController.addProduct(member.username, product, quantity)).toStrictEqual(new Result(false, undefined, "Failed to addProduct to cart because the needed cart wasn't found"));
    })

    test("Remove Product - invalid cart", () => {
        expect(shoppingCartController.removeProduct(member.username, product)).toStrictEqual(new Result(false, undefined, "Failed to remove product from cart because the needed cart wasn't found"));
    })

    test("Add Cart - valid input", () => {
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();
    })

    test("Remove Cart - valid input", () => {
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();

        //act
        shoppingCartController.removeCart(member.username);

        //assert
        expect(shoppingCartController.carts.get(member.username)).toBeUndefined();
    })

    test("Remove Cart - non-existing cart", () => {
        expect(shoppingCartController.removeCart(member.username)).toStrictEqual(new Result(false, undefined, `Failed to delete ${member.username}'s cart, because the cart was not found.`));
    })

    test("Get Cart - valid input", () => {
        //add cart
        shoppingCartController.addCart(member.username);
        expect(shoppingCartController.carts.get(member.username)).toBeDefined();

        //act
        //assert
        expect(shoppingCartController.getCart(member.username).data).toBe(shoppingCartController.carts.get(member.username));
    })

    test("Get Cart - invalid username", () => {
        expect(shoppingCartController.getCart(member.username)).toStrictEqual(new Result(false, undefined, `Failed to returned ${member.username}'s cart, because the cart was not found.`));
    })

    test("Empty Cart - invalid username", () => {
        expect(shoppingCartController.emptyCart(member.username)).toStrictEqual(new Result(false, undefined, `Failed to empty ${member.username}'s cart, because the cart wasn't found`));
    })

    test("Empty Bag - invalid username", () => {
        expect(shoppingCartController.emptyBag(member.username, shop.id)).toStrictEqual(new Result(true, undefined, `Tried to empty ${member.username}'s bag in shop with id: ${shop.id}, but the bag wasn't found.`));
    })
})