import {Guest} from "../user/Guest";
import {SecurityController} from "./SecurityController";
import {LoginData, NewProductData, NewRoleData, NewShopData, RegisterMemberData} from "../../utilities/DataObjects";
import {Member} from "../user/Member";
import {Permissions} from "../../utilities/Permissions";
import {ExternalServiceType, Id} from "../../utilities/Utils";
import {Role} from "../user/Role";
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

    exitMarketplace(userId: Id): Result<void> {
        this.disconnectGuest(userId);

        return new Result(true, null);
    }

    disconnectGuest(guestId: Id): void {
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

    registerMember(guestId: Id, NewMember: RegisterMemberData): Result<void> {
        return new Result(false, null, "no implementation");
    }

    //buyer actions

    getProduct(user: Id, productId: Id): Result<Product> {
        return new Result(false, null, "no implementation");
    }

    getProducts(user: Id, productIds: number[]): Result<Product[]> {
        return new Result(false, null, "no implementation");
    }

    getShop(user: Id, shopIds: number): Result<Shop[]> {
        return new Result(false, null, "no implementation");
    }


    getShops(user: Id, shopIds: Id[]): Result<Shop> {
        return new Result(false, null, "no implementation");
    }

    searchProducts(user: Id, searchTerm: string): Result<Product[]> {
        return new Result(false, null, "no implementation");
    }

    addToCart(user: Id, product: Id, quantity: number): Result<void> {
        return new Result(false, null, "no implementation");
    }

    getCart(user: Id): Result<ShoppingCart> {
        return new Result(false, null, "no implementation");
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
        return new Result(false, null, "no implementation");
    }

    //shop owner related

    addProduct(member: Id, newProductData:NewProductData): Result<void> {
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