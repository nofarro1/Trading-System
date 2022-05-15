import {ShoppingBag} from "../../../src/domain/marketplace/ShoppingBag";
import {Product} from "../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../src/utilities/Enums";


let bag: ShoppingBag;
const shopID: number = 1;
const product: Product = new Product("product", 1, ProductCategory.A, "", 10, 10);
const quantity: number = 5;
const newQuantity: number = 10;

describe('SecurityController - tests', function () {

    beforeEach(function () {
        bag = new ShoppingBag(shopID);
    })

    test("Add Product - valid input", () => {
        bag.addProduct(product, quantity);
        let [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theProduct.id).toEqual(product.id);
    })

    test("Remove Product - valid input", () => {
        //valid add
        bag.addProduct(product, quantity);
        let [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theProduct.id).toEqual(product.id);

        bag.removeProduct(product);
        expect(bag.products.get(1)).not.toBeDefined();
    })

    test("Remove Product - non-existing product", () => {
        expect(function() {bag.removeProduct(product)}).toThrow(new Error("Failed to remove product because the product wasn't found in bag."));
    })

    test("Update Product Quantity - valid input", () => {
        //valid add
        bag.addProduct(product, quantity);
        let [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theProduct.id).toEqual(product.id);

        bag.updateProductQuanity(product, newQuantity);
        [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theQuantity).toEqual(newQuantity);
    })

    test("Update Product Quantity - product does not exist", () => {
        expect(function() {bag.updateProductQuanity(product, newQuantity)}).toThrow(new Error("Failed to update product because the product wasn't found in bag."));
    })
});
