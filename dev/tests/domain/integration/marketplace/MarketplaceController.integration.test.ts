import {Product} from "../../../../src/domain/marketplace/Product";
import {FilterType, ProductCategory, SearchType, ShopStatus} from "../../../../src/utilities/Enums";
import {MarketplaceController} from "../../../../src/domain/marketplace/MarketplaceController";
import {Range} from "../../../../src/utilities/Range";
import {Offer} from "../../../../src/domain/user/Offer";
import {Result} from "../../../../src/utilities/Result";
import {Shop} from "../../../../prisma/prisma";

let controller: MarketplaceController;
const p1: Product = new Product("Ski", 0, 0, ProductCategory.A, 5.9);
const p2: Product = new Product("Cottage", 0, 1, ProductCategory.A, 5.9);

describe("MarketPlaceController", () => {
    beforeEach(function () {
        controller = new MarketplaceController();
    })

    test("SetUpShop", () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        expect(shop_res.ok).toBe(true);
        if (shop_res.data) {
            expect(controller.shops.has(shop_res.data.id)).toBe(true);
            let actual = controller.shops.get(shop_res.data.id);
            expect(actual).toEqual(shop_res.data);
        }
    })

    test("getShop", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        expect(shop_res.ok).toBe(true);
        if (shop_res.data) {
            expect(controller.shops.has(shop_res.data.id)).toBe(true);
            let actual = controller.shops.get(shop_res.data.id);
            expect(actual).toEqual(shop_res.data);
            shop_res.data.appointShopManager("Shahar");
            let res= await controller.getShopInfo(shop_res.data.id);
            expect(res.ok).toBe(true);
            expect(res.data).toEqual(shop_res.data);
        }
    })

    test("CloseShop", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        if (shop_res.data) {
            let res = await controller.closeShop("OfirPovi", shop_res.data.id);
            expect(res.ok).toBe(true);
            let shop_actual = controller.shops.get(shop_res.data.id);
            if (shop_actual) {
                expect(shop_actual.status).toBe(ShopStatus.close);
            }
        }
    })

    test("reopenShop", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        if (shop_res.data) {
            let shop = shop_res.data;
            shop.status = ShopStatus.close
            let res = await controller.reopenShop("OfirPovi", shop.id);
            expect(res.ok).toBe(true);
            let shop_actual = controller.shops.get(shop.id);
            if (shop_actual) {
                expect(shop_actual.status).toBe(ShopStatus.open);
            }
        }
    })

    test("Add product to shop - valid input", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let res = await controller.addProductToShop(shop.id, p1.category, p1.name, 3, p1.fullPrice);
            expect(res.ok).toBe(true);
            let product_tupl = shop.products.get(p1.id);
            if (product_tupl) {
                let actual_quantity = product_tupl[1];
                expect(actual_quantity).toEqual(3);
            }
        }
    })

    test("Add product to shop - invalid input", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let res = await controller.addProductToShop(shop.id, p1.category, p1.name, -1, p1.fullPrice);
            expect(res.ok).toBe(false);
        }
    })

    test("Remove product to shop", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let product_res = await controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            if (product_res.data) {
                let res = await controller.removeProductFromShop(shop.id, product_res.data.id);
                expect(res.ok).toBe(true);
                expect(shop.products.has(product_res.data.id)).toBe(false);
            }
        }
    })

    test("update product quantity", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let product_res = await controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            if (product_res.data) {
                controller.updateProductQuantity(shop.id, product_res.data.id, 4);
                let actual_tuple = shop.products.get(product_res.data.id);
                if (actual_tuple)
                    expect(actual_tuple[1]).toEqual(4);
            }
        }
    })

    // test("Appoint shop owner", ()=>{
    //     let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
    //     let shop = shop_res.data;
    //     if (shop) {
    //         let res= controller.appointShopOwner("NofarRoz", shop.id);
    //         expect(res.ok).toBe(true);
    //         expect(shop.shopOwners.has("NofarRoz")).toBe(true);
    //     }
    // })

    test("Appoint shop Manager", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let res = await controller.appointShopManager("ShaharAlon", shop.id);
            expect(res.ok).toBe(true);
            expect(shop.shopManagers.has("ShaharAlon")).toBe(true);
        }
    })

    test("Show shop products - No Products to show", async () => {
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            let res = await controller.showShopProducts(shop.id);
            expect(res.message).toBe("No products to show");
        }
    })

    test("Show shop products - There is Products to show", async () => {
        let shop_res = await controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            await controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            await controller.addProductToShop(shop.id, ProductCategory.A, "Cottage", 1, 5.9);
            let res = await controller.showShopProducts(shop.id);
            if (res.data) {
                let p1 = res.data.get(0);
                let p2 = res.data.get(1);
                if (p1 && p2 && p1[0] && p2[0]) {
                    expect(p1[0].name).toBe("Ski");
                    expect(p2[0].name).toBe("Cottage");
                }
            }
        }
    })

    test("Search product - By Name", async () => {
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if (shop_1.data && shop_2.data) {
            let p1_res = await controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.9);
            let p2_res = await controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Cottage", 1, 5.9);
            let p3_res = await controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 5.9);
            let search_res = controller.searchProduct(SearchType.productName, "Ski");
            if (p1_res.data && p2_res.data && p3_res.data && search_res.data) {
                expect(search_res.data.length).toBe(2);
            }
        }
    })

    test("Search product - By keyword", async () => {
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if (shop_1.data && shop_2.data) {
            let p1_res = await controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.9);
            let p2_res = await controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Cottage", 1, 5.9);
            let p3_res = await controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 5.9);
            let search_res = controller.searchProduct(SearchType.keyword, "chees");
            if (p1_res.data && p2_res.data && p3_res.data && search_res.data) {
                expect(search_res.data.length).toBe(3);
            }
        }
    })

    test("Sort product- By price ", async () => {
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if (shop_1.data && shop_2.data) {
            let p1 = (await controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.2, "Yami cheesy")).data;
            let p2 = (await controller.addProductToShop(shop_2.data.id, ProductCategory.B, "Cottage", 1, 5.9, "Yami chees")).data;
            let p3 = (await controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 6, "Yami cheesyyy")).data;
            if (p1 && p2 && p3) {
                let filter_res = controller.filterProducts(FilterType.price, new Range(5, 5.9), [p1, p2, p3]);
                if (filter_res.data) {
                    expect(filter_res.data).toEqual([p1, p2]);
                }
            }
        }
    })

    test("sort product -By category", async () => {
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if (shop_1.data && shop_2.data) {
            let p1 = (await controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.2, "Yami cheesy")).data;
            let p2 = (await controller.addProductToShop(shop_2.data.id, ProductCategory.B, "Cottage", 1, 5.9, "Yami chees")).data;
            let p3 = (await controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 6, "Yami cheesyyy")).data;
            if (p1 && p2 && p3) {
                let filter_res = controller.filterProducts(FilterType.category, ProductCategory.A, [p1, p2, p3]);
                if (filter_res.data) {
                    expect(filter_res.data).toEqual([p1, p3]);
                }
            }
        }
    })

    test("Offer & filing Counter offer - member deny counter offer", async () => {
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        if (shop_1.data) {
            let shop = shop_1.data;
            let offer: Offer | void = (await controller.addOffer2Product(shop.id, "Elad", p1.id, 2.5)).data;
            if (offer) {
                expect((await controller.getOffer(shop.id, offer.id)).data).toEqual(offer);
                controller.approveOffer(shop.id, offer.id, "OfirPovi", false);
                expect(offer.isDone()).toBe(true);
                expect(offer.answer).toBe(false);
                controller.filingCounterOffer(shop.id, offer.id, "OfirPovi", 3);
                expect(offer.answer).toBe(false);
                controller.denyCounterOffer(shop.id, offer.id);
                expect((await controller.getOffer(shop.id, offer.id)).ok).toBe(false);
            }
        }
    })

    test("Appointment agreement", () => {
        let shop_1 = controller.setUpShop("OfirPovi", "Ofir's shop");
        if (shop_1.data) {
            let shop = shop_1.data;
            let agreement = shop.submitOwnerAppointment("Idan", "OfirPovi");
            expect(shop.appointmentAgreements.has("Idan")).toBe(true);
            controller.answerAppointmentAgreementInShop(shop.id, "Idan", "OfirPovi", true);
            expect(shop.appointmentAgreements.has("Idan")).toBe(false);
        }
    })


})