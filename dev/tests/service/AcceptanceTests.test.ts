import {Service} from "../../src/service/Service";
import {ExternalServiceType} from "../../src/utilities/Utils";
import {SimpleProduct} from "../../src/utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShop} from "../../src/utilities/simple_objects/marketplace/SimpleShop";
import {SimpleGuest} from "../../src/utilities/simple_objects/user/SimpleGuest";
import {SimpleMember} from "../../src/utilities/simple_objects/user/SimpleMember";
import {Permissions} from "../../src/utilities/Permissions";
import {SimpleShoppingCart} from "../../src/utilities/simple_objects/user/SimpleShoppingCart";
import {ProductCategory, SearchType} from "../../src/utilities/Enums";
import {TYPES} from "../../src/helpers/types";
import {systemContainer} from "../../src/helpers/inversify.config";
import {PaymentDetails} from "../../src/domain/external_services/IPaymentService";
import {DeliveryDetails} from "../../src/domain/external_services/IDeliveryService";


let service: Service;
let testGuest: SimpleGuest | void;
let testShop: SimpleShop | void;
let testProducts: SimpleProduct[] | void;
let testProduct: SimpleProduct;
let testMember: SimpleMember | void;
let testShoppingCart: SimpleShoppingCart | void;
let guestSession: string;
let memberSession: string;
let adminSession: string;
let memberUsername: string;
let adminUsername: string;
let memberPassword: string;
let adminPassword: string;

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

describe('System dis/connections-tests', function () {
    beforeAll(() => {
        guestSession = "guest session";
        memberSession = "member session";
        adminSession = "admin session";
        memberUsername = "member";
        adminUsername = "admin";
        memberPassword = "password";
        adminPassword = "admin";
    })

    //System1
    //Asserting there's delivery and payment external services **Constraint11**
    //Asserting there's atleast one system manager **Constraint2**
    test('initialize marketplace-success', async (done) => {
        service = systemContainer.get(TYPES.Service);
        testGuest = (await service.accessMarketplace(adminSession)).data;
        if (testGuest instanceof SimpleGuest) {
            expect((await service.login(testGuest.guestID, adminUsername, adminPassword)).ok).toBe(true);
        } else fail('expected testGuest to be SimpleGuest');
        expect((await service.editConnectionWithExternalService(adminSession, adminUsername, ExternalServiceType.Delivery, undefined)).ok).toBe(true);
        expect((await service.editConnectionWithExternalService(adminSession, adminUsername, ExternalServiceType.Payment, undefined)).ok).toBe(true);
        done();
    })
    //User1.1
    test('access marketplace-success', () => {
        expect(testGuest).toBeInstanceOf(SimpleGuest);
    })
    //User1.3
    //Register with valid info
    test('register-success', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.register(testGuest.guestID, 'user', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel')).ok).toBe(true);
            expect((await service.login(testGuest.guestID, 'user', 'pass1234')).ok).toBe(true);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })
    //Register with invalid password
    test('register-fail', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.register(testGuest.guestID, 'user2', 'pass!', 'steve', 'jobs', 'steve@jobs.co.il', 'israel')).ok).toBe(false);
            expect((await service.login(testGuest.guestID, 'user2', 'pass!')).ok).toBe(false);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })
    //Register with invalid session **Constraint4**
    test('register-fail', async (done) => {
        expect((await service.register("-1", 'user3', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel')).ok).toBe(false);
        expect((await service.login("-1", 'user3', 'pass1234')).ok).toBe(false);
        done();
    })
    //Register with already used username **Constraint1**
    test('register-fail', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.register(testGuest.guestID, 'user', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel')).ok).toBe(false);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })

    test('register admin-success', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.registerAdmin(testGuest.guestID, 'newadmin', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel')).ok).toBe(true);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })

    test('register admin-fail', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.register(testGuest.guestID, 'admin2', 'pass!', 'steve', 'jobs', 'steve@jobs.co.il', 'israel')).ok).toBe(false);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })

    test('register admin-fail', async (done) => {
        expect((await service.register("-1", 'user3', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel')).ok).toBe(false);
        done();
    })

    test('register admin-fail', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.register(testGuest.guestID, 'newadmin', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel')).ok).toBe(false);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })
    //User1.4
    test('login-success', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            (await service.register(testGuest.guestID, 'Loginuser', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel'));
            expect((await service.login(testGuest.guestID, 'Loginuser', 'pass1234')).ok).toBe(true);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })
    test('login-fail', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.login(testGuest.guestID, 'Loginuser', 'pass12345')).ok).toBe(false);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })
    test('login-fail', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.login(testGuest.guestID, 'wuser', 'pass1234')).ok).toBe(false);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })
    //Login with invalid session **Constraint4**
    test('login-fail', async (done) => {
        expect((await service.login("-1", 'user', 'pass1234')).ok).toBe(false);
        done();
    })
    //User3.1
    test('logout-success', async (done) => {
        expect((await service.logout("1", 'Loginuser')).ok).toBe(true);
        done();
    })

    test('logout-fail', async (done) => {
        expect((await service.logout("-1", 'user')).ok).toBe(false);
        done();
    })

    test('logout-fail', async (done) => {
        expect((await service.logout("-1", 'user')).ok).toBe(false);
        done();
    })
    //User1.2
    test('exit marketplace-success', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            expect((await service.exitMarketplace(testGuest.guestID)).ok).toBe(true);
        } else fail('expected testGuest to be SimpleGuest');
        done();
    })

    test('exit marketplace-fail', async (done) => {
        expect((await service.exitMarketplace("-1")).ok).toBe(false);
        done();
    })
})

