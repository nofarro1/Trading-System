import {SystemController} from "../../../src/domain/SystemController";
import {MessageController} from "../../../src/domain/notifications/MessageController"
import {MarketplaceController} from "../../../src/domain/marketplace/MarketplaceController";
import {PurchaseController} from "../../../src/domain/purchase/PurchaseController";
import {SecurityController} from "../../../src/domain/SecurityController";
import {UserController} from "../../../src/domain/user/UserController";
import {Result} from "../../../src/utilities/Result";
import {Guest} from "../../../src/domain/user/Guest";
import {Member} from "../../../src/domain/user/Member";
import {ShoppingCart} from "../../../src/domain/user/ShoppingCart";
import {ShoppingCartController} from "../../../src/domain/user/ShoppingCartController";
import {MessageBox} from "../../../src/domain/notifications/MessageBox";
import {Product} from "../../../src/domain/marketplace/Product";
import {JobType, ProductCategory, SearchType} from "../../../src/utilities/Enums";
import {Shop} from "../../../src/domain/marketplace/Shop";
import {Role} from "../../../src/domain/user/Role";
import {Permissions} from "../../../src/utilities/Permissions";
import {
    toSimpleGuest, toSimpleMember,
    toSimpleProduct,
    toSimpleProducts,
    toSimpleShop, toSimpleShoppingCart
} from "../../../src/utilities/simple_objects/SimpleObjectFactory";
import {systemContainer} from "../../../src/helpers/inversify.config";
import {TYPES} from "../../../src/helpers/types";
import {clearMocks, mockDependencies, mockInstance, mockMethod} from "../../mockHelper";


