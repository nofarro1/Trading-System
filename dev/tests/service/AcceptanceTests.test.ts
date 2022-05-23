import {Service} from "../../src/service/Service";
import {ExternalServiceType} from "../../src/utilities/Utils";
import {SimpleProduct} from "../../src/utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShop} from "../../src/utilities/simple_objects/marketplace/SimpleShop";
import {SimpleGuest} from "../../src/utilities/simple_objects/user/SimpleGuest";
import {SimpleMember} from "../../src/utilities/simple_objects/user/SimpleMember";
import {Permissions} from "../../src/utilities/Permissions";
import {SimpleShoppingCart} from "../../src/utilities/simple_objects/user/SimpleShoppingCart";
import {ProductCategory, SearchType} from "../../src/utilities/Enums";


let service:Service;
let testGuest:SimpleGuest|void;
let testShop:SimpleShop|void;
let testProducts:SimpleProduct[]|void;
let testProduct:SimpleProduct;
let testMember:SimpleMember|void;
let testShoppingCart:SimpleShoppingCart|void;


describe('System dis/connections-tests', function () {
    test('initialize marketplace-success',()=>{
        service=new Service();
        testGuest=service.accessMarketplace().data;
        if (testGuest instanceof SimpleGuest) {
            expect(service.login(testGuest.guestID, 'admin', 'admin').ok).toBe(true);
        }else fail('expected testGuest to be SimpleGuest');
        expect(service.editConnectionWithExternalService("admin", ExternalServiceType.Delivery, undefined).ok).toBe(true);
        expect(service.editConnectionWithExternalService("admin", ExternalServiceType.Payment, undefined).ok).toBe(true);
    })
    test('access marketplace-success',()=>{
        expect(testGuest).toBeInstanceOf(SimpleGuest);
    })
    test('register-success',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.register(testGuest.guestID, 'user', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel').ok).toBe(true);
            expect(service.login(testGuest.guestID,'user','pass1234').ok).toBe(true);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('register-fail',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.register(testGuest.guestID, 'user2', 'pass!', 'steve', 'jobs', 'steve@jobs.co.il', 'israel').ok).toBe(false);
            expect(service.login(testGuest.guestID,'user2','pass!').ok).toBe(false);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('register-fail',()=>{
        expect(service.register(-1,'user3','pass1234','steve','jobs','steve@jobs.co.il','israel').ok).toBe(false);
        expect(service.login(-1,'user3','pass1234').ok).toBe(false);
    })
    test('register-fail',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.register(testGuest.guestID, 'user', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel').ok).toBe(false);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('register admin-success',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.registerAdmin(testGuest.guestID, 'newadmin', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel').ok).toBe(true);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('register admin-fail',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.register(testGuest.guestID, 'admin2', 'pass!', 'steve', 'jobs', 'steve@jobs.co.il', 'israel').ok).toBe(false);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('register admin-fail',()=>{
        expect(service.register(-1,'user3','pass1234','steve','jobs','steve@jobs.co.il','israel').ok).toBe(false);
    })
    test('register admin-fail',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.register(testGuest.guestID, 'newadmin', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel').ok).toBe(false);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('login-success',()=>{
        if (testGuest instanceof SimpleGuest) {
            service.register(testGuest.guestID, 'Loginuser', 'pass1234', 'steve', 'jobs', 'steve@jobs.co.il', 'israel');
            expect(service.login(testGuest.guestID, 'Loginuser', 'pass1234').ok).toBe(true);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('login-fail',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.login(testGuest.guestID, 'Loginuser', 'pass1234').ok).toBe(false);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('login-fail',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.login(testGuest.guestID, 'wuser', 'pass1234').ok).toBe(false);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('login-fail',()=>{
        expect(service.login(-1,'user','pass1234').ok).toBe(false);
    })
    test('logout-success',()=>{
        expect(service.logout('Loginuser').ok).toBe(true);
    })
    test('logout-fail',()=>{
        expect(service.logout('wuser').ok).toBe(false);
    })
    test('logout-fail',()=>{
        expect(service.logout('user').ok).toBe(false);
    })
    test('exit marketplace-success',()=>{
        if (testGuest instanceof SimpleGuest) {
            expect(service.exitMarketplace(testGuest.guestID).ok).toBe(true);
        }else fail('expected testGuest to be SimpleGuest');
    })
    test('exit marketplace-fail',()=>{
        expect(service.exitMarketplace(-1).ok).toBe(false);
    })
})
describe('SimpleShop-tests', function () {

    beforeAll(function () {
        service=new Service();
        testGuest=service.accessMarketplace().data;
        if (testGuest instanceof SimpleGuest) {
            service.register(testGuest.guestID,'user','pass1234','steve','jobs','steve@jobs.co.il','israel');
            service.register(testGuest.guestID,'notpermitted','pass1234','bill','gates','bill@gates.co.il','israel');
            testMember = service.login(testGuest.guestID, 'user', 'pass1234').data;
        }
        if (testMember instanceof SimpleMember) {
            testShop = service.setUpShop('zara', testMember.username).data;
        }
        expect(testMember).toBeInstanceOf(SimpleMember);
        expect(testGuest).toBeInstanceOf(SimpleGuest);
        expect(testShop).toBeInstanceOf(SimpleShop);
    })
    test('set up shop-success',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.setUpShop(testMember.username,'footlocker').data).toBeInstanceOf(SimpleShop);
        }else fail('expected testMember to be SimpleMember');
    })
    test('set up shop-fail',()=>{
        expect(service.setUpShop('nonuser','ikea').ok).toBe(false);
    })
    test('get shop info-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect(service.getShopInfo(testMember.username, testShop.ID).data).toBeInstanceOf(SimpleShop);
        }else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
    })
    test('get shop info-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.getShopInfo(testMember.username, -1).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('get shop info-fail',()=>{
        if (testShop instanceof SimpleShop) {
            expect(service.getShopInfo(-1, testShop.ID).ok).toBe(false);
        }else fail('expected testShop to be shop');
    })
    test('add product-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect(service.addProductToShop(testMember.username, testShop.ID, ProductCategory.A, 'white shirt' ,50, 10).ok).toBe(true);
        }else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
    })
    test('add product-fail',()=>{
        if (testShop instanceof SimpleShop) {
            expect(service.addProductToShop('nonuser', testShop.ID, ProductCategory.A, 'white shirt',50, 10 ).ok).toBe(false);
        }else fail('expected testShop to be shop');
    })
    test('add product-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
            expect(service.addProductToShop(testMember.username, testShop.ID, ProductCategory.A, 'white shirt',-50, 10).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
    })
    test('add product-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
        expect(service.addProductToShop(testMember.username,testShop.ID,ProductCategory.A, 'white shirt',50,-10).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
    })
    test('search products-success',()=>{
        if (testGuest instanceof SimpleGuest) {
            testProducts = service.searchProducts(testGuest.guestID, SearchType.category, "product").data;
            expect(service.searchProducts(testGuest.guestID, SearchType.category, "product").data).toHaveLength(1);
        }else fail('expected test guest to be SimpleGuest');
    })
    test('search products-fail',()=>{
        expect(service.searchProducts(-1,SearchType.category, "product").ok).toBe(false);
    })
    test('modify product-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop && testProducts instanceof Array) {
        expect(service.modifyProductQuantityInShop(testMember.username,testShop.ID,testProducts[0].productID,15).ok).toBe(true);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop and testProducts to be array of products');
    })
    test('modify product-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
        expect(service.modifyProductQuantityInShop(testMember.username,testShop.ID,-1,15).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
    })
    test('modify product-fail',()=>{
        if (testMember instanceof SimpleMember && testProducts instanceof Array) {
        expect(service.modifyProductQuantityInShop(testMember.username,-1,testProducts[0].productID,15).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember and testProducts to be array of products');
    })
    test('modify product-fail',()=>{
        if (testShop instanceof SimpleShop && testProducts instanceof Array) {
        expect(service.modifyProductQuantityInShop('notpermitted',testShop.ID,testProducts[0].productID,15).ok).toBe(false);
        }else fail('testShop to be SimpleShop and testProducts to be array of products');
    })
    test('modify product-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop && testProducts instanceof Array) {
        expect(service.modifyProductQuantityInShop(testMember.username,testShop.ID,testProducts[0].productID,-15).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop and testProducts to be array of products');
    })
    test('remove product-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop && testProducts instanceof Array) {
        expect(service.removeProductFromShop(testMember.username,testShop.ID,testProducts[0].productID).ok).toBe(true);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop and testProducts to be array of products');
    })
    test('remove product-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop) {
        expect(service.removeProductFromShop(testMember.username,testShop.ID,-1).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember and testShop to be SimpleShop');
    })
    test('remove product-fail',()=>{
        if (testMember instanceof SimpleMember && testProducts instanceof Array) {
        expect(service.removeProductFromShop(testMember.username,-1,testProducts[0].productID).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember and testProducts to be array of products');
    })
    test('remove product-fail',()=>{
        if (testShop instanceof SimpleShop && testProducts instanceof Array) {
        expect(service.removeProductFromShop('notpermitted',testShop.ID,testProducts[0].productID).ok).toBe(false);
        }else fail('testShop to be SimpleShop and testProducts to be array of products');
    })
    test('get purchase history-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.getShopPurchaseHistory(testMember.username,testShop.ID,new Date('2022-03-20'),new Date('2022-04-20')).data).toBeInstanceOf(Array);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('get purchase history-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.getShopPurchaseHistory(testMember.username,testShop.ID,new Date('2022-05-20'),new Date('2022-04-20')).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('get purchase history-fail',()=>{
        if (testShop instanceof SimpleShop ) {
            expect(service.getShopPurchaseHistory('notpermitted',testShop.ID,new Date('2022-03-20'),new Date('2022-04-20')).ok).toBe(false);
        }else fail('expected testShop to be SimpleShop');
    })
    test('get purchase history-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.getShopPurchaseHistory(testMember.username,-1,new Date('2022-03-20'),new Date('2022-04-20')).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('close shop-fail',()=>{
        if (testShop instanceof SimpleShop )  {
            expect(service.closeShop('notpermitted',testShop.ID).ok).toBe(false);
        }else fail('expected testShop to be SimpleShop');
    })
    test('close shop-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.closeShop(testMember.username,testShop.ID).ok).toBe(true);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })

})
describe('SimpleShop Management-tests', function () {

    beforeAll(function () {
        service=new Service();
        testGuest = service.accessMarketplace().data;
        if (testGuest instanceof SimpleGuest) {
            service.register(testGuest.guestID, 'founder', 'pass1234', 'shahar', 'alon', 'shahar@alon.co.il', 'israel');
            service.register(testGuest.guestID, 'owner', 'pass1234', 'elon', 'mask', 'elon@mask.co.il', 'israel');
            service.register(testGuest.guestID, 'manager', 'pass1234', 'jeff', 'bezos', 'jeff@bezos.co.il', 'israel');
            testMember=service.login(testGuest.guestID,'founder','pass1234').data;
        }
        if (testMember instanceof SimpleMember) {
            testShop = service.setUpShop('zara', testMember.username).data;
        }
        expect(testMember).toBeInstanceOf(SimpleMember);
        expect(testGuest).toBeInstanceOf(SimpleGuest);
        expect(testShop).toBeInstanceOf(SimpleShop);
    })
    test('appoint shop manager-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.appointShopManager('manager',testShop.ID,testMember.username).ok).toBe(true);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('appoint shop manager-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.appointShopManager('manager',-1,testMember.username).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('appoint shop manager-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.appointShopManager('nonuser',testShop.ID,testMember.username).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('appoint shop owner-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.appointShopOwner('owner',testShop.ID,testMember.username).ok).toBe(true);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('appoint shop owner-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.appointShopOwner('owner',-1,testMember.username).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('appoint shop owner-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.appointShopOwner('nonuser',testShop.ID,testMember.username).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('request shop personnel-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.requestShopPersonnelInfo(testMember.username,testShop.ID).ok).toBe(true);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('request shop personnel-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.requestShopPersonnelInfo(testMember.username,-1).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('request shop personnel-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.requestShopPersonnelInfo('notpermitted',testShop.ID).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('add permissions-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            service.addPermissions(testMember.username,'manager',testShop.ID,Permissions.RequestPersonnelInfo);
            expect(service.requestShopPersonnelInfo('manager',testShop.ID).ok).toBe(true);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('add permissions-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.addPermissions(testMember.username,'nonuser',testShop.ID,Permissions.RequestPersonnelInfo).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('add permissions-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.addPermissions('user','manager',testShop.ID,Permissions.RequestPersonnelInfo).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('remove permissions-success',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            service.removePermissions(testMember.username,'manager',testShop.ID,Permissions.RequestPersonnelInfo);
            expect(service.requestShopPersonnelInfo('manager',testShop.ID).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('remove permissions-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.removePermissions(testMember.username,'manager',testShop.ID,Permissions.RemoveProduct).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })
    test('remove permissions-fail',()=>{
        if (testMember instanceof SimpleMember && testShop instanceof SimpleShop ) {
            expect(service.removePermissions('user','manager',testShop.ID,Permissions.RemoveProduct).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember, testShop to be SimpleShop');
    })

})
describe('Shopping cart-tests', function () {
    beforeAll(function () {
        service=new Service();
        testGuest = service.accessMarketplace().data;
        if (testGuest instanceof SimpleGuest) {
            service.register(testGuest.guestID, 'founder', 'pass1234', 'shahar', 'alon', 'shahar@alon.co.il', 'israel');
            testMember=service.login(testGuest.guestID,'founder','pass1234').data;
        }
        if (testMember instanceof SimpleMember) {
            testShop = service.setUpShop('zara', testMember.username).data;
            if(testShop instanceof SimpleShop) {
                service.addProductToShop(testMember.username, testShop.ID, ProductCategory.A, 'blue shirt', 50, 10);
                service.addProductToShop(testMember.username, testShop.ID, ProductCategory.A, 'red shirt', 50, 10);
                testProducts = service.searchProducts(testMember.username, SearchType.category, "product").data;
                if(testProducts instanceof Array)
                    testProduct=testProducts[0];
            }
        }
        expect(testMember).toBeInstanceOf(SimpleMember);
        expect(testGuest).toBeInstanceOf(SimpleGuest);
        expect(testShop).toBeInstanceOf(SimpleShop);
    })
    test('add to cart-success',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.addToCart(testMember.username,testProduct.productID,5).ok).toBe(true);
            testShoppingCart=service.checkShoppingCart(testMember.username).data;
            if(testShoppingCart instanceof SimpleShoppingCart) {
                expect(testShoppingCart.products.has(testProduct)).toBe(true);
            }fail('expected testShoppingCart to be SimpleShoppingCart');
        }else fail('expected testMember to be SimpleMember');
    })
    test('add to cart-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.addToCart(testMember.username,testProduct.productID,15).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('add to cart-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.addToCart(testMember.username,-1,5).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('remove from cart-success',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.removeFromCart(testMember.username,testProduct.productID).ok).toBe(true);
            testShoppingCart=service.checkShoppingCart(testMember.username).data;
            if(testShoppingCart instanceof SimpleShoppingCart) {
                expect(testShoppingCart.products.has(testProduct)).toBe(false);
            }fail('expected testShoppingCart to be SimpleShoppingCart');
        }else fail('expected testMember to be SimpleMember');
    })
    test('remove from cart-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.removeFromCart(testMember.username,-1).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('edit product in cart-success',()=>{
        if (testMember instanceof SimpleMember) {
            service.addToCart(testMember.username,testProduct.productID,5);
            expect(service.editProductInCart(testMember.username,testProduct.productID,7).ok).toBe(true);
            if(testShoppingCart instanceof SimpleShoppingCart) {
                expect(testShoppingCart.products.get(testProduct)).toBe(7);
            }fail('expected testShoppingCart to be SimpleShoppingCart');
        }else fail('expected testMember to be SimpleMember');
    })
    test('edit product in cart-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.editProductInCart(testMember.username,testProduct.productID,15).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('check cart-success',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.checkShoppingCart(testMember.username).data).toBeInstanceOf(SimpleShoppingCart);
        }else fail('expected testMember to be SimpleMember');
    })
    test('check cart-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.checkShoppingCart(-1).ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
    test('checkout-success',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.checkout(testMember.username,'payment','address').ok).toBe(true);
        }else fail('expected testMember to be SimpleMember');
    })
    test('checkout-fail',()=>{
        if (testMember instanceof SimpleMember) {
            expect(service.checkout(-1,'payment','address').ok).toBe(false);
        }else fail('expected testMember to be SimpleMember');
    })
})

describe('External Connection-tests', function (){
    beforeAll(function () {
        service=new Service();
    })
    test('edit external connection-success',()=>{
        expect(service.editConnectionWithExternalService('admin',ExternalServiceType.Delivery,'setting1').ok).toBe(true);
    })
    test('edit external connection-fail',()=>{
        expect(service.editConnectionWithExternalService('notadmin',ExternalServiceType.Delivery,'setting1').ok).toBe(false);
    })
    test('edit external connection-fail',()=>{
        expect(service.editConnectionWithExternalService('admin',-1,'setting1').ok).toBe(false);
    })
    test('swap external connection-success',()=>{
        expect(service.swapConnectionWithExternalService('admin',ExternalServiceType.Delivery,'ups').ok).toBe(true);
    })
    test('swap external connection-fail',()=>{
        expect(service.swapConnectionWithExternalService('notadmin',ExternalServiceType.Delivery,'ups').ok).toBe(false);
    })
    test('swap external connection-fail',()=>{
        expect(service.swapConnectionWithExternalService('admin',-1,'ups').ok).toBe(false);
    })

})

