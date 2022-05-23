import {SecurityController} from "./SecurityController";

import {LoginData, NewProductData, NewRoleData, RegisterMemberData} from "../utilities/DataObjects";
import {Member} from "./user/Member";
import {ExternalServiceType} from "../utilities/Utils";
import {MarketplaceController} from "./marketplace/MarketplaceController";
import {ShoppingCartController} from "./marketplace/ShoppingCartController";
import {PurchaseController} from "./purchase/PurchaseController";
import {MessageController} from "./notifications/MessageController";
import {NotificationController} from "./notifications/NotificationController";
import {checkRes, Result} from "../utilities/Result";
import {ShoppingCart} from "./marketplace/ShoppingCart";
import {ShopOrder} from "./purchase/ShopOrder";
import {UserController} from "./user/UserController";
import {User} from "./user/Guest";
import {logger} from "../helpers/logger";
import {JobType, ProductCategory, SearchType} from "../utilities/Enums";
import {Permissions} from "../utilities/Permissions";
import {PaymentServiceAdaptor} from "./external_services/PaymentServiceAdaptor";
import {DeliveryServiceAdaptor} from "./external_services/DeliveryServiceAdaptor";
import {
    toSimpleGuest,
    toSimpleMember,
    toSimpleProduct,
    toSimpleProducts,
    toSimpleShop, toSimpleShopOrder, toSimpleShoppingCart
} from "../utilities/simple_objects/SimpleObjectFactory";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleShoppingCart} from "../utilities/simple_objects/user/SimpleShoppingCart";
import {SimpleShopOrder} from "../utilities/simple_objects/purchase/SimpleShopOrder";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import session from "express-session";


export class SystemController {

    mpController: MarketplaceController
    scController: ShoppingCartController
    uController: UserController
    pController: PurchaseController
    mController: MessageController
    securityController: SecurityController
    notifyController: NotificationController


    constructor(mpController: MarketplaceController,
                scController: ShoppingCartController,
                uController: UserController,
                pController: PurchaseController,
                msgController: MessageController,
                sController: SecurityController,
                notifyController: NotificationController,
                defaultAdmin: Member | undefined) {

        this.mpController = mpController;
        this.scController = scController;
        this.uController = uController;
        this.pController = pController;
        this.mController = msgController;
        this.securityController = sController;
        this.notifyController = notifyController;
        if (defaultAdmin === undefined) {
            logger.error("failed to initialize system. default admin registration failed")
            throw new Error("failed to register default admin member");
        } else {
            logger.info("system controller initialize successfully")
        }
    }

    static initialize(): SystemController {


        //create all services
        let marketplace = new MarketplaceController();
        let shoppingCart = new ShoppingCartController();
        let user = new UserController()
        let purchase = new PurchaseController(new PaymentServiceAdaptor("Pservice", undefined), new DeliveryServiceAdaptor("Dservice", undefined));
        let messages = new MessageController();
        let notifications = new NotificationController();
        let security = new SecurityController();

        //todo: configure dependencies between controllers
        purchase.subscribe(marketplace)
        marketplace.subscribe(messages)
        const defaultAdmin = this.createDefaultAdmin(security, user, shoppingCart, messages, {
            username: "admin",
            password: "adminadmin"
        })
        return new SystemController(marketplace, shoppingCart, user, purchase, messages, security, notifications, defaultAdmin.data);

    }

