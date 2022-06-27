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
import {SimpleDiscountDescriber} from "../utilities/simple_objects/marketplace/SimpleDiscountDescriber";
import {DiscountData, ImmediatePurchaseData} from "../utilities/DataObjects";
import {
    ImmediatePurchasePolicyComponent
} from "../domain/marketplace/DiscountAndPurchasePolicies/Components/ImmediatePurchasePolicyComponent";

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
    async  getShopInfo(sessionID: string, shopID: number): Promise<Result<void | SimpleShop>> {
        let ans = this.systemController.getShop(sessionID, shopID);
        console.log("in getShopInfo in MarketPlace");
        console.log(ans);
        return ans;
    }

    //Guest Payment - Use-Case 2
    async searchProducts(sessionID: string, searchType: SearchType, searchTerm: string | ProductCategory, filters?: any): Promise<Result<void | SimpleProduct[]>> {
        return this.systemController.searchProducts(sessionID, searchType, searchTerm, filters);
    }

    //Member Payment - Use-Case 2
    async setUpShop(sessionID: string, shopName: string): Promise<Result<void | SimpleShop>> {
        return new Promise<Result<void | SimpleShop>>((resolve, reject) => {
            let result: Result<void | SimpleShop> = this.systemController.setUpShop(sessionID, shopName);
            result.ok ? resolve(result) : reject(result.message);
        });
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

    getDiscounts(sessionId: string, shopId: number){
        return new Promise<Result<void | SimpleDiscountDescriber[]>>((resolve, reject)=>{
            let result: Result<void | SimpleDiscountDescriber[]> = this.systemController.getDiscounts(sessionId, shopId);
            result.ok ? resolve(result) : reject(result.message);
        })
    }

    addDiscount(sessionId: string, shopId: number,discount:DiscountData){
        return new Promise<Result<void | number>>((resolve, reject)=>{
            let result: Result<void | number> = this.systemController.addDiscount(sessionId, shopId,discount);
            result.ok ? resolve(result) : reject(result.message);
        })
    }
    removeDiscount(sessionId: string, shopId: number,dId:number){
        return new Promise<Result<void>>((resolve, reject)=>{
            let result: Result<void> = this.systemController.removeDiscount(sessionId, shopId,dId);
            result.ok ? resolve(result) : reject(result.message);
        })
    }

    getPolicies(sessionId: string, shopId: number){
        return new Promise<Result<void | ImmediatePurchasePolicyComponent[]>>((resolve, reject)=>{
            let result: Result<void | ImmediatePurchasePolicyComponent[]> = this.systemController.getPolicies(sessionId, shopId);
            result.ok ? resolve(result) : reject(result.message);
        })
    }

    addPurchasePolicy(sessionId: string, shopId: number,policy:ImmediatePurchaseData){
        return new Promise<Result<void | number>>((resolve, reject)=>{
            let result: Result<void | number> = this.systemController.addPurchasePolicy(sessionId, shopId,policy);
            result.ok ? resolve(result) : reject(result.message);
        })
    }
    removePurchasePolicy(sessionId: string, shopId: number,pId:number){
        return new Promise<Result<void>>((resolve, reject)=>{
            let result: Result<void> = this.systemController.removePurchasePolicy(sessionId, shopId,pId);
            result.ok ? resolve(result) : reject(result.message);
        })
    }
}
