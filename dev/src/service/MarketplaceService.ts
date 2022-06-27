import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {ProductCategory, SearchType} from "../utilities/Enums";
import {inject, injectable} from "inversify";
import {TYPES} from './../helpers/types';
import "reflect-metadata";
import {Offer} from "../domain/user/Offer";
import {AppointmentAgreement} from "../domain/marketplace/AppointmentAgreement";

@injectable()
export class MarketplaceService {
    private systemController: SystemController;

    constructor(@inject(TYPES.SystemController)systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 1
    async accessMarketplace(sessionID: string): Promise<Result<void | SimpleGuest>> {
        return this.systemController.accessMarketplace(sessionID);
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    async exitMarketplace(sessionID: string): Promise<Result<void>> {
        return this.systemController.exitMarketplace(sessionID);
    }

    //Guest Payment - Use-Case 1
    async getShopInfo(sessionID: string, shopID: number): Promise<Result<void | SimpleShop>> {
        return this.systemController.getShop(sessionID, shopID);
    }

    //Guest Payment - Use-Case 2
    async searchProducts(sessionID: string, searchType: SearchType, searchTerm: string | ProductCategory, filters?: any): Promise<Result<void | SimpleProduct[]>> {
        return this.systemController.searchProducts(sessionID, searchType, searchTerm, filters);
    }

    //Member Payment - Use-Case 2
    async setUpShop(sessionID: string, shopName: string): Promise<Result<void | SimpleShop>> {
        return this.systemController.setUpShop(sessionID, shopName);
    }

    //Shop Owner - Use-Case 1.1
    async addProductToShop(sessionID: string, shopID: number, category: ProductCategory, name: string, price: number,
                     quantity: number, description?: string): Promise<Result<SimpleProduct | void>> {
        return this.systemController.addProduct(sessionID, {shopId: shopID, productCategory: category, productName: name, fullPrice: price,
                quantity: quantity, productDesc: description});
    }

    //Shop Owner - Use-Case 1.2
    async removeProductFromShop(sessionID: string, shopID: number, productID: number): Promise<Result<void>> {
        return this.systemController.deleteProduct(sessionID, shopID, productID);
    }

    //Shop Owner - Use-Case 1.3
    async modifyProductQuantityInShop(sessionID: string, shopID: number, productID: number, productQuantity: number): Promise<Result<void>> {
        return this.systemController.updateProductQuantity(sessionID, shopID, productID, productQuantity);
    }

    //Shop Owner - Use-Case 9
    async closeShop(sessionID: string, shopID: number): Promise<Result<void>> {
        return this.systemController.deactivateShop(sessionID, shopID);

    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    async getShopPurchaseHistory(sessionID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Promise<Result<void | string[]>> {
        return this.systemController.getShopPurchases(sessionID, shopID, startDate, endDate, filters);
    }

    // getAllShopInfo() {
    //     console.log("[MarketPlaceService/getAllShopInfo] start");
    //     return this.systemController.getShops();
    // }


    async getAllShopInfo(sessionID: string) {
        return this.systemController.getShops(sessionID);
    }

    async addOffer2Shop (sessionId, shopId: number, pId: number, price: number ){
        return this.systemController.addOffer2Shop(sessionId, shopId, pId, price);

    }

    async filingCounterOffer(sessionId: string, shopId: number, offerId: number, counterPrice: number){
        return this.systemController.filingCounterOffer(sessionId, shopId, offerId, counterPrice);
    }

    async denyCounterOffer(sessionId: string, username: string  , shopId: number, offerId: number){
        return this.systemController.denyCounterOffer(sessionId, username, shopId, offerId);
    }

    async submitOwnerAppointmentInShop(sessionId: string, shopId: number, member: string, assigner: string){
        return this.systemController.submitOwnerAppointmentInShop(sessionId, shopId, member, assigner);
    }
}
