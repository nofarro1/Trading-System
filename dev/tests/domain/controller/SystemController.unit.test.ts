import {SystemController} from "../../../src/domain/SystemController";
import {MessageController} from "../../../src/domain/notifications/MessageController"
import {MarketplaceController} from "../../../src/domain/marketplace/MarketplaceController";
import {PurchaseController} from "../../../src/domain/purchase/PurchaseController";
import {SecurityController} from "../../../src/domain/SecurityController";
import {UserController} from "../../../src/domain/user/UserController";
import {NotificationController} from "../../../src/domain/notifications/NotificationController";
import {Result} from "../../../src/utilities/Result";
import {Guest} from "../../../src/domain/user/Guest";
import {Member} from "../../../src/domain/user/Member";
import {ShoppingCart} from "../../../src/domain/marketplace/ShoppingCart";
import {ShoppingCartController} from "../../../src/domain/marketplace/ShoppingCartController";
import {MessageBox} from "../../../src/domain/notifications/MessageBox";
import {Product} from "../../../src/domain/marketplace/Product";
import {ProductCategory, SearchType} from "../../../src/utilities/Enums";
import {Shop} from "../../../src/domain/marketplace/Shop";

const mockDependencies = {
    SecurityController: "../../../src/domain/SecurityController",
    MessageController: "../../../src/domain/notifications/MessageController",
    MarketplaceController: "../../../src/domain/marketplace/MarketplaceController",
    PurchaseController: "../../../src/domain/purchase/PurchaseController",
    UserController: "../../../src/domain/user/UserController",
    NotificationController: "../../../src/domain/notifications/NotificationController",
}
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


