import {ShoppingBag} from "../../../../src/domain/marketplace/ShoppingBag";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";


describe('SecurityController - tests', function () {
    let bag: ShoppingBag;
    const shopID: number = 1;
    const product: Product = new Product("product", 1, ProductCategory.A,  10, 10);
    const quantity: number = 5;
    const newQuantity: number = 10;

    beforeEach(function () {
        bag = new ShoppingBag(shopID);
    })

    test("Add SimpleProduct - valid input", () => {
        bag.addProduct(product, quantity);
        let [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theProduct.id).toEqual(product.id);
    })

    test("Remove SimpleProduct - valid input", () => {
        bag.products.set(product.id,[product,1]);
        bag.removeProduct(product);
        expect(bag.products.has(product.id)).toBe(false);
    })

    test("Remove SimpleProduct - non-existing product", () => {
        bag.products= new Map();
        expect(function() {bag.removeProduct(product)}).toThrow(new Error("Failed to remove product because the product wasn't found in bag."));
    })

    test("Update SimpleProduct Quantity - valid input", () => {
        bag.products= new Map<number, [Product, number]>().set(product.id, [product,1]);
        bag.updateProductQuanity(product, newQuantity);
        // @ts-ignore
        expect(bag.products.get(product.id)[1]).toEqual(newQuantity);
    })

    test("Update SimpleProduct Quantity - product does not exist", () => {
        expect(function() {bag.updateProductQuanity(product, newQuantity)}).toThrow(new Error("Failed to update product because the product wasn't found in bag."));
    })
});
