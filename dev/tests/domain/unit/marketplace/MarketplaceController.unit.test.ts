import {Product} from "../../../../src/domain/marketplace/Product";
import {FilterType, ProductCategory, SearchType, ShopStatus} from "../../../../src/utilities/Enums";
import {MarketplaceController} from "../../../../src/domain/marketplace/MarketplaceController";
import {Range} from "../../../../src/utilities/Range";
import {clearMocks, mockDependencies, mockInstance, mockMethod} from "../../../mockHelper";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Result} from "../../../../src/utilities/Result";
import {Offer} from "../../../../src/domain/user/Offer";
import {MessageController} from "../../../../src/domain/notifications/MessageController";
import {SecurityController} from "../../../../src/domain/SecurityController";
import {UserController} from "../../../../src/domain/user/UserController";
import {Member} from "../../../../src/domain/user/Member";
import mock = jest.mock;
import {Message} from "../../../../src/domain/notifications/Message";
import {SystemController} from "../../../../src/domain/SystemController";
import {Guest} from "../../../../src/domain/user/Guest";
import {MessageBox} from "../../../../src/domain/notifications/MessageBox";
import {AppointmentAgreement} from "../../../../src/domain/marketplace/AppointmentAgreement";


let controller: MarketplaceController;
let sys: SystemController;

const sess1 = "1";
let member1: Member;
const username1 = "OfirPovi";
let box1: MessageBox;

const sess2 = "2";
let member2: Member
const username2 = "EladIn";
let box2: MessageBox;

let shop_res: Result<void | Shop>;
let shop: void | Shop;
let p1: Product;
let  p2: Product;

let shopData: Shop;

let mController: MessageController;
let pControllerMockMethod: jest.SpyInstance<any, unknown[]>

