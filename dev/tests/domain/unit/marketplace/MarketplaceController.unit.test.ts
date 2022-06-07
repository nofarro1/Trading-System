import {Product} from "../../../../src/domain/marketplace/Product";
import {FilterType, ProductCategory, SearchType, ShopStatus} from "../../../../src/utilities/Enums";
import {MarketplaceController} from "../../../../src/domain/marketplace/MarketplaceController";
import {Range} from "../../../../src/utilities/Range";
import {Shop} from "../../../../src/domain/marketplace/Shop";


describe("MarketPlaceController unit", ()=>{
    let controller: MarketplaceController;
    let p1: Product = new Product("Ski", 0, ProductCategory.A, 5.9, undefined,"Yami chees");
    let p2: Product  = new Product("Cottage", 0, ProductCategory.A,  6, undefined, "Yami chees");
    let shop1: Shop;
    let shop2: Shop;

    beforeEach(()=>{
        controller = new MarketplaceController();
        shop1 = new Shop(0,"OfirPovi", "Ofir's shop");
        shop2 = new Shop(1, "NofarRoz", "Nofar's shop");
        controller.shops= new Map();
        // @ts-ignore
        controller.shops.set(0, shop1).get(0).products.set(0, [p1,1]);
        // @ts-ignore
        controller.shops.set(1, shop2).get(1).products.set(1, [p2,2]);
    })

    test("SetUpShop", ()=>{
        let shop_res= controller.setUpShop("OfirPovi", "Ofir's shop");
        expect(shop_res.ok).toBe(true);
        if(shop_res.data){
            expect(controller.shops.has(shop_res.data.id)).toBe(true);
            let actual=controller.shops.get(shop_res.data.id);
            expect(actual).toEqual(shop_res.data);
        }
    })

    test("CloseShop", ()=>{
        controller.closeShop("OfirPovi", 0);
        expect(shop1.status).toBe(ShopStatus.close);
    })

    test("reopenShop", ()=>{
        shop1.status= ShopStatus.close;
        controller.reopenShop("OfirPovi", 0);
        expect(shop1.status).toBe(ShopStatus.open);
    })

    test("Add product to shop - valid input", ()=>{
        let p3 = controller.addProductToShop(0, ProductCategory.B, "Cottage", 3, 5.9);
        if(p3.data){
            let product_tupl = shop1.products.get(p3.data.id);
            if(product_tupl){
                let actual_quantity = product_tupl[1];
                expect(actual_quantity).toEqual(3);
            }
         }
    })

    test("Add product to shop - invalid input", ()=>{
            let res = controller.addProductToShop(0, ProductCategory.B, "Simphonia", -1, 6);
            expect(res.ok).toBe(false);
    })

    test( "Remove product to shop", ()=> {
            let res = controller.removeProductFromShop(0, 0);
            expect(res.ok).toBe(true);
            expect(shop1.products.has(0)).toBe(false);
    })

    test("update product quantity", ()=>{
            controller.updateProductQuantity(0, 0, 4);
            let actual_tuple = shop1.products.get(0);
            if(actual_tuple)
                expect(actual_tuple[1]).toEqual(4);

    })

    test("Appoint shop owner", ()=>{
            let res= controller.appointShopOwner("EladIn", 0);
            expect(res.ok).toBe(true);
            expect(shop1.shopOwners.has("EladIn")).toBe(true);
    })

    test("Appoint shop Manager", ()=>{
            let res= controller.appointShopManager("ShaharAlon", 0);
            expect(res.ok).toBe(true);
            expect(shop1.shopManagers.has("ShaharAlon")).toBe(true);
    })

    test("Show shop products - No Products to show", ()=>{
        shop1.products= new Map();
            let res = controller.showShopProducts(shop1.id);
            expect(res.message).toBe("No products to show");
    })

    test("Show shop products - There is Products to show", ()=>{
            let res = controller.showShopProducts(shop1.id);
            if(res.data)
                    expect(res.data).toEqual(shop1.products);
    })

    test("Search product - By Name", ()=>{
            let search_res = controller.searchProduct(SearchType.productName, "Ski");
                expect(search_res.data.length).toBe(1);
    })

    test("Search product - By keyword", ()=>{
            let search_res = controller.searchProduct(SearchType.keyword, "chees");
            expect(search_res.data.length).toBe(2);
    })

    test("filter product- By price ", ()=>{
                let filter_res = controller.filterProducts(FilterType.price, new Range(5, 5.9), [p1, p2]);
                if(filter_res.data) {
                    expect(filter_res.data).toEqual([p1]);
                }
    })

    test("sort product -By category", ()=>{
                let filter_res = controller.filterProducts(FilterType.category, ProductCategory.A, [p1, p2]);
                if(filter_res.data){
                    expect(filter_res.data).toEqual([p1,p2]);
        }
    })
})