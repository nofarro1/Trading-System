import {SecurityController} from "./SecurityController";

import {DiscountData, LoginData, NewProductData, NewRoleData, RegisterMemberData} from "../utilities/DataObjects";
import {Member} from "./user/Member";
import {ExternalServiceType} from "../utilities/Utils";
import {MarketplaceController} from "./marketplace/MarketplaceController";
import {ShoppingCartController} from "./user/ShoppingCartController";
import {PurchaseController} from "./purchase/PurchaseController";
import {MessageController} from "./notifications/MessageController";
import {NotificationController} from "./notifications/NotificationController";
import {checkRes, Result} from "../utilities/Result";
import {UserController} from "./user/UserController";
import {Guest} from "./user/Guest";
import {logger} from "../helpers/logger";
import {JobType, ProductCategory, SearchType} from "../utilities/Enums";
import {Permissions} from "../utilities/Permissions";
import {PaymentServiceAdaptor} from "./external_services/PaymentServiceAdaptor";
import {DeliveryServiceAdaptor} from "./external_services/DeliveryServiceAdaptor";

import {
    toSimpleDiscountDescriber,
    toSimpleGuest,
    toSimpleMember,
    toSimpleProduct,
    toSimpleProducts,
    toSimpleShop,
    toSimpleShoppingCart
} from "../utilities/simple_objects/SimpleObjectFactory";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleShoppingCart} from "../utilities/simple_objects/user/SimpleShoppingCart";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {inject, injectable} from "inversify";
import {TYPES} from "../helpers/types";
import "reflect-metadata";
import {
    ImmediatePurchasePolicyComponent
} from "./marketplace/DiscountAndPurchasePolicies/Components/ImmediatePurchasePolicyComponent";
import {SimpleDiscountDescriber} from "../utilities/simple_objects/marketplace/SimpleDiscountDescriber";
import {DiscountComponent} from "./marketplace/DiscountAndPurchasePolicies/Components/DiscountComponent";

@injectable()
export class SystemController {

    mpController: MarketplaceController
    scController: ShoppingCartController
    uController: UserController
    pController: PurchaseController
    mController: MessageController
    securityController: SecurityController


    constructor(@inject(TYPES.MarketplaceController) mpController: MarketplaceController,
                @inject(TYPES.ShoppingCartController) scController: ShoppingCartController,
                @inject(TYPES.UserController) uController: UserController,
                @inject(TYPES.PurchaseController) pController: PurchaseController,
                @inject(TYPES.MessageController) msgController: MessageController,
                @inject(TYPES.SecurityController) sController: SecurityController,) {

        this.mpController = mpController;
        this.scController = scController;
        this.uController = uController;
        this.pController = pController;
        this.mController = msgController;
        this.securityController = sController;

        const defaultAdmin = SystemController.createDefaultAdmin(this.securityController, this.uController, this.scController, this.mController, {
            username: "admin",
            password: "adminadmin"
        })
        if (defaultAdmin.data === undefined) {
            logger.error("failed to initialize system. default admin registration failed")
            throw new Error("failed to register default admin member");
        } else {
            logger.info("system controller initialize successfully")
        }

        //todo: configure dependencies between controllers
        this.pController.subscribe(this.mController)
        this.mpController.subscribe(this.mController)
    }

    // static initialize(): SystemController {
    //
    //
    //     //create all services
    //     let marketplace = new MarketplaceController();
    //     let shoppingCart = new ShoppingCartController();
    //     let user = new UserController()
    //     let purchase = new PurchaseController(new PaymentServiceAdaptor("Pservice", undefined), new DeliveryServiceAdaptor("Dservice", undefined));
    //     let messages = new MessageController();
    //     let notifications = new NotificationController();
    //     let security = new SecurityController();
    //
    //
    //     const defaultAdmin = this.createDefaultAdmin(security, user, shoppingCart, messages, {
    //         username: "admin",
    //         password: "adminadmin"
    //     })
    //     return new SystemController(marketplace, shoppingCart, user, purchase, messages, security, notifications);
    //
    // }

