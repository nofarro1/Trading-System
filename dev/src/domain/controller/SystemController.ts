import {Guest} from "../user/Guest";
import {SecurityController} from "./SecurityController";

import {LoginData, NewProductData, NewRoleData, NewShopData, RegisterMemberData} from "../../utilities/DataObjects";
import {Member} from "../user/Member";
import {ExternalServiceType, Id} from "../../utilities/Utils";
import {Permissions} from "../../utilities/Permissions";
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
        let purchase = new PurchaseController({}, {});
        let messages = new MessageController();
        let notifications = new NotificationController();
        let security = new SecurityController();

        //todo: configure dependencies between controllers
        purchase.subscribe(messages)
        marketplace.subscribe(messages)
        return new SystemController(marketplace, shoppingCart, guest, member, purchase, messages, security);

    }

    private authenticateMarketVisitor<T>(user, callback: () => Result<T>) {
        if (!this.securityController.isLoggedIn(user)) {
            return new Result(false, null, "this is not one of our visitors!");
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
        this.securityController.accessMarketplace(String(guest.id));
        return new Result(true, guest);
    }

    exitMarketplace(userId: Id): Result<void> {
        this.disconnectGuest(userId);

        return new Result(true, undefined);
    }

    disconnectGuest(guestId: number): void {
        let guest = `this is guest ${guestId}`;
        // gController.removeGuest(guest)
        //scController.removeShoppingCart(guest.ShoppingCart.id);


    }

    login(guestId: number, d: LoginData): Result<Member | null> {
        const secCallback = () => {
            //if success get the member_id
            try {
                this.securityController.login(d.username, d.password);
            } catch (e: any) {
                return new Result(false, null, e.message);
            }
            //retrieve member and add it to active users
            const user: Member = this.uController.getUser(d.username).data as Member;


            //initiate live notification connection with user
            this.notifyController.addActiveUser(user.id);
            return new Result(true, user)
        }

        return this.authenticateMarketVisitor(guestId, secCallback);
    }

    logout(memberId: number): Result<Guest | null> {
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

    registerMember(guestId: Id, newMember: RegisterMemberData): Result<any> {
        const secCallback = (): Result<void> => {
            //register process
            try {
                this.securityController.register(newMember.username, newMember.password);
            } catch (e: any) {
                return new Result(false, undefined, e.massage);
            }

            //record in user package
            // this.uController.addMember(newMember.username, ...);
            return new Result(true, undefined, "User registered successfully");

        }

        return this.authenticateMarketVisitor(guestId, secCallback);
    }

    //buyer actions

    getProduct(user: Id, productId: Id): Result<Product | null> {
        //market visitor authentication

       return this.authenticateMarketVisitor(user,() => {
            return this.mpController.getProduct(productId)
        })
    }

    // nice to have
    // getProducts(user: Id, productIds: number[]): Result<Product[]> {
    //     return new Result(false, null, "no implementation");
    // }

    getShop(user: Id, shopId: number): Result<Shop | null> {
        return this.authenticateMarketVisitor(user,() => {
            return this.mpController.getShop(shopId)
        })
    }

    // nice to have
    // getShops(user: Id, shopIds: Id[]): Result<Shop[]> {
    //     return this.mpController.getShop(shopid)
    // }

    searchProducts(user: Id, searchTerm: string): Result<Product[]> {
        //market visitor authentication
        return this.authenticateMarketVisitor(user,() => {
            return this.mpController.searchProducts(productId)
        })
    }

    addToCart(user: Id, product: Id, quantity: number): Result<void> {

        const authCallback = () => {
            const product = this.mpController.getProduct(productId)


        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    getCart(user: Id): Result<ShoppingCart | null> {

        const authCallback = ():Result<ShoppingCart> | Result<null> => {
            const result = this.uController.getUser(user)
            return result.data ? new Result(true, result.data!!.getShoppingCart()) : new Result(false, null,result.message);


        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    editCart(user: Id, product: Id, quantity: number, additionalData?: any): Result<ShoppingCart> {
        return new Result(false, null, "no implementation");
    }

    removeProductFromCart(user: Id, product: Id): Result<void> {
        return new Result(false, null, "no implementation");
    }

    checkout(user: Id, paymentDetails, deliveryDetails): Result<BuyerOrder> {
        return new Result(false, null, "no implementation")
    }

    setUpShop(shopData: NewShopData): Result<void> {
        const authCallback = ():Result<void> => {
            const result = this.uController.getUser(shopData.founder);
            //found shop
            // insert role


        }
        return this.authenticateMarketVisitor(user, authCallback);
    }

    //shop owner related

    addProduct(member: Id, newProductData: NewProductData): Result<void> {
        return new Result(false, null, "no implementation");
    }

    updateProduct(member: Id, shop: Id, product: Id, quantity: number): Result<void> {
        return new Result(false, null, "no implementation");
    }

    deleteProduct(member: Id, shop: Id, product: Id): Result<void> {
        return new Result(false, null, "no implementation");
    }

    addShopPolicy(user: Id, shopId: Id, policyDetails): Result<void> {
        return new Result(false, null, "no implementation");
    }

    addShopSale(user: Id, shopId: Id, saleDetails): Result<void> {
        return new Result(false, null, "no implementation");
    }

    appointShopOwner(newRole: NewRoleData): Result<void> {

        const authCallback = () => {

        }
    }

    //shop management and ownership

    appointShopManager(newRole: NewRoleData): Result<void> {

        return new Result(false, null, "no implementation");
    }

    /* not for this version


        removeShopManager(toRemove: Id, remover: Id, shop: Shop): Result<void> {
            return new Result(false, null, "no implementation");
        }

        removeShopOwner(toRemove: Id, remover: Id, shop: Shop): Result<void> {
            return new Result(false, null, "no implementation");
        }
    */
    addShopManagerPermissions(owner: Id, manager: Id, shop: Id, permissions: Permissions[]): Result<void> {
        return new Result(false, null, "no implementation");
    }

    removeShopManagerPermissions(owner: Id, manager: Id, shop: Id, permissions: Permissions[]): Result<void> {

        return new Result(false, null, "no implementation");
    }

    deactivateShop(member: Id, shop: Id): Result<void> {
        //check that member can
        return new Result(false, null, "no implementation");
    }

    reactivateShop(memberId: Id, shopId: Id): Result<Shop> {
        return new Result(false, null, "no implementation");
    }

    getPersonnelInfo(memberId: Id, shopId: Id): Result<Member[]> {
        return new Result(false, null, "no implementation");
    }

    getShopPurchases(memberId: Id, shopId: Id, startDate: Date, endDate: Date, filters?: any): Result<ShopOrder[]> {
        return new Result(false, null, "no implementation");
    }

    getShopPurchasesFiltered(memberId: Id, shopId: Id): Result<ShopOrder[]> {
        return new Result(false, null, "no implementation");
    }

    //system Admin actions

    registerAsAdmin(guestId: number, registrationData: RegisterMemberData, adminSecretKey?: string): Result<void> {
        return new Result(false, null, "no implementation");
    }

    //todo: external services.
    addConnectionWithExternalService(type: ExternalServiceType, serviceName: string): Result<void> {
        return new Result(false, null, "no implementation");
    }

    editConnectionWithExternalService(type: ExternalServiceType, serviceName: string, settings: any): Result<void> {
        return new Result(false, null, "no implementation");
    }

    swapConnectionWithExternalService(type: ExternalServiceType, newServiceName: string): Result<void> {
        return new Result(false, null, "no implementation");
    }

    callService(type: ExternalServiceType, serviceDetails: any): Result<void> {
        return new Result(false, null, "no implementation");
    }
}
