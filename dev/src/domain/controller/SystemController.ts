import {Guest} from "../user/Guest";
import {SecurityController} from "./SecurityController";
<<<<<<< HEAD
import {LoginData, NewProductData, NewRoleData, NewShopData, RegisterMemberData} from "../../utilities/DataObjects";
import {Member} from "../user/Member";
import {Permissions} from "../../utilities/Permissions";
import {ExternalServiceType, UserID} from "../../utilities/Utils";
import {Role} from "../user/Role";
=======
import {loginData, newRoleData, newShopData, registerMemberData} from "../../utilities/DataObjects";
import {Member} from "../user/Member";
import {Permissions} from "../../utilities/Permissions";
import {UserID} from "../../utilities/Utils";
import {Role} from "../user/Role";
import {MarketplaceController} from "../marketplace/MarketplaceController";
>>>>>>> origin/23-nr_user-package
import {ShoppingCartController} from "../marketplace/ShoppingCartController";
import {GuestController} from "../user/GuestController";
import {MemberController} from "../user/MemberController";
import {PurchaseController} from "../purchase/PurchaseController";
import MessageController from "../notifications/MessageController";
import {Result} from "../../utilities/Result";
import {Shop} from "../marketplace/Shop";
import {MarketplaceController} from "../marketplace/MarketplaceController";
import {Product} from "../marketplace/Product";
import {ShoppingCart} from "../marketplace/ShoppingCart";
import {BuyerOrder} from "../purchase/BuyerOrder";
import {ShopOrder} from "../purchase/ShopOrder";


export class SystemController {

    mpController: MarketplaceController
    scController: ShoppingCartController
    gController: GuestController
    mController: MemberController
    pController: PurchaseController
    nController: MessageController
    securityController: SecurityController


    constructor(mpController: MarketplaceController,
                scController: ShoppingCartController,
                gController: GuestController,
                mController: MemberController,
                pController: PurchaseController,
                msgController: MessageController,
                sController: SecurityController) {

        this.mpController = mpController;
        this.scController = scController;
        this.gController = gController;
        this.mController = mController;
        this.pController = pController;
        this.nController = msgController;
        this.securityController = sController;
    }

    static initialize(): SystemController {


        //create all services
        let marketplace = new MarketplaceController();
        let shoppingCart = new ShoppingCartController();
        let guest = new GuestController();
        let member = new MemberController();
        let purchase = new PurchaseController();
        let messages = new MessageController();
        let security = new SecurityController();

        //todo: configure dependencies between controllers
        purchase.subscribe(messages)
        marketplace.subscribe(messages)
        return new SystemController(marketplace, shoppingCart, guest, member, purchase, messages, security);

    }

    //Guest actions

    accessMarketplace(): Result<Guest> {
        let newGuest: Guest = this.gController.addNewGuest();


        this.securityController.addActiveGuest(newGuest);

        return new Result(true, newGuest);
    }

    exitMarketplace(userId: UserID): Result<void> {
        this.disconnectGuest(userId);

        return new Result(true, null);
    }

    disconnectGuest(guestId: UserID): void {
        let guest = `this is guest ${guestId}`;
        // gController.removeGuest(guest)
        //scController.removeShoppingCart(guest.ShoppingCart.id);


    }

    login(guestId: number, d: LoginData): Result<Member> {

        //dispatch to security controller

        //if success get the member_id

        //retrieve member and add it to active users

        //initiate live notification connection with user

        //save member id with notification connection in map.


        return new Result(true, null)
    }

    logout(memberId): Result<Guest> {

        // dispatch to security controller

        // get conformation of log out

        // remove member and live notification

        //update guestController

        return this.accessMarketplace();
    }

    registerMember(guestId: UserID, NewMember: RegisterMemberData): Result<void> {
        return new Result(false, null, "no implementation");
    }

    //buyer actions

    getProduct(user: UserID, productId: UserID): Result<Product> {
        return new Result(false, null, "no implementation");
    }

    getProducts(user: UserID, productIds: number[]): Result<Product[]> {
        return new Result(false, null, "no implementation");
    }

    getShop(user: UserID, shopIds: number): Result<Shop[]> {
        return new Result(false, null, "no implementation");
    }


    getShops(user: UserID, shopIds: UserID[]): Result<Shop> {
        return new Result(false, null, "no implementation");
    }

    searchProducts(user: UserID, searchTerm: string): Result<Product[]> {
        return new Result(false, null, "no implementation");
    }

    addToCart(user: UserID, product: UserID, quantity: number): Result<void> {
        return new Result(false, null, "no implementation");
    }

    getCart(user: UserID): Result<ShoppingCart> {
        return new Result(false, null, "no implementation");
    }

    editCart(user: UserID, product: UserID, quantity: number, additionalData?: any): Result<ShoppingCart> {
        return new Result(false, null, "no implementation");
    }

    removeProductFromCart(user: UserID, product: UserID): Result<void> {
        return new Result(false, null, "no implementation");
    }

    checkout(user: UserID, paymentDetails, deliveryDetails): Result<BuyerOrder> {
        return new Result(false, null, "no implementation")
    }

    setUpShop(shopData: NewShopData): Result<void> {
        return new Result(false, null, "no implementation");
    }

    //shop owner related

    addProduct(member: UserID, newProductData:NewProductData): Result<void> {
        return new Result(false, null, "no implementation");
    }

    updateProduct(member: UserID, shop: UserID, product: UserID, quantity: number): Result<void> {
        return new Result(false, null, "no implementation");
    }

    deleteProduct(member: UserID, shop: UserID, product: UserID): Result<void> {
        return new Result(false, null, "no implementation");
    }

    addShopPolicy(user: UserID, shopId: UserID, policyDetails): Result<void> {
        return new Result(false, null, "no implementation");
    }

    addShopSale(user: UserID, shopId: UserID, saleDetails): Result<void> {
        return new Result(false, null, "no implementation");
    }

    appointShopOwner(newRole: NewRoleData): Result<void> {
        return new Result(false, null, "no implementation");
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
    addShopManagerPermissions(owner: UserID, manager: UserID, shop: UserID, permissions: Permissions[]): Result<void> {
        return new Result(false, null, "no implementation");
    }

    removeShopManagerPermissions(owner: UserID, manager: UserID, shop: UserID, permissions: Permissions[]): Result<void> {

        return new Result(false, null, "no implementation");
    }

    deactivateShop(member: UserID, shop: UserID): Result<void> {
        //check that member can
        return new Result(false, null, "no implementation");
    }

    reactivateShop(memberId: UserID, shopId: UserID): Result<Shop> {
        return new Result(false, null, "no implementation");
    }

    getPersonnelInfo(memberId: UserID, shopId: UserID): Result<Member[]> {
        return new Result(false, null, "no implementation");
    }

    getShopPurchases(memberId: UserID, shopId: UserID, startDate: Date, endDate: Date, filters?: any): Result<ShopOrder[]> {
        return new Result(false, null, "no implementation");
    }

    getShopPurchasesFiltered(memberId: UserID, shopId: UserID): Result<ShopOrder[]> {
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