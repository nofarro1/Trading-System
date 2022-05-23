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

    test("Add Product - valid input", () => {
        bag.addProduct(product, quantity);
        let [theProduct, theQuantity] = <[Product, number]> bag.products.get(product.id);
        expect(theProduct.id).toEqual(product.id);
    })

    test("Remove Product - valid input", () => {
        bag.products.set(product.id,[product,1]);
        bag.removeProduct(product);
        expect(bag.products.has(product.id)).toBe(false);
    })

    test("Remove Product - non-existing product", () => {
        bag.products = new Map<number, [Product, number]>();
        expect(function() {bag.removeProduct(product)}).toThrow(new Error("Failed to remove product because the product wasn't found in bag."));
    })

    test("Update Product Quantity - valid input", () => {
        bag.products = new Map<number, [Product, number]>().set(product.id, [product, newQuantity]);
        expect(bag.products.get(product.id)).toStrictEqual([product, newQuantity]);
    })

    test("Update Product Quantity - product does not exist", () => {
        expect(function() {bag.updateProductQuantity(product, newQuantity)}).toThrow(new Error("Failed to update product because the product wasn't found in bag."));
    })
});