describe('system controller - unit', () => {
    let sys: SystemController;
    let mpController: MarketplaceController;
    let mController: MessageController;
    let pController: PurchaseController;
    let scController: SecurityController;
    let uController: UserController;

    let mpControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let mControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let pControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let scControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let uControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let notificationsControllerMockMethod: jest.SpyInstance<any, unknown[]>

    const sess1 = "1";
    let user1: Guest;
    let cart1: ShoppingCart;

    const sess2 = "2";
    let user2: Guest
    let cart2: ShoppingCart;

    const sess3 = "3";
    let user3: Guest;
    let cart3: ShoppingCart;

    const sess4 = "4";
    const username1 = "member1";
    const pass1 = "123456789"
    let member1: Member;
    let cart4: ShoppingCart;
    let box1: MessageBox;

    const sess5 = "5";
    const username2 = "member2";
    const pass2 = "123456789"
    let member2: Member;
    let cart5: ShoppingCart;
    let box2: MessageBox;

    const shop1 = new Shop(0, "_name", username1, "this is my shop");

    const p1 = new Product("ps1", 0, ProductCategory.A, 10, undefined, "description");
    const p2 = new Product("ps2", 0, ProductCategory.A, 10, undefined, "description");
    const p3 = new Product("ps3", 0, ProductCategory.A, 10, undefined, "description");
    // const p4 = new Product("ps4", 0, ProductCategory.A, "description", 10, 10)
    // const p5 = new Product("ps5", 0, ProductCategory.A, "description", 10, 10)
    // const p6 = new Product("ps6", 0, ProductCategory.A, "description", 10, 10)

    const role1 = new Role(0, "title", JobType.Owner, new Set())
    const role2 = new Role(0, "title", JobType.Manager, new Set())


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

        pControllerMockMethod = mockMethod(MarketplaceController.prototype, 'subscribe', () => {
            console.log(`subscribe has been called for marketplace`);
        })

        mpControllerMockMethod = mockMethod(PurchaseController.prototype, 'subscribe', () => {
            console.log(`subscribe has been called for PurchaseController`);
        })

        scControllerMockMethod = mockMethod(SecurityController.prototype, 'hasActiveSession', (id) => {
            return id;
        })

        sys = systemContainer.get<SystemController>(TYPES.SystemController)
        mpController = sys.mpController
        mController = sys.mController
        pController = sys.pController
        scController = sys.securityController
        uController = sys.uController
    })

    beforeEach(() => {
        cart1 = new ShoppingCart()
        user1 = new Guest(sess1)

        cart2 = new ShoppingCart()
        user2 = new Guest(sess2)

        cart2 = new ShoppingCart()
        user2 = new Guest(sess3)

        cart4 = new ShoppingCart()
        member1 = new Member(sess4, username1)
        box1 = new MessageBox(username1);

        cart5 = new ShoppingCart()
        member2 = new Member(sess5, username2)
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
        expect(mpControllerMockMethod).toBeCalledWith(mController);
        expect(mpControllerMockMethod).toBeCalled();
    })

    test("access marketplace test", () => {
        //prepare

        scControllerMockMethod = mockMethod(SecurityController.prototype, "accessMarketplace", (id) => {
            expect(id).toBe(sess1)
            console.log("used accessMarketplace in security controller")
        })

        uControllerMockMethod = mockMethod(UserController.prototype, "createGuest", () => {
            return new Result<Guest>(true, user1);
        })
        //act
        const res = sys.accessMarketplace(sess1);

        //assert
        expect(res.ok).toBeTruthy();
        expect(res.data).toBeDefined()
        expect(res.data).toEqual(toSimpleGuest(user1))
        expect(scControllerMockMethod).toBeCalledWith(sess1);
        expect(uControllerMockMethod).toReturnWith(new Result(true, user1));

        clearMocks(scControllerMockMethod, uControllerMockMethod);
    })

    test("exit marketplace - guest", () => {
        mockInstance(mockDependencies.SystemController);
        let logoutMockMethod = mockMethod(SystemController.prototype, 'logout', () => {
            return new Result(false, user2);
        });
        let exitMarketplaceMM = mockMethod(SecurityController.prototype, 'exitMarketplace', () => {

        })
        let toRemoveMM = mockMethod(UserController.prototype, 'getGuest', () => {
            return new Result(true, user1)
        })
        let toRemoveCartMM = mockMethod(ShoppingCartController.prototype, 'removeCart', () => {
            return new Result(true, undefined)
        })

        let ExitGuestMM = mockMethod(UserController.prototype, 'exitGuest', () => {
            return new Result(true, user1)
        })

        let res = sys.exitMarketplace("1");

        expect(res.ok).toBe(true)
        expect(res.data).toEqual(undefined)
        expect(res.message).toEqual("bye bye!")
        expect(logoutMockMethod).toBeCalledWith("1")
        expect(exitMarketplaceMM).toBeCalledWith("1")
        let mocks = [logoutMockMethod, exitMarketplaceMM, toRemoveMM, toRemoveCartMM, ExitGuestMM]
        for (let mock of mocks) {
            expect(mock).toBeCalled();
        }
        clearMocks(...mocks);
    })

    test("exit marketplace - member", () => {
        mockInstance(mockDependencies.SystemController);
        let logoutMockMethod = mockMethod(SystemController.prototype, 'logout', () => {
            return new Result(true, user1);
        });
        let exitMarketplaceMM = mockMethod(SecurityController.prototype, 'exitMarketplace', () => {

        })
        let toRemoveMM = mockMethod(UserController.prototype, 'getGuest', () => {
            return new Result(true, user1)
        })
        let toRemoveCartMM = mockMethod(ShoppingCartController.prototype, 'removeCart', () => {
            return new Result(true, undefined)
        })

        let ExitGuestMM = mockMethod(UserController.prototype, 'exitGuest', () => {
            return new Result(true, user1)
        })

        let res = sys.exitMarketplace("1");

        expect(res.ok).toBe(true)
        expect(res.data).toEqual(undefined)
        expect(res.message).toEqual("bye bye!")
        let mocks = [logoutMockMethod, exitMarketplaceMM, toRemoveMM, toRemoveCartMM, ExitGuestMM]
        for (let mock of mocks) {
            expect(mock).toBeCalled();
        }
        clearMocks(...mocks);
    })


    describe("login tests", () => {
        test("login test - success", () => {
            //prepare
            let loginMockMethod = mockMethod(SecurityController.prototype, 'login',
                (_: any) => {
                });

            let getMemberMockMethod = mockMethod(UserController.prototype, 'getMember',
                () => {
                    return new Result(true, member1, "mock success")
                })

            let getGuestMM = mockMethod(UserController.prototype, 'getGuest', () => {
                return new Result(true, new Guest(sess4))
            })

            let removeCartMM = mockMethod(ShoppingCartController.prototype, 'remove cart', () => {
                return new Result(true, undefined);
            })

            let exitGuestMM = mockMethod(UserController.prototype, 'exitGuest', () => {
                return new Result(true, undefined);
            })
            //act
            let res = sys.login(sess4, {username: username1, password: pass1});
            //assert
            expect(res.ok).toBe(true);
            expect(res.data).toBeDefined()
            expect(loginMockMethod).toBeCalledWith(sess4, username1, pass1);
            expect(getMemberMockMethod).toBeCalledWith(username1)
            expect(getMemberMockMethod).toHaveReturnedWith(new Result(true, member1, "mock success"));

            clearMocks(loginMockMethod, getMemberMockMethod, getGuestMM, removeCartMM, exitGuestMM)

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
            clearMocks(loginMockMethod)
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
                    return new Result(true, member1)
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
                    return new Result(true, member1)
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
                    return new Result(true, member1)
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
                    return new Result(true, member1)
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

            test("register member - failure from user", () => {
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
        expect(res.data).toEqual(toSimpleProduct(p1));
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
        expect(res.data).toEqual(toSimpleShop(shop1));
        expect(getShopMM).toBeCalled()
        clearMocks(getShopMM)
    })

    test("search product", () => {
        let searchMM = mockMethod(MarketplaceController.prototype, 'searchProduct', () => {
            return new Result(true, [p1, p2, p3]);
        });
        let res = sys.searchProducts(username1, SearchType.productName, "some Search");
        expect(res.ok).toBe(true);
        expect(res.data).toEqual(toSimpleProducts([p1, p2, p3]));
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
        expect(res.data).toEqual(toSimpleShoppingCart(username1, cart1));
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
        expect(ProdMM).toBeCalled()

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
            () => {
                return new Result(true, member1, "mock success")
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
            () => {
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
            () => {
                return new Result(true, true, "mock success")
            })

        let addProductToShopMM = mockMethod(MarketplaceController.prototype, 'addProductToShop',
            () => {
                return new Result(true, toSimpleProduct(p1), "mock success")
            })
        let res = sys.addProduct(username1, {
            shopId: p1.shopId,
            productCategory: p1.category,
            productName: p1.name,
            quantity: 5,
            fullPrice: p1.fullPrice
        })

        expect(res.ok).toBe(true);
        expect(res.data).toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(addProductToShopMM).toBeCalled();

        clearMocks(addProductToShopMM);
    })

    test("add product to shop - failure - permissions", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            () => {
                return new Result(false, false, "mock fail")
            })

        let addProductToShopMM = mockMethod(MarketplaceController.prototype, 'addProductToShop',
            () => {
                return new Result(true, toSimpleProduct(p1), "mock fail")
            })
        let res = sys.addProduct(username1, {
            shopId: p1.shopId,
            productCategory: p1.category,
            productName: p1.name,
            quantity: 5,
            fullPrice: p1.fullPrice
        })

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(addProductToShopMM).not.toBeCalled();

        clearMocks(addProductToShopMM);
    })

    test("add product to shop - failure - addProduct", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            () => {
                return new Result(true, true, "mock fail")
            })

        let addProductToShopMM = mockMethod(MarketplaceController.prototype, 'addProductToShop',
            () => {
                return new Result(false, undefined, "mock fail")
            })
        let res = sys.addProduct(username1, {
            shopId: p1.shopId,
            productCategory: p1.category,
            productName: p1.name,
            quantity: 5,
            fullPrice: p1.fullPrice
        })

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(addProductToShopMM).toBeCalled();

        clearMocks(addProductToShopMM);
    })

    test("delete product - successes", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            () => {
                return new Result(true, true, "mock success")
            })

        let addProductToShopMM = mockMethod(MarketplaceController.prototype, 'removeProductFromShop',
            () => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.deleteProduct(username1, 0, 0);

        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(addProductToShopMM).toBeCalled();

        clearMocks(addProductToShopMM);
    })

    test("delete product - failure - permissions", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            () => {
                return new Result(false, false, "mock fail")
            })

        let removeProductFromShopMM = mockMethod(MarketplaceController.prototype, 'removeProductFromShop',
            () => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.deleteProduct(username1, 0, 0);

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(removeProductFromShopMM).not.toBeCalled();

        clearMocks(removeProductFromShopMM);
    })

    test("delete product - failure - remove", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            () => {
                return new Result(true, true, "mock success")
            })

        let removeProductFromShopMM = mockMethod(MarketplaceController.prototype, 'removeProductFromShop',
            () => {
                return new Result(false, undefined, "mock success")
            })
        let res = sys.deleteProduct(username1, 0, 0);

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(removeProductFromShopMM).toBeCalled();

        clearMocks(removeProductFromShopMM);
    })

    test("update product - success", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            () => {
                return new Result(true, true, "mock success")
            })

        let updateProductToShopMM = mockMethod(MarketplaceController.prototype, 'updateProductQuantity',
            () => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.updateProduct(username1, 0, 0, 5);

        expect(res.ok).toBe(true);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(updateProductToShopMM).toBeCalled();

        clearMocks(updateProductToShopMM);


    })
    test("update product - failure - permissions", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            () => {
                return new Result(false, false, "mock fail")
            })

        let updateProductToShopMM = mockMethod(MarketplaceController.prototype, 'updateProductQuantity',
            () => {
                return new Result(true, undefined, "mock success")
            })
        let res = sys.updateProduct(username1, 0, 0, 5);

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(updateProductToShopMM).not.toBeCalled();

        clearMocks(updateProductToShopMM);
    })
    test("update product - failure - update", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission',
            () => {
                return new Result(true, true, "mock success")
            })

        let updateProductToShopMM = mockMethod(MarketplaceController.prototype, 'updateProductQuantity',
            () => {
                return new Result(false, undefined, "mock success")
            })
        let res = sys.updateProduct(username1, 0, 0, 5);

        expect(res.ok).toBe(false);
        expect(res.data).not.toBeDefined();
        expect(checkPermissionMM).toBeCalled();
        expect(updateProductToShopMM).toBeCalled();

        clearMocks(updateProductToShopMM);
    })

    describe("appoint Owner", () => {

        test("appoint owner - success", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let addRoleMM = mockMethod(UserController.prototype, 'addRole', () => {
                return new Result(true, role1)
            })

            let appointOwnerMM = mockMethod(MarketplaceController.prototype, 'appointShopOwner', () => {
                return new Result(true, undefined, "mock appoint message")
            })

            //act
            let res = sys.appointShopOwner(sess4, {
                member: username2,
                shopId: 0,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addRoleMM).toBeCalled()
            expect(appointOwnerMM).toBeCalled()

            clearMocks(checkPermissionMM, addRoleMM, appointOwnerMM)

        })
        test("appoint owner - failure - permissions", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(false, false, "mock success")
            })

            let addRoleMM = mockMethod(UserController.prototype, 'addRole', () => {
                return new Result(true, role1)
            })

            let appointOwnerMM = mockMethod(MarketplaceController.prototype, 'appointShopOwner', () => {
                return new Result(true, undefined, "mock appoint message")
            })

            //act
            let res = sys.appointShopOwner(sess4, {
                member: username2,
                shopId: 0,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addRoleMM).not.toBeCalled()
            expect(appointOwnerMM).not.toBeCalled()

            clearMocks(checkPermissionMM, addRoleMM, appointOwnerMM)

        })
        test("appoint owner - failure - addRole", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let addRoleMM = mockMethod(UserController.prototype, 'addRole', () => {
                return new Result(false, undefined)
            })

            let appointOwnerMM = mockMethod(MarketplaceController.prototype, 'appointShopOwner', () => {
                return new Result(true, undefined, "mock appoint message")
            })

            //act
            let res = sys.appointShopOwner(sess4, {
                member: username2,
                shopId: 0,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addRoleMM).toBeCalled()
            expect(appointOwnerMM).not.toBeCalled()

            clearMocks(checkPermissionMM, addRoleMM, appointOwnerMM)

        })
        test("appoint owner  - failure - appointShopOwner", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let addRoleMM = mockMethod(UserController.prototype, 'addRole', () => {
                return new Result(true, role1)
            })

            let appointOwnerMM = mockMethod(MarketplaceController.prototype, 'appointShopOwner', () => {
                return new Result(false, undefined, "mock appoint message")
            })

            //act
            let res = sys.appointShopOwner(sess4, {
                member: username2,
                shopId: 0,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addRoleMM).toBeCalled()
            expect(appointOwnerMM).toBeCalled()

            clearMocks(checkPermissionMM, addRoleMM, appointOwnerMM)

        })

    })

    describe("appoint Shop Manager", () => {

        test("appoint Manager - success", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let addRoleMM = mockMethod(UserController.prototype, 'addRole', () => {
                return new Result(true, role2)
            })

            let appointOwnerMM = mockMethod(MarketplaceController.prototype, 'appointShopManager', () => {
                return new Result(true, undefined, "mock appoint message")
            })

            //act
            let res = sys.appointShopManager(sess4, {
                member: username2,
                shopId: 0,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addRoleMM).toBeCalled()
            expect(appointOwnerMM).toBeCalled()

            clearMocks(checkPermissionMM, addRoleMM, appointOwnerMM)

        })
        test("appoint manager - failure - permissions", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(false, false, "mock success")
            })

            let addRoleMM = mockMethod(UserController.prototype, 'addRole', () => {
                return new Result(true, role1)
            })

            let appointOwnerMM = mockMethod(MarketplaceController.prototype, 'appointShopManager', () => {
                return new Result(true, undefined, "mock appoint message")
            })

            //act
            let res = sys.appointShopManager(sess4, {
                member: username2,
                shopId: 0,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addRoleMM).not.toBeCalled()
            expect(appointOwnerMM).not.toBeCalled()

            clearMocks(checkPermissionMM, addRoleMM, appointOwnerMM)

        })
        test("appoint manager - failure - addRole", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let addRoleMM = mockMethod(UserController.prototype, 'addRole', () => {
                return new Result(false, undefined)
            })

            let appointOwnerMM = mockMethod(MarketplaceController.prototype, 'appointShopManager', () => {
                return new Result(true, undefined, "mock appoint message")
            })

            //act
            let res = sys.appointShopManager(sess4, {
                member: username2,
                shopId: 0,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addRoleMM).toBeCalled()
            expect(appointOwnerMM).not.toBeCalled()

            clearMocks(checkPermissionMM, addRoleMM, appointOwnerMM)

        })
        test("appoint manager  - failure - appointShopOwner", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let addRoleMM = mockMethod(UserController.prototype, 'addRole', () => {
                return new Result(true, role1)
            })

            let appointOwnerMM = mockMethod(MarketplaceController.prototype, 'appointShopManager', () => {
                return new Result(false, undefined, "mock appoint message")
            })

            //act
            let res = sys.appointShopManager(sess4, {
                member: username2,
                shopId: 0,
                assigner: username2,
                permissions: [],
                title: "title"
            })

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addRoleMM).toBeCalled()
            expect(appointOwnerMM).toBeCalled()

            clearMocks(checkPermissionMM, addRoleMM, appointOwnerMM)

        })

    })


    describe('add permissions to shop manager', () => {
        test("add permissions to shop Manager - success", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let addPermissionMM = mockMethod(UserController.prototype, 'addPermission', () => {
                return new Result(true, undefined, "mock success")
            })

            //act
            let res = sys.addShopManagerPermission(username1, username2, 0, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addPermissionMM).toBeCalled()

            clearMocks(checkPermissionMM, addPermissionMM)

        })

        test("add permissions to shop Manager - failure - permissions", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(false, false, "mock success")
            })

            let addPermissionMM = mockMethod(UserController.prototype, 'addPermission', () => {
                return new Result(true, undefined, "mock success")
            })

            //act
            let res = sys.addShopManagerPermission(username1, username2, 0, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addPermissionMM).not.toBeCalled()

            clearMocks(checkPermissionMM, addPermissionMM)

        })

        test("add permissions to shop Manager - failure - add", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let addPermissionMM = mockMethod(UserController.prototype, 'addPermission', () => {
                return new Result(false, undefined, "mock success")
            })

            //act
            let res = sys.addShopManagerPermission(username1, username2, 0, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(addPermissionMM).toBeCalled()

            clearMocks(checkPermissionMM, addPermissionMM)

        })
    });


    describe('add permmissions to shop manager', () => {
        test("remove shop manager permissions - success", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let removePermissionMM = mockMethod(UserController.prototype, 'removePermission', () => {
                return new Result(true, undefined, "mock success")
            })

            //act
            let res = sys.removeShopManagerPermission(username1, username2, 0, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(removePermissionMM).toBeCalled()

            clearMocks(checkPermissionMM, removePermissionMM)
        })

        test("remove shop manager permissions - failure - checkPermission", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(false, false, "mock success")
            })

            let removePermissionMM = mockMethod(UserController.prototype, 'removePermission', () => {
                return new Result(true, undefined, "mock success")
            })

            //act
            let res = sys.removeShopManagerPermission(username1, username2, 0, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(removePermissionMM).not.toBeCalled()

            clearMocks(checkPermissionMM, removePermissionMM)
        })

        test("remove shop manager permissions - failure - remove", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let removePermissionMM = mockMethod(UserController.prototype, 'removePermission', () => {
                return new Result(false, undefined, "mock failure")
            })

            //act
            let res = sys.removeShopManagerPermission(username1, username2, 0, Permissions.AddProduct)

            //assert
            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(removePermissionMM).toBeCalled()

            clearMocks(checkPermissionMM, removePermissionMM)
        })
    });


    describe('deactivate shop', () => {

        test("deactivate shop - success", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let close = mockMethod(MarketplaceController.prototype, 'closeShop', () => {
                return new Result(true, undefined, "mock");
            })

            let res = sys.deactivateShop(username1, 0);

            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(close).toBeCalled()

            clearMocks(close, checkPermissionMM)
        })

        test("deactivate shop - failure - permissions", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(false, false, "mock success")
            })

            let close = mockMethod(MarketplaceController.prototype, 'closeShop', () => {
                return new Result(true, undefined, "mock");
            })

            let res = sys.deactivateShop(username1, 0);

            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(close).not.toBeCalled()

            clearMocks(close, checkPermissionMM)
        })

        test("deactivate shop - failure to deactivate", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let close = mockMethod(MarketplaceController.prototype, 'closeShop', () => {
                return new Result(false, undefined, "mock");
            })

            let res = sys.deactivateShop(username1, 0);

            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(close).toBeCalled()

            clearMocks(close, checkPermissionMM)
        })
    });

    describe('reactivate shop manager', () => {

        test("reactivate shop - success", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let open = mockMethod(MarketplaceController.prototype, 'reopenShop', () => {
                return new Result(true, undefined, "mock");
            })

            let res = sys.reactivateShop(username1, 0);

            expect(res.ok).toBe(true);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(open).toBeCalled()

            clearMocks(open, checkPermissionMM)
        })

        test("reactivate shop - failure - permissions", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(false, false, "mock success")
            })

            let open = mockMethod(MarketplaceController.prototype, 'reopenShop', () => {
                return new Result(true, undefined, "mock");
            })

            let res = sys.reactivateShop(username1, 0);

            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(open).not.toBeCalled()

            clearMocks(open, checkPermissionMM)
        })

        test("reactivate shop - failure to deactivate", () => {
            //prep
            let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
                return new Result(true, true, "mock success")
            })

            let open = mockMethod(MarketplaceController.prototype, 'reopenShop', () => {
                return new Result(false, undefined, "mock");
            })

            let res = sys.reactivateShop(username1, 0);

            expect(res.ok).toBe(false);
            expect(res.data).not.toBeDefined();
            expect(checkPermissionMM).toBeCalled()
            expect(open).toBeCalled()

            clearMocks(open, checkPermissionMM)
        })
    });


    test("get personnel info - success", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
            return new Result(true, true, "mock success")
        })

        let getShop = mockMethod(MarketplaceController.prototype, 'getShopInfo', () => {
            return new Result(true, shop1);
        })

        let getMember = mockMethod(UserController.prototype, 'getMember', () => {
            return new Result(true, member1)
        })

        let res = sys.getPersonnelInfo(username1, 0);

        expect(res.ok).toBe(true);
        expect(res.data).toBeDefined()
        expect(res.data).toContainEqual(toSimpleMember(member1));

        expect(checkPermissionMM).toHaveBeenCalled()
        expect(getShop).toHaveBeenCalled()
        expect(getMember).toHaveBeenCalled()

        clearMocks(checkPermissionMM, getShop, getMember)

    })

    test("get shop purchases - success", () => {
        let checkPermissionMM = mockMethod(UserController.prototype, 'checkPermission', () => {
            return new Result(true, true, "mock success")
        })

        let res = sys.getShopPurchases(username1, 0, new Date(), new Date())

        expect(res.ok).toBe(true)
        expect(res.data).toEqual([]);
        expect(checkPermissionMM).toHaveBeenCalled()

    })

    test("register admin", () => {

    })

    test("edit external connection service", () => {

    })

    test("swap external connection service", () => {

    })

})