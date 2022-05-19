import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShopOrder} from "../utilities/simple_objects/purchase/SimpleShopOrder";
import {ProductCategory, SearchType} from "../utilities/Enums";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";


export class MarketplaceService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 1
    accessMarketplace(sessionID: string): Result<void | SimpleGuest> {
        return this.systemController.accessMarketplace(sessionID);
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(sessionID: string): Result<void> {
        return this.systemController.exitMarketplace(sessionID);
    }

    //Guest Payment - Use-Case 1
    getShopInfo(sessionID: string, shopID: number): Result<void | SimpleShop> {
        return this.systemController.getShop(sessionID, shopID);
    }

    //Guest Payment - Use-Case 2
    searchProducts(sessionID: string, searchType: SearchType, searchTerm: string | ProductCategory, filters?: any): Result<void | SimpleProduct[]> {
        return this.systemController.searchProducts(sessionID, searchType, searchTerm, filters);
    }

    //Member Payment - Use-Case 2
    setUpShop(sessionID: string, username: string, shopName: string): Result<void | SimpleShop> {
        return this.systemController.setUpShop(sessionID, username, shopName);
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(sessionID: string, username: string, shopID: number, category: ProductCategory, name: string,
                     price: number, quantity: number, description?: string): Result<void> {
        return this.systemController.addProduct(sessionID, username, {shopId: shopID, productCategory: category, productName: name,
            fullPrice: price, quantity: quantity, productDesc: description});
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(sessionID: string, username: string, shopID: number, productID: number): Result<void> {
        return this.systemController.deleteProduct(sessionID, username, shopID, productID);
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(sessionID: string, username: string, shopID: number, productID: number, productQuantity: number): Result<void> {
        return this.systemController.updateProduct(sessionID, username, shopID, productID, productQuantity);
    }

    //Shop Owner - Use-Case 9
    closeShop(sessionID: string, founderID: string, shopID: number): Result<void> {
        return this.systemController.deactivateShop(sessionID, founderID, shopID);
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(sessionID: string, ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Result<void | SimpleShopOrder[]> {
        return this.systemController.getShopPurchases(sessionID, ownerID, shopID, startDate, endDate, filters);
    }
}