describe('SimpleShop-tests', function () {
    beforeAll(async function (done) {
        service = systemContainer.get(TYPES.Service);
        testGuest = (await service.accessMarketplace("1")).data;
        if (testGuest instanceof SimpleGuest) {
            (await service.register(testGuest.guestID, 'user', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel'));
            (await service.register(testGuest.guestID, 'notpermitted', 'pass1234', 'bill', 'gates', 'bill@gates.co.il', 'israel'));
            testMember = (await service.login(testGuest.guestID, 'user', 'pass1234')).data;
        }
        if (testMember instanceof SimpleMember) {
            testShop = (await service.setUpShop("1", 'zara', testMember.username)).data;
        }
        expect(testMember).toBeInstanceOf(SimpleMember);
        expect(testGuest).toBeInstanceOf(SimpleGuest);
        expect(testShop).toBeInstanceOf(SimpleShop);
        done();
    })
    //User3.2
    test('set up shop-success', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.setUpShop("1", testMember.username, 'footlocker')).data).toBeInstanceOf(SimpleShop);
        } else fail('expected testMember to be SimpleMember');
        done();
    })
    //Setting up shop non-member **Constraint3**
    test('set up shop-fail', async (done) => {
        expect((await service.setUpShop("2", 'nonuser', 'ikea')).ok).toBe(false);
        done();
    })
    //User2.1
    test('get shop info-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.getShopInfo(testMember.username, testShop.ID)).data).toBeInstanceOf(SimpleShop);
        } else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
        done();
    })

    test('get shop info-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.getShopInfo(testMember.username, -1)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('get shop info-fail', async (done) => {
        if (testShop instanceof SimpleShop) {
            expect((await service.getShopInfo("-1", testShop.ID)).ok).toBe(false);
        } else fail('expected testShop to be shop');
        done();
    })
    //User4.1
    test('add product-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.addProductToShop("1", testShop.ID, ProductCategory.A, 'white shirt', 50, 10)).ok).toBe(true);
        } else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
        done();
    })

    test('add product-fail', async (done) => {
        if (testShop instanceof SimpleShop) {
            expect((await service.addProductToShop("-1",  testShop.ID, ProductCategory.A, 'white shirt', 50, 10)).ok).toBe(false);
        } else fail('expected testShop to be shop');
        done();
    })

    test('add product-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.addProductToShop("1", testShop.ID, ProductCategory.A, 'white shirt', -50, 10)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
        done();
    })
    //Asserting quantity can't be negative **Constraint9**
    test('add product-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.addProductToShop("1", testShop.ID, ProductCategory.A, 'white shirt', 50, -10)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
        done();
    })
    //User2.2
    test('search products-success', async (done) => {
        if (testGuest instanceof SimpleGuest) {
            testProducts = (await service.searchProducts(testGuest.guestID, SearchType.category, "product")).data;
            expect((await service.searchProducts(testGuest.guestID, SearchType.category, "product")).data).toHaveLength(1);
        } else fail('expected test guest to be SimpleGuest');
        done();
    })

    test('search products-fail', async (done) => {
        expect((await service.searchProducts("-1", SearchType.category, "product")).ok).toBe(false);
        done();
    })
    //User4.1
    test('modify product-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop && testProducts instanceof Array) {
            expect((await service.modifyProductQuantityInShop("1", testMember.username, testShop.ID, testProducts[0].productID, 15)).ok).toBe(true);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop and testProducts to be array of products');
        done();
    })

    test('modify product-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.modifyProductQuantityInShop("1", testMember.username, testShop.ID, -1, 15)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
        done();
    })

    test('modify product-fail', async (done) => {
        if (testMember instanceof SimpleMember && testProducts instanceof Array) {
            expect((await service.modifyProductQuantityInShop("1", testMember.username, -1, testProducts[0].productID, 15)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember and testProducts to be array of products');
        done();
    })

    test('modify product-fail', async (done) => {
        if (testShop instanceof SimpleShop && testProducts instanceof Array) {
            expect((await service.modifyProductQuantityInShop("-1", 'notpermitted', testShop.ID, testProducts[0].productID, 15)).ok).toBe(false);
        } else fail('testShop to be SimpleShop and testProducts to be array of products');
        done();
    })
    //Asserting quantity can't be negative **Constraint9**
    test('modify product-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop && testProducts instanceof Array) {
            expect((await service.modifyProductQuantityInShop("1", testMember.username, testShop.ID, testProducts[0].productID, -15)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop and testProducts to be array of products');
        done();
    })
    //User4.1
    test('remove product-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop && testProducts instanceof Array) {
            expect((await service.removeProductFromShop("1", testShop.ID, testProducts[0].productID)).ok).toBe(true);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop and testProducts to be array of products');
        done();
    })

    test('remove product-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.removeProductFromShop("1", testShop.ID, -1)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
        done();
    })

    test('remove product-fail', async (done) => {
        if (testMember instanceof SimpleMember && testProducts instanceof Array) {
            expect((await service.removeProductFromShop("1", -1, testProducts[0].productID)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember and testProducts to be array of products');
        done();
    })

    test('remove product-fail', async (done) => {
        if (testShop instanceof SimpleShop && testProducts instanceof Array) {
            expect((await service.removeProductFromShop("-1", testShop.ID, testProducts[0].productID)).ok).toBe(false);
        } else fail('testShop to be SimpleShop and testProducts to be array of products');
        done();
    })
    //User4.13
    test('get purchase history-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.getShopPurchaseHistory("1", testMember.username, testShop.ID, new Date('2022-03-20'), new Date('2022-04-20'))).data).toBeInstanceOf(Array);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('get purchase history-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.getShopPurchaseHistory("1", testMember.username, testShop.ID, new Date('2022-08-20'), new Date('2022-04-20'))).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('get purchase history-fail', async (done) => {
        if (testShop instanceof SimpleShop) {
            expect((await service.getShopPurchaseHistory("-1", 'notpermitted', testShop.ID, new Date('2022-03-20'), new Date('2022-04-20'))).ok).toBe(false);
        } else fail('expected testShop to be SimpleShop');
        done();
    })

    test('get purchase history-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.getShopPurchaseHistory("1", testMember.username, -1, new Date('2022-03-20'), new Date('2022-04-20'))).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })
    //User4.9
    test('close shop-fail', async (done) => {
        if (testShop instanceof SimpleShop) {
            expect((await service.closeShop("-1", 'notpermitted', testShop.ID)).ok).toBe(false);
        } else fail('expected testShop to be SimpleShop');
        done();
    })

    test('close shop-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.closeShop("1", testMember.username, testShop.ID)).ok).toBe(true);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })
})

describe('SimpleShop Management-tests', function () {
    beforeAll(async function (done) {
        service = systemContainer.get(TYPES.Service);
        testGuest = (await service.accessMarketplace("1")).data;
        if (testGuest instanceof SimpleGuest) {
            (await service.register(testGuest.guestID, 'founder', 'pass1234', 'shahar', 'alon', 'shahar@alon.co.il', 'israel'));
            (await service.register(testGuest.guestID, 'owner', 'pass1234', 'elon', 'mask', 'elon@mask.co.il', 'israel'));
            (await service.register(testGuest.guestID, 'manager', 'pass1234', 'jeff', 'bezos', 'jeff@bezos.co.il', 'israel'));
            testMember = (await service.login(testGuest.guestID, 'founder', 'pass1234')).data;
        }
        if (testMember instanceof SimpleMember) {
            testShop = (await service.setUpShop("1", 'zara', testMember.username)).data;
        }
        expect(testMember).toBeInstanceOf(SimpleMember);
        expect(testGuest).toBeInstanceOf(SimpleGuest);
        expect(testShop).toBeInstanceOf(SimpleShop);
        done();
    })
    //User4.6
    test('appoint shop manager-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.appointShopManager("1", 'manager', testShop.ID, testMember.username)).ok).toBe(true);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('appoint shop manager-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.appointShopManager("1", 'manager', -1, testMember.username)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('appoint shop manager-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.appointShopManager("-1", 'nonuser', testShop.ID, testMember.username)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })
    //User4.4
    // test('appoint shop owner-success', async (done) => {
    //     if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
    //         expect((await service.appointShopOwner("1", 'owner', testShop.ID, testMember.username)).ok).toBe(true);
    //     } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    //     done();
    // })

    // test('appoint shop owner-fail', async (done) => {
    //     if (testMember instanceof SimpleMember) {
    //         expect((await service.appointShopOwner("1", 'owner', -1, testMember.username)).ok).toBe(false);
    //     } else fail('expected testMember to be SimpleMember');
    //     done();
    // })
    //
    // test('appoint shop owner-fail', async (done) => {
    //     if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
    //         expect((await service.appointShopOwner("-1", 'nonuser', testShop.ID, testMember.username)).ok).toBe(false);
    //     } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    //     done();
    // })
    //User4.11
    test('request shop personnel-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.requestShopPersonnelInfo("1", testMember.username, testShop.ID)).ok).toBe(true);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('request shop personnel-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.requestShopPersonnelInfo("1", testMember.username, -1)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('request shop personnel-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.requestShopPersonnelInfo("-1", 'notpermitted', testShop.ID)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })
    //User4.7
    test('add permissions-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            (await service.addPermissions("1", testMember.username, 'manager', testShop.ID, Permissions.RequestPersonnelInfo));
            expect((await service.requestShopPersonnelInfo("1", 'manager', testShop.ID)).ok).toBe(true);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('add permissions-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.addPermissions("1", testMember.username, 'nonuser', testShop.ID, Permissions.RequestPersonnelInfo)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('add permissions-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.addPermissions("2", 'user', 'manager', testShop.ID, Permissions.RequestPersonnelInfo)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('remove permissions-success', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            (await service.removePermissions("1", testMember.username, 'manager', testShop.ID, Permissions.RequestPersonnelInfo));
            expect((await service.requestShopPersonnelInfo("1", 'manager', testShop.ID)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('remove permissions-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.removePermissions("1", testMember.username, 'manager', testShop.ID, Permissions.RemoveProduct)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })

    test('remove permissions-fail', async (done) => {
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect((await service.removePermissions("2", 'user', 'manager', testShop.ID, Permissions.RemoveProduct)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
        done();
    })
})

describe('Shopping cart-tests', function () {
    beforeAll(async function (done) {
        service = systemContainer.get(TYPES.Service);
        testGuest = (await service.accessMarketplace("1")).data;
        if (testGuest instanceof SimpleGuest) {
            (await service.register(testGuest.guestID, 'founder', 'pass1234', 'shahar', 'alon', 'shahar@alon.co.il', 'israel'));
            testMember = (await service.login(testGuest.guestID, 'founder', 'pass1234')).data;
        }
        if (testMember instanceof SimpleMember) {
            testShop = (await service.setUpShop("1", 'zara', testMember.username)).data;
            if (testShop instanceof SimpleShop) {
                (await service.addProductToShop("1", testShop.ID, ProductCategory.A, 'blue shirt', 50, 10));
                (await service.addProductToShop("1", testShop.ID, ProductCategory.A, 'red shirt', 50, 10));
                testProducts = (await service.searchProducts(testMember.username, SearchType.category, "product")).data;
                if (testProducts instanceof Array)
                    testProduct = testProducts[0];
            }
        }
        expect(testMember).toBeInstanceOf(SimpleMember);
        expect(testGuest).toBeInstanceOf(SimpleGuest);
        expect(testShop).toBeInstanceOf(SimpleShop);
        done();
    })
    //User2.3
    test('add to cart-success', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.addToCart(testMember.username, testProduct.shopID, testProduct.productID, 5)).ok).toBe(true);
            testShoppingCart = (await service.checkShoppingCart(testMember.username)).data;
            if (testShoppingCart instanceof SimpleShoppingCart) {
                expect(testShoppingCart.products.has(testProduct)).toBe(true);
            }
            fail('expected testShoppingCart to be SimpleShoppingCart');
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('add to cart-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.addToCart(testMember.username, testProduct.productID, testProduct.productID, 15)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('add to cart-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.addToCart(testMember.username, -1,-1, 5)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('remove from cart-success', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.removeFromCart(testMember.username, testProduct.shopID, testProduct.productID)).ok).toBe(true);
            testShoppingCart = (await service.checkShoppingCart(testMember.username)).data;
            if (testShoppingCart instanceof SimpleShoppingCart) {
                expect(testShoppingCart.products.has(testProduct)).toBe(false);
            }
            fail('expected testShoppingCart to be SimpleShoppingCart');
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('remove from cart-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.removeFromCart(testMember.username, -1, -1)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('edit product in cart-success', async (done) => {
        if (testMember instanceof SimpleMember) {
            (await service.addToCart(testMember.username, testProduct.shopID, testProduct.productID, 5));
            expect((await service.editProductInCart(testMember.username, testProduct.productID, 7)).ok).toBe(true);
            if (testShoppingCart instanceof SimpleShoppingCart) {
                expect(testShoppingCart.products.get(testProduct)).toBe(7);
            }
            fail('expected testShoppingCart to be SimpleShoppingCart');
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('edit product in cart-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.editProductInCart(testMember.username, testProduct.productID, 15)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })
    //User2.4
    test('check cart-success', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.checkShoppingCart(testMember.username)).data).toBeInstanceOf(SimpleShoppingCart);
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('check cart-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.checkShoppingCart("-1")).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })
    //System3+4
    //User2.5
    test('checkout-success', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.checkout(testMember.username, paymentDetails, deliveryDetails)).ok).toBe(true);
        } else fail('expected testMember to be SimpleMember');
        done();
    })

    test('checkout-fail', async (done) => {
        if (testMember instanceof SimpleMember) {
            expect((await service.checkout("-1", paymentDetails, deliveryDetails)).ok).toBe(false);
        } else fail('expected testMember to be SimpleMember');
        done();
    })
})
//System2
describe('External Connection-tests', function () {
    beforeAll(function () {
        service = systemContainer.get(TYPES.Service);
    })

    test('edit external connection-success', async (done) => {
        expect((await service.editConnectionWithExternalService("1", 'admin', ExternalServiceType.Delivery, 'setting1')).ok).toBe(true);
        done();
    })

    test('edit external connection-fail', async (done) => {
        expect((await service.editConnectionWithExternalService("1", 'notadmin', ExternalServiceType.Delivery, 'setting1')).ok).toBe(false);
        done();
    })

    test('edit external connection-fail', async (done) => {
        expect((await service.editConnectionWithExternalService("1", 'admin', -1, 'setting1')).ok).toBe(false);
        done();
    })

    test('swap external connection-success', async (done) => {
        expect((await service.swapConnectionWithExternalService("1", 'admin', ExternalServiceType.Delivery, 'ups')).ok).toBe(true);
        done();
    })

    test('swap external connection-fail', async (done) => {
        expect((await service.swapConnectionWithExternalService("1", 'notadmin', ExternalServiceType.Delivery, 'ups')).ok).toBe(false);
        done();
    })

    test('swap external connection-fail', async (done) => {
        expect((await service.swapConnectionWithExternalService("1", 'admin', -1, 'ups')).ok).toBe(false);
        done();
    })
})

