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
import {BuyerOrder} from "../purchase/BuyerOrder";
import {ShopOrder} from "../purchase/ShopOrder";
import {UserController} from "../user/UserController";
import {User} from "../user/User";
import {logger} from "../../helpers/logger";
import {JobType, Permission} from "../user/Role";
import {MessageBox} from "../notifications/MessageBox";


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
        let purchase = new PurchaseController({}, {});
        let messages = new MessageController();
        let notifications = new NotificationController();
        let security = new SecurityController();

        //todo: configure dependencies between controllers
        purchase.subscribe(messages)
        marketplace.subscribe(messages)
        return new SystemController(marketplace, shoppingCart, user, purchase, messages, security, notifications);

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
                const toExit = this.uController.getGuest(userId);
                this.scController.removeCart(userId);
                if (toExit.ok) {
                    this.uController.exitGuest(toExit.data as Guest);
                    return new Result(true, undefined, "bye bye!");
                } else {
                    logger.error("for some reason could not delete guest")
                    return new Result(false, undefined, "Some thing fishy in here!");
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
            this.notifyController.addActiveUser(user.getUsername());
            return new Result(true, user)
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
            try {
                this.securityController.register(newMember.username, newMember.password);
            } catch (e: any) {
                return new Result(false, undefined, e.massage);
            }

            let sc: ShoppingCart = new ShoppingCart();
            let mb = this.mController.addMessageBox(newMember.username)
            if (mb.ok)
                return this.uController.addMember(newMember.username, sc, mb.data as MessageBox)
            else
                return new Result(false, undefined);
        }

        return this.authenticateMarketVisitor(guestId, secCallback);
    }

    //buyer actions

    getProduct(user: UserID, productId: UserID): Result<Product | void> {
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
            return this.mpController.getShop(shopId)
        })
    }

    // nice to have
    // getShops(user: Id, shopIds: Id[]): Result<Shop[]> {
    //     return this.mpController.getShop(shopid)
    // }

    searchProducts(user: UserID, searchTerm: string, filters?: any): Result<Product[] | void> {
        //market visitor authentication
        return this.authenticateMarketVisitor(user, () => {
            return this.mpController.searchProducts(productId)
        })
    }

    addToCart(user: UserID, productId: number, quantity: number): Result<void> {

        const authCallback = () => {
            const product = this.mpController.getProduct(productId)
            return this.scController.addProduct(user, product, quantity)
        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    getCart(user: UserID): Result<ShoppingCart | void> {

        const authCallback = (): Result<ShoppingCart | void> => {
            const result = this.scController.getCart(user);
            return result.data ? new Result(true, result.data!!.getShoppingCart()) : new Result(false, undefined, result.message);


        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    editCart(user: UserID, product: UserID, quantity: number, additionalData?: any): Result<void> {
        const authCallback = () => {
            const product = this.mpController.get(productId)
            return this.scController.editCart(product, quantity, additionalDatauser, product, quantity)
        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    removeProductFromCart(user: UserID, product: number): Result<void> {
        const authCallback = (): Result<ShoppingCart | undefined> => {
            this.mpController.getProduct(product)
            this.scController.removeProduct(user,)


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
                this.uController.addRole(founder, "founder", JobType.Founder, (shop.data as Shop).id, []);
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
            if (this.uController.checkPermission(member, p.shopId, Permission.ProductManagement).data) {
                return this.mpController.addProductToShop(p.userId,
                    p.shopId, p.productCategory, p.productName,
                    p.quantity, p.fullPrice, p.discountPrice,
                    p.relatedSale, p.productDesc);
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(member, authCallback);
    }

    updateProduct(member: string, shop: number, product: number, quantity: number): Result<void> {
        const authCallback = (): Result<void> => {
            if (this.uController.checkPermission(member, shop, Permission.ProductManagement).data) {
                return this.mpController.updateProductQuantity(shop, product, quantity)
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(member, authCallback);
    }

    deleteProduct(member: string, shop: number, product: number): Result<void> {
        const authCallback = (): Result<void> => {
            if (this.uController.checkPermission(member, shop, Permission.ProductManagement).data) {
                return this.mpController.removeProductFromShop(shop, product);
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitor(member, authCallback);
    }


    //todo: missing method in controllers below
    addShopPolicy(user: UserID, shopId: UserID, policyDetails): Result<void> {
        return new Result(false, undefined, "no implementation");
    }

    addShopSale(user: UserID, shopId: UserID, saleDetails): Result<void> {
        return new Result(false, undefined, "no implementation");
    }

    appointShopOwner(r: NewRoleData): Result<void> {
        const authCallback = () => {
            const result = this.uController.addRole(r.member, r.title, JobType.Owner, r.shopId, r.permissions)
            if (result.ok) {
                this.mpController.appointShopOwner(r.member, r.shopId)
            }
            return result;
        }
        return this.authenticateMarketVisitor(r.assigner, authCallback)
    }

    //shop management and ownership

    appointShopManager(r: NewRoleData): Result<void> {
        const authCallback = () => {
            const result = this.uController.addRole(r.member, r.title, JobType.Manager, r.shopId, r.permissions)
            if (result.ok) {
                this.mpController.appointShopManager(r.member, r.shopId)
            }
            return result;
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
    addShopManagerPermission(owner: UserID, manager: string, shop: number, permission: Permission): Result<void> {
        const authCallback = () => {
            return this.uController.addPermission(manager, shop, permission)
        }
        return this.authenticateMarketVisitor(owner, authCallback)
    }

    removeShopManagerPermission(owner: UserID, manager: string, shop: number, permission: Permission): Result<void> {
        const authCallback = () => {
            return this.uController.removePermission(manager, shop, permission)
        }
        return this.authenticateMarketVisitor(owner, authCallback)
    }

    deactivateShop(member: string, shop: number): Result<void> {
        return this.authenticateMarketVisitor(member, () => {
            return this.mpController.closeShop(member, shop)
        })
    }

    reactivateShop(memberId: string, shopId: number): Result<void> {
        return this.authenticateMarketVisitor(memberId, () => {
            return this.mpController.reopenShop(memberId, shopId)
        })
    }

    getPersonnelInfo(memberId: UserID, shopId: UserID): Result<Member[]> {
        this.authenticateMarketVisitor()
    }

    getShopPurchases(memberId: UserID, shopId: UserID, startDate: Date, endDate: Date, filters?: any): Result<ShopOrder[]> {
        return new Result(false, undefined, "no implementation");
    }

    getShopPurchasesFiltered(memberId: UserID, shopId: UserID): Result<ShopOrder[]> {
        return new Result(false, undefined, "no implementation");
    }

    //system Admin actions

    registerAsAdmin(guestId: number, registrationData: RegisterMemberData, adminSecretKey?: string): Result<void> {
        if(adminSecretKey === null || adminSecretKey !== "Edan Rules"){
            return new Result(false, undefined, "admin key not correct");
        }
        let admin = this.registerMember(guestId,registrationData);
        if(admin.ok){
            this.uController.addRole(registrationData.username,"system Admin", JobType.admin, -1,[])
        }
    }

    //todo: external services.
    addConnectionWithExternalService(type: ExternalServiceType, serviceName: string): Result<void> {
        return new Result(false, undefined, "no implementation");
    }

    editConnectionWithExternalService(type: ExternalServiceType, serviceName: string, settings: any): Result<void> {
        return new Result(false, undefined, "no implementation");
    }

    swapConnectionWithExternalService(type: ExternalServiceType, newServiceName: string): Result<void> {
        return new Result(false, undefined, "no implementation");
    }

    callService(type: ExternalServiceType, serviceDetails: any): Result<void> {
        return new Result(false, undefined, "no implementation");
    }
}
