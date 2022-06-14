import {Product} from "../../../../src/domain/marketplace/Product";
import {FilterType, JobType, ProductCategory, SearchType, ShopStatus} from "../../../../src/utilities/Enums";
import {MarketplaceController} from "../../../../src/domain/marketplace/MarketplaceController";
import {Range} from "../../../../src/utilities/Range";
import {AppDataSource} from "../../../../src/dal/AppDataSource";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {Products_In_Bag, ShoppingBag} from "../../../../src/domain/user/ShoppingBag";
import {Member} from "../../../../src/domain/user/Member";
import {SimpleMessage} from "../../../../src/domain/notifications/Message";
import {Role} from "../../../../src/domain/user/Role";
import {Permissions} from "../../../../src/utilities/Permissions";
import {MemberCredentials} from "../../../../src/domain/SecurityController";
import {Offer} from "../../../../src/domain/user/Offer";

jest.setTimeout(10000);
let controller: MarketplaceController;
const p1: Product = new Product("Ski", 0,0, ProductCategory.A, 5.9);
// const p2: Product  = new Product("Cottage", 0,1, ProductCategory.A,  5.9);

describe("MarketPlaceController", ()=>{
    beforeAll(async function () {
        await AppDataSource.initialize();

        // let shoppingCart: ShoppingCart = new ShoppingCart();
        // shoppingCart.bags.set(1, new ShoppingBag(1));
        // await shoppingCart.save();
        // console.log("shoppingCart was saved");
        // let shop: Shop = new Shop(0, "name", "founder");
        // shop.shopOwners.add("moshe");
        // shop.shopManagers.add("yossi");
        // shop.shopManagers.add("joshua");
        // shop.products.set(1, [p1, 10]);
        // await shop.save();
        // console.log("shop saved");
        // await p1.save();
        // console.log("p1 saved");

        let member = new Member("session", "username");
        let shoppingCart = new ShoppingCart("username");
        let shop = new Shop(0, "shop", "founder");
        let shoppingBag = new ShoppingBag(0, shoppingCart);
        let product: Product = new Product("product", 0, 1, ProductCategory.A, 10);
        let product2: Product = new Product("product2", 0, 2, ProductCategory.B, 15);
        let products: Products_In_Bag = new Products_In_Bag(shoppingBag, product, 5);
        let message: SimpleMessage = new SimpleMessage(new Set<string>(), "message");
        let role: Role = new Role(0, "owner", JobType.Owner, new Set<Permissions>())
        let credentials: MemberCredentials = new MemberCredentials("username", "password");
        let offer: Offer = new Offer(1, "username", 0, 1, 10, new Set<string>());
        role.member = member;
        message.recipients.add("username");
        shop.shopOwners.add("owner1");
        shop.shopManagers.add("manager1");
        shoppingBag.addProduct(product, 5);
        shoppingBag.addProduct(product2, 7);
        shoppingCart.bags.set(0, shoppingBag);
        await member.save();
        await credentials.save();
        await shoppingCart.save();
        await shoppingBag.save();
        await products.save();
        await offer.save();
        console.log("all added");
    })

    beforeEach(function(){
        controller = new MarketplaceController();
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
        let shop_res= controller.setUpShop("OfirPovi", "Ofir's shop");
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
        let shop_res= controller.setUpShop("OfirPovi", "Ofir's shop");
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
        let shop_res= controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop= shop_res.data;
        if(shop){
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
        let shop_res= controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop= shop_res.data;
        if(shop) {
            let res = controller.addProductToShop(shop.id, p1.category, p1.name, -1, p1.fullPrice);
            expect(res.ok).toBe(false);
        }
    })

    test( "Remove product to shop", ()=> {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let product_res = controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            if(product_res.data){
                let res = controller.removeProductFromShop(shop.id, product_res.data.id);
                expect(res.ok).toBe(true);
                expect(shop.products.has(product_res.data.id)).toBe(false);
            }
        }
    })

    test("update product quantity", ()=>{
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
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
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let res= controller.appointShopOwner("NofarRoz", shop.id);
            expect(res.ok).toBe(true);
            expect(shop.shopOwners.has("NofarRoz")).toBe(true);
        }
    })

    test("Appoint shop Manager", ()=>{
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
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
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
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
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if( shop_1.data && shop_2.data){
            let p1_res = controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.9 ,"Yami cheesy");
            let p2_res = controller.addProductToShop(shop_2.data.id, ProductCategory.B, "Cottage", 1, 5.9 ,"Yami chees");
            let p3_res = controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 5.9 ,"Yami cheesyyy");
            let search_res = controller.searchProduct(SearchType.keyword, "chees");
            if(p1_res.data && p2_res.data && p3_res.data && search_res.data){
                expect(search_res.data.length).toBe(3);
            }
        }
    })

    test("Sort product- By price ", ()=>{
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if( shop_1.data && shop_2.data) {
            let p1 = controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.2, "Yami cheesy").data;
            let p2 = controller.addProductToShop(shop_2.data.id, ProductCategory.B, "Cottage", 1, 5.9, "Yami chees").data;
            let p3 = controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 6, "Yami cheesyyy").data;
            if( p1 && p2 && p3){
                let filter_res = controller.filterProducts(FilterType.price, new Range(5, 5.9), [p1, p2, p3]);
                if(filter_res.data){
                    expect(filter_res.data).toEqual([p1,p2]);
                }
            }
        }
    })

    test("sort product -By category", ()=>{
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if( shop_1.data && shop_2.data) {
            let p1 = controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.9, "Yami cheesy").data;
            let p2 = controller.addProductToShop(shop_2.data.id, ProductCategory.B, "Cottage", 1, 5.9, "Yami chees").data;
            let p3 = controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 5.9, "Yami cheesyyy").data;
            if( p1 && p2 && p3){
                let filter_res = controller.filterProducts(FilterType.category, ProductCategory.A, [p1, p2, p3]);
                if(filter_res.data){
                    expect(filter_res.data).toEqual([p1,p3]);
                }
            }
        }
    })


})