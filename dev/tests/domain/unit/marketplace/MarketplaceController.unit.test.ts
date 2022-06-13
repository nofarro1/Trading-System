import {Product} from "../../../../src/domain/marketplace/Product";
import {FilterType, ProductCategory, SearchType, ShopStatus} from "../../../../src/utilities/Enums";
import {MarketplaceController} from "../../../../src/domain/marketplace/MarketplaceController";
import {Range} from "../../../../src/utilities/Range";
import {mockDependencies, mockInstance, mockMethod} from "../../../mockHelper";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Result} from "../../../../src/utilities/Result";

let controller: MarketplaceController;
let shop_res: Result<void | Shop>;
let p1: Product;
let  p2: Product;

describe("MarketPlaceController", ()=>{
    beforeAll(()=>{
        mockInstance(mockDependencies.Shop);
    })
    beforeEach(function(){
        controller = new MarketplaceController();
        shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
         p1 = new Product("Ski", 0,0, ProductCategory.A, 5.9);
         p2  = new Product("Cottage", 0,1, ProductCategory.A,  5.9);
    })

    test("SetUpShop", ()=>{
        let shop = controller.setUpShop("OfirPovis", "Ofir's shop");
        expect(shop.ok).toBe(true);
        if(shop.data){
            expect(controller.shops.has(shop.data.id)).toBe(true);
            let actual=controller.shops.get(shop.data.id);
            expect(actual).toEqual(shop.data);
            expect(controller.shopCounter).toBe(2);
        }
    })

    test("CloseShop", ()=>{

        if(shop_res.data){
            let res = controller.closeShop("OfirPovi", shop_res.data.id);
            expect(res.ok).toBe(true);
            let shop_actual= controller.shops.get(shop_res.data.id);
            if(shop_actual){
                expect(shop_actual.status).toBe(ShopStatus.close);
            }
        }
    })

    test("reopenShop", ()=>{

        if(shop_res.data){
            let shop= shop_res.data;
            shop.status=ShopStatus.close
            let res = controller.reopenShop("OfirPovi", shop.id);
            expect(res.ok).toBe(true);
            let shop_actual = controller.shops.get(shop.id);
            if(shop_actual){
                expect(shop_actual.status).toBe(ShopStatus.open);
            }
        }
    })

    test("Add product to shop - valid input", ()=>{
        const mock_addP = mockMethod(Shop.prototype, "addProduct", (productName, productCategory, fullPrice, quantity,  productDes)=> {
            let toAdd = new Product(productName, shop.id, shop.productsCounter, productCategory, fullPrice);
            shop.products.set(0, [toAdd, quantity]);
            return toAdd;
        })

        let shop: Shop;
        if(shop_res.data){
            shop = shop_res.data;
            let res = controller.addProductToShop(shop.id, p1.category, p1.name, 3, p1.fullPrice);
            expect(res.ok).toBe(true);
            let product_tupl = shop.products.get(p1.id);
            if(product_tupl){
                let actual_quantity = product_tupl[1];
                expect(actual_quantity).toEqual(3);
            }
        }
    })

    test("Add product to shop - invalid input", ()=>{
        const mock_addP = mockMethod(Shop.prototype, "addProduct", (productName, productCategory, fullPrice, quantity,  productDes)=> {
            let toAdd = new Product(productName, shop.id, shop.productsCounter, productCategory, fullPrice);
            shop.products.set(0, [toAdd, quantity]);
            return toAdd;
        })

        let shop:Shop;
        if(shop_res.data){
            shop = shop_res.data;
            let res = controller.addProductToShop(shop.id, p1.category, p1.name, -1, p1.fullPrice);
            expect(res.ok).toBe(false);
        }
    })

    test( "Remove product to shop", ()=> {
        const mock_addP = mockMethod(Shop.prototype, "addProduct", (productName, productCategory, fullPrice, quantity,  productDes)=> {
            let toAdd = new Product(productName, shop.id, shop.productsCounter, productCategory, fullPrice);
            shop.products.set(0, [toAdd, quantity]);
            return toAdd;
        })
        const mock_removeP = mockMethod(Shop.prototype, "removeProduct", (pId)=> shop.products.delete(pId))

        let shop:Shop;
        if(shop_res.data){
            shop = shop_res.data;
            let product_res = controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            if(product_res.data){
                let res = controller.removeProductFromShop(shop.id, product_res.data.id);
                expect(res.ok).toBe(true);
                expect(shop.products.has(product_res.data.id)).toBe(false);
            }
        }
    })

    test("update product quantity", ()=>{
        const mock_addP = mockMethod(Shop.prototype, "addProduct", (productName, productCategory, fullPrice, quantity,  productDes)=> {
            let toAdd = new Product(productName, shop.id, shop.productsCounter, productCategory, fullPrice);
            shop.products.set(0, [toAdd, quantity]);
            return toAdd;
        })
        const mock_updateQP = mockMethod(Shop.prototype, "updateProductQuantity", (pId, quantity)=> {
            shop.products = new Map().set(pId, [shop.products.get(pId), quantity]);
        })

        let shop:Shop;

        if(shop_res.data){
            shop = shop_res.data;
            let product_res = controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            if(product_res.data){
                controller.updateProductQuantity(shop.id, product_res.data.id, 4);
                let actual_tuple = shop.products.get(product_res.data.id);
                if(actual_tuple)
                    expect(actual_tuple[1]).toEqual(4);
            }
        }
    })

    test("Appoint shop owner", ()=>{
        const mock_appoint = mockMethod(Shop.prototype, "appointShopOwner", (ownerId)=>{
            shop.shopOwners.add(ownerId);
        })

        let shop:Shop;
        if(shop_res.data){
            shop = shop_res.data;
            let res= controller.appointShopOwner("NofarRoz", shop.id);
            expect(res.ok).toBe(true);
            expect(shop.shopOwners.has("NofarRoz")).toBe(true);
        }
    })

    test("Appoint shop Manager", ()=>{
        const mock_appoint = mockMethod(Shop.prototype, "appointShopManager", (ownerId)=>{
            shop.shopManagers.add(ownerId);
        })

        let shop:Shop;
        if(shop_res.data){
            shop = shop_res.data;
            let res= controller.appointShopManager("ShaharAlon", shop.id);
            expect(res.ok).toBe(true);
            expect(shop.shopManagers.has("ShaharAlon")).toBe(true);
        }
    })

    test("Show shop products - No Products to show", ()=>{
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let res = controller.showShopProducts(shop.id);
            expect(res.message).toBe("No products to show");
        }
    })

    test("Show shop products - There is Products to show", ()=>{
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            controller.addProductToShop(shop.id, ProductCategory.A, "Cottage", 1, 5.9);
            let res = controller.showShopProducts(shop.id);
            if(res.data){
                let p1 = res.data.get(0);
                let p2 = res.data.get(1);
                if(p1 && p2 && p1[0] && p2[0]){
                    expect(p1[0].name).toBe("Ski");
                    expect(p2[0].name).toBe("Cottage");
                }
            }
        }
    })

    test("Search product - By Name", ()=>{
        let shop_1 = shop_res;
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if( shop_1.data && shop_2.data){
            let p1_res = controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.9);
            let p2_res = controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Cottage", 1, 5.9);
            let p3_res = controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 5.9);
            let search_res = controller.searchProduct(SearchType.productName, "Ski");
            if(p1_res.data && p2_res.data && p3_res.data && search_res.data){
                expect(search_res.data.length).toBe(2);
            }
        }
    })

    test("Search product - By keyword", ()=>{
        let shop_1 = shop_res;
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if( shop_1.data && shop_2.data){
            let p1_res = controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.9,undefined ,"Yami cheesy");
            let p2_res = controller.addProductToShop(shop_2.data.id, ProductCategory.B, "Cottage", 1, 5.9, undefined ,"Yami chees");
            let p3_res = controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 5.9, undefined ,"Yami cheesyyy");
            let search_res = controller.searchProduct(SearchType.keyword, "chees");
            if(p1_res.data && p2_res.data && p3_res.data && search_res.data){
                expect(search_res.data.length).toBe(3);
            }
        }
    })

    test("Sort product- By price ", ()=>{
        let shop_1 = shop_res;
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if( shop_1.data && shop_2.data) {
            let p1 = controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.2, undefined, "Yami cheesy").data;
            let p2 = controller.addProductToShop(shop_2.data.id, ProductCategory.B, "Cottage", 1, 5.9, undefined, "Yami chees").data;
            let p3 = controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 6, undefined, "Yami cheesyyy").data;
            if( p1 && p2 && p3){
                let filter_res = controller.filterProducts(FilterType.price, new Range(5, 5.9), [p1, p2, p3]);
                if(filter_res.data){
                    expect(filter_res.data).toEqual([p1,p2]);
                }
            }
        }
    })

    test("sort product -By category", ()=>{
        let shop_1 = shop_res;
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if( shop_1.data && shop_2.data) {
            let p1 = controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.9, undefined, "Yami cheesy").data;
            let p2 = controller.addProductToShop(shop_2.data.id, ProductCategory.B, "Cottage", 1, 5.9, undefined, "Yami chees").data;
            let p3 = controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 5.9, undefined, "Yami cheesyyy").data;
            if( p1 && p2 && p3){
                let filter_res = controller.filterProducts(FilterType.category, ProductCategory.A, [p1, p2, p3]);
                if(filter_res.data){
                    expect(filter_res.data).toEqual([p1,p3]);
                }
            }
        }
    })


})