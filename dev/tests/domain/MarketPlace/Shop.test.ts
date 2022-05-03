import {Shop} from "../../../src/domain/marketplace/Shop";
import {Product} from "../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../src/utilities/Enums";
import exp from "constants";
import {MarketplaceController} from "../../../src/domain/marketplace/MarketplaceController";

class TestShop extends Shop{
    constructor(shop: Shop) {
        super(shop.id, shop.name, shop.shopFounder);
    }
}
let s1:Shop;
let p1: Product;
//const p1:Product= new Product("cotage",s1.id, ProductCategory.A, "Yami chees", 5.9, 5.9);

describe('Shop- products', function(){
    beforeEach(function(){
        s1= new Shop(0, "Mega", "ofir");
    })

    test('add un-exist product', ()=>{
        s1.addProduct("cotage",s1.id, ProductCategory.A, "Yami chees", 5.9, 5.9, 1);
        expect(s1.products.keys()).toContain(0);
        p1= s1.getProduct(0);
        expect(s1.products.get(0)).toEqual([p1,1]);
    })

    test('remove existing product', ()=>{
        s1.addProduct("cotage",s1.id, ProductCategory.A, "Yami chees", 5.9, 5.9, 1);
        p1= s1.getProduct(0);
        s1.removeProduct(p1.id)
        expect(s1.products.keys()).not.toContain(p1.id);
    })

    test('remove not existing product', () => {
        expect(function(){s1.removeProduct(p1.id)}).toThrow(new Error(`Failed to remove product, because product id: ${p1.id} was not found`));
    })

    test('update product quantity', ()=>{
        s1.addProduct("cotage",s1.id, ProductCategory.A, "Yami chees", 5.9, 5.9, 1);
        s1.updateProductQuantity(0, 2);
        p1= s1.getProduct(0);
        expect(s1.products.get(0)).toEqual([p1, 2]);
    })
})



