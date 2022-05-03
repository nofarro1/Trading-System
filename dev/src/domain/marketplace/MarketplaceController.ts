import {IMessageListener, IMessagePublisher} from "../notifications/IEventPublishers";
import {ShopPurchaseMessage, ShopStatusChangedMessage} from "../notifications/Message";
import {Shop} from "./Shop";
import {Result} from "../../utilities/Result";
import {Product} from "./Product";
import {Sale} from "./Sale";
import {ProductCategory, ProductRate, SearchType, ShopRate, ShopStatus, SortType} from "../../utilities/Enums";
import {logger} from "../../helpers/logger";

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

export class MarketplaceController implements IMessagePublisher<ShopStatusChangedMessage>, IMessageListener<ShopPurchaseMessage> {
    private shops: Map<number, Shop>;
    private shopCounter: number;
    private products: Map<number, Product>
    subscriber: IMessageListener<ShopStatusChangedMessage> | null;

    constructor(){
        this.shops= new Map<number,Shop>();
        this.shopCounter= 0;
        this.products= new Map<number, Product>();
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

    

    setUpShop(userId: string, shopName: string, purchaseAndDiscountPolicies?: string): Result<Shop| void>{
        let toAdd= new Shop(this.shopCounter, shopName, userId, purchaseAndDiscountPolicies);
        this.shops.set(toAdd.id, toAdd);
        logger.info(`The ${shopName} was opened in the market by ${userId}.`);
        return new Result(true, undefined);
    }

    closeShop(founder: string, shopId: number): Result<void>{
        let toClose= this.shops.get(shopId);
        if(toClose){
            toClose.status= ShopStatus.close;
            this.notify(new ShopStatusChangedMessage(false, toClose.shopOwners, toClose.name));
            logger.info(`The ${toClose.name} was closed in the market.`);
            return new Result(true, undefined);
        }
        logger.error(`${founder} tried to close his shop, but the shop with id:${shopId}  does not exist`);
        return new Result(false,undefined, "Failed to close shop because the shop isn't exist.");
    }
    
    reopenShop(founder: string, shopId: number): Result<void>{
        let toReopen= this.shops.get(shopId);
        if(toReopen){
            toReopen.status= ShopStatus.open;
            this.notify(new ShopStatusChangedMessage(true, toReopen.shopOwners, toReopen.name));
            logger.info(`The ${toReopen.name} was reopend in the market.`);
            return new Result(true, undefined);
        }
        logger.error(`${founder} tried to reopen his shop, but the shop with id:${shopId} does not exist.`);
        return new Result(false,undefined, "Failed to reopen shop because the shop does not exist.");
    }

    addProductToShop(shopId: number, productCategory: ProductCategory, productName: string, quantity: number, fullPrice: number, discountPrice: number, relatedSale?: Sale, productDesc?: string): Result<void> {
        let shop = this.shops.get(shopId);
        if (!shop) {
            logger.error(`Failed to add product to shop because the shop with id:${shopId} does not exit .`)
            return new Result(false, undefined, "Failed to add product to the shop because the shop isn't exist");
        }
        shop.addProduct(productName, shopId, productCategory, productDesc, fullPrice, discountPrice, relatedSale, quantity)
        logger.info(`${productName} was added to ${shop.name}.`);
        return new Result(true, undefined,undefined);
    }

    removeProductFromShop(shopId: number, productId: number): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop) {
            logger.error(`Failed to remove ${productId} from shop with id: ${shopId}, because the shop wasn't found.`)
            return new Result(false, undefined, "Failed to remove product from the shop because the shop wasn't found");
        }
        try{
            shop.removeProduct(productId)
            logger.info(`${productId} was removed from ${shop.name}.`)
            return new Result(true, undefined);
        }
        catch(error: any){
            logger.error(`In marketPlaceController-> removeProductFromShop(${shopId}, ${productId}): ${error.message}`);
            return new Result(false, undefined, error.message)
        }
    }

    updateProductQuantity(shopId: number, productId: number, quantity: number): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop) {
            logger.error(`Failed to update the quantity of ${productId}, because the shop with id: ${shopId} wasn't found.`)
            return new Result(false, undefined, "Failed to update product quantity because the shop wasn't found");
        }
        try{
            shop.updateProductQuantity(productId, quantity)
            logger.info(`The quantity of the product with Id: ${productId} was update in ${shop.name}.`)
            return new Result(true, undefined);
        }
        catch(error: any){
            logger.error(`In marketPlaceController-> updateProductQuantity(${shopId}, ${productId}, ${quantity}): ${error.message}.`)
            return new Result(false, undefined, error.message);
         }
    }

    appointShopOwner(ownerId: string, shopId: number): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop) {
            logger.error(`Failed to appoint ${ownerId} to shop with id: ${shopId}, because the shop does not exist.`)
            return new Result(false, undefined, "Failed to appoint owner because the shop wasn't found");
        }
        try{
            shop.appointShopOwner(ownerId);
            logger.info(`${ownerId} was appointed as a ${shop.name} shop owner.`)
            return new Result(true, undefined);
        }
        catch(error: any){
            logger.error(`In marketPlaceController-> appointShopOwner(${ownerId}, ${shopId}): ${error.any}`)
            return new Result(false, undefined, error.message);
        }
                 
    }

    appointShopManager(managerId: string, shopId: number): Result<void>{
        let shop= this.shops.get(shopId);
        if(!shop) {
            logger.error(`Failed to appoint ${managerId} to shop with id: ${shopId}, because the shop does not exist.`)
            return new Result(false, undefined, "Failed to appoint manager because the shop wasn't found");
        }
        try{
            shop.appointShopManager(managerId);
            logger.info(`${managerId} was appointed as a ${shop.name} shop manager.`)
            return new Result(true, undefined);
        }
        catch(error: any){
            logger.error(`In marketPlaceController-> appointShopManager(${managerId}, ${shopId}): ${error.any}`)
            return new Result(false, undefined, error.message);
        }
    }

    showShopProducts(shopId: number): Result<Map<number, [Product, number]> | undefined> {
        let shop = this.shops.get(shopId);
        if (shop) {
            let products = shop.products;
            if (products.size == 0) {
                logger.info(`The products of ${shop.name} was shown.`)
                return new Result(true, products, "No products to show");
            }
            logger.info(`The products of ${shop.name} was shown.`)
            return new Result(true, products, "No products to show");    
        }
        else
            logger.error(`In marketPlaceController-> showShopProducts(${shopId}).`)
            return new Result(false, undefined, "Failed to show the shop products because the shop wasn't found");
    }

    searchProduct(searchBy: SearchType, searchInput: String | ProductCategory): Result<Product[]>{
        let shopsArray = Array.from(this.shops.values());
        let allProductsMap= shopsArray.map(shop=> Array.from(shop.products.values()));
        let allProductsInMarket= this.extractProducts(allProductsMap);
        switch (searchBy) {
            case SearchType.productName:
                let searchedByName= allProductsInMarket.filter(p=> p.name==searchInput);
                logger.info(`Searching for products by name is done successfully.`)
                return new Result(true,searchedByName);
            case SearchType.category:
                let searchedByCategory= allProductsInMarket.filter(p=> p.category==searchInput);
                logger.info(`Searching for products by category is done successfully.`)
                return new Result(true,searchedByCategory);
            case SearchType.keyword:
                if(typeof searchInput == "string"){
                    let searchByKeyWord= allProductsInMarket.filter(p=> p.description.includes(searchInput));
                    logger.info(`Searching for products by key word is done successfully.`)
                    return new Result(true,searchByKeyWord);
                }
        }
        logger.error(`Searching by ${SearchType} is not possible option.`)
        return new Result(false, [], "Failed to search product");
    }

    private extractProducts(pTuples: [Product, number][][]): Product[]{
        return pTuples.map(pTuple=> pTuple[0][0]);
    }

    private sortProducts(sortBy: SortType, sortInput: ProductCategory| ProductRate| Range<number> | ShopRate, toSort: Product[]): Result<Product[]>{
        switch(sortBy){
            case SortType.category:
                let sortByCategory= toSort.filter(p=> p.category== sortInput);
                logger.info(`Sorting products by category is done successfully.`)
                return new Result(true, sortByCategory);
            case SortType.price:
                if(sortInput instanceof Range){
                    let sortByPrice= toSort.filter(p=> {let price= p.discountPrice;
                                         price>=sortInput.min && price<=sortInput.max})
                    logger.info(`Sorting products by price range is done successfully.`)
                    return new Result(true, sortByPrice);
                }
            case SortType.productRate:
                let sortByProductRate= toSort.filter(p=> p.rate==sortInput);
                logger.info(`Sorting products by product's rate is done successfully.`)
                return new Result(true, sortByProductRate);
            case SortType.shopRate:
                let sortByShopRate= toSort.filter(p=> this.shops.get(p.shopId)?.rate == sortInput)
                logger.info(`Sorting products by shop's rate is done successfully.`)
                return new Result(true, sortByShopRate);
        }
        logger.error(`Sorting by ${SortType} is not possible option.`)
        return new Result(false, [], "Failed to sort product");
    }

    getShopInfo(shopId: number): Result<Shop | undefined>{
        let shop = this.shops.get(shopId);
        if (shop){
            logger.info(`${shop.name}'s info was returned successfully.`);
            return new Result(true, shop);
        }
        logger.error(`Failed to return shop info because the shop with id: ${shopId} wasn't found.`);
        return new Result(false, undefined,"Failed to return shop info because the shop wasn't found.");
    }

    getProduct(productId: number): Result<Product | void>{
        let toReturn= this.products.get(productId);
        if(toReturn){
            logger.info(`Product with id: ${productId} was Returned successfully.`)
            return new Result(true,toReturn);
        }
        logger.error(`Product with id: ${productId} was not found.`)
        return new Result(false,undefined,`Product with id: ${productId} was not found.`);
    }
    visitPurchaseEvent(msg: ShopPurchaseMessage): void {
        logger.info(`"ShopPurchaseMessage" was received in marketPlaceController.`);
        let shopId = msg.purchase.shopId;
        let shop = this.shops.get(shopId);
        if (shop !== undefined) {
            msg.purchase.products.forEach(([product, quantity]) => {
                shop?.updateProductQuantity(product.id, quantity)
            });
        }
    }

    visitShopStatusChangedEvent(msg: ShopStatusChangedMessage): void {
        console.log("Not interested in that event");
    }
} 