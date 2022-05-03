import {GuestService} from "./GuestService";
import {MemberService} from "./MemberService";
import {ShoppingCartService} from "./ShoppingCartService";
import {MarketplaceService} from "./MarketplaceService";
import {OrderService} from "./OrderService";
import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {Member} from "./simple_objects/user/Member";
import {Guest} from "./simple_objects/user/Guest";
import {Permissions} from "../utilities/Permissions";
import {ExternalServiceType, UserID} from "../utilities/Utils";
import {Shop} from "./simple_objects/marketplace/Shop";
import {Product} from "./simple_objects/marketplace/Product";
import {ShopOrder} from "./simple_objects/purchase/ShopOrder";
import {ShoppingCart} from "./simple_objects/marketplace/ShoppingCart";
import {productCategory} from "../utilities/Enums";
import {logger} from "../helpers/logger";


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
        logger.info(`A member registration is being performed by ${guestId} using username: ${username} and password: ${password}`);
        logger.info(`The following personal details were entered: First Name ${firstName}, Last Name: ${lastName}, E-mail: ${email}, Country: ${country}`);
        return this.guestService.register(guestId, username, password, firstName, lastName, email, country);
    }

    //General Admin - Use-Case 0
    registerAdmin(guestId: number, username: string, password: string, firstName?: string, lastName?: string, email?: string, country?: string): Result<void> {
        logger.info(`An admin registration is being performed by ${guestId} using username: ${username} and password: ${password}`);
        logger.info(`The following personal details were entered: First Name ${firstName}, Last Name: ${lastName}, E-mail: ${email}, Country: ${country}`);
        return this.guestService.registerAdmin(guestId, username, password, firstName, lastName, email, country);
    }

    //General Guest - Use-Case 4
    login(guestID: number, username: string, password: string): Result<void | Member> {
        logger.info(`A login is being performed by ${guestID} using username: ${username} and password: ${password}`);
        return this.guestService.login(guestID, username, password);
    }

    //----------------------Member Service methods-------------------------------

    //General Member - Use-Case 1
    logout(username: string): Result<void | Guest> {
        logger.info(`A logout operation is being performed by ${username}`);
        return this.memberService.logout(username);
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(newOwnerID: string, shopID: number, assigningOwnerID: string, title?: string): Result<void> {
        logger.info(`${assigningOwnerID} is appointing ${newOwnerID} to an owner of shop ${shopID}`);
        if(title)
            logger.info(`Member is appointed with the title ${title}`);
        return this.memberService.appointShopOwner(newOwnerID, shopID, assigningOwnerID, title);
    }

    //Shop Owner - Use-Case 6
    appointShopManager(newManagerID: string, shopID: number, assigningOwnerID: string, title?: string, permissions?: Permissions[]): Result<void> {
        logger.info(`${assigningOwnerID} is appointing ${newManagerID} to a manager of shop ${shopID}`);
        if(title)
            logger.info(`Member is appointed with the title ${title}`);
        if(permissions)
            logger.info(`Member is appointed with the following permissions: ${permissions}`);
        return this.memberService.appointShopManager(newManagerID, shopID, assigningOwnerID, title, permissions);
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(assigningOwnerID: string, promotedManagerID: string, shopID: number, permissions: Permissions[]): Result<void> {
        logger.info(`${assigningOwnerID} is promoting ${promotedManagerID} of shop ${shopID} by adding the following permissions: ${permissions}`);
        return this.memberService.addPermissions(assigningOwnerID, promotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(assigningOwnerID: string, demotedManagerID: string, shopID: number, permissions: Permissions[]): Result<void> {
        logger.info(`${assigningOwnerID} is demoting ${demotedManagerID} of shop ${shopID} by removing the following permissions: ${permissions}`);
        return this.memberService.removePermissions(assigningOwnerID, demotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(username: string, shopID: number): Result<void | Member[]> {
        logger.info(`${username} is requesting the personnel info of shop ${shopID}`);
        return this.memberService.requestShopPersonnelInfo(username, shopID);
    }

    //----------------------Marketplace Service methods-------------------------------

    //General Guest - Use-Case 1
    accessMarketplace(): Result<void | Guest> {
        logger.info(`A new user is accessing the marketplace`);
        return this.marketplaceService.accessMarketplace();
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(userID: UserID): Result<void> {
        logger.info(`${userID} is attempting to exit the marketplace`);
        return this.marketplaceService.exitMarketplace(userID);
    }

    //Guest Payment - Use-Case 1
    getShopInfo(userID: UserID, shopID: number): Result<void | Shop> {
        logger.info(`${userID} is requesting info regarding shop ${shopID}`);
        return this.marketplaceService.getShopInfo(userID, shopID);
    }

    //Guest Payment - Use-Case 2
    searchProducts(userID: UserID, searchTerm: string, filters?: any): Result<void | Product[]> {
        logger.info(`${userID} has initiated a product search operation using the search term ${searchTerm}`);
        if(filters)
            logger.info(`The search is initiated using the following filter details ${filters}`);
        return this.marketplaceService.searchProducts(userID, searchTerm, filters);
    }

    //Member Payment - Use-Case 2
    setUpShop(username: string, shopName: string): Result<void | Shop> {
        logger.info(`${username} wants to create a new shop with the name ${shopName}`);
        return this.marketplaceService.setUpShop(shopName, username);
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(username: string, shopID: number, category: productCategory, name: string, price: number,
                     quantity: number, description?: string): Result<void> {
        logger.info(`The user ${username} wants to add a new product to shop ${shopID}`);
        logger.info(`The product contains the following details - category: ${category}, name: ${name}, price: ${price}, quantity: ${quantity}`);
        if(description)
            logger.info(`The product contains the following description: ${description}`);
        return this.marketplaceService.addProductToShop(username, shopID, category, name, price, quantity, description);
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(username: string, shopID: number, productID: number): Result<void> {
        logger.info(`${username} wants to remove from shop ${shopID} the product ${productID}`);
        return this.marketplaceService.removeProductFromShop(username, shopID, productID);
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(username: string, shopID: number, productID: number, productQuantity: number): Result<void> {
        logger.info(`${username} wants to modify the product ${productID} in shop ${shopID} wth quantity ${productQuantity}`);
        return this.marketplaceService.modifyProductQuantityInShop(username, shopID, productID, productQuantity);
    }

    //Shop Owner - Use-Case 9
    closeShop(founderID: string, shopID: number): Result<void> {
        logger.info(`${founderID} wants to close the shop ${shopID}`);
        return this.marketplaceService.closeShop(founderID, shopID);
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Result<void | ShopOrder[]> {
        logger.info(`${ownerID} would like to view the purchase history of ${shopID} from ${startDate} to ${endDate}`);
        if(filters)
            logger.info(`The request is made with the following filters: ${filters}`);
        return this.marketplaceService.getShopPurchaseHistory(ownerID, shopID, startDate, endDate, filters);
    }

    //----------------------Shopping Cart Service methods-------------------------------

    //Guest Payment - Use-Case 4.1
    addToCart(userID: UserID, productID: number, productQuantity: number): Result<void> {
        logger.info(`${userID} wants to add the product ${productID} x${productQuantity} to his shopping cart`);
        return this.shoppingCartService.addToCart(userID, productID, productQuantity);
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(userID: UserID): Result<void | ShoppingCart> {
        logger.info(`${userID} would like to review the contents of his shopping cart`);
        return this.shoppingCartService.checkShoppingCart(userID);
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(userID: UserID, productID: number): Result<void> {
        logger.info(`${userID} would like to remove the product ${productID} from his shopping cart`);
        return this.shoppingCartService.removeFromCart(userID, productID);
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(userID: UserID, productID: number, productQuantity: number, additionalDetails?: any): Result<void> {
        logger.info(`${userID} would like to modify product ${productID} with a quantity of ${productQuantity}`);
        if(additionalDetails)
            logger.info(`The modification is requested using the following additional details ${additionalDetails}`);
        return this.shoppingCartService.editProductInCart(userID, productID, productQuantity, additionalDetails);
    }

    //Guest Payment - Use-Case 5
    checkout(userID: UserID, paymentDetails: any, deliveryDetails: any): Result<void> {
        logger.info(`${userID} would like to perform a checkout operation using the following payment details: ${paymentDetails} and delivery details: ${deliveryDetails}`);
        return this.shoppingCartService.checkout(userID, paymentDetails, deliveryDetails);
    }

    //----------------------Order Service methods-------------------------------

    //System - Use-Case 2
    addConnectionWithExternalService(type: ExternalServiceType, serviceName: string): Result<void> {
        logger.info(`A connection with the ${type} service ${serviceName} is being initiated`);
        return this.orderService.addConnectionWithExternalService(type, serviceName);
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(type: ExternalServiceType, serviceName: string, settings: any): Result<void> {
        logger.info(`The connection with the ${type} service ${serviceName} is being modified using the following settings: ${settings}`);
        return this.orderService.editConnectionWithExternalService(type, serviceName, settings);
    }

    //System - Use-Case 2.2
    swapConnectionWithExternalService(type: ExternalServiceType, oldServiceName: string, newServiceName: string): Result<void> {
        logger.info(`The connection with the ${type} service ${oldServiceName} is being swapped with ${newServiceName}`);
        return this.orderService.swapConnectionWithExternalService(type, oldServiceName, newServiceName);
    }

    //System - Use-Case 3
    //System - Use-Case 4
    callService(type: ExternalServiceType, serviceDetails?: any): Result<void> {
        logger.info(`The ${type} service is being called with the following details: ${serviceDetails}`); //TODO add service name parameter
        return this.orderService.callService(type, serviceDetails);
    }
}
