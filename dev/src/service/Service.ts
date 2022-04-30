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
import {ExternalServiceType, Id} from "../utilities/Utils";
import {Shop} from "./simple_objects/marketplace/Shop";
import {Product} from "./simple_objects/marketplace/Product";
import {ShopOrder} from "./simple_objects/purchase/ShopOrder";
import {Product as DomainProduct} from "../domain/marketplace/Product";
import {ShoppingCart} from "./simple_objects/marketplace/ShoppingCart";


export class Service {
    systemController: SystemController;

    guestService: GuestService;
    memberService: MemberService;
    marketplaceService: MarketplaceService;
    shoppingCartService: ShoppingCartService;
    orderService: OrderService;

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
    register(guestId: number, registrationData: RegisterMemberData): Result<void> {
        return this.guestService.register(guestId, registrationData);
    }

    //General Admin - Use-Case 0
    registerAdmin(guestId: number, registrationData: RegisterMemberData): Result<void> {
        return this.guestService.registerAdmin(guestId, registrationData);
    }

    //General Guest - Use-Case 4
    login(guestID: number, loginData: LoginData): Result<Member> {
        return this.guestService.login(guestID, loginData);
    }

    //----------------------Member Service methods-------------------------------

    //General Member - Use-Case 1
    logout(username: string): Result<Guest> {
        return this.memberService.logout(username);
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(newRoleData: NewRoleData): Result<void> {
        return this.memberService.appointShopOwner(newRoleData);
    }

    //Shop Owner - Use-Case 6
    appointShopManager(newRoleData: NewRoleData): Result<void> {
        return this.memberService.appointShopManager(newRoleData);
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
    exitMarketplace(userID: Id): Result<void> {
        return this.marketplaceService.exitMarketplace(userID);
    }

    //Guest Payment - Use-Case 1
    getShopInfo(userID: Id, shopID: number): Result<Shop> {
        return this.marketplaceService.getShopInfo(userID, shopID);
    }

    //Guest Payment - Use-Case 2
    searchProducts(userID: Id, searchTerm: string, filters?: any): Result<Product[]> {
        return this.marketplaceService.searchProducts(userID, searchTerm, filters);
    }

    //Member Payment - Use-Case 2
    setUpShop(shopName: string, username: string, description: string): Result<void> {
        return this.marketplaceService.setUpShop(shopName, username, description);
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(username: string, productInfo: NewProductData): Result<void> {
        return this.marketplaceService.addProductToShop(username, productInfo);
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
    addToCart(userID: Id, productID: number, productQuantity: number): Result<void> {
        return this.shoppingCartService.addToCart(userID, productID, productQuantity);
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(userID: Id): Result<ShoppingCart> {
        return this.shoppingCartService.checkShoppingCart(userID);
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(userID: Id, productID: number): Result<void> {
        return this.shoppingCartService.removeFromCart(userID, productID);
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(userID: string, productID: number, productQuantity: number, additionalDetails?: any): Result<void> {
        return this.shoppingCartService.editProductInCart(userID, productID, productQuantity, additionalDetails);
    }

    //Guest Payment - Use-Case 5
    checkout(userID: Id, paymentDetails: any, deliveryDetails: any): Result<void> {
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
    swapConnectionWithExternalService(type: ExternalServiceType, newServiceName: string): Result<void> {
        return this.orderService.swapConnectionWithExternalService(type, newServiceName);
    }

    //System - Use-Case 3
    //System - Use-Case 4
    callService(type: ExternalServiceType, serviceDetails?: any): Result<void> {
        return this.orderService.callService(type, serviceDetails);
    }
}
