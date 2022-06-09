import {ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";


let bag: ShoppingBag;
const shopID: number = 1;
const product: Product = new Product("product", 1, 0, ProductCategory.A, 10);
const quantity: number = 5;
const newQuantity: number = 10;

describe('SecurityController - tests', function () {

    beforeEach(function () {
        bag = new ShoppingBag(shopID);
    })

    test("Add SimpleProduct - valid input", () => {
        bag.addProduct(product, quantity);
        let [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theProduct.id).toEqual(product.id);
    })

    test("Remove SimpleProduct - valid input", () => {
        //valid add
        bag.addProduct(product, quantity);
        let [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theProduct.id).toEqual(product.id);

        bag.removeProduct(product);
        expect(bag.products.get(1)).not.toBeDefined();
    })

    test("Remove SimpleProduct - non-existing product", () => {
        expect(function() {bag.removeProduct(product)}).toThrow(new Error("Failed to remove product because the product wasn't found in bag."));
    })

    test("Update SimpleProduct Quantity - valid input", () => {
        //valid add
        bag.addProduct(product, quantity);
        let [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theProduct.id).toEqual(product.id);

        bag.updateProductQuantity(product, newQuantity);
        [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theQuantity).toEqual(newQuantity);
    })

    test("Update SimpleProduct Quantity - product does not exist", () => {
        expect(function() {bag.updateProductQuantity(product, newQuantity)}).toThrow(new Error("Failed to update product because the product wasn't found in bag."));
    })
});
