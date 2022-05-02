import {IMessageListener, IMessagePublisher} from "../notifications/IEventPublishers";
import {ShopStatusChangedMessage} from "../notifications/Message";
import {Shop, shopRate} from "./Shop";
import { Result } from "../../utilities/Result";
import { Product, productCategory, productRate } from "./Product";
import { Sale } from "./Sale";

export enum searchType{productName, category, keyword}
export enum sortType{price, productRate, category, shopRate}
export class Range<T>{
    private _min: T;
    private _max: T;

    constructor(min: T, max: T){
        this._min= min;
        this._max= max;
    }
    public get min(): T {
        return this._min;
    }
    public set min(value: T) {
        this._min = value;
    }
    public get max(): T {
        return this._max;
    }
    public set max(value: T) {
        this._max = value;
    }
}

export class MarketplaceController implements IMessagePublisher<ShopStatusChangedMessage> {
    private shops: Map<number, Shop>;
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

    searchProduct(searchBy: searchType, searchInput: String | productCategory): Result<Product[]>{
        let shopsArray = Array.from(this.shops.values());
        let allProductsMap= shopsArray.map(shop=> Array.from(shop.products.values()));
        let allProductsInMarket= this.extractProducts(allProductsMap);
        switch (searchBy) {
            case searchType.productName:
                let searchedByName= allProductsInMarket.filter(p=> p.name==searchInput);
                return new Result(true,searchedByName);
            case searchType.category:
                let searchedByCategory= allProductsInMarket.filter(p=> p.category==searchInput);
                return new Result(true,searchedByCategory);
            case searchType.keyword:
                if(typeof searchInput == "string"){
                    let searchByKeyWord= allProductsInMarket.filter(p=> p.description.includes(searchInput));
                    return new Result(true,searchByKeyWord);
                }
        }
    }

    private extractProducts(pTuples: [Product, number][][]): Product[]{
        return pTuples.map(pTuple=> pTuple[0][0]);
    }

    private sortProducts(sortBy: sortType, sortInput: productCategory| productRate| Range<number> | shopRate, toSort: Product[]): Result<Product[]>{
        switch(sortBy){
            case sortType.category:
                let sortByCategory= toSort.filter(p=> p.category== sortInput);
                return new Result(true, sortByCategory);
            case sortType.price:
                if(sortInput instanceof Range){
                    let sortByPrice= toSort.filter(p=> {let price= p.discountPrice;
                                         price>=sortInput.min && price<=sortInput.max})
                    return new Result(true, sortByPrice);
                }
            case sortType.productRate:
                let sortByProductRate= toSort.filter(p=> p.rate==sortInput);
                return new Result(true, sortByProductRate);
            case sortType.shopRate:
                let sortByShopRate= toSort.filter(p=> this.shops.get(p.shopId)?.shopRate == sortInput)
                return new Result(true, sortByShopRate);
        }
    }
} 