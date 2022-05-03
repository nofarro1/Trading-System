import {Shop} from "../../../src/domain/marketplace/Shop";
import {Product} from "../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../src/utilities/Enums";
import exp from "constants";

class TestShop extends Shop{
    constructor(shop: Shop) {
        super(shop.id, shop.name, shop.shopFounder);
    }
}
const s1:Shop= new Shop(0, "Mega", "ofir");
//const p1:Product= new Product("cotage",s1.id, ProductCategory.A, "Yami chees", 5.9, 5.9);

describe('Shop- products', function(){
    test('add un-exist product', ()=>{
        s1.addProduct("cotage",s1.id, ProductCategory.A, "Yami chees", 5.9, 5.9, 1);
        expect(s1.products.keys()).toContain(0);
        expect(s1.products.get(0)).toContain([s1.getProduct(0),1]);
    })
    test('add twice the same product', ()=>{s1.addProduct(p1.name, s1.id, p1.category, p1.description, p1.fullPrice, p1.discountPrice, 2)
    expect(s1.products).toContain(p1.id);
    expect(s1.products.get(p1.id)).toContain([p1,1]);
    })

    test('remove existing product', ()=>{s1.removeProduct(p1.id)
        expect(s1.products).not.toContain(p1.id);
    })
    test('remove not existing product', () => {
        expect(function(){s1.removeProduct(p1.id)}).toThrow(new Error(`Failed to remove product, because product id: ${p1.id} was not found`));
    })
    // test('add un-exist product', ()=>{s1.addProduct(p1.name, s1.id, p1.category, p1.description, p1.fullPrice, p1.discountPrice, 1)
    //     expect(s1.products).toContain(p1.id);
    //     expect(s1.products.get(p1.id)).toContain([p1,1]);
    // })

})