describe('system controller - unit', () => {
    let sys: SystemController;
    let mpController: MarketplaceController;
    let mController: MessageController;
    let pController: PurchaseController;
    let scController: SecurityController;
    let uController: UserController;
    let notificationsController: NotificationController;

    let mpControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let mControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let pControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let scControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let uControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let notificationsControllerMockMethod: jest.SpyInstance<any, unknown[]>

    const sess1 = "1";
    let tuser1: Guest;
    let cart1: ShoppingCart;

    const sess2 = "2";
    let tuser2: Guest
    let cart2: ShoppingCart;

    const sess3 = "3";
    let tuser3: Guest;
    let cart3: ShoppingCart;

    const sess4 = "4";
    const username1 = "member1";
    const pass1 = "123456789"
    let tmember1: Member;
    let cart4: ShoppingCart;
    let box1: MessageBox;

    const sess5 = "5";
    const username2 = "member2";
    const pass2 = "123456789"
    let tmember2: Member;
    let cart5: ShoppingCart;
    let box2: MessageBox;

    const shop1 = new Shop(0, "_name", username1, "this is my shop");

    const p1 = new Product("ps1", 0, ProductCategory.A, "description", 10, 10)
    const p2 = new Product("ps2", 0, ProductCategory.A, "description", 10, 10)
    const p3 = new Product("ps3", 0, ProductCategory.A, "description", 10, 10)
    const p4 = new Product("ps4", 0, ProductCategory.A, "description", 10, 10)
    const p5 = new Product("ps5", 0, ProductCategory.A, "description", 10, 10)
    const p6 = new Product("ps6", 0, ProductCategory.A, "description", 10, 10)


    beforeAll(() => {


        //marketplace
        mockInstance(mockDependencies.MarketplaceController)
        //security
        mockInstance(mockDependencies.SecurityController)
        //message
        mockInstance(mockDependencies.MessageController)
        //purchase
        mockInstance(mockDependencies.PurchaseController)
        //user
        mockInstance(mockDependencies.UserController)
        //notification
        mockInstance(mockDependencies.NotificationController)

        pControllerMockMethod = mockMethod(MarketplaceController.prototype, 'subscribe', (sub) => {
            console.log(`subscribe has been called for marketplace`);
        })

        mpControllerMockMethod = mockMethod(PurchaseController.prototype, 'subscribe', (sub) => {
            console.log(`subscribe has been called for PurchaseController`);
        })

        scControllerMockMethod = mockMethod(SecurityController.prototype, 'isLoggedIn', (user) => {
            return true;
        })

        sys = SystemController.initialize();
        mpController = sys.mpController
        mController = sys.mController
        pController = sys.pController
        scController = sys.securityController
        uController = sys.uController
        notificationsController = sys.notifyController
    })

    beforeEach(() => {
        cart1 = new ShoppingCart()
        tuser1 = new Guest(sess1, cart1)

        cart2 = new ShoppingCart()
        tuser2 = new Guest(sess2, cart2)

        cart2 = new ShoppingCart()
        tuser2 = new Guest(sess3, cart3)

        cart4 = new ShoppingCart()
        tmember1 = new Member(username1, cart4)
        box1 = new MessageBox(username1);

        cart5 = new ShoppingCart()
        tmember2 = new Member(username2, cart5)
        box2 = new MessageBox(username1);

    })

    afterEach(() => {
    })

    test("initialize the system", () => {
        expect(sys.mpController).toBeDefined();
        expect(sys.pController).toBeDefined();
        expect(sys.scController).toBeDefined();
        expect(sys.uController).toBeDefined();
        expect(sys.mController).toBeDefined();
        expect(sys.securityController).toBeDefined();
        expect(sys.notifyController).toBeDefined();
        expect(mpControllerMockMethod).toBeCalledWith(mpController);
        expect(mpControllerMockMethod).toBeCalledTimes(1);
    })

    test("access marketplace test", () => {
        //prepare

        scControllerMockMethod = mockMethod(SecurityController.prototype, "accessMarketplace", (id) => {
            expect(id).toBe(sess1)
            console.log("used accessMarketplace in security controller")
        })

        uControllerMockMethod = mockMethod(UserController.prototype, "createGuest", (session) => {
            return new Result<Guest>(true, tuser1);
        })
        //act
        const res = sys.accessMarketplace(sess1);

        //assert
        expect(res.ok).toBeTruthy();
        expect(res.data).toBeDefined()
        expect(res.data).toEqual(tuser1)
        expect(scControllerMockMethod).toBeCalledWith(sess1);
        expect(uControllerMockMethod).toReturnWith(new Result(true, tuser1));

        clearMocks(scControllerMockMethod, uControllerMockMethod);
    })

    test("exit marketplace test", () => {

    })


    describe("login tests", () => {
        test("login test - success", () => {
            //prepare
            let loginMockMethod = mockMethod(SecurityController.prototype, 'login',
                (_: any) => {
                });

            let getMemberMockMethod = mockMethod(UserController.prototype, 'getMember',
                (uname) => {
                    return new Result(true, tmember1, "mock success")
                })
            //act
            let res = sys.login(sess4, {username: username1, password: pass1});
            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined()
            expect(loginMockMethod).toBeCalledWith(sess4, username1, pass1);
            expect(getMemberMockMethod).toBeCalledWith(username1)
            expect(getMemberMockMethod).toHaveReturnedWith(new Result(true, tmember1, "mock success"));


        })

        test("login test - failure - recover from security failure", () => {
            let loginMockMethod = mockMethod(SecurityController.prototype, 'login',
                (_: any) => {
                    throw new Error("mock throw")
                });
            let res = sys.login(sess4, {username: username1, password: pass1});
            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined()
            expect(loginMockMethod).toThrow("mock throw");

        })

        test("login test - failure - recover from Member Controller failure", () => {
            let loginMockMethod = mockMethod(SecurityController.prototype, 'login',
                (_: any) => {
                    throw new Error("mock throw")
                });
            let res = sys.login(sess4, {username: username1, password: pass1});
            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined()
            expect(loginMockMethod).toThrow("mock throw");
            clearMocks(loginMockMethod)
        })
    })


    test("logout test", () => {

    })

    describe("register tests", () => {
            test("register member - success", () => {
                //prepare
                let registerMockMethod = mockMethod(SecurityController.prototype, 'register',
                    (_: any) => {
                        console.log("user registered")
                    });
                let getCartMM = mockMethod(ShoppingCartController.prototype, 'getCart', () => {
                    return new Result(true, cart4);
                });
                let addBoxMM = mockMethod(MessageController.prototype, 'addMessageBox', () => {
                    return new Result(true, box1)
                })

                let addMemberMM = mockMethod(UserController.prototype, 'addMember', () => {
                    return new Result(true, tmember1)
                })

                //act
                let res = sys.registerMember(sess4, {username: username1, password: pass1});

                //assert
                expect(res.ok).toBe(true);
                expect(res.data).not.toBeDefined();
                let mocks = [registerMockMethod, addBoxMM, addMemberMM, getCartMM]
                for (let mm of mocks) {
                    expect(mm).toHaveBeenCalledTimes(1);
                }
                clearMocks(...mocks)
            })

            test("register member - failure from security", () => {
                //prepare
                let registerMockMethod = mockMethod(SecurityController.prototype, 'register',
                    (_: any) => {
                        throw new Error("mock security failure")
                    });

                let getCartMM = mockMethod(ShoppingCartController.prototype, 'getCart', () => {
                    return new Result(true, cart4);
                });
                let addBoxMM = mockMethod(MessageController.prototype, 'addMessageBox', () => {
                    return new Result(true, box1)
                })

                let addMemberMM = mockMethod(UserController.prototype, 'addMember', () => {
                    return new Result(true, tmember1)
                })

                //act
                let res = sys.registerMember(sess4, {username: username1, password: pass1});
                expect(res.ok).toBe(false);
                expect(res.data).not.toBeDefined();
                let mocks = [addBoxMM, addMemberMM, getCartMM];
                expect(registerMockMethod).toThrow();
                for (let mm of mocks) {
                    expect(mm).not.toHaveBeenCalled();
                }
                clearMocks(...mocks)
            })

            test("register member - failure from shoppingCart", () => {
                //prepare
                let registerMockMethod = mockMethod(SecurityController.prototype, 'register',
                    () => {
                        console.log("user registered")
                    });
                let getCartMM = mockMethod(ShoppingCartController.prototype, 'getCart', () => {
                    return new Result(false, undefined, "failed");
                });
                let addBoxMM = mockMethod(MessageController.prototype, 'addMessageBox', () => {
                    return new Result(true, box1)
                })

                let addMemberMM = mockMethod(UserController.prototype, 'addMember', () => {
                    return new Result(true, tmember1)
                })
                //act
                let res = sys.registerMember(sess4, {username: username1, password: pass1});
                expect(res.ok).toBe(false);
                expect(res.data).not.toBeDefined();
                let mocksNotCalled = [addMemberMM, addBoxMM]
                let mocksCalled = [registerMockMethod, getCartMM]
                for (let mm of mocksNotCalled) {
                    expect(mm).not.toHaveBeenCalledTimes(1);
                }
                for (let mm of mocksCalled) {
                    expect(mm).toHaveBeenCalled();
                }
                //tairDown
                clearMocks(...mocksNotCalled, ...mocksCalled)
            })

            test("register member - failure from MessageBox", () => {
                //prepare
                let registerMockMethod = mockMethod(SecurityController.prototype, 'register',
                    (_: any) => {
                        console.log("user registered")
                    });
                let getCartMM = mockMethod(ShoppingCartController.prototype, 'getCart', () => {
                    return new Result(true, cart4);
                });
                let addBoxMM = mockMethod(MessageController.prototype, 'addMessageBox', () => {
                    return new Result(false, undefined)
                })

                let addMemberMM = mockMethod(UserController.prototype, 'addMember', () => {
                    return new Result(true, tmember1)
                })

                //act
                let res = sys.registerMember(sess4, {username: username1, password: pass1});
                expect(res.ok).toBe(false);
                expect(res.data).not.toBeDefined();
                expect(addMemberMM).not.toBeCalled();
                let mocks = [registerMockMethod, addBoxMM, getCartMM]

                mocks.forEach(
                    (mm) => {
                        expect(mm).toHaveBeenCalled();
                    })
                clearMocks(...mocks)
            })

            test("register member - failure from User", () => {
                //prepare
                let registerMockMethod = mockMethod(SecurityController.prototype, 'register',
                    (_: any) => {
                        console.log("user registered")
                    });
                let getCartMM = mockMethod(ShoppingCartController.prototype, 'getCart', () => {
                    return new Result(true, cart4);
                });
                let addBoxMM = mockMethod(MessageController.prototype, 'addMessageBox', () => {
                    return new Result(true, box1)
                })

                let addMemberMM = mockMethod(UserController.prototype, 'addMember', () => {
                    return new Result(false, undefined);
                })

                //act
                let res = sys.registerMember(sess4, {username: username1, password: pass1});
                expect(res.ok).toBe(false);
                expect(res.data).not.toBeDefined();
                let mocks = [registerMockMethod, addBoxMM, addMemberMM, getCartMM]
                mocks.forEach(
                    (mm) => {
                        expect(mm).toHaveBeenCalledTimes(1);
                    })
                clearMocks(...mocks)
            })
        }
    )


    test("get product - success", () => {
        //prepare
        let getProductMM = mockMethod(MarketplaceController.prototype, 'getProduct', () => {
            return new Result(true, p1);
        });
        //act
        let res = sys.getProduct(sess1, 0);
        expect(res.ok).toBe(true);
        expect(res.data).toEqual(p1);
        expect(getProductMM).toBeCalled()
        clearMocks(getProductMM)

    })

    test("get shop", () => {
        let getShopMM = mockMethod(MarketplaceController.prototype, 'getShopInfo', () => {
            return new Result(true, shop1);
        });
        //act
        let res = sys.getShop(sess1, 0);
        expect(res.ok).toBe(true);
        expect(res.data).toEqual(shop1);
        expect(getShopMM).toBeCalled()
        clearMocks(getShopMM)
    })

    test("search product", () => {
        let searchMM = mockMethod(MarketplaceController.prototype, 'searchProduct', () => {
            return new Result(true, [p1, p2, p3]);
        });
        let res = sys.searchProducts(username1, SearchType.productName, "some Search");
        expect(res.ok).toBe(true);
        expect(res.data).toEqual([p1, p2, p3]);
        expect(searchMM).toBeCalled()
        clearMocks(searchMM)
    })
    test("add to cart - success", () => {
        let addMM = mockMethod(ShoppingCartController.prototype, 'addProduct', () => {
            return new Result(true, undefined);
        });

        let getProdMM = mockMethod(MarketplaceController.prototype, 'getProduct', () => {
            return new Result(true, p1);
        });

        let res = sys.addToCart(username1, 0, 2);
        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(getProdMM).toBeCalled()
        expect(addMM).toBeCalled()

        clearMocks(addMM, getProdMM);
    })

    test("add to cart - failure - getting the product", () => {
        let getProdMM = mockMethod(MarketplaceController.prototype, 'getProduct', () => {
            return new Result(false, undefined);
        });

        let res = sys.addToCart(username1, 0, 2);
        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(getProdMM).toBeCalled()

        clearMocks(getProdMM)
    })

    test("get cart", () => {
        let getCartMM = mockMethod(ShoppingCartController.prototype, 'getCart', () => {
            return new Result(true, cart1);
        });
        let res = sys.getCart(username1)
        expect(res.ok).toBe(true);
        expect(res.data).toBeDefined();
        expect(res.data).toEqual(cart1);
        expect(getCartMM).toBeCalled()

        clearMocks(getCartMM)
    })

    test("remove product from cart", () => {
        let removeProdMM = mockMethod(ShoppingCartController.prototype, 'removeProduct', () => {
            return new Result(true, undefined);
        });

        let ProdMM = mockMethod(MarketplaceController.prototype, 'getProduct', () => {
            return new Result(true, p1);
        });

        let res = sys.removeProductFromCart(username1, 0);
        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(removeProdMM).toBeCalled()

        clearMocks(removeProdMM)
    })

    test("checkout - success", () => {
        let perchMM = mockMethod(PurchaseController.prototype, "checkout", () => {
            return new Result(true, undefined);
        })

        let res = sys.checkout(username1, "Pure gold", "please give me products")
        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(perchMM).toBeCalled()

        clearMocks(perchMM);

    })

    test("checkout - failure", () => {
        let perchMM = mockMethod(PurchaseController.prototype, "checkout", () => {
            return new Result(false, undefined);
        })

        let res = sys.checkout(username1, "Pure gold", "please give me products")
        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(perchMM).toBeCalled()
        clearMocks(perchMM);

    })

    test("setup shop", () => {
        let getMemberMockMethod = mockMethod(UserController.prototype, 'getMember',
            (uname) => {
                return new Result(true, tmember1, "mock success")
            })

        let getShopMM = mockMethod(MarketplaceController.prototype, 'setUpShop', () => {
            return new Result(true, shop1);
        });

        //act
        let res = sys.setUpShop(username1, "shop1");
        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(getMemberMockMethod).toBeCalled()
        expect(getShopMM).toBeCalled()

        clearMocks(getMemberMockMethod, getShopMM);
    })

    test("setup shop - failed", () => {
        let getMemberMockMethod = mockMethod(UserController.prototype, 'getMember',
            (uname) => {
                return new Result(false, undefined, "mock success")
            })
        //act
        let res = sys.setUpShop(username1, "shop1");

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(getMemberMockMethod).toBeCalled();

        clearMocks(getMemberMockMethod);
    })

    test("add product to shop - success", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(true, true, "mock success")
            })

        let addProductToShopMM = mockMethod(MarketplaceController.prototype, 'addProductToShop',
            (uname) => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.addProduct(username1, {shopId: p1.shopId,
                                                productCategory: p1.category,
                                                productName: p1.name,
                                                quantity: 5,
                                                fullPrice: p1.fullPrice})

        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(addProductToShopMM).toBeCalled();

        clearMocks(addProductToShopMM);
    })

    test("add product to shop - failure - permissions", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(false, false, "mock fail")
            })

        let addProductToShopMM = mockMethod(MarketplaceController.prototype, 'addProductToShop',
            (uname) => {
                return new Result(true, undefined, "mock fail")
            })
        let res = sys.addProduct(username1, {shopId: p1.shopId,
            productCategory: p1.category,
            productName: p1.name,
            quantity: 5,
            fullPrice: p1.fullPrice})

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(addProductToShopMM).not.toBeCalled();

        clearMocks(addProductToShopMM);
    })

    test("add product to shop - failure - addProduct", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(true, true, "mock fail")
            })

        let addProductToShopMM = mockMethod(MarketplaceController.prototype, 'addProductToShop',
            (uname) => {
                return new Result(false, undefined, "mock fail")
            })
        let res = sys.addProduct(username1, {shopId: p1.shopId,
            productCategory: p1.category,
            productName: p1.name,
            quantity: 5,
            fullPrice: p1.fullPrice})

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(addProductToShopMM).toBeCalled();

        clearMocks(addProductToShopMM);
    })

    test("delete product - successes", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(true, true, "mock success")
            })

        let addProductToShopMM = mockMethod(MarketplaceController.prototype, 'removeProductFromShop',
            (uname) => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.deleteProduct(username1,0,0);

        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(addProductToShopMM).toBeCalled();

        clearMocks(addProductToShopMM);
    })

    test("delete product - failure - permissions", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(false, false, "mock fail")
            })

        let removeProductFromShopMM = mockMethod(MarketplaceController.prototype, 'removeProductFromShop',
            (uname) => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.deleteProduct(username1,0,0);

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(removeProductFromShopMM).not.toBeCalled();

        clearMocks(removeProductFromShopMM);
    })

    test("delete product - failure - remove", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(true, true, "mock success")
            })

        let removeProductFromShopMM = mockMethod(MarketplaceController.prototype, 'removeProductFromShop',
            (uname) => {
                return new Result(false, undefined, "mock success")
            })
        let res = sys.deleteProduct(username1,0,0);

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(removeProductFromShopMM).toBeCalled();

        clearMocks(removeProductFromShopMM);
    })

    test("update product - success", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(true, true, "mock success")
            })

        let updateProductToShopMM = mockMethod(MarketplaceController.prototype, 'updateProductQuantity',
            (uname) => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.updateProduct(username1,0,0,5);

        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(updateProductToShopMM).toBeCalled();

        clearMocks(updateProductToShopMM);


    })
    test("update product - failure - permissions", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(false, false, "mock fail")
            })

        let updateProductToShopMM = mockMethod(MarketplaceController.prototype, 'updateProductQuantity',
            (uname) => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.deleteProduct(username1,0,0);

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(updateProductToShopMM).not.toBeCalled();

        clearMocks(updateProductToShopMM);
    })
    test("update product - failure - update", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            (uname) => {
                return new Result(true, true, "mock success")
            })

        let updateProductToShopMM = mockMethod(MarketplaceController.prototype, 'updateProductQuantity',
            (uname) => {
                return new Result(false, undefined, "mock success")
            })
        let res = sys.deleteProduct(username1,0,0);

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(updateProductToShopMM).not.toBeCalled();

        clearMocks(updateProductToShopMM);
    })

    test("appoint owner", () => {

    })

    test("appoint menager", () => {

    })

    test("update product", () => {

    })

    test("add permissions to shop Manager", () => {

    })
    test("remove shop manager permissions", () => {

    })
    test("deactivate shop", () => {

    })
    test("reactivate shop", () => {

    })
    test("update product", () => {

    })
    test("get shop info", () => {

    })
    test("get shop purchases", () => {

    })
    test("register admin", () => {

    })
    test("edit external connection service", () => {

    })
    test("swap external connection service", () => {

    })

})