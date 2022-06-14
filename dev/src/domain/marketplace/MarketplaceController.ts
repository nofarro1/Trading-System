import {IMessageListener, IMessagePublisher} from "../notifications/IEventPublishers";
import {ShopStatusChangedMessage} from "../notifications/Message";
import {Shop} from "./Shop";
import {Result} from "../../utilities/Result";
import {Product} from "./Product";
import {Sale} from "./Sale";
import {
    DiscountKinds,
    FilterType,
    ProductCategory,
    ProductRate,
    SearchType,
    ShopRate,
    ShopStatus,
} from "../../utilities/Enums";
import {Range} from "../../utilities/Range";
import {logger} from "../../helpers/logger";
import {injectable} from "inversify";
import {ImmediatePurchasePolicyComponent} from "./DiscountAndPurchasePolicies/Components/ImmediatePurchasePolicyComponent";
import {DiscountData} from "../../utilities/DataObjects";
import {DiscountComponent} from "./DiscountAndPurchasePolicies/Components/DiscountComponent";
import {
    ContainerDiscountComponent
} from "./DiscountAndPurchasePolicies/Containers/DiscountsContainers/ContainerDiscountComponent";
import {Offer} from "../user/Offer";

@injectable()
export class MarketplaceController implements IMessagePublisher<ShopStatusChangedMessage> {
    private _shops: Map<number, Shop>;
    private _shopCounter: number;
    private _products: Map<number, Product>;
    subscribers: IMessageListener<ShopStatusChangedMessage>[];

    constructor(){
        this._shops= new Map<number,Shop>();
        this._shopCounter= 0;
        this._products= new Map<number, Product>();
        this.subscribers= [];
    }


    get Shops(): Shop[] {
        return [...this._shops.values()];
    }

    get shops(): Map<number, Shop> {
        return this._shops;
    }

    set shops(value: Map<number, Shop>) {
        this._shops = value;
    }

    get products(): Map<number, Product> {
        return this._products;
    }

    set products(value: Map<number, Product>) {
        this._products = value;
    }


    get shopCounter(): number {
        return this._shopCounter;
    }

    setUpShop(userId: string, shopName: string): Result<Shop | void> {
        let toAdd = new Shop(this.shopCounter, shopName, userId);
        this._shopCounter++;
        this._shops.set(toAdd.id, toAdd);
        logger.info(`The ${shopName} was opened in the market by ${userId}.`);
        return new Result(true, toAdd);
    }

    closeShop(founder: string, shopId: number): Result<void> {
        let toClose = this._shops.get(shopId);
        if (toClose) {
            toClose.status = ShopStatus.close;
            // this.notify(new ShopStatusChangedMessage(false, toClose.shopOwners, toClose.name));
            logger.info(`The ${toClose.name} was closed in the market.`);
            return new Result(true, undefined);
        }
        logger.error(`${founder} tried to close his shop, but the shop with id:${shopId}  does not exist`);
        return new Result(false, undefined, "Failed to close shop because the shop isn't exist.");
    }

    reopenShop(founder: string, shopId: number): Result<void> {
        let toReopen = this._shops.get(shopId);
        if (toReopen) {
            toReopen.status = ShopStatus.open;
            // this.notify(new ShopStatusChangedMessage(true, toReopen.shopOwners, toReopen.name));
            logger.info(`The ${toReopen.name} was reopend in the market.`);
            return new Result(true, undefined);
        }
        logger.error(`${founder} tried to reopen his shop, but the shop with id:${shopId} does not exist.`);
        return new Result(false, undefined, "Failed to reopen shop because the shop does not exist.");
    }

    addProductToShop(shopId: number, productCategory: ProductCategory, productName: string, quantity: number, fullPrice: number, relatedSale?: Sale, productDesc?: string): Result<void | Product> {
        if (quantity < 0)
            return new Result<void>(false, undefined, "Cannot add negative amount of product to a shop ");
        let shop = this._shops.get(shopId);
        if (!shop) {
            logger.error(`Failed to add product to shop because the shop with id:${shopId} does not exit .`)
            return new Result(false, undefined, "Failed to add product to the shop because the shop isn't exist");
        }
        let product = shop.addProduct(productName, productCategory, fullPrice, quantity, productDesc);
        logger.info(`${productName} was added to ${shop.name}.`);
        return new Result(true, product, undefined);
    }

    removeProductFromShop(shopId: number, productId: number): Result<void> {
        let shop = this._shops.get(shopId);
        if (!shop) {
            logger.error(`Failed to remove ${productId} from shop with id: ${shopId}, because the shop wasn't found.`)
            return new Result(false, undefined, "Failed to remove product from the shop because the shop wasn't found");
        }
        try {
            shop.removeProduct(productId)
            logger.info(`${productId} was removed from ${shop.name}.`)
            return new Result(true, undefined);
        } catch (error: any) {
            logger.error(`In marketPlaceController-> removeProductFromShop(${shopId}, ${productId}): ${error.message}`);
            return new Result(false, undefined, error.message)
        }
    }

    updateProductQuantity(shopId: number, productId: number, quantity: number): Result<void> {
        let shop = this._shops.get(shopId);
        if (!shop) {
            logger.error(`Failed to update the quantity of ${productId}, because the shop with id: ${shopId} wasn't found.`)
            return new Result(false, undefined, "Failed to update product quantity because the shop wasn't found");
        }
        try {
            shop.updateProductQuantity(productId, quantity)
            logger.info(`The quantity of the product with Id: ${productId} was update in ${shop.name}.`)
            return new Result(true, undefined);
        } catch (error: any) {
            logger.error(`In marketPlaceController-> updateProductQuantity(${shopId}, ${productId}, ${quantity}): ${error.message}.`)
            return new Result(false, undefined, error.message);
        }
    }

