import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {ProductCategory, SearchType} from "../utilities/Enums";
import {inject, injectable} from "inversify";
import {TYPES} from './../helpers/types';
import "reflect-metadata";

@injectable()
export class MarketplaceService {
    private systemController: SystemController;

    constructor(@inject(TYPES.SystemController)systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 1
    accessMarketplace(sessionID: string): Promise<Result<void | SimpleGuest>> {

        return new Promise<Result<void | SimpleGuest>> ((resolve, reject) => {
            let result: Result<void | SimpleGuest> = this.systemController.accessMarketplace(sessionID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(sessionID: string): Promise<Result<void>> {

        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.exitMarketplace(sessionID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 1
    getShopInfo(sessionID: string, shopID: number): Promise<Result<void | SimpleShop>> {

        return new Promise<Result<void | SimpleShop>>((resolve, reject) => {
            let result: Result<void | SimpleShop> = this.systemController.getShop(sessionID, shopID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 2
    searchProducts(sessionID: string, searchType: SearchType, searchTerm: string | ProductCategory, filters?: any): Promise<Result<void | SimpleProduct[]>> {

        return new Promise<Result<void | SimpleProduct[]>>((resolve, reject) => {
            let result: Result<void | SimpleProduct[]> = this.systemController.searchProducts(sessionID, searchType, searchTerm, filters);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Member Payment - Use-Case 2
    setUpShop(sessionID: string, shopName: string): Promise<Result<void | SimpleShop>> {

        return new Promise<Result<void | SimpleShop>>((resolve, reject) => {
            let result: Result<void | SimpleShop> = this.systemController.setUpShop(sessionID, shopName);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(sessionID: string, shopID: number, category: ProductCategory, name: string, price: number,
                     quantity: number, description?: string): Promise<Result<SimpleProduct | void>> {

        return new Promise<Result<SimpleProduct | void>>((resolve, reject) => {
            let result: Result<SimpleProduct | void> = this.systemController.addProduct(sessionID, {shopId: shopID, productCategory: category, productName: name, fullPrice: price,
                quantity: quantity, productDesc: description});
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(sessionID: string, shopID: number, productID: number): Promise<Result<void>> {

        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.deleteProduct(sessionID, shopID, productID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(sessionID: string, shopID: number, productID: number, productQuantity: number): Promise<Result<void>> {
        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.updateProductQuantity(sessionID, shopID, productID, productQuantity);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 9
    closeShop(sessionID: string, shopID: number): Promise<Result<void>> {
        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.deactivateShop(sessionID, shopID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(sessionID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Promise<Result<void | string[]>> {
        return new Promise<Result<void | string[]>>((resolve, reject) => {
            let result: Result<void | string[]> = this.systemController.getShopPurchases(sessionID, shopID, startDate, endDate, filters);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    getAllShopInfo(sessionID: string) {
        return new Promise<Result<void | SimpleShop[]>>((resolve, reject) => {
            let result: Result<void | SimpleShop[]> = this.systemController.getShops(sessionID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    // addOffer2Shop (sessionId, userName:string, shopId: number, pId: number, price: number ){
    //     return new Promise<Result<void>>((resolve, reject)=>{
    //         let result: Result<void> = this.systemController.addOffer2Shop(sessionId, userName, shopId, pId, price);
    //         result.ok ? resolve(result) : reject(result.message);
    //     })
    // }
}
