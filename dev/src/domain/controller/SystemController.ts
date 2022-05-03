import {Guest} from "../user/Guest";
import {SecurityController} from "./SecurityController";

import {LoginData, NewProductData, NewRoleData, RegisterMemberData} from "../../utilities/DataObjects";
import {Member} from "../user/Member";
import {ExternalServiceType, UserID} from "../../utilities/Utils";
import {MarketplaceController} from "../marketplace/MarketplaceController";
import {ShoppingCartController} from "../marketplace/ShoppingCartController";
import {PurchaseController} from "../purchase/PurchaseController";
import MessageController from "../notifications/MessageController";
import {NotificationController} from "../notifications/NotificationController";
import {Result} from "../../utilities/Result";
import {Shop} from "../marketplace/Shop";
import {Product} from "../marketplace/Product";
import {ShoppingCart} from "../marketplace/ShoppingCart";
import {ShopOrder} from "../purchase/ShopOrder";
import {UserController} from "../user/UserController";
import {User} from "../user/User";
import {logger} from "../../helpers/logger";
import {JobType, ProductCategory, SearchType} from "../../utilities/Enums";
import {Permissions} from "../../utilities/Permissions";
import {PaymentServiceAdaptor} from "../external_services/PaymentServiceAdaptor";
import {DeliveryServiceAdaptor} from "../external_services/DeliveryServiceAdaptor";


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
                notifyController: NotificationController) {

        this.mpController = mpController;
        this.scController = scController;
        this.uController = uController;
        this.pController = pController;
        this.mController = msgController;
        this.securityController = sController;
        this.notifyController = notifyController;
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
        purchase.subscribe(messages)
        marketplace.subscribe(messages)

        let sys = new SystemController(marketplace, shoppingCart, user, purchase, messages, security, notifications);
        //adding
        sys.registerAsAdmin({username: "admin", password: "admin"}, "Edan Rules")
        return sys;

    }

    private authenticateMarketVisitor<T>(user: UserID, callback: () => Result<T>) {
        if (!this.securityController.isLoggedIn(user)) {
            return new Result(false, undefined, "this is not one of our visitors!");
        }
        return callback();
    }

    //Guest actions

    accessMarketplace(): Result<Guest> {
        let newGuest: Result<Guest> = this.uController.createGuest();
        if (!newGuest.ok) {
            return newGuest;
        }
        const guest = newGuest.data
        this.securityController.accessMarketplace(guest.id);
        return new Result(true, guest);
    }

    exitMarketplace(userId: UserID): Result<void> {

        const callback = () => {
            try {
                this.securityController.exitMarketplace(userId);
                if (typeof userId === 'number') {
                    const toExit = this.uController.getGuest(userId);
                    this.scController.removeCart(userId);
                    if (toExit.ok) {
                        this.uController.exitGuest(toExit.data as Guest);
                        return new Result(true, undefined, "bye bye!");
                    } else {
                        logger.error("for some reason could not delete guest")
                        return new Result(false, undefined, "Some thing fishy in here!");
                    }
                } else {
                    this.notifyController.removeActiveUser(userId);
                    return new Result(true, undefined, "bye bye!");
                }

            } catch (error: any) {
                return new Result(false, undefined, error.message);
            }
        }

        return this.authenticateMarketVisitor(userId, callback);

    }

    // disconnectGuest(guestId: UserID): void {
    //     let guest = `this is guest ${guestId}`;
    //     // gController.removeGuest(guest)
    //     //scController.removeShoppingCart(guest.ShoppingCart.id);
    //
    //
    // }

    login(guestId: UserID, d: LoginData): Result<void> {
        const secCallback = () => {
            //if success get the member_id
            try {
                this.securityController.login(d.username, d.password);
            } catch (e: any) {
                return new Result(false, undefined, e.message);
            }
            //retrieve member and add it to active users
            const user: Member = this.uController.getMember(d.username).data as Member;


            //initiate live notification connection with user
            this.notifyController.addActiveUser(user.username);
            return new Result(true, undefined)
        }

        return this.authenticateMarketVisitor(guestId, secCallback);
    }

    logout(memberId: string): Result<Guest | void> {
        const secCallback = () => {
            // get conformation of log out
            logger.info(`member ${memberId} logged out`);
            // remove member and live notification
            this.notifyController.removeActiveUser(memberId);
            //update guestController
            return this.accessMarketplace();
        }
        return this.authenticateMarketVisitor(memberId, secCallback);
    }

    registerMember(guestId: UserID, newMember: RegisterMemberData): Result<void> {
        const secCallback = (): Result<void> => {
            //register process
            return this.register(newMember);

        }

        return this.authenticateMarketVisitor(guestId, secCallback);
    }

    private register(newMember: RegisterMemberData): Result<void> {
        try {
            this.securityController.register(newMember.username, newMember.password);
        } catch (e: any) {
            return new Result(false, undefined, e.massage);
        }

        this.scController.addCart(newMember.username)
        let res = this.scController.getCart(newMember.username)
        if (res.ok) {
            let mb = this.mController.addMessageBox(newMember.username)
            if (mb.ok) {
                if(this.uController.addMember(newMember.username, res.data as ShoppingCart).ok)
                    return new Result(true,undefined,"register success");
            }
            return new Result(false, undefined,"could not Register");
        }
        return new Result(false, undefined,"could not Register");
    }

//buyer actions

    getProduct(user: UserID, productId: number): Result<Product | void> {
        //market visitor authentication

        return this.authenticateMarketVisitor(user, () => {
            return this.mpController.getProduct(productId)
        })
    }

    // nice to have
    // getProducts(user: Id, productIds: number[]): Result<Product[]> {
    //     return new Result(false, null, "no implementation");
    // }

    getShop(user: UserID, shopId: number): Result<Shop | void> {
        return this.authenticateMarketVisitor(user, () => {
            return this.mpController.getShopInfo(shopId)
        })
    }

    // nice to have
    // getShops(user: Id, shopIds: Id[]): Result<Shop[]> {
    //     return this.mpController.getShop(shopid)
    // }

    searchProducts(user: UserID, searchBy: SearchType, searchTerm: string | ProductCategory, filter?: any): Result<Product[] | void> {
        //market visitor authentication
        return this.authenticateMarketVisitor(user, () => {
            return this.mpController.searchProduct(searchBy, searchTerm)
        })
    }

    addToCart(user: UserID, productId: number, quantity: number): Result<void> {

        const authCallback = () => {
            const productRes = this.mpController.getProduct(productId);
            if (productRes.ok && productRes.data !== undefined)
                return this.scController.addProduct(user, productRes.data, quantity)
            else {
                return new Result(false, undefined, productRes.message)
            }
        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    getCart(user: UserID): Result<ShoppingCart | void> {

        const authCallback = (): Result<ShoppingCart | void> => {
            const result = this.scController.getCart(user);
            return result.data ? new Result(true, result.data) : new Result(false, undefined, result.message);


        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    editCart(user: UserID, product: number, quantity: number, additionalData?: any): Result<void> {
        const authCallback = () => {
            const productRes = this.mpController.getProduct(product);
            if (productRes.ok && productRes.data !== undefined) {
                return this.scController.updateProductQuantity(user, productRes.data, quantity)
            } else
                return new Result(false, undefined, "product not found")

        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    removeProductFromCart(user: UserID, product: number): Result<void> {
        const authCallback = () => {
            const productRes = this.mpController.getProduct(product);
            if (productRes.ok && productRes.data !== undefined) {
                return this.scController.removeProduct(user, productRes.data)
            }
            return new Result(false, undefined, "product not found")
        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    checkout(user: UserID, paymentDetails: any, deliveryDetails: any): Result<void> {
        return this.authenticateMarketVisitor(user, () => {
            let result = this.uController.getGuest(user as number);
            let resultMm = this.uController.getMember(user as string);
            let userObj = result.ok ? result.data as User : resultMm.data as User;
            return this.pController.checkout(userObj)
        })
    }

    setUpShop(founder: string, shopName: string): Result<void | Shop> {
        const authCallback = (): Result<void> => {
            const result = this.uController.getMember(founder);
            if (result.ok) {
                let shop = this.mpController.setUpShop(founder, shopName)
                this.uController.addRole(founder, "founder", JobType.Founder, (shop.data as Shop).id, new Set());
                return new Result(true, undefined, "shop has opened");
            } else {
                return new Result(false, undefined, "you have to be a member to open a shop.")
            }
            //found shop

            // insert role
        }
        return this.authenticateMarketVisitor(founder, authCallback);
    }

    //shop owner related

    addProduct(member: string, p: NewProductData): Result<void> {
        const authCallback = (): Result<void> => {
            if (this.uController.checkPermission(member, p.shopId, Permissions.AddProduct).data) {
                return this.mpController.addProductToShop(
                    p.shopId, p.productCategory, p.productName,
                    p.quantity, p.fullPrice, !p.discountPrice ? p.fullPrice : p.discountPrice,
                    p.relatedSale, p.productDesc);
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(member, authCallback);
    }

    updateProduct(member: string, shop: number, product: number, quantity: number): Result<void> {
        const authCallback = (): Result<void> => {
            if (this.uController.checkPermission(member, shop, Permissions.ModifyProduct).data) {
                return this.mpController.updateProductQuantity(shop, product, quantity)
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(member, authCallback);
    }

    deleteProduct(member: string, shop: number, product: number): Result<void> {
        const authCallback = (): Result<void> => {
            if (this.uController.checkPermission(member, shop, Permissions.RemoveProduct).data) {
                return this.mpController.removeProductFromShop(shop, product);
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(member, authCallback);
    }


    // //todo: missing method in controllers below
    // addShopPolicy(user: UserID, shopId: UserID, policyDetails): Result<void> {
    //     return new Result(false, undefined, "no implementation");
    // }
    //
    // addShopSale(user: UserID, shopId: UserID, saleDetails): Result<void> {
    //     return new Result(false, undefined, "no implementation");
    // }

    appointShopOwner(r: NewRoleData): Result<void> {
        const authCallback = () => {
            if (this.uController.checkPermission(r.assigner, r.shopId, Permissions.AddShopOwner).data) {
                const result = this.uController.addRole(r.member, r.title !== undefined ? r.title : "", JobType.Owner, r.shopId, new Set(r.permissions))
                if (result.ok) {
                    this.mpController.appointShopOwner(r.member, r.shopId)
                }
                return new Result(true,undefined,"shop manager appointed");
            }
            return new Result(false, undefined, "no permissions to appoint shopOwner")
        }
        return this.authenticateMarketVisitor(r.assigner, authCallback)
    }

    //shop management and ownership

    appointShopManager(r: NewRoleData): Result<void> {
        const authCallback = () => {
            if (this.uController.checkPermission(r.assigner, r.shopId, Permissions.AddShopManager).data) {
                const result = this.uController.addRole(r.member, r.title !== undefined ? r.title : "", JobType.Manager, r.shopId, new Set(r.permissions))
                if (result.ok) {
                    this.mpController.appointShopManager(r.member, r.shopId)
                }
                return new Result(true,undefined,"shop manager appointed");
            }
            return new Result(false, undefined, "no permissions to appoint shopOwner")
        }
        return this.authenticateMarketVisitor(r.assigner, authCallback)
    }

    /* not for this version


        removeShopManager(toRemove: Id, remover: Id, shop: Shop): Result<void> {
            return new Result(false, null, "no implementation");
        }

        removeShopOwner(toRemove: Id, remover: Id, shop: Shop): Result<void> {
            return new Result(false, null, "no implementation");
        }
    */
    addShopManagerPermission(owner: string, manager: string, shop: number, permission: Permissions): Result<void> {
        const authCallback = () => {
            if (this.uController.checkPermission(owner, shop, Permissions.AddPermission).data) {
                return this.uController.addPermission(manager, shop, permission)
            } else {
                return new Result(false, undefined, "No permission to add permissions");
            }
        }
        return this.authenticateMarketVisitor(owner, authCallback)
    }

    removeShopManagerPermission(owner: string, manager: string, shop: number, permission: Permissions): Result<void> {
        const authCallback = () => {
            if (this.uController.checkPermission(owner, shop, Permissions.RemovePermission).data) {
                return this.uController.removePermission(manager, shop, permission)
            } else {
                return new Result(false, undefined, "No permission to add permissions");
            }
        }
        return this.authenticateMarketVisitor(owner, authCallback)
    }

    deactivateShop(member: string, shop: number): Result<void> {
        return this.authenticateMarketVisitor(member, () => {
            if (this.uController.checkPermission(member, shop, Permissions.CloseShop).data) {
                return this.mpController.closeShop(member, shop)
            }
            return new Result(false, undefined, "no permission")
        })
    }

    reactivateShop(member: string, shop: number): Result<void> {
        return this.authenticateMarketVisitor(member, () => {
            if (this.uController.checkPermission(member, shop, Permissions.ReopenShop).data) {
                return this.mpController.reopenShop(member, shop)
            }
            return new Result(false, undefined, "no permission")
        })
    }

    getPersonnelInfo(member: string, shop: number): Result<Member[] | void> {
        const callback = () => {
            if (!this.uController.checkPermission(member, shop, Permissions.RequestPersonnelInfo).data) {
                return new Result(false, undefined, "no permission");
            }
            let shopRes = this.mpController.getShopInfo(shop);
            if (shopRes.ok) {
                let data = shopRes.data!!;
                let collectedMembers: Member[] = [];
                [...data.shopManagers, ...data.shopOwners].forEach((id) => {
                    let res = this.uController.getMember(id);
                    if (res.ok && res.data !== undefined) {
                        collectedMembers.push(res.data);
                    }
                });
                return new Result(true, collectedMembers,)
            }

            return new Result(false, [], shopRes.message);
        }
        return this.authenticateMarketVisitor(member, callback);
    }

    getShopPurchases(member: string, shop: number, startDate: Date, endDate: Date, filter?: any): Result<ShopOrder[] | void> {

        const callback = () => {
            //check if can preview History
            if (!this.uController.checkPermission(member, shop, Permissions.RequestPersonnelInfo).data) {
                return new Result(false, undefined, "no permission");
            }
            let orders: ShopOrder[] = this.pController.shopOrders.has(shop) ?
                [...(this.pController.shopOrders.get(shop) as Set<ShopOrder>)].filter((o) => o.creationTime > startDate && o.creationTime < endDate) : []
            return new Result(orders.length !== 0, orders, orders.length !== 0 ? undefined : "no Shop order were found");
        }

        return this.authenticateMarketVisitor(member, callback);
    }

    //system Admin actions

    registerAsAdmin(registrationData: RegisterMemberData, adminSecretKey?: string): Result<void> {
        if (adminSecretKey === null || adminSecretKey !== "Edan Rules") {
            return new Result(false, undefined, "admin key not correct");
        }
        let admin = this.register({username: registrationData.username, password: registrationData.password});
        if (admin.ok) {
            this.uController.addRole(registrationData.username, "system Admin", JobType.admin, -1, new Set())
            return new Result(true, undefined, "new addmin is added")
        }
        return new Result(false, undefined, "admin name cannot be registered");
    }


    editConnectionWithExternalService(admin: string, type: ExternalServiceType, settings: any): Result<void> {
        return this.authenticateMarketVisitor(admin, () => {
            if (!this.uController.checkPermission(admin, -1, Permissions.AdminControl)) {
                return new Result(false, undefined, "no admin Privileges");
            }
            if(type === ExternalServiceType.Delivery)
                this.pController.deliveryService.editServiceSettings(settings);
            else
                this.pController.paymentService.editServiceSettings(settings)

                return new Result(true, undefined, "services updated");

        })
    }

    swapConnectionWithExternalService(admin:string,type: ExternalServiceType, newServiceName: string): Result<void> {
        return this.authenticateMarketVisitor(admin, () => {
            if (!this.uController.checkPermission(admin, -1, Permissions.AdminControl)) {
                return new Result(false, undefined, "no admin Privileges");
            }
            if(type === ExternalServiceType.Delivery)
                this.pController.deliveryService = new DeliveryServiceAdaptor(newServiceName,undefined);
            else
                this.pController.paymentService= new PaymentServiceAdaptor(newServiceName,undefined);

            return new Result(true, undefined, "services swapped");


        })

    }
}