describe("MarketPlaceController", ()=>{
    beforeAll(()=>{
        mockInstance(mockDependencies.Shop);
    })
    beforeEach(function(){
        controller = new MarketplaceController();

        member1 = new Member(sess1, username1)
        box1 = new MessageBox(username1);

        member2= new Member( sess2, username2);
        box2 = new MessageBox(username2);


        shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        shop = shop_res.data;
        if(shop)
            shopData = shop;
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

    test("CloseShop", async () => {

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
        const mock_addP = mockMethod(Shop.prototype, "addProduct", (productName, productCategory, fullPrice, quantity, productDes) => {
            let toAdd = new Product(productName, shop.id, shop.productsCounter, productCategory, fullPrice);
            shop.products.set(0, [toAdd, quantity]);
            return toAdd;
        })

        let shop: Shop;
        if (shop_res.data) {
            shop = shop_res.data;
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
        const mock_addP = mockMethod(Shop.prototype, "addProduct", (productName, productCategory, fullPrice, quantity, productDes) => {
            let toAdd = new Product(productName, shop.id, shop.productsCounter, productCategory, fullPrice);
            shop.products.set(0, [toAdd, quantity]);
            return toAdd;
        })

        let shop: Shop;
        if (shop_res.data) {
            shop = shop_res.data;
            let res = await controller.addProductToShop(shop.id, p1.category, p1.name, -1, p1.fullPrice);
            expect(res.ok).toBe(false);
        }
    })

    test( "Remove product to shop", async () => {
        const mock_addP = mockMethod(Shop.prototype, "addProduct", (productName, productCategory, fullPrice, quantity, productDes) => {
            let toAdd = new Product(productName, shop.id, shop.productsCounter, productCategory, fullPrice);
            shop.products.set(0, [toAdd, quantity]);
            return toAdd;
        })
        const mock_removeP = mockMethod(Shop.prototype, "removeProduct", (pId) => shop.products.delete(pId))

        let shop: Shop;
        if (shop_res.data) {
            shop = shop_res.data;
            let product_res = await controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            if (product_res.data) {
                let res = await controller.removeProductFromShop(shop.id, product_res.data.id);
                expect(res.ok).toBe(true);
                expect(shop.products.has(product_res.data.id)).toBe(false);
            }
        }
    })

    test("update product quantity", async () => {
        const mock_addP = mockMethod(Shop.prototype, "addProduct", (productName, productCategory, fullPrice, quantity, productDes) => {
            let toAdd = new Product(productName, shop.id, shop.productsCounter, productCategory, fullPrice);
            shop.products.set(0, [toAdd, quantity]);
            return toAdd;
        })
        const mock_updateQP = mockMethod(Shop.prototype, "updateProductQuantity", (pId, quantity) => {
            shop.products = new Map().set(pId, [shop.products.get(pId), quantity]);
        })

        let shop: Shop;

        if (shop_res.data) {
            shop = shop_res.data;
            let product_res = await controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            if (product_res.data) {
                await controller.updateProductQuantity(shop.id, product_res.data.id, 4);
                let actual_tuple = shop.products.get(product_res.data.id);
                if (actual_tuple)
                    expect(actual_tuple[1]).toEqual(4);
            }
        }
    })

    // test("Appoint shop owner", ()=>{
    //     const mock_appoint = mockMethod(Shop.prototype, "appointShopOwner", (ownerId)=>{
    //         shop.shopOwners.add(ownerId);
    //     })
    //
    //     let shop:Shop;
    //     if(shop_res.data){
    //         shop = shop_res.data;
    //         let res= controller.appointShopOwner("NofarRoz", shop.id);
    //         expect(res.ok).toBe(true);
    //         expect(shop.shopOwners.has("NofarRoz")).toBe(true);
    //     }
    // })

    test("Appoint shop Manager", async () => {
        const mock_appoint = mockMethod(Shop.prototype, "appointShopManager", (ownerId) => {
            shop.shopManagers.add(ownerId);
        })

        let shop: Shop;
        if (shop_res.data) {
            shop = shop_res.data;
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
        let shop_res = controller.setUpShop("OfirPovi", "Ofir's shop");
        let shop = shop_res.data;
        if (shop) {
            controller.addProductToShop(shop.id, ProductCategory.A, "Ski", 1, 5.9);
            controller.addProductToShop(shop.id, ProductCategory.A, "Cottage", 1, 5.9);
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
        let shop_1 = shop_res;
        let shop_2 = controller.setUpShop("NofarShop", "Nofar's shop");
        if (shop_1.data && shop_2.data) {
            let p1_res = await controller.addProductToShop(shop_1.data.id, ProductCategory.A, "Ski", 1, 5.9);
            let p2_res = await controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Cottage", 1, 5.9);
            let p3_res = await controller.addProductToShop(shop_2.data.id, ProductCategory.A, "Ski", 1, 5.9);
            let search_res = await controller.searchProduct(SearchType.productName, "Ski");
            if (p1_res.data && p2_res.data && p3_res.data && search_res.data) {
                expect(search_res.data.length).toBe(2);
            }
        }
    })

    test("Search product - By keyword", async () => {
        let shop_1 = shop_res;
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
        let shop_1 = shop_res;
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
        let shop_1 = shop_res;
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

    test("addOffer2Product", ()=>{
        const mock_addOffer = mockMethod(Shop.prototype, "addOfferPrice2Product", (userId: string, pId: number, offeredPrice: number )=>{
            if(shop){
                let offer: Offer = new Offer(0, userId, shop.id, pId, offeredPrice, shop.shopOwners);
                shop.offers.set(0, offer);
                return offer;
            }
        })
        const mock_notify = mockMethod(MarketplaceController.prototype, "notifySubscribers", ()=>{})
        let shop = shop_res.data;
        if(shop){
            controller.addOffer2Product(shop.id, "NofarRoz", 0, 4.5);
        }

        expect(mock_addOffer).toHaveBeenCalled();
        expect(mock_notify).toHaveBeenCalled();
        clearMocks(mock_addOffer, mock_notify);
    })

    test("getOffer" , async () => {
        const mock_addOffer = mockMethod(Shop.prototype, "addOfferPrice2Product", (userId: string, pId: number, offeredPrice: number) => {
            if (shop) {
                let offer = new Offer(0, userId, shop.id, pId, offeredPrice, shop.shopOwners);
                shop.offers.set(0, offer);
                return offer
            }
        })
        let shop = shop_res.data;
        if (shop) {
            let offer = shop.addOfferPrice2Product("NofarRoz", 0, 4.5);
            expect((await controller.getOffer(shop.id, offer.id)).data).toEqual(offer);
        }
        clearMocks(mock_addOffer);
    })

    test("approveOffer", ()=>{
        const mock_answerOffer = mockMethod(Shop.prototype, "answerOffer", ()=>{});
        controller.approveOffer(0, 0, "NofarRoz",true);
        expect(mock_answerOffer).toHaveBeenCalled();
        clearMocks(mock_answerOffer);
    })

    test("filing counter offer", async () => {
        const mock_approveOffer = mockMethod(MarketplaceController.prototype, "approveOffer", () => {
        });
        const mock_filingOffer = mockMethod(Shop.prototype, "filingCounterOffer", (offerId: number, counterPrice: number) => {
            return shop ? new Offer(0, "NofarRoz", shop.id, p1.id, counterPrice, shop.shopOwners) : undefined
        });
        const mock_notify = mockMethod(MarketplaceController.prototype, "notifySubscribers", () => {
        });
        let res: Result<void | Offer>;
        if (shop) {
            res = await controller.filingCounterOffer(shop.id, 0, "NofarRoz", 4.5);
        }
        expect(mock_approveOffer).toHaveBeenCalled();
        expect(mock_filingOffer).toHaveBeenCalled();
        expect(mock_notify).toHaveBeenCalled();
        expect(res.ok).toBe(true);
        clearMocks(mock_approveOffer, mock_filingOffer, mock_notify);
    })

    test("deny counter offer", async () => {
        const mock_removeOffer = mockMethod(Shop.prototype, "removeOffer", () => {
        });
        const mock_getOffer = mockMethod(Shop.prototype, "getOffer", (offerId: number) => {
            return shop ? new Offer(0, "NofarRoz", shop.id, p1.id, 3.5, shop.shopOwners) : undefined
        });
        let res: Result<void | Offer>;
        if (shop) {
            res = await controller.denyCounterOffer(shop.id, 0);
        }
        expect(mock_removeOffer).toHaveBeenCalled();
        expect(res.ok).toBe(true);
        clearMocks(mock_removeOffer, mock_getOffer);
    })

    test("accept counter offer", async () => {
        const mock_acceptCounterOffer = mockMethod(Shop.prototype, "acceptCounterOffer", () => {
        });
        const mock_getOffer = mockMethod(Shop.prototype, "getOffer", (offerId: number) => {
            return shop ? new Offer(0, "NofarRoz", shop.id, p1.id, 3.5, shop.shopOwners) : undefined
        });
        const mock_notify = mockMethod(MarketplaceController.prototype, "notifySubscribers", () => {
        });
        let res: Result<void | Offer>;
        if (shop) {
            res = await controller.acceptCounterOffer(shop.id, 0);
        }
        expect(mock_acceptCounterOffer).toHaveBeenCalled();
        expect(mock_getOffer).toHaveBeenCalled();
        expect(mock_notify).toHaveBeenCalled();
        expect(res.ok).toBe(true);
        clearMocks(mock_acceptCounterOffer, mock_getOffer, mock_notify);
    })

    test("submit owner appointment in shop - success", async () => {
        const mock_submitOA = mockMethod(Shop.prototype, "submitOwnerAppointment", (member: string, assigner: string) => {
            return new AppointmentAgreement(member, assigner, shopData.shopOwners);
        })
        const mock_notify = mockMethod(MarketplaceController.prototype, "notifySubscribers", () => {
        });
        let res: Result<void | AppointmentAgreement> = await controller.submitOwnerAppointmentInShop(shopData.id, "Nofar", shopData.shopFounder);
        expect(mock_notify).toHaveBeenCalled();
        expect(res.ok).toBe(true);
        clearMocks(mock_notify);
    })

    test("submit owner appointment in shop - fail- assigner isn't shop owner", async () => {
        const mock_submitOA = mockMethod(Shop.prototype, "submitOwnerAppointment", (member: string, assigner: string) => {
            return new AppointmentAgreement(member, assigner, shopData.shopOwners);
        })
        const mock_notify = mockMethod(MarketplaceController.prototype, "notifySubscribers", () => {
        });
        let res: Result<void | AppointmentAgreement> = await controller.submitOwnerAppointmentInShop(shopData.id, "Nofar", "shahar");
        expect(mock_notify).not.toHaveBeenCalled();
        expect(res.ok).toBe(false);
        expect(res.message).toBe(`Cannot submit owner appointment in ${shopData.name} because shahar is not a shop owner.`)
        clearMocks(mock_submitOA, mock_notify);
    })

    test("answer appointment agreement in shop - appointment agreement is not done - succsess ", async () => {
        const mock_answerAA = mockMethod(Shop.prototype, "answerAppointmentAgreement", () => {
            let agreement: AppointmentAgreement = new AppointmentAgreement("Nofar", "OfirPovi", new Set<string>().add("OfirPovi").add("EladIn"));
            agreement.setAnswer("OfirPovi", true);
            return agreement;
        })
        const mock_notify = mockMethod(MarketplaceController.prototype, "notifySubscribers", () => {
        });
        const mock_appointShopOwner = mockMethod(MarketplaceController.prototype, "appointShopOwner", () => {
        });
        let res: Result<void> = await controller.answerAppointmentAgreementInShop(shopData.id, "", "", true);
        expect(res.ok).toBe(true);
        expect(mock_answerAA).toHaveBeenCalled();
        expect(mock_appointShopOwner).not.toHaveBeenCalled();
        expect(mock_notify).not.toHaveBeenCalled();
        clearMocks(mock_answerAA, mock_notify, mock_appointShopOwner);

    })

    test("answer appointment agreement in shop - appointment agreement is done - succsess ", async () => {
        const mock_answerAA = mockMethod(Shop.prototype, "answerAppointmentAgreement", () => {
            let agreement: AppointmentAgreement = new AppointmentAgreement("Nofar", "OfirPovi", new Set<string>().add("OfirPovi").add("EladIn"));
            agreement.setAnswer("OfirPovi", true);
            agreement.setAnswer("EladIn", true);
            return agreement;
        })
        const mock_notify = mockMethod(MarketplaceController.prototype, "notifySubscribers", () => {
        });
        const mock_appointShopOwner = mockMethod(MarketplaceController.prototype, "appointShopOwner", () => {
        });
        let res: Result<void> = await controller.answerAppointmentAgreementInShop(shopData.id, "", "", true);
        expect(res.ok).toBe(true);
        expect(mock_answerAA).toHaveBeenCalled();
        expect(mock_appointShopOwner).toHaveBeenCalled();
        expect(mock_notify).toHaveBeenCalled();
        clearMocks(mock_answerAA, mock_notify, mock_appointShopOwner);
    })

    test("answer appointment agreement in shop - failure because the approver isn't owner ", async () => {
        const mock_answerAA = mockMethod(Shop.prototype, "answerAppointmentAgreement", () => {
            let agreement: AppointmentAgreement = new AppointmentAgreement("Nofar", "OfirPovi", new Set<string>().add("OfirPovi").add("EladIn"));
            agreement.setAnswer("IdanLe", true);
            return agreement;
        })
        let res: Result<void> = await controller.answerAppointmentAgreementInShop(shopData.id, "Nofar", "IdanLe", true);
        expect(mock_answerAA).toHaveBeenCalled();
        expect(res.ok).toBe(false);
        expect(res.message).toBe(`In shop- ${shopData.name}: IdanLe cannot answer on Nofar's appointment agreement because he isn't one of the shop owners`);
        clearMocks(mock_answerAA);
    })
})