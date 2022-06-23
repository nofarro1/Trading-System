import {SystemController} from "../../../src/domain/SystemController";
import {MessageController} from "../../../src/domain/notifications/MessageController"
import {MarketplaceController} from "../../../src/domain/marketplace/MarketplaceController";
import {PurchaseController} from "../../../src/domain/purchase/PurchaseController";
import {SecurityController} from "../../../src/domain/SecurityController";
import {UserController} from "../../../src/domain/user/UserController";
import {Guest} from "../../../src/domain/user/Guest";
import {Member} from "../../../src/domain/user/Member";
import {ShoppingCart} from "../../../src/domain/user/ShoppingCart";
import {MessageBox} from "../../../src/domain/notifications/MessageBox";
import {Product} from "../../../src/domain/marketplace/Product";
import {JobType, ProductCategory, SearchType} from "../../../src/utilities/Enums";
import {Shop} from "../../../src/domain/marketplace/Shop";
import {Role} from "../../../src/domain/user/Role";
import {Permissions} from "../../../src/utilities/Permissions";
import {
    toSimpleGuest,
    toSimpleMember,
    toSimpleProduct,
    toSimpleShop,
    toSimpleShoppingCart
} from "../../../src/utilities/simple_objects/SimpleObjectFactory";
import {ExternalServiceType} from "../../../src/utilities/Utils";
import {resetContainer, systemContainer} from "../../../src/helpers/inversify.config";
import {TYPES} from "../../../src/helpers/types";
import {PaymentDetails} from "../../../src/domain/external_services/IPaymentService";
import {DeliveryDetails} from "../../../src/domain/external_services/IDeliveryService";
import {SimpleShop} from "../../../src/utilities/simple_objects/marketplace/SimpleShop";
import {SimpleProduct} from "../../../src/utilities/simple_objects/marketplace/SimpleProduct";


const paymentDetails: PaymentDetails = {
    action_type: "pay",
    card_number: "1234567891011",
    month: "12",
    year: "2025",
    holder: "me",
    ccv: "123",
    id: "123456"
}
const deliveryDetails: DeliveryDetails = {
    action_type: "supply",
    name: "me",
    address: "Bilbo house",
    city: "Shire",
    country: "Middle Earth",
    zip: "123456",
}

describe('system controller - integration', () => {
    let sys: SystemController;
    let mpController: MarketplaceController;
    let mController: MessageController;
    let pController: PurchaseController;
    let scController: SecurityController;
    let uController: UserController;

    const sess1 = "1";
    let guest1: Guest;
    let cart1: ShoppingCart;

    const sess2 = "2";
    let guest2: Guest
    let cart2: ShoppingCart;

    const sess3 = "3";
    let guest3: Guest;
    let cart3: ShoppingCart;

    const sess4 = "4";
    const username1 = "member1";
    const pass1 = "123456789"
    let member1: Member;
    let cart4: ShoppingCart;
    let box1: MessageBox;

    const sess5 = "5";
    const username2 = "member2";
    const pass2 = "987654321"
    let member2: Member;
    let cart5: ShoppingCart;
    let box2: MessageBox;

    const shop1 = new Shop(0, "_name", username1, "this is my shop");
    let shop: SimpleShop;

    const p1 = new Product("ps1", 0, ProductCategory.A, 10, 1000,"description");
    let simple_p1:SimpleProduct;
    const p2 = new Product("ps2", 0, ProductCategory.A, 10, 200,"description");
    const p3 = new Product("ps3", 0, ProductCategory.A, 10, 3000,"description");

    const role1 = new Role(0, "title", JobType.Owner, new Set())
    const role2 = new Role(0, "title", JobType.Manager, new Set())

    // beforeAll(() => {
    //
    // })

    beforeEach(() => {

        sys = systemContainer.get(TYPES.SystemController)
        mpController = sys.mpController
        mController = sys.mController
        pController = sys.pController
        scController = sys.securityController
        uController = sys.uController

        cart1 = new ShoppingCart();
        guest1 = new Guest(sess1);

        cart2 = new ShoppingCart();
        guest2 = new Guest(sess2);

        cart3 = new ShoppingCart();
        guest3 = new Guest(sess3);

        cart4 = new ShoppingCart();
        member1 = new Member(sess4, username1)
        box1 = new MessageBox(username1);

        cart5 = new ShoppingCart();
        member2 = new Member(sess5, username2)
        box2 = new MessageBox(username1);


        sys.accessMarketplace(sess4);
        sys.registerMember(sess4, {username: username1, password: pass1});
        //act
        sys.login(sess4, {username: username1, password: pass1});
        shop = sys.setUpShop(sess4, shop1.name).data as SimpleShop;
        const res = sys.addProduct(sess4,{shopId: shop.ID, productCategory:p1.category, productName:p1.name, quantity:10,fullPrice:p1.fullPrice});
        simple_p1 = res.data as SimpleProduct;
        sys.exitMarketplace(sess4)
    })

    afterEach(() => {
        resetContainer()
    })

    test("initialize the system", () => {
        expect(sys.mpController).toBeDefined();
        expect(sys.pController).toBeDefined();
        expect(sys.scController).toBeDefined();
        expect(sys.uController).toBeDefined();
        expect(sys.mController).toBeDefined();
        expect(sys.securityController).toBeDefined();
    })

    test("access marketplace test", () => {
        //act
        const res = sys.accessMarketplace(sess1);

        //assert
        expect(res.ok).toBeTruthy();
        expect(res.data).toBeDefined();
        expect(res.data).toEqual(toSimpleGuest(guest1))
    })

    test("exit marketplace - guest", () => {
        //prepare
        //previus test accessMarketplace
        sys.accessMarketplace(sess1);

        //act
        let res = sys.exitMarketplace(sess1);

        //assert
        expect(res.ok).toBe(true);
        expect(res.data).toEqual(undefined);
        expect(res.message).toEqual("bye bye!");
    })

    test("exit marketplace - member", () => {
        //prepare
        sys.accessMarketplace(sess4);
        sys.registerMember(sess4, {username: username1, password: pass1});
        sys.login(sess1, {username: member1.username, password: pass1});

        //act
        let res = sys.exitMarketplace(sess4);

        //assert
        expect(res.ok).toBe(true)
        expect(res.data).toEqual(undefined)
        expect(res.message).toEqual("bye bye!")
    })


    describe("login tests", () => {

        test("login test - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            // sys.registerMember(sess4, {username: username1, password: pass1});

            //act
            let res = sys.login(sess4, {username: username1, password: pass1});

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).toBeDefined()
        })

        test("login test - failure - recover from security failure", () => {
            //prepare
            sys.accessMarketplace(sess4);

            //act
            let res = sys.login(sess4, {username: username1, password: pass2});

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
    })

    test("logout test - success", () => {
        //prepare
        sys.accessMarketplace(sess4);
        // sys.registerMember(sess4, {username: username1, password: pass1});
        sys.login(sess4, {username: username1, password: pass1});

        //act
        let res = sys.logout(sess4);

        //assert
        expect(res.ok).toBe(true);
        expect(res.data).toBeDefined()
    })

    describe("register tests", () => {
        test("register member - success", () => {
            //prepare
            sys.accessMarketplace(sess5);

            //act
            let res = sys.registerMember(sess5, {username: username2, password: pass2});

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).toBeDefined();
        })

        test("register member - failure from security", () => {
            //act
            sys.accessMarketplace(sess5);
            let res = sys.registerMember(sess5, {username: username1, password: pass1});

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
    })

        test("get shop", () => {
            //prepare
            sys.accessMarketplace(sess1);

            //act
            let res = sys.getShop(sess1, shop1.id);
            expect(res.ok).toBe(true);
            expect(res.data).toBeDefined()
            let data: SimpleShop = res.data as SimpleShop;
            expect(data.ID).toBe(shop.ID);
        })

        test("search product", () => {
            //prepare
            sys.accessMarketplace(sess1);

            //act
            let res = sys.searchProducts(sess1, SearchType.productName, "ps1");

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).toEqual([simple_p1]);
        })

        test("add to cart - success", () => {
            //prepare
            sys.accessMarketplace(sess1);

            //act
            let res = sys.addToCart(sess1, simple_p1.productID, 2);

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("add to cart - failure", () => {
            //act

            let res = sys.addToCart(username1, p1.id, 2);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("get cart", () => {
            //prepare
            sys.accessMarketplace(sess1);

            //act
            let res = sys.getCart(sess1);

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).toBeDefined();
            expect(res.data).toEqual(toSimpleShoppingCart(sess1, cart1));
        })

        test("remove product from cart", () => {
            //prepare
            sys.accessMarketplace(sess1);
            sys.addToCart(username1, p1.id, 2);

            //act
            let res = sys.removeProductFromCart(username1, p1.id);

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("checkout - success", async() => {
            //prepare
            sys.accessMarketplace(sess1);
            sys.addToCart(username1, p1.id, 2);

            //act
            let res = await sys.checkout(username1, paymentDetails, deliveryDetails)

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("checkout - failure", async(done) => {
            //prepare
            sys.accessMarketplace(sess1);
            sys.addToCart(username1, p1.id, 2);
            sys.removeProductFromCart(username1, p1.id);

            //act
            let res = await sys.checkout(username1, paymentDetails, deliveryDetails)

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("setup shop", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});

            //act
            let res = sys.setUpShop(sess4, "shop1");

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).toBeDefined();
        })

        test("setup shop - failed", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});

            //act
            let res = sys.setUpShop(username1, "shop1");

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("add product to shop - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.addProduct(username1, {
                shopId: p1.shopId,
                productCategory: p1.category,
                productName: p1.name,
                quantity: 5,
                fullPrice: p1.fullPrice
            })

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("add product to shop - failure - permissions", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.addProduct(username2, {
                shopId: p1.shopId,
                productCategory: p1.category,
                productName: p1.name,
                quantity: 5,
                fullPrice: p1.fullPrice
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("add product to shop - failure - addProduct", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.addProduct(username1, {
                shopId: p1.shopId,
                productCategory: p1.category,
                productName: p1.name,
                quantity: 5,
                fullPrice: p1.fullPrice
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("delete product - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.addProduct(username1, {
                shopId: p1.shopId,
                productCategory: p1.category,
                productName: p1.name,
                quantity: 5,
                fullPrice: p1.fullPrice
            })

            //act
            let res = sys.deleteProduct(username1, shop1.id, shop1.id);

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("delete product - failure - permissions", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.addProduct(username1, {
                shopId: p1.shopId,
                productCategory: p1.category,
                productName: p1.name,
                quantity: 5,
                fullPrice: p1.fullPrice
            });
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.deleteProduct(username2, shop1.id, p1.id);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("delete product - failure - remove", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.deleteProduct(username1, shop1.id, p1.id);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("update product - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.addProduct(username1, {
                shopId: p1.shopId,
                productCategory: p1.category,
                productName: p1.name,
                quantity: 5,
                fullPrice: p1.fullPrice
            });

            //act
            let res = sys.updateProductQuantity(username1, shop1.id, shop1.id, 6);

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("update product - failure - permissions", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.addProduct(username1, {
                shopId: p1.shopId,
                productCategory: p1.category,
                productName: p1.name,
                quantity: 5,
                fullPrice: p1.fullPrice
            });
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.updateProductQuantity(username1, shop1.id, p1.id, 6);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("update product - failure - update", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.updateProductQuantity(username1, shop1.id, p1.id, 5);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

    describe("appoint owner", () => {
        test("appoint owner - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});

            //act
            let res = sys.appointShopOwner(sess4, {
                member: username2,
                shopId: shop1.id,
                assigner: username1,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("appoint owner - failure - permissions", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.appointShopOwner(sess4, {
                member: username1,
                shopId: shop1.id,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
        test("appoint owner - failure - addRole - nominee doesn't exist", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.appointShopOwner(sess4, {
                member: username2,
                shopId: shop1.id,
                assigner: username1,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("appoint owner - failure - appointShopOwner - no shop", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});

            //act
            let res = sys.appointShopOwner(sess4, {
                member: username2,
                shopId: shop1.id,
                assigner: username1,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
    })

    describe("appoint manager", () => {
        test("appoint manager - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});

            //act
            let res = sys.appointShopManager(sess4, {
                member: username2,
                shopId: shop1.id,
                assigner: username1,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("appoint manager - failure - permissions", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.appointShopManager(sess4, {
                member: username1,
                shopId: shop1.id,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("appoint manager - failure - addRole - nominee doesn't exist", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.appointShopManager(sess4, {
                member: username2,
                shopId: shop1.id,
                assigner: username1,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("appoint manager - failure - appointShopOwner - no shop", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});

            //act
            let res = sys.appointShopManager(sess4, {
                member: username2,
                shopId: shop1.id,
                assigner: username1,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
    })


    describe('add permissions to shop manager', () => {
        test("add permissions to shop manager - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});

            //act
            let res = sys.addShopManagerPermission(username1, username2, shop1.id, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("add permissions to shop manager - failure - permissions", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.addShopManagerPermission(username2, username1, shop1.id, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("add permissions to shop manager - failure - no user", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.addShopManagerPermission(username1, username2, shop1.id, Permissions.AddProduct);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
    });

    describe('add permissions to shop manager', () => {
        test("remove shop manager permissions - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.addShopManagerPermission(username1, username2, shop1.id, Permissions.AddProduct);

            //act
            let res = sys.removeShopManagerPermission(username1, username2, shop1.id, Permissions.AddProduct);

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("remove shop manager permissions - failure - checkPermission", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.removeShopManagerPermission(username2, username1, shop1.id, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("remove shop manager permissions - failure - remove - no member", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.removeShopManagerPermission(username1, username2, shop1.id, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
    });


    describe('deactivate shop', () => {
        test("deactivate shop - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);

            //act
            let res = sys.deactivateShop(username1, shop1.id);

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("deactivate shop - failure - permissions", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.deactivateShop(username2, shop1.id);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("deactivate shop - failure to deactivate", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});

            //act
            let res = sys.deactivateShop(username1, shop1.id);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
    });

    describe('reactivate shop', () => {
        test("reactivate shop - success", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.deactivateShop(username1, shop1.id);

            //act
            let res = sys.reactivateShop(username1, shop1.id);

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
        })

        test("reactivate shop - failure - permissions", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});
            sys.setUpShop(username1, shop1.name);
            sys.deactivateShop(username1, shop1.id);
            sys.accessMarketplace(sess5);
            sys.registerMember(sess5, {username: username2, password: pass2});
            sys.login(sess5, {username: username2, password: pass2});

            //act
            let res = sys.reactivateShop(username2, shop1.id);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })

        test("deactivate shop - failure to reactivate - shop doesn't exist", () => {
            //prepare
            sys.accessMarketplace(sess4);
            sys.registerMember(sess4, {username: username1, password: pass1});
            sys.login(sess4, {username: username1, password: pass1});

            //act
            let res = sys.reactivateShop(username1, shop1.id);

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
        })
    });


    test("get personnel info - success", () => {
        //prepare
        sys.accessMarketplace(sess4);
        sys.registerMember(sess4, {username: username1, password: pass1});
        sys.login(sess4, {username: username1, password: pass1});
        sys.setUpShop(username1, shop1.name);

        //act
        let res = sys.getPersonnelInfoOfShop(username1, shop1.id);

        //assert
        expect(res.ok).toBe(true);
        expect(res.data).toBeDefined()
        expect(res.data).toContain(toSimpleMember(member1));
    })

    test("get shop purchases - success", () => {
        //prepare
        sys.accessMarketplace(sess4);
        sys.registerMember(sess4, {username: username1, password: pass1});
        sys.login(sess4, {username: username1, password: pass1});
        sys.setUpShop(username1, shop1.name);

        //act
        let res = sys.getShopPurchases(username1, shop1.id, new Date(), new Date())

        //assert
        expect(res.ok).toBe(true)
        expect(res.data).toEqual([]);
    })

    test("register admin", () => {
        //prepare
        sys.accessMarketplace(sess4);

        //act
        let res = sys.registerAsAdmin(sess4, {username: username1, password: pass1});

        //assert
        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
    })

    test("edit external connection service", () => {
        //prepare
        sys.accessMarketplace(sess4);
        sys.registerAsAdmin(sess4, {username: username1, password: pass1});

        //act
        let res = sys.editConnectionWithExternalService(sess4, username1, ExternalServiceType.Payment,
                                                {min:1,max:10,url:"google.com"});

        //assert
        expect(res.ok).toBeTruthy();
        expect(res.data).not.toBeDefined();
        expect(res.message).toBe("services updated");
    })

    test("swap external connection service", () => {
        //prepare
        sys.accessMarketplace(sess4);
        sys.registerAsAdmin(sess4, {username: username1, password: pass1});

        //act
        let res = sys.swapConnectionWithExternalService(sess4, username1, ExternalServiceType.Payment, "settings");

        //assert
        expect(res.ok).toBeTruthy();
        expect(res.data).not.toBeDefined();
        expect(res.message).toBe("services swapped");
    })
})