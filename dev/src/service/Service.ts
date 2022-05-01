import {GuestService} from "./GuestService";
import {MemberService} from "./MemberService";
import {ShoppingCartService} from "./ShoppingCartService";
import {MarketplaceService} from "./MarketplaceService";
import {OrderService} from "./OrderService";
import {SystemController} from "../domain/controller/SystemController";
import {LoginData, NewProductData, NewRoleData, RegisterMemberData} from "../utilities/DataObjects";
import {Result} from "../utilities/Result";
import {Member} from "./simple_objects/user/Member";
import {Guest} from "./simple_objects/user/Guest";
import {Permissions} from "../utilities/Permissions";
import {ExternalServiceType, UserID} from "../utilities/Utils";
import {Shop} from "./simple_objects/marketplace/Shop";
import {Product} from "./simple_objects/marketplace/Product";
import {ShopOrder} from "./simple_objects/purchase/ShopOrder";
import {ShoppingCart} from "./simple_objects/marketplace/ShoppingCart";
import {JobType} from "../domain/user/Role";


export class Service {
    private readonly systemController: SystemController;

    private guestService: GuestService;
    private memberService: MemberService;
    private marketplaceService: MarketplaceService;
    private shoppingCartService: ShoppingCartService;
    private orderService: OrderService;

    constructor() {
        //System - Use-Case 1
        this.systemController = SystemController.initialize();
        this.guestService = new GuestService(this.systemController);
        this.memberService = new MemberService(this.systemController);
        this.marketplaceService = new MarketplaceService(this.systemController);
        this.shoppingCartService = new ShoppingCartService(this.systemController);
        this.orderService = new OrderService(this.systemController);
    }

    //----------------------Guest Service methods-------------------------------

    //General Guest - Use-Case 3
    register(guestId: number, username: string, password: string, firstName?: string, lastName?: string, email?: string, country?: string): Result<void> {
        return this.guestService.register(guestId, username, password, firstName, lastName, email, country);
    }

    //General Admin - Use-Case 0
    registerAdmin(guestId: number, username: string, password: string, firstName?: string, lastName?: string, email?: string, country?: string): Result<void> {
        return this.guestService.registerAdmin(guestId, username, password, firstName, lastName, email, country);
    }

    //General Guest - Use-Case 4
    login(guestID: number, username: string, password: string): Result<Member> {
        return this.guestService.login(guestID, username, password);
    }

    //----------------------Member Service methods-------------------------------

    //General Member - Use-Case 1
    logout(username: string): Result<Guest> {
        return this.memberService.logout(username);
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(newOwnerID: string, jobRole: JobType = JobType.Owner, shopID: number, assigningOwnerID: string, title?: string, permissions?: Permissions[]): Result<void> {
        return this.memberService.appointShopOwner(newOwnerID, jobRole, shopID, assigningOwnerID, title, permissions);
    }

    //Shop Owner - Use-Case 6
    appointShopManager(newManagerID: string, jobRole: JobType = JobType.Manager, shopID: number, assigningOwnerID: string, title?: string, permissions?: Permissions[]): Result<void> {
        return this.memberService.appointShopManager(newManagerID, jobRole, shopID, assigningOwnerID, title, permissions);
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(assigningOwnerID: string, promotedManagerID: string, shopID: number, permissions: Permissions[]): Result<void> {
        return this.memberService.addPermissions(assigningOwnerID, promotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(assigningOwnerID: string, demotedManagerID: string, shopID: number, permissions: Permissions[]): Result<void> {
        return this.memberService.removePermissions(assigningOwnerID, demotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(username: string, shopID: number): Result<Member[]> {
        return this.memberService.requestShopPersonnelInfo(username, shopID);
    }

    //----------------------Marketplace Service methods-------------------------------

    //General Guest - Use-Case 1
    accessMarketplace(): Result<Guest> {
        return this.marketplaceService.accessMarketplace();
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(userID: UserID): Result<void> {
        return this.marketplaceService.exitMarketplace(userID);
    }

    //Guest Payment - Use-Case 1
    getShopInfo(userID: UserID, shopID: number): Result<Shop> {
        return this.marketplaceService.getShopInfo(userID, shopID);
    }

    //Guest Payment - Use-Case 2
    searchProducts(userID: UserID, searchTerm: string, filters?: any): Result<Product[]> {
        return this.marketplaceService.searchProducts(userID, searchTerm, filters);
    }

    //Member Payment - Use-Case 2
    setUpShop(shopName: string, username: string, description: string): Result<void> {
        return this.marketplaceService.setUpShop(shopName, username, description);
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(username: string, shopID: number, name: string, price: number, quantity: number, description?: string): Result<void> {
        return this.marketplaceService.addProductToShop(username, shopID, name, price, quantity, description);
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(username: string, shopID: number, productID: number): Result<void> {
        return this.marketplaceService.removeProductFromShop(username, shopID, productID);
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(username: string, shopID: number, productName: string, productQuantity: number): Result<void> {
        return this.marketplaceService.modifyProductQuantityInShop(username, shopID, productName, productQuantity);
    }

    //Shop Owner - Use-Case 9
    closeShop(founderID: string, shopID: number): Result<void> {
        return this.marketplaceService.closeShop(founderID, shopID);
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Result<ShopOrder[]> {
        return this.marketplaceService.getShopPurchaseHistory(ownerID, shopID, startDate, endDate, filters);
    }

    //----------------------Shopping Cart Service methods-------------------------------

    //Guest Payment - Use-Case 4.1
    addToCart(userID: UserID, productID: number, productQuantity: number): Result<void> {
        return this.shoppingCartService.addToCart(userID, productID, productQuantity);
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(userID: UserID): Result<ShoppingCart> {
        return this.shoppingCartService.checkShoppingCart(userID);
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(userID: UserID, productID: number): Result<void> {
        return this.shoppingCartService.removeFromCart(userID, productID);
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(userID: UserID, productID: number, productQuantity: number, additionalDetails?: any): Result<void> {
        return this.shoppingCartService.editProductInCart(userID, productID, productQuantity, additionalDetails);
    }

    //Guest Payment - Use-Case 5
    checkout(userID: UserID, paymentDetails: any, deliveryDetails: any): Result<void> {
        return this.shoppingCartService.checkout(userID, paymentDetails, deliveryDetails);
    }

    //----------------------Order Service methods-------------------------------

    //System - Use-Case 2
    addConnectionWithExternalService(type: ExternalServiceType, serviceName: string): Result<void> {
        return this.orderService.addConnectionWithExternalService(type, serviceName);
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(type: ExternalServiceType, serviceName: string, settings?: any): Result<void> {
        return this.orderService.editConnectionWithExternalService(type, serviceName, settings);
    }

    //System - Use-Case 2.2
    swapConnectionWithExternalService(type: ExternalServiceType, oldServiceName: string, newServiceName: string): Result<void> {
        return this.orderService.swapConnectionWithExternalService(type, oldServiceName, newServiceName);
    }

    //System - Use-Case 3
    //System - Use-Case 4
    callService(type: ExternalServiceType, serviceDetails?: any): Result<void> {
        return this.orderService.callService(type, serviceDetails);
    }
}