    private static createDefaultAdmin(security: SecurityController, user: UserController, cart: ShoppingCartController, box: MessageController, newMember: RegisterMemberData) {
        try {
            security.accessMarketplace("-1")
            security.register("-1", newMember.username, newMember.password);
        } catch (e: any) {
            return new Result(false, undefined, e.message);
        }

        cart.addCart(newMember.username)
        let res = cart.getCart(newMember.username)
        if (res.ok) {
            let mb = box.addMessageBox(newMember.username)
            if (mb.ok) {
                const memRes = user.addMember("-1", newMember.username)
                if (memRes.ok)
                    return new Result(true, memRes.data, "register success");
            }
            return new Result(false, undefined, "could not Register");
        }
        return new Result(false, undefined, "could not Register");
    }

    private authenticateMarketVisitor<T>(sessionId: string, callback: (id: string) => Result<T>) {
        const userId: string = this.securityController.hasActiveSession(sessionId);
        if (userId.length === 0) {
            return new Result(false, undefined, "this is not one of our visitors!");
        }
        return callback(userId);
    }

    /*------------------------------------Guest management actions----------------------------------------------*/

    //General Guest - Use-Case 1
    accessMarketplace(session: string): Result<void | SimpleGuest> {
        let newGuest: Result<Guest> = this.uController.createGuest(session);
        if (!newGuest.ok) {
            return new Result(false, undefined);
        }
        const guest = newGuest.data
        let res = this.scController.addCart(guest.session);
        if (checkRes(res)) {
            // guest._shoppingCart = res.data
        }
        this.securityController.accessMarketplace(guest.session);
        return new Result(true, toSimpleGuest(guest));
    }

    //General Member - Use-Case 1 //General Guest - Use-Case 2
    exitMarketplace(sessionId: string): Result<void> {

        const callback = (id: string) => {
            let toLogout = id
            let res = this.logout(id) // try to log out member if session id is connected to a member ,returns a guest on success. on fail the id is all ready a guest, and we can preside
            if (checkRes(res)) {
                toLogout = res.data.guestID;
            }
            try {
                this.securityController.exitMarketplace(toLogout);
                const toExit = this.uController.getGuest(toLogout);
                const delCart = this.scController.removeCart(toLogout);
                if (checkRes(toExit) && checkRes(delCart)) {
                    this.uController.exitGuest(toExit.data);
                    return new Result(true, undefined, "bye bye!");
                }
                return new Result(false, undefined, "for some reason guest was not deleted");
            } catch (error: any) {
                return new Result(false, undefined, error.message);
            }

        }

        return this.authenticateMarketVisitor(sessionId, callback);

    }

    // disconnectGuest(guestId: UserID): void {
    //     let guest = `this is guest ${guestId}`;
    //     // gController.removeGuest(guest)
    //     //scController.removeShoppingCart(guest.SimpleShoppingCart.id);
    //
    //
    // }
    //General Guest - Use-Case 4
    login(sessionId: string, d: LoginData): Result<void> {
        const secCallback = (id: string) => {
            //if success get the member_id
            try {
                this.securityController.login(id, d.username, d.password);
            } catch (e: any) {
                return new Result(false, undefined, e.message);
            }
            //retrieve member and add it to active users
            const res = this.uController.getMember(d.username)
            if (checkRes(res)) {
                const user: Member = res.data
                user.session = sessionId;
                //delete the guest
                const toExit = this.uController.getGuest(sessionId);
                const delCart = this.scController.removeCart(sessionId);
                if (checkRes(toExit) && checkRes(delCart)) {
                    this.uController.exitGuest(toExit.data);
                    return new Result(true, toSimpleMember(user), "member logged in");
                }
                return new Result(true, undefined, res.message)
            } else {
                return new Result(false, undefined, "member does not exist");
            }
        }

        return this.authenticateMarketVisitor(sessionId, secCallback);
    }

    //General Member - Use-Case 1
    logout(sessionID: string): Result<SimpleGuest | void> {
        const secCallback = (id: string) => {
            // remove member and live notification
            try {
                this.securityController.logout(sessionID, id);
                return this.accessMarketplace(sessionID);
            } catch (e: any) {
                return new Result(false, undefined, e.message)
            }
        }
        return this.authenticateMarketVisitor(sessionID, secCallback);
    }

    //General Guest - Use-Case 3
    registerMember(sessionID: string, newMember: RegisterMemberData): Result<void> {
        const secCallback = (id: string): Result<void> => {
            //register process
            const res = this.register(id, newMember);
            if (res.ok) {
                return new Result<void>(true, undefined, res.message)
            } else {
                return new Result(false, undefined, res.message);
            }


        }

        return this.authenticateMarketVisitor(sessionID, secCallback);
    }

    private register(sessionId: string, newMember: RegisterMemberData): Result<SimpleMember | void> {
        try {
            this.securityController.register(sessionId, newMember.username, newMember.password);
        } catch (e: any) {
            return new Result(false, undefined, e.message);
        }
        let add = this.scController.addCart(newMember.username)
        let res = this.scController.getCart(newMember.username)
        if (checkRes(res)) {
            let mb = this.mController.addMessageBox(newMember.username)
            if (checkRes(mb)) {
                const memRes = this.uController.addMember(sessionId, newMember.username)
                if (checkRes(memRes))
                    return new Result(true, toSimpleMember(memRes.data), "register success");
            }
            return new Result(false, undefined, "could not Register");
        }
        return new Result(false, undefined, "could not Register");
    }

    /*------------------------------------Marketplace Interaction actions----------------------------------------------*/

    getProduct(sessionID: string, productId: number): Result<SimpleProduct | void> {
        //market visitor authentication

        return this.authenticateMarketVisitor(sessionID, () => {

            const res = this.mpController.getProduct(productId);
            if (checkRes(res)) {
                return new Result(true, toSimpleProduct(res.data), res.message)
            }
            return new Result(false, undefined, "could not get product")
        })
    }

    // nice to have
    // getProducts(user: Id, productIds: number[]): Result<SimpleProduct[]> {
    //     return new Result(false, null, "no implementation");
    // }

    getShop(sessionId: string, shopId: number): Result<SimpleShop | void> {
        return this.authenticateMarketVisitor(sessionId, () => {
            const res = this.mpController.getShopInfo(shopId);
            if (checkRes(res)) {
                return new Result(true, toSimpleShop(res.data), res.message)
            }
            return new Result(false, undefined, "could not get product")
        })
    }

    // nice to have
    // getShops(user: Id, shopIds: Id[]): Result<SimpleShop[]> {
    //     return this.mpController.getShop(shopid)
    // }

    getShops(sessionId: string): Result<SimpleShop[] | void> {
        return this.authenticateMarketVisitor(sessionId, (id) => {
            const shops: SimpleShop[] = this.mpController.getShops().map(toSimpleShop);
            return Result.Ok(shops);
        })

    }

    //Guest Payment - Use-Case 2
    searchProducts(sessionId: string, searchBy: SearchType, searchTerm: string | ProductCategory, filter?: any): Result<SimpleProduct[] | void> {
        //market visitor authentication
        return this.authenticateMarketVisitor(sessionId, () => {

            const res = this.mpController.searchProduct(searchBy, searchTerm)
            if (checkRes(res)) {
                return new Result(true, toSimpleProducts(res.data), res.message)
            }
            return new Result(false, undefined, "could not get product")

        })
    }

    //Guest Payment - Use-Case 4.1
    addToCart(sessionId: string, productId: number, quantity: number): Result<void> {

        const authCallback = (id: string) => {
            const productRes = this.mpController.getProduct(productId);
            if (checkRes(productRes))
                return this.scController.addProduct(id, productRes.data, quantity)
            else {
                return new Result(false, undefined, productRes.message)
            }
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Guest Payment - Use-Case 4.2
    getCart(sessionId: string): Result<SimpleShoppingCart | void> {

        const authCallback = (id: string): Result<SimpleShoppingCart | void> => {
            const result = this.scController.getCart(id);
            return checkRes(result) ? new Result(true, toSimpleShoppingCart(id, result.data)) : new Result(false, undefined, result.message);


        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Guest Payment - Use-Case 4.4
    editCart(sessionId: string, product: number, quantity: number, additionalData?: any): Result<void> {
        const authCallback = (id: string) => {
            const productRes = this.mpController.getProduct(product);
            if (checkRes(productRes)) {
                return this.scController.updateProductQuantity(id, productRes.data, quantity)
            } else
                return new Result(false, undefined, "product not found")

        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Guest Payment - Use-Case 4.3
    removeProductFromCart(sessionId: string, product: number): Result<void> {
        const authCallback = (id: string) => {
            const productRes = this.mpController.getProduct(product);
            if (checkRes(productRes)) {
                return this.scController.removeProduct(id, productRes.data)
            }
            return new Result(false, undefined, "product not found")
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Guest Payment - Use-Case 5
    checkout(sessionId: string, paymentDetails: any, deliveryDetails: any): Result<void> {
        return this.authenticateMarketVisitor(sessionId, (id) => {
            let result = this.uController.getGuest(id);
            let resultMm = this.uController.getMember(id);
            let userObj: Guest;
            if (checkRes(result)) {
                userObj = result.data;
                return this.pController.checkout(userObj);

            } else if (checkRes(resultMm)) {
                userObj = resultMm.data;
                return this.pController.checkout(userObj);
            }
            return new Result(false, undefined, "Unable to check out this user");
        })
    }

    /*------------------------------------Marketplace Interaction actions----------------------------------------------*/

    //Member Payment - Use-Case 2
    setUpShop(sessionId: string, shopName: string): Result<void> {
        const authCallback = (founderId: string): Result<void> => {
            const result = this.uController.getMember(founderId);
            if (checkRes(result)) {
                let shop = this.mpController.setUpShop(founderId, shopName)
                if (checkRes(shop)) {
                    this.uController.addRole(founderId, "founder", JobType.Founder, shop.data.id, new Set());
                    return new Result(true, undefined, "shop has opened");
                }
                return new Result(false, undefined, "failed to set up shop.")
            } else {
                return new Result(false, undefined, "you have to be a member to open a shop.")
            }
            //found shop

            // insert role
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Shop Owner - Use-Case 1.1
    addProduct(sessionId: string, p: NewProductData): Result<SimpleProduct | void> {
        const authCallback = (id: string) => {
            if (this.uController.checkPermission(id, p.shopId, Permissions.AddProduct).data) {

                let res = this.mpController.addProductToShop(
                    p.shopId, p.productCategory, p.productName,
                    p.quantity, p.fullPrice, p.relatedSale, p.productDesc);

                if (checkRes(res)) {
                    return new Result(true, toSimpleProduct(res.data), res.message)
                }
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Shop Owner - Use-Case 1.3
    updateProductQuantity(sessionId: string, shop: number, product: number, quantity: number): Result<void> {
        const authCallback = (id: string): Result<void> => {
            if (this.uController.checkPermission(id, shop, Permissions.ModifyProduct).data) {
                return this.mpController.updateProductQuantity(shop, product, quantity)
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Shop Owner - Use-Case 1.2
    deleteProduct(sessId: string, shop: number, product: number): Result<void> {
        const authCallback = (id: string): Result<void> => {
            if (this.uController.checkPermission(id, shop, Permissions.RemoveProduct).data) {
                return this.mpController.removeProductFromShop(shop, product);
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(sessId, authCallback);
    }

    //Shop Owner - Use-Case 9
    deactivateShop(sessId: string, shop: number): Result<void> {
        return this.authenticateMarketVisitor(sessId, (id: string) => {
            if (this.uController.checkPermission(id, shop, Permissions.CloseShop).data) {
                return this.mpController.closeShop(id, shop)
            }
            return new Result(false, undefined, "no permission")
        })
    }

    getDiscounts(sessId: string, shopId: number): Result<SimpleDiscountDescriber[] | void> {
        return this.authenticateMarketVisitor(sessId, () => {
            const discounts: DiscountComponent[] = this.mpController.getDiscounts(shopId);
            return Result.Ok(discounts.map(toSimpleDiscountDescriber))
        })

    }

    addDiscount(sessId: string, shopId: number, discount: DiscountData): Result<number | void> {
        return this.authenticateMarketVisitor(sessId, (userId) => {
            if (this.uController.checkPermission(userId, shopId, Permissions.AddDiscount).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner).data) {
                const res = this.mpController.addDiscount(shopId, discount)
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return Result.Fail("was unable to add the discount. reason: " + res.message);
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        })
    }

    removeDiscount(sessId: string, shopId: number, idDisc: number): Result<void> {
        return this.authenticateMarketVisitor(sessId, (userId) => {
            if (this.uController.checkPermission(userId, shopId, Permissions.RemoveDiscount).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner).data) {
                const res: Result<void> = this.mpController.removeDiscount(shopId, idDisc)
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return res;
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        })
    }

    getPolicies(sessId: string, shopId: number): Result<ImmediatePurchasePolicyComponent[]> {
        return this.authenticateMarketVisitor(sessId, (userId) => {
            if (this.uController.checkPermission(userId, shopId, Permissions.AddPurchasePolicy).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner).data) {
                const res = this.mpController.getPolicies(shopId);
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return Result.Fail("was unable to add the discount. reason: " + res.message);
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        })

    }

    addPurchasePolicy(sessId: string, shopId: number, puPolicy: ImmediatePurchasePolicyComponent): Result<number | void> {
        return this.authenticateMarketVisitor(sessId, (userId) => {
            if (this.uController.checkPermission(userId, shopId, Permissions.AddPurchasePolicy).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner).data) {
                const res = this.mpController.addPurchasePolicy(shopId, puPolicy);
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return Result.Fail("was unable to add the discount. reason: " + res.message);
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        })
    }

    removePurchasePolicy(sessId: string, shopId: number, idPuPolicy: number): Result<void> {
        return this.authenticateMarketVisitor(sessId, (userId) => {
            if (this.uController.checkPermission(userId, shopId, Permissions.AddPurchasePolicy).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner).data) {
                const res = this.mpController.removePurchasePolicy(shopId, idPuPolicy);
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return res;
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        })
    }

    /*-----------------------------------shop Personnel Actions actions----------------------------------------------*/

    //Shop Owner - Use-Case 4
    appointShopOwner(sessionId: string, r: NewRoleData): Result<void> {
        const authCallback = (id: string) => {
            if (this.uController.checkPermission(id, r.shopId, Permissions.AddShopOwner).data) {
                const result = this.uController.addRole(r.member, r.title !== undefined ? r.title : "", JobType.Owner, r.shopId, new Set(r.permissions.concat(Permissions.ShopOwner)))
                if (checkRes(result)) {
                    return this.mpController.appointShopOwner(r.member, r.shopId)
                }
                return new Result(false, undefined, "failed to add the role to the user")
            }
            return new Result(false, undefined, "no permissions to appoint shopOwner")
        }
        return this.authenticateMarketVisitor(sessionId, authCallback)
    }

    //Shop Owner - Use-Case 6
    appointShopManager(sessionId: string, r: NewRoleData): Result<void> {
        const authCallback = (appointerId: string) => {
            if (this.uController.checkPermission(appointerId, r.shopId, Permissions.AddShopManager).data) {
                const result = this.uController.addRole(r.member, r.title !== undefined ? r.title : "", JobType.Manager, r.shopId, new Set(r.permissions)) //todo: adding an assigner to the method?
                if (result.ok) {
                    return this.mpController.appointShopManager(r.member, r.shopId)
                }
                return new Result(false, undefined, "failed to add role to member");
            }
            return new Result(false, undefined, "no permissions to appoint shopOwner")
        }
        return this.authenticateMarketVisitor(sessionId, authCallback)
    }

    /* not for this version


        removeShopManager(toRemove: Id, remover: Id, shop: SimpleShop): Result<void> {
            return new Result(false, null, "no implementation");
        }

        removeShopOwner(toRemove: Id, remover: Id, shop: SimpleShop): Result<void> {
            return new Result(false, null, "no implementation");
        }
    */

    //Shop Owner - Use-Case 7.1
    addShopManagerPermission(connectionId: string, manager: string, shop: number, permission: Permissions): Result<void> {
        const authCallback = (ownerId: string) => {
            if (this.uController.checkPermission(ownerId, shop, Permissions.AddPermission).data) {
                return this.uController.addPermission(manager, shop, permission)
            } else {
                return new Result(false, undefined, "No permission to add permissions");
            }
        }
        return this.authenticateMarketVisitor(connectionId, authCallback)
    }

    //Shop Owner - Use-Case 7.2
    removeShopManagerPermission(sessionId: string, manager: string, shop: number, permission: Permissions): Result<void> {
        const authCallback = (id: string) => {
            if (this.uController.checkPermission(id, shop, Permissions.RemovePermission).data) {
                return this.uController.removePermission(manager, shop, permission)
            } else {
                return new Result(false, undefined, "No permission to add permissions");
            }
        }
        return this.authenticateMarketVisitor(sessionId, authCallback)
    }

    reactivateShop(sessId: string, shop: number): Result<void> {
        return this.authenticateMarketVisitor(sessId, (id: string) => {
            if (this.uController.checkPermission(id, shop, Permissions.ReopenShop).data) {
                return this.mpController.reopenShop(id, shop)
            }
            return new Result(false, undefined, "no permission")
        })
    }

    //Shop Owner - Use-Case 11
    getPersonnelInfoOfShop(sessId: string, shop: number): Result<SimpleMember[] | void> {
        const callback = (id: string) => {
            if (!this.uController.checkPermission(id, shop, Permissions.RequestPersonnelInfo).data) {
                return new Result(false, undefined, "no permission");
            }
            let shopRes = this.mpController.getShopInfo(shop);
            if (checkRes(shopRes)) {
                let data = shopRes.data;
                let collectedMembers: Member[] = [];
                [...data.shopManagers, ...data.shopOwners].forEach((id) => {
                    let res = this.uController.getMember(id);
                    if (checkRes(res)) {
                        collectedMembers.push(res.data);
                    }
                });
                return new Result(true, collectedMembers.map(toSimpleMember),)
            }

            return new Result(false, [], "not shop with that Id exists");
        }
        return this.authenticateMarketVisitor(sessId, callback);
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchases(sessId: string, shop: number, startDate: Date, endDate: Date, filter?: any): Result<string[] | void> {

        const callback = (id: string) => {
            //check if can preview History
            if (!this.uController.checkPermission(id, shop, Permissions.GetPurchaseHistory).data) {
                return new Result(false, undefined, "no permission");
            }
            let orders: string[] = this.pController.shopOrders.has(shop) ?
                [...(this.pController.shopOrders.get(shop))] : []
            return new Result(true, orders, orders.length !== 0 ? undefined : "no SimpleShop order were found");
        }

        return this.authenticateMarketVisitor(sessId, callback);
    }

    /*-----------------------------------shop Personnel Actions actions----------------------------------------------*/

    //System Admin actions
    //General Admin - Use-Case 0
    registerAsAdmin(sessionID: string, registrationData: RegisterMemberData, adminSecretKey?: string): Result<void> {
        if (adminSecretKey === null || adminSecretKey !== "Edan Rules") {
            return new Result(false, undefined, "admin key not correct");
        }
        let admin = this.register(sessionID, {
            username: registrationData.username,
            password: registrationData.password
        });
        if (admin.ok) {
            this.uController.addRole(registrationData.username, "System Admin", JobType.admin, -1, new Set())
            return new Result(true, undefined, "new admin is added")
        }
        return new Result(false, undefined, "admin name cannot be registered");
    }


    editConnectionWithExternalService(sessionID: string, admin: string, type: ExternalServiceType, settings: any): Result<void> {
        return this.authenticateMarketVisitor(admin, (id: string) => {
            if (!this.uController.checkPermission(id, -1, Permissions.AdminControl)) {
                return new Result(false, undefined, "no admin Privileges");
            }
            if (type === ExternalServiceType.Delivery)
                this.pController.deliveryService.editServiceSettings(settings);
            else
                this.pController.paymentService.editServiceSettings(settings)

            return new Result(true, undefined, "services updated");

        })
    }

    swapConnectionWithExternalService(sessionID: string, admin: string, type: ExternalServiceType, newServiceName: string): Result<void> {
        return this.authenticateMarketVisitor(admin, (id: string) => {
            if (!this.uController.checkPermission(id, -1, Permissions.AdminControl)) {
                return new Result(false, undefined, "no admin Privileges");
            }
            if (type === ExternalServiceType.Delivery)
                this.pController.swapDeliveryService(new DeliveryServiceAdaptor(newServiceName, undefined));
            else
                this.pController.swapPaymentService(new PaymentServiceAdaptor(newServiceName, undefined))

            return new Result(true, undefined, "services swapped");


        })

    }


}