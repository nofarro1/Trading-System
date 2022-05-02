import {IMessageListener, IMessagePublisher} from "../notifications/IEventPublishers";
import {ShopStatusChangedMessage} from "../notifications/Message";
import {Shop} from "./Shop";
import { Result } from "../../utilities/Result";
import { Product, productCategory } from "./Product";
import { Sale } from "./Sale";
import { Member } from "../user package/Member";
export enum searchType{productName, category, keyword}
export enum sortType{price, rate, category, shopRate}


export class MarketplaceController implements IMessagePublisher<ShopStatusChangedMessage> {
    private shops: Map<number, Shop>
    private idsCounter: number;
    private subscriber: IMessageListener<ShopStatusChangedMessage> | null;

    constructor(){
        this.shops= new Map<number,Shop>();
        this.idsCounter= 0;
        this.subscriber= null;
    }

    accept(v: IMessageListener<ShopStatusChangedMessage>, msg: ShopStatusChangedMessage) {
        v.visitShopStatusChangedEvent(msg);
    }

    notify(message: ShopStatusChangedMessage) {
        if(this.subscriber !== null)
            this.accept(this.subscriber, message);
        else
            throw new Error("No one to get the message");
    }

    subscribe(sub: IMessageListener<ShopStatusChangedMessage>) {
        this.subscriber = sub;
    }

    unsub(sub: IMessageListener<ShopStatusChangedMessage>) {
        this.subscriber = null;
    }

    

    setUpShop(userId: number, shopName: String, purchaseAndDiscountPolicies: String): Result<void>{
        let toAdd= new Shop(this.idsCounter, shopName, userId, purchaseAndDiscountPolicies);
        this.shops.set(toAdd.id, toAdd);
        return new Result(true, undefined);
    }

    closeShop(founder: number, shopId: number): Result<void>{
        let toClose= this.shops.get(shopId);
        if(toClose){
            if(founder!= toClose.shopFounder)
                return new Result(false, undefined, "Only the shop's founder can close it");
            else{
                toClose.isActive= false;
                this.notify(new ShopStatusChangedMessage(false, toClose.shopOwners, toClose.name));
                return new Result(true, undefined);
            }
        }
        return new Result(false,undefined, "Failed to close shop because the shop isn't exsist");
    }
    
    reopenShop(founder: number, shopId: number): Result<void>{ 
        let toReopen= this.shops.get(shopId);
        if(toReopen){
            if(founder= toReopen.shopFounder)
                return new Result(false, undefined, "Only the shop's founder can reopen it");
            else{
                toReopen.isActive= true;
                this.notify(new ShopStatusChangedMessage(true, toReopen.shopOwners, toReopen.name));
                return new Result(true, undefined);
            }
        }
        return new Result(false,undefined, "Failed to reopen shop because the shop isn't exsist");
    }

    addProductToShop(userId: number, shopId: number, productCategory:productCategory, productName: string, quantity: number, fullPrice: number, discountPrice:number, relatedSale: Sale, productDesc: string): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop)
            return new Result(false, undefined, "Failed to add product to the shop because the shop wasn't found");
        shop.addProduct(productName, shopId, productCategory, productDesc, fullPrice, discountPrice, relatedSale, quantity)
        return new Result(true, undefined);
    }

    removeProductFromShop(shopId: number, productId: number): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop)
            return new Result(false, undefined, "Failed to remove product to the shop because the shop wasn't found");
        try{
            shop.removeProduct(productId)
            return new Result(true, undefined);
        }
        catch(error: any){
            return new Result(false, undefined, error.message)
        }
    }

    updateProductQuantity(shopId: number, productId: number, quantity: number): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop)
            return new Result(false, undefined, "Failed to update product quantity because the shop wasn't found");
        try{
            shop.updateProductQuantity(productId, quantity)
            return new Result(true, undefined);
        }
        catch(error: any){
            return new Result(false, undefined, error.message);
         }
    }

    appointShopOwner(ownerId: number, shopId: number): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop)
            return new Result(false, undefined, "Failed to appoint owner because the shop wasn't found");
        try{
            shop.appointShopOwner(ownerId);
            return new Result(true, undefined);
        }
        catch(error: any){
            return new Result(false, undefined, error.message);
        }
                 
    }

    appointShopManager(managerId: number, shopId: number): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop)
            return new Result(false, undefined, "Failed to appoint owner because the shop wasn't found");
        try{
            shop.appointShopManager(managerId);
            return new Result(true, undefined);
        }
        catch(error: any){
            return new Result(false, undefined, error.message);
        }
    }

    showShopProducts(shopId: number): Result<Map<number, [Product, number]> | undefined> {
        let shop= this.shops.get(shopId);
        if(shop){
            let products= shop.products;
            if(products.size==0)
                return new Result(true, products, "No products to show");
            return new Result(true, products, "No products to show");    
        }
        else
            return new Result(false, undefined, "Failed to show the shop products because the shop wasn't found");
    }

    //TODO: searchProduct(toSearch: pr){}

} 