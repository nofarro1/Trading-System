import {GuestService} from "./GuestService";
import {MemberService} from "./MemberService";
import {ShoppingCartService} from "./ShoppingCartService";
import {MarketplaceService} from "./MarketplaceService";
import {OrderService} from "./OrderService";
import {Result} from "../utilities/Result";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {Permissions} from "../utilities/Permissions";
import {ExternalServiceType} from "../utilities/Utils";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShoppingCart} from "../utilities/simple_objects/user/SimpleShoppingCart";
import {ProductCategory, SearchType} from "../utilities/Enums";
import {logger} from "../helpers/logger";
import {inject, injectable} from "inversify";
import {TYPES} from "../helpers/types";
import "reflect-metadata";
import {DeliveryDetails} from "../domain/external_services/IDeliveryService";
import {PaymentDetails} from "../domain/external_services/IPaymentService";

@injectable()
export class Service {
    private guestService: GuestService;
    private memberService: MemberService;
    private marketplaceService: MarketplaceService;
    private shoppingCartService: ShoppingCartService;
    private orderService: OrderService;

    constructor(@inject(TYPES.GuestService) guestService: GuestService,
                @inject(TYPES.MemberService) memberService: MemberService,
                @inject(TYPES.MarketplaceService) marketplaceService: MarketplaceService,
                @inject(TYPES.ShoppingCartService) shoppingCartService: ShoppingCartService,
                @inject(TYPES.OrderService) orderService: OrderService) {
        //System - Use-Case 1

        this.guestService = guestService
        this.memberService = memberService
        this.marketplaceService = marketplaceService
        this.shoppingCartService = shoppingCartService
        this.orderService = orderService
    }

    //----------------------Guest Service methods-------------------------------

    //General Guest - Use-Case 3
    register(sessionID: string, username: string, password: string, firstName?: string, lastName?: string, email?: string, country?: string): Promise<Result<void | SimpleMember>> {
        logger.info(`A member registration is being performed using ${sessionID} for username: ${username}`);
        logger.info(`The following personal details were entered: First Name ${firstName}, Last Name: ${lastName}, E-mail: ${email}, Country: ${country}`);
        return this.guestService.register(sessionID, username, password, firstName, lastName, email, country);
    }

    //General Admin - Use-Case 0
    registerAdmin(sessionID: string, username: string, password: string, firstName?: string, lastName?: string, email?: string, country?: string): Promise<Result<void>> {
        logger.info(`An admin registration is being performed for username ${username}`);
        logger.info(`The following personal details were entered: First Name ${firstName}, Last Name: ${lastName}, E-mail: ${email}, Country: ${country}`);
        return this.guestService.registerAdmin(sessionID, username, password, firstName, lastName, email, country);
    }

    //General Guest - Use-Case 4
    login(sessionID: string, username: string, password: string): Promise<Result<void | SimpleMember>> {
        logger.info(`A login is being performed using ${sessionID} for username: ${username}.`);
        return this.guestService.login(sessionID, username, password);
    }

    //----------------------Member Service methods-------------------------------

    //General Member - Use-Case 1
    logout(sessionID: string, username: string): Promise<Result<void | SimpleGuest>> {
        logger.info(`A logout operation is being performed by ${username} using ${sessionID}`);
        return this.memberService.logout(sessionID);
    }

    //Shop Owner - Use-Case 4
    // appointShopOwner(sessionID: string, newOwnerID: string, shopID: number, assigningOwnerID: string, title?: string): Promise<Result<void>> {
    //     logger.info(`${sessionID}: ${assigningOwnerID} is appointing ${newOwnerID} to an owner of shop ${shopID}`);
    //     if(title)
    //         logger.info(`Member is appointed with the title ${title}`);
    //     return this.memberService.appointShopOwner(sessionID, newOwnerID, shopID, assigningOwnerID, title);
    // }

    //Shop Owner - Use-Case 6
    appointShopManager(sessionID: string, newManagerID: string, shopID: number, assigningOwnerID: string, title?: string, permissions?: Permissions[]): Promise<Result<void>> {
        logger.info(`${sessionID}: ${assigningOwnerID} is appointing ${newManagerID} to a manager of shop ${shopID}`);
        if(title)
            logger.info(`Member is appointed with the title ${title}`);
        if(permissions)
            logger.info(`Member is appointed with the following permissions: ${permissions}`);
        return this.memberService.appointShopManager(sessionID, newManagerID, shopID, assigningOwnerID, title, permissions);
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(sessionID: string, assigningOwnerID: string, promotedManagerID: string, shopID: number, permissions: Permissions): Promise<Result<void>> {
        logger.info(`${sessionID}: ${assigningOwnerID} is promoting ${promotedManagerID} of shop ${shopID} by adding the following permissions: ${permissions}`);
        return this.memberService.addPermissions(sessionID, assigningOwnerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(sessionID: string, assigningOwnerID: string, demotedManagerID: string, shopID: number, permissions: Permissions): Promise<Result<void>> {
        logger.info(`${sessionID}: ${assigningOwnerID} is demoting ${demotedManagerID} of shop ${shopID} by removing the following permissions: ${permissions}`);
        return this.memberService.removePermissions(sessionID, demotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(sessionID: string, username: string, shopID: number): Promise<Result<void | SimpleMember[]>> {
        logger.info(`${sessionID}: ${username} is requesting the personnel info of shop ${shopID}`);
        return this.memberService.requestShopPersonnelInfo(sessionID, shopID);
    }

    //----------------------Marketplace Service methods-------------------------------

    //General Guest - Use-Case 1
    accessMarketplace(sessionID: string): Promise<Result<void | SimpleGuest>> {
        logger.info(`A new guest is accessing the marketplace`);
        return this.marketplaceService.accessMarketplace(sessionID);
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(sessionID: string): Promise<Result<void>> {
        logger.info(`${sessionID} is attempting to exit the marketplace`);
        return this.marketplaceService.exitMarketplace(sessionID);
    }

    //Guest Payment - Use-Case 1
    getShopInfo(sessionID: string, shopID: number): Promise<Result<void | SimpleShop>> {
        logger.info(`${sessionID} is requesting info regarding shop ${shopID}`);
        return this.marketplaceService.getShopInfo(sessionID, shopID);
    }

    //todo: Get shops (all or filtered for a number

    //Guest Payment - Use-Case 2
    searchProducts(sessionID: string, searchBy: SearchType, searchTerm: string, filters?: any): Promise<Result<void | SimpleProduct[]>> {
        logger.info(`${sessionID} has initiated a product search operation using the search term ${searchTerm}`);
        if(filters)
            logger.info(`The search is initiated using the following filter details ${filters}`);
        return this.marketplaceService.searchProducts(sessionID, searchBy, searchTerm, filters);
    }

    //todo: get products (provided list of ids)

    //Member Payment - Use-Case 2
    setUpShop(sessionID: string, username: string, shopName: string): Promise<Result<void | SimpleShop>> {
        logger.info(`${sessionID}: ${username} wants to create a new shop with the name ${shopName}`);
        return this.marketplaceService.setUpShop(sessionID, shopName);
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(sessionID: string, username: string, shopID: number, category: ProductCategory, name: string,
                     price: number, quantity: number, description?: string): Promise<Result<SimpleProduct | void>> {
        logger.info(`${sessionID}:  user ${username} wants to add a new product to shop ${shopID}`);
        logger.info(`The product contains the following details - category: ${category}, name: ${name}, price: ${price}, quantity: ${quantity}`);
        if(description)
            logger.info(`The product contains the following description: ${description}`);
        return this.marketplaceService.addProductToShop(sessionID, shopID, category, name, price, quantity, description);
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(sessionID: string, username: string, shopID: number, productID: number): Promise<Result<void>> {
        logger.info(`${sessionID}: ${username} wants to remove from shop ${shopID} the product ${productID}`);
        return this.marketplaceService.removeProductFromShop(sessionID, shopID, productID);
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(sessionID: string, username: string, shopID: number, productID: number, productQuantity: number): Promise<Result<void>> {
        logger.info(`${sessionID}: ${username} wants to modify the product ${productID} in shop ${shopID} wth quantity ${productQuantity}`);
        return this.marketplaceService.modifyProductQuantityInShop(sessionID, shopID, productID, productQuantity);
    }

    //Shop Owner - Use-Case 9
    closeShop(sessionID: string, founderID: string, shopID: number): Promise<Result<void>> {
        logger.info(`${sessionID}: ${founderID} wants to close the shop ${shopID}`);
        return this.marketplaceService.closeShop(sessionID, shopID);
    }

    //todo: missing reopen shop

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(sessionID: string, ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Promise<Result<void | string[]>> {
        logger.info(`${sessionID}: ${ownerID} would like to view the purchase history of ${shopID} from ${startDate} to ${endDate}`);
        if(filters)
            logger.info(`The request is made with the following filters: ${filters}`);
        return this.marketplaceService.getShopPurchaseHistory(sessionID, shopID, startDate, endDate, filters);
    }

    //----------------------Shopping Cart Service methods-------------------------------

    //Guest Payment - Use-Case 4.1
    addToCart(sessionID: string, shopId: number, productID: number, productQuantity: number): Promise<Result<void>> {
        logger.info(`${sessionID} wants to add the product ${productID} x${productQuantity} to his shopping cart`);
        return this.shoppingCartService.addToCart(sessionID, shopId, productID, productQuantity);
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(sessionID: string): Promise<Result<void | SimpleShoppingCart>> {
        logger.info(`${sessionID} would like to review the contents of his shopping cart`);
        return this.shoppingCartService.checkShoppingCart(sessionID);
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(sessionID: string, shopId: number, productID: number): Promise<Result<void>> {
        logger.info(`${sessionID} would like to remove the product ${productID} from his shopping cart`);
        return this.shoppingCartService.removeFromCart(sessionID, shopId, productID);
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(sessionID: string, productID: number, productQuantity: number, additionalDetails?: any): Promise<Result<void>> {
        logger.info(`${sessionID} would like to modify product ${productID} with a quantity of ${productQuantity}`);
        if(additionalDetails)
            logger.info(`The modification is requested using the following additional details ${additionalDetails}`);
        return this.shoppingCartService.editProductInCart(sessionID, productID, productQuantity, additionalDetails);
    }

    //Guest Payment - Use-Case 5
    checkout(sessionID: string, paymentDetails: PaymentDetails, deliveryDetails: DeliveryDetails): Promise<Result<void>> {
        logger.info(`${sessionID} would like to perform a checkout operation using the following payment details: ${paymentDetails} and delivery details: ${deliveryDetails}`);
        return this.shoppingCartService.checkout(sessionID, paymentDetails, deliveryDetails);
    }

    //----------------------Order Service methods-------------------------------

    //System - Use-Case 2.2
    swapConnectionWithExternalService(sessionID: string, adminUsername: string, type: ExternalServiceType, serviceName: string): Promise<Result<void>> {
        logger.info(`${sessionID}: A connection with the ${type} service ${serviceName} is being initiated`);
        return this.orderService.swapConnectionWithExternalService(sessionID, adminUsername, type, serviceName);
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(sessionID: string, adminUsername: string, type: ExternalServiceType, settings: any): Promise<Result<void>> {
        logger.info(`${sessionID}: The connection with the ${type} service is being modified using the following settings: ${settings}`);
        return this.orderService.editConnectionWithExternalService(sessionID, adminUsername, type, settings);
    }

    async getAllShopsInfo(sessionID: string) {
        logger.info(`${sessionID} is requesting All shops`);
        return this.marketplaceService.getAllShopInfo(sessionID);
    }

    async getMessages(sessionId: string) {
        return this.memberService.getMessages(sessionId)

    }
}
