import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Product} from "../../../../src/domain/marketplace/Product";
import {ProductCategory} from "../../../../src/utilities/Enums";

const mockInstance = (dependency: string) => {
    jest.mock(dependency)
}

const mockMethod = <T extends {}>(obj: T, method: any, todoInstead: ((...args: jest.ArgsType<any>) => ReturnType<any>) | undefined) => {
    return jest.spyOn(obj, method).mockImplementation(todoInstead)
}

const clearMocks = (...mocks: jest.SpyInstance<any, unknown[]>[]) => {
    for (const mock of mocks) {
        mock.mockClear()
    }
}

class TestShop extends Shop{
    constructor(shop: Shop) {
        super(shop.id, shop.name, shop.shopFounder);
    }
}
mockInstance("../../../src/domain/marketplace/Shop")
let s1:Shop;
let p1: Product;
//const p1:SimpleProduct= new SimpleProduct("cotage",s1.id, ProductCategory.A, "Yami chees", 5.9, 5.9);

describe('SimpleShop- products', function(){
    beforeEach(function(){
        s1= new Shop(0, "Mega", "ofir");
    })

    test('add un-exist product', ()=>{
        s1.addProduct("cotage",s1.id, ProductCategory.A, 5.9, 5.9, 1, undefined, "Yami chees");
        expect(s1.products.keys()).toContain(0);
        p1= s1.getProduct(0);
        expect(s1.products.get(0)).toEqual([p1,1]);
    })

    test('remove existing product', ()=>{
        // let removemockMethod = mockMothod(Shop.prototype,'addProduct',()=>{
        //     let products = s1.products
        //     products.push(p1);
        //     return p1;
        // })
        s1.addProduct("cotage",s1.id, ProductCategory.A, 5.9, 5.9, 1, undefined,"Yami chees",);
        p1= s1.getProduct(0);
        s1.removeProduct(p1.id)
        expect(s1.products.keys()).not.toContain(p1.id);

        //clearMocks(removemockMethod)
    })

    test('remove not existing product', () => {
        expect(function(){s1.removeProduct(p1.id)}).toThrow(new Error(`Failed to remove product, because product id: ${p1.id} was not found`));
    })

    test('update product quantity', ()=>{
        s1.addProduct("cottage",s1.id, ProductCategory.A, 5.9, 5.9, 1,undefined, "Yami chees");
        s1.updateProductQuantity(0, 2);
        p1= s1.getProduct(0);
        expect(s1.products.get(0)).toEqual([p1, 2]);
    })
})

describe('SimpleShop- Appointed Members', function(){
    beforeEach(function(){
        s1= new Shop(0, "Mega", "ofir");
    })

    test('appointShopOwner', () =>{
        s1.appointShopOwner("Nofar");
        expect(s1.shopOwners.values()).toContain("Nofar");
    })

    test('appointShopManager', () =>{
        s1.appointShopOwner("Idan");
        expect(s1.shopOwners.values()).toContain("Idan");
    })
})