    appointShopOwner(ownerId: string, shopId: number): Result<void> {
        let shop = this._shops.get(shopId);
        if (!shop) {
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

    removeShopOwner(shopId: number, ownerId: string){
        let shop= this._shops.get(shopId);
        if(!shop) {
            logger.error(`Failed to remove an owner with id: ${ownerId} from shop with id: ${shopId}, because the shop does not exist.`)
            return new Result(false, undefined, "Failed to remove owner because the shop wasn't found.");
        }
        else{
            shop.removeShopOwner(ownerId);
                shop.removeShopOwner(ownerId);
                logger.info(`${ownerId} is no longer a owner of ${shop.name} .`)
                return new Result(true, undefined);
        }
    }

    appointShopManager(managerId: string, shopId: number): Result<void> {
        let shop = this._shops.get(shopId);
        if (!shop) {
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

    removeShopManager(shopId: number, managerId: string): Result<void>{
        let shop= this._shops.get(shopId);
        if(!shop) {
            logger.error(`Failed to remove a manager with id: ${managerId} from shop with id: ${shopId}, because the shop does not exist.`)
            return new Result(false, undefined, "Failed to remove manager because the shop wasn't found.");
        }
        else{
            shop.removeShopOwner(managerId);
            logger.info(`${managerId} is no longer a manager in ${shop.name} .`)
            return new Result(true, undefined);
        }
    }

    showShopProducts(shopId: number): Result<Map<number, [Product, number]> | undefined> {
        let shop = this._shops.get(shopId);
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

    searchProduct(searchBy: SearchType, searchInput: string | ProductCategory): Result<Product[]>{
        let shopsArray: Shop[] = Array.from(this._shops.values());
        let allProductsInMarket: Product[] = [];
        for (let shop of shopsArray) {
            allProductsInMarket = allProductsInMarket.concat(this.extractProducts(shop.products));
        }
        switch (searchBy) {
            case SearchType.productName:
                let searchedByName=
                    allProductsInMarket.filter(
                        p=> p.name==searchInput);
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

    private extractProducts(shopProducts: Map<number, [Product, number]>): Product[]{
        let productsList = [];
        for(let tuple of shopProducts){ productsList.push(tuple[1][0])}
        return productsList;
    }

    public filterProducts(filterBy: FilterType, filterInput: ProductCategory| ProductRate| Range<number> | ShopRate, toFilter: Product[]): Result<Product[]>{
        switch(filterBy){
            case FilterType.category:
                let filterByCategory= toFilter.filter(p=> p.category== filterInput);
                logger.info(`Filtering products by category is done successfully.`)
                return new Result(true, filterByCategory);
            case FilterType.price:
                if(filterInput instanceof Range){
                    let filterByPrice= toFilter.filter(p=> {
                        let price= p.fullPrice;
                        return price>=filterInput.min && price<=filterInput.max}, )
                    logger.info(`Filtering products by price range is done successfully.`)
                    return new Result(true, filterByPrice);
                }
            case FilterType.productRate:
                let filterByProductRate= toFilter.filter(p=> p.rate==filterInput);
                logger.info(`Filtering products by product's rate is done successfully.`)
                return new Result(true, filterByProductRate);
            case FilterType.shopRate:
                let filterByShopRate= toFilter.filter(p=> this._shops.get(p.shopId)?.rate == filterInput)
                logger.info(`Filtering products by shop's rate is done successfully.`)
                return new Result(true, filterByShopRate);
        }
        logger.error(`Filtering by ${FilterType} is not possible option.`)
        return new Result(false, [], "Failed to filter product");
    }

    getShopInfo(shopId: number): Result<Shop | undefined>{
        let shop = this._shops.get(shopId);
        if (shop){
            logger.info(`${shop.name}'s info was returned successfully.`);
            return new Result(true, shop);
        }
        logger.error(`Failed to return shop info because the shop with id: ${shopId} wasn't found.`);
        return new Result(false, undefined,"Failed to return shop info because the shop wasn't found.");
    }

    getProduct(productId: number): Result<Product | void>{
        let toReturn= this._products.get(productId);
        if(toReturn){
            logger.info(`Product with id: ${productId} was Returned successfully.`)
            return new Result(true,toReturn);
        }
        logger.error(`Product with id: ${productId} was not found.`)
        return new Result(false,undefined,`Product with id: ${productId} was not found.`);
    }

    addDiscount(shopId: number, discount: DiscountData): Result<number | void>{
        let shop = this._shops.get(shopId);
        if(shop){
            let discId: number =  shop.addDiscount(discount);
            logger.info(`Discount with id: ${discId} was added to Shop with id: ${shopId} successfully.`)
            return new Result(true, discId);
        }
        else{
            return new Result(false, undefined, `Shop with id: ${shopId} was not found in market`);
        }
    }


    removeDiscount(shopId: number, idDisc: number): Result<void>{
        let shop = this._shops.get(shopId);
        if(shop){
            let discId =  shop.removeDiscount(idDisc)
            logger.info(`Discount with id: ${discId} was removed from Shop with id: ${shopId} successfully.`)
            return new Result(true, discId);
        }
        else{
            return new Result(false, undefined, `Shop with id: ${shopId} was not found in market`);
        }
    }

    addSubDiscount(shopId: number, discId: number, toAdd: DiscountData): Result<void>{
        let shop = this._shops.get(shopId);
        if(shop){
            shop.addSubDiscount(discId, toAdd);
            //Todo fix logs and result
            logger.info(`Discount with id: ${discId} was removed from Shop with id: ${shopId} successfully.`)
            return new Result(true, undefined);
        }
        else{
            return new Result(false, undefined, `Shop with id: ${shopId} was not found in market`);
        }
    }

    getDiscount(shopId: number, id2return: number){
        let shop = this._shops.get(shopId);
        if(shop){
            let disc =  shop.getDiscount(id2return);
            if(disc){
                logger.info(`Discount with id: ${id2return} was returned from Shop with id: ${shopId} successfully.`)
                return new Result(true, disc);
            }
            else{
                logger.info(`Failed to return discount with id: ${id2return} from Shop with id: ${shopId}.`)
                return new Result(false, undefined, `Discount with id: ${id2return} was not found in Shop with id: ${shopId}.`);
            }
        }
        else{
            return new Result(false, undefined, `Shop with id: ${shopId} was not found in market`);
        }
    }

    addPurchasePolicy(shopId: number, puPolicy: ImmediatePurchaseData): Result<number | void>{
        let shop = this._shops.get(shopId);
        if(shop){
            let purchasePolicyId =  shop.addPurchasePolicy(puPolicy);
            logger.info(`Purchase policy with id: ${purchasePolicyId} was added to Shop with id: ${shopId} successfully.`)
            return new Result(true, purchasePolicyId);
        }
        else{
            return new Result(false, undefined, `Shop with id: ${shopId} was not found in market`);
        }
    }

    removePurchasePolicy(shopId: number, idPuPolicy: number): Result<void>{
        let shop = this._shops.get(shopId);
        if(shop){
            let puPurchaseId =  shop.removeDiscount(idPuPolicy)
            logger.info(`Purchase policy with id: ${puPurchaseId} was removed from Shop with id: ${shopId} successfully.`)
            return new Result(true, puPurchaseId);
        }
        else{
            return new Result(false, undefined, `Shop with id: ${shopId} was not found in market`);
        }
    }

    getPurchase(shopId: number, id2return: number){
        let shop = this._shops.get(shopId);
        if(shop){
            let policy =  shop.getPurchasePolicy(id2return);
            if(policy){
                logger.info(`Purchase policy with id: ${id2return} was returned from Shop with id: ${shopId} successfully.`)
                return new Result(true, policy);
            }
            else{
                logger.info(`Failed to return Purchase policy with id: ${id2return} from Shop with id: ${shopId}.`)
                return new Result(false, undefined, `Purchase policy with id: ${id2return} was not found in Shop with id: ${shopId}.`);
            }
        }
        else{
            return new Result(false, undefined, `Shop with id: ${shopId} was not found in market`);
        }
    }

    addOffer2Product(shopId: number, userId: string, pId: number, offeredPrice: number ): Result<Offer | void>{
        let shop = this._shops.get(shopId);
        if(shop){
            let offer = shop.addOfferPrice2Product(userId, pId, offeredPrice);
            logger.info(`User with id: ${userId} submitted an price offer on product with id: ${pId}.`)
            return new Result(true, offer);
        }
        logger.error(`Couldn't submit offer to shop with id: ${shopId} because the shop not found in market`);
        return new Result (false, undefined, `Couldn't submit offer to shop with id: ${shopId} because the shop not found in market`)
    }

    getOffer(shopId: number, offerId: number): Result< Offer | void> {
        let shop = this._shops.get(shopId);
        if(shop){
            let offer = shop.getOffer(offerId);
            if(offer){
                logger.info(`Offer with id: ${offerId} was return successfully from shop with id: ${shopId}.`);
                return new Result(true, offer);
            }
            else {
                logger.error(`Offer with id: ${offerId} was not found in shop with id: ${shopId}.`);
                return new Result(false, undefined, `Offer with id: ${offerId} was not found in shop with id: ${shopId}.`);
            }
        }
        logger.error(`Couldn't returned offer to shop with id: ${shopId} because the shop not found in market`);
        return new Result (false, undefined, `Couldn't returned offer to shop with id: ${shopId} because the shop not found in market`)
    }

    approveOffer(shopId: number, offerId: number, ownerId: string, answer: boolean): Result<void>{
        let shop = this._shops.get(shopId);
        if(shop){
                try{
                    let res = shop.answerOffer(offerId, ownerId, answer);
                    if(res){
                        logger.info(`User with id: ${ownerId} was answer successfully on Offer with id: ${offerId} in shop with id: ${shopId}.`);
                        return new Result(true, undefined);
                    }
                    else{
                        logger.info( `Offer with id: ${offerId} was not answered because it was not found in shop with id: ${shopId}.`);
                        return new Result(true, undefined);
                    }
                }
                catch(error: any){
                    return new Result(false, undefined, error.message);
                }
        }
        logger.error(`Couldn't approve offer to shop with id: ${shopId} because the shop not found in market`);
        return new Result (false, undefined, `Couldn't returned offer to shop with id: ${shopId} because the shop not found in market`)
    }


    // visitPurchaseEvent(msg: ShopPurchaseMessage): void {
    //     // logger.info(`"ShopPurchaseMessage" was received in marketPlaceController.`);
    //     // let shopId = msg.purchase.shopId;
    //     // let shop = this._shops.get(shopId);
    //     // if (shop !== undefined) {
    //     //     msg.purchase.products.forEach(([product, quantity]) => {
    //     //         shop?.updateProductQuantity(product.id, quantity)
    //     //     });
    //     // }
    // }
    //
    // visitShopStatusChangedEvent(msg: ShopStatusChangedMessage): void {
    //     console.log("Not interested in that event");
    // }

    //status changed event;
    subscribe(sub: IMessageListener<ShopStatusChangedMessage>) {
        if (!this.subscribers.includes(sub)) {
            this.subscribers.push(sub)
            logger.debug(`subscriber ${sub.constructor.name} sunsctibe to ${this.constructor.name}`)
        } else {
            logger.warn(`subscriber ${sub.constructor.name} already subscribed to ${this.constructor.name}`)
        }
    }

    unsubscribe(sub: IMessageListener<ShopStatusChangedMessage>) {
        if (this.subscribers.includes(sub)) {
            const inx = this.subscribers.findIndex((o) => o === sub)
            this.subscribers.splice(inx, inx + 1)
            logger.debug(`subscriber ${sub.constructor.name} unsubscribed to ${this.constructor.name}`)
        } else {
            logger.warn(`subscriber ${sub.constructor.name} already subscribed to ${this.constructor.name}`)
        }
    }

    notifySubscribers(message: ShopStatusChangedMessage) {
        if (this.subscribers !== null)
            for (let sub of this.subscribers) {
                this.accept(sub, message);
            } else
            throw new Error("No one to get the message");

    }

    accept(v: IMessageListener<ShopStatusChangedMessage>, msg: ShopStatusChangedMessage) {
        v.visitShopStatusChangedEvent(msg);
    }

    getDiscounts(shopId: number) {
        return [];
    }

    getPolicies(shopId: number) {
        return null
    }
}