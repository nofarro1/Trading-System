import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShopOrder} from "../utilities/simple_objects/purchase/SimpleShopOrder";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {ProductCategory, SearchType} from "../utilities/Enums";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";

@injectable()
export class MarketplaceService {
    private systemController: SystemController;

    constructor(@inject(TYPES.SystemController)systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 1
    accessMarketplace(sessionID: string): Promise<Result<void | SimpleGuest>> {
        let result: Result<void | SimpleGuest> = this.systemController.accessMarketplace(sessionID);
        return new Promise<Result<void | SimpleGuest>> ((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(sessionID: string): Promise<Result<void>> {
        let result: Result<void> = this.systemController.exitMarketplace(sessionID);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 1
    getShopInfo(sessionID: string, shopID: number): Promise<Result<void | SimpleShop>> {
        let result: Result<void | SimpleShop> = this.systemController.getShop(sessionID, shopID);
        return new Promise<Result<void | SimpleShop>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 2
    searchProducts(sessionID: string, searchType: SearchType, searchTerm: string | ProductCategory, filters?: any): Promise<Result<void | SimpleProduct[]>> {
        let result: Result<void | SimpleProduct[]> = this.systemController.searchProducts(sessionID, searchType, searchTerm, filters);
        return new Promise<Result<void | SimpleProduct[]>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Member Payment - Use-Case 2
    setUpShop(sessionID: string, shopName: string): Promise<Result<void | SimpleShop>> {
        let result: Result<void | SimpleShop> = this.systemController.setUpShop(sessionID, shopName);
        return new Promise<Result<void | SimpleShop>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(sessionID: string, shopID: number, category: ProductCategory, name: string, price: number,
                     quantity: number, description?: string): Promise<Result<void>> {
        let result: Result<void> = this.systemController.addProduct(sessionID, {shopId: shopID, productCategory: category, productName: name, fullPrice: price,
            quantity: quantity, productDesc: description});
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(sessionID: string, shopID: number, productID: number): Promise<Result<void>> {
        let result: Result<void> = this.systemController.deleteProduct(sessionID, shopID, productID);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(sessionID: string, shopID: number, productID: number, productQuantity: number): Promise<Result<void>> {
        let result: Result<void> = this.systemController.updateProduct(sessionID, shopID, productID, productQuantity);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 9
    closeShop(sessionID: string, shopID: number): Promise<Result<void>> {
        let result: Result<void> = this.systemController.deactivateShop(sessionID, shopID);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(sessionID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Promise<Result<void | SimpleShopOrder[]>> {
        let result: Result<void | SimpleShopOrder[]> = this.systemController.getShopPurchases(sessionID, shopID, startDate, endDate, filters);
        return new Promise<Result<void | SimpleShopOrder[]>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}