    private static createDefaultAdmin(security: SecurityController, user: UserController, cart: ShoppingCartController, box: MessageController, newMember: RegisterMemberData) {
        try {
            security.register("-1", newMember.username, newMember.password);
        } catch (e: any) {
            return new Result(false, undefined, e.message);
        }

        cart.addCart(newMember.username)
        let res = cart.getCart(newMember.username)
        if (res.ok) {
            let mb = box.addMessageBox(newMember.username)
            if (mb.ok) {
                const memRes = user.addMember("-1",newMember.username, res.data as ShoppingCart)
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

    //SimpleGuest actions

    accessMarketplace(session: string): Result<void | SimpleGuest> {
        let newGuest: Result<User> = this.uController.createGuest(session);
        if (!newGuest.ok) {
            return new Result(false,undefined);
        }
        const guest = newGuest.data
        this.securityController.accessMarketplace(guest.session);
        return new Result(true, toSimpleGuest(guest));
    }

    //fix according to security controller
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

    login(sessionId: string, d: LoginData): Result<void> {
        const secCallback = (id:string) => {
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
                this.notifyController.addActiveUser(user.username);
                //delete the guest
                const toExit = this.uController.getGuest(sessionId);
                const delCart = this.scController.removeCart(sessionId);
                if (checkRes(toExit) && checkRes(delCart)) {
                    this.uController.exitGuest(toExit.data);
                    return new Result(true, undefined, "bye bye!");
                }
                return new Result(true, undefined, res.message)
            }
            //initiate live notification connection with user
            return new Result(false, undefined, res.message);
        }

        return this.authenticateMarketVisitor(sessionId, secCallback);
    }

    logout(sessionID: string): Result<SimpleGuest | void> {
        const secCallback = (id: string) => {
            // remove member and live notification
            try {
                this.securityController.logout(sessionID,id);
                this.notifyController.removeActiveUser(sessionID);
                return this.accessMarketplace(sessionID);
            } catch (e: any) {
                return new Result(false, undefined, e.message)
            }
        }
        return this.authenticateMarketVisitor(sessionID, secCallback);
    }

    registerMember(sessionID: string, newMember: RegisterMemberData): Result<void> {
        const secCallback = (id:string): Result<void> => {
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
                const memRes = this.uController.addMember(sessionId,newMember.username, res.data)
                if (checkRes(memRes))
                    return new Result(true, toSimpleMember(memRes.data), "register success");
            }
            return new Result(false, undefined, "could not Register");
        }
        return new Result(false, undefined, "could not Register");
    }

//buyer actions

    getProduct(sessionID: string, productId: number): Result<SimpleProduct | void> {
        //market visitor authentication

        return this.authenticateMarketVisitor(sessionID, () => {

            const res =  this.mpController.getProduct(productId);
            if(checkRes(res)){
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
            const res =  this.mpController.getShopInfo(shopId);
            if(checkRes(res)){
                return new Result(true, toSimpleShop(res.data), res.message)
            }
            return new Result(false, undefined, "could not get product")
        })
    }

    // nice to have
    // getShops(user: Id, shopIds: Id[]): Result<SimpleShop[]> {
    //     return this.mpController.getShop(shopid)
    // }

    searchProducts(sessionId: string, searchBy: SearchType, searchTerm: string | ProductCategory, filter?: any): Result<SimpleProduct[] | void> {
        //market visitor authentication
        return this.authenticateMarketVisitor(sessionId, () => {

            const res =  this.mpController.searchProduct(searchBy, searchTerm)
            if(checkRes(res)){
                return new Result(true, toSimpleProducts(res.data), res.message)
            }
            return new Result(false, undefined, "could not get product")

        })
    }

    addToCart(sessionId: string, productId: number, quantity: number): Result<void> {

        const authCallback = (id:string) => {
            const productRes = this.mpController.getProduct(productId);
            if (checkRes(productRes))
                return this.scController.addProduct(id, productRes.data, quantity)
            else {
                return new Result(false, undefined, productRes.message)
            }
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    getCart(sessionId: string): Result<SimpleShoppingCart | void> {

        const authCallback = (id:string): Result<SimpleShoppingCart | void> => {
            const result = this.scController.getCart(id);
            return checkRes(result) ? new Result(true, toSimpleShoppingCart(id,result.data)) : new Result(false, undefined, result.message);


        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    editCart(sessionId: string, product: number, quantity: number, additionalData?: any): Result<void> {
        const authCallback = (id:string) => {
            const productRes = this.mpController.getProduct(product);
            if (productRes.ok && productRes.data !== undefined) {
                return this.scController.updateProductQuantity(id, productRes.data, quantity)
            } else
                return new Result(false, undefined, "product not found")

        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    removeProductFromCart(sessionId: string, product: number): Result<void> {
        const authCallback = (id:string) => {
            const productRes = this.mpController.getProduct(product);
            if (checkRes(productRes)) {
                return this.scController.removeProduct(id, productRes.data)
            }
            return new Result(false, undefined, "product not found")
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    checkout(sessionId: string, paymentDetails: any, deliveryDetails: any): Result<void> {
        return this.authenticateMarketVisitor(sessionId, (id) => {
            let result = this.uController.getGuest(id);
            let resultMm = this.uController.getMember(id);
            let userObj: User;
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

    setUpShop(sessionId: string, shopName: string): Result<void> {
        const authCallback = (founderId:string): Result<void> => {
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

    //shop owner related

    addProduct(sessionId: string, p: NewProductData): Result<SimpleProduct | void> {
        const authCallback = (id: string): Result<SimpleProduct | void> => {
            if (this.uController.checkPermission(id, p.shopId, Permissions.AddProduct).data) {
                let product = this.mpController.addProductToShop(
                    p.shopId, p.productCategory, p.productName,
                    p.quantity, p.fullPrice, !p.discountPrice ? p.fullPrice : p.discountPrice,
                    p.relatedSale, p.productDesc);
                if(checkRes(product)){
                    return new Result(true,toSimpleProduct(product.data))
                }
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    updateProduct(sessionId: string, shop: number, product: number, quantity: number): Result<void> {
        const authCallback = (id: string): Result<void> => {
            if (this.uController.checkPermission(id, shop, Permissions.ModifyProduct).data) {
                return this.mpController.updateProductQuantity(shop, product, quantity)
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    deleteProduct(sessId: string, shop: number, product: number): Result<void> {
        const authCallback = (id: string): Result<void> => {
            if (this.uController.checkPermission(id, shop, Permissions.RemoveProduct).data) {
                return this.mpController.removeProductFromShop(shop, product);
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(sessId, authCallback);
    }


    // //todo: missing method in controllers below
    // addShopPolicy(user: string, shopId: UserID, policyDetails): Result<void> {
    //     return new Result(false, undefined, "no implementation");
    // }
    //
    // addShopSale(user: string, shopId: string, saleDetails): Result<void> {
    //     return new Result(false, undefined, "no implementation");
    // }

    //shop management and ownership
    //need to check if the tobe owner is not already a owner or manager od the shop
    appointShopOwner(sessionId: string, r: NewRoleData): Result<void> {
        const authCallback = (id: string) => {
            if (this.uController.checkPermission(id, r.shopId, Permissions.AddShopOwner).data) {
                const result = this.uController.addRole(r.member, r.title !== undefined ? r.title : "", JobType.Owner, r.shopId, new Set(r.permissions))
                if (checkRes(result)) {
                    return this.mpController.appointShopOwner(r.member, r.shopId)
                }
                return new Result(false, undefined, "failed to add the role to the user")
            }
            return new Result(false, undefined, "no permissions to appoint shopOwner")
        }
        return this.authenticateMarketVisitor(sessionId, authCallback)
    }


    appointShopManager(sessionId: string, r: NewRoleData): Result<void> {
        const authCallback = (appointerId: string) => {
            if (this.uController.checkPermission(appointerId, r.shopId, Permissions.AddShopManager).data) {
                const result = this.uController.addRole(r.member, r.title !== undefined ? r.title : "", JobType.Manager, r.shopId, new Set(r.permissions)) //todo: adding an assigner to the method?
                if (result.ok) {
                    this.mpController.appointShopManager(r.member, r.shopId)
                }
                return new Result(true, undefined, "shop manager appointed");
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

    deactivateShop(sessId: string, shop: number): Result<void> {
        return this.authenticateMarketVisitor(sessId, (id: string) => {
            if (this.uController.checkPermission(id, shop, Permissions.CloseShop).data) {
                return this.mpController.closeShop(id, shop)
            }
            return new Result(false, undefined, "no permission")
        })
    }

    reactivateShop(sessId: string, shop: number): Result<void> {
        return this.authenticateMarketVisitor(sessId, (id: string) => {
            if (this.uController.checkPermission(id, shop, Permissions.ReopenShop).data) {
                return this.mpController.reopenShop(id, shop)
            }
            return new Result(false, undefined, "no permission")
        })
    }

    getPersonnelInfo(sessId: string, shop: number): Result<SimpleMember[] | void> {
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

            return new Result(false, [], shopRes.message);
        }
        return this.authenticateMarketVisitor(sessId, callback);
    }

    getShopPurchases(sessId: string, shop: number, startDate: Date, endDate: Date, filter?: any): Result<SimpleShopOrder[] | void> {

        const callback = (id:string) => {
            //check if can preview History
            if (!this.uController.checkPermission(id, shop, Permissions.GetPurchaseHistory).data) {
                return new Result(false, undefined, "no permission");
            }
            let orders = this.pController.shopOrders.has(shop) ?
                [...(this.pController.shopOrders.get(shop) as Map<string,Set<string>>).entries()].filter((o) => o.creationTime > startDate && o.creationTime < endDate) : []
            return new Result(orders.length !== 0, orders.map(toSimpleShopOrder), orders.length !== 0 ? undefined : "no SimpleShop order were found");
        }

        return this.authenticateMarketVisitor(sessId, callback);
    }

    //System Admin actions

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
        return this.authenticateMarketVisitor(admin, (id:string) => {
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
        return this.authenticateMarketVisitor(admin, (id:string) => {
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
