import {Product} from "./Product";
import {Sale} from "./Sale";
import {ProductCategory, ShopRate, ShopStatus} from "../../utilities/Enums";
import {ShoppingBag} from "./ShoppingBag";
import {DiscountComponent} from "./CompositePattern/Components/DiscountComponent";
import {User} from "../user/User";
import {ImmediatePurchasePolicyComponent} from "./CompositePattern/Components/ImmediatePurchasePolicyComponent";


export class Shop {
    private _id: number;
    private _name: string;
    private _status: ShopStatus;
    private _shopFounder: string;
    private _shopOwners: Set<string>;
    private _shopManagers: Set<string>;
    private _products: Map<number, [Product, number]>;
    private _rate: ShopRate;
    private _discounts: Map<number, DiscountComponent>;
    private _discountCounter: number;
    private _purchasePolicies: Map <number, ImmediatePurchasePolicyComponent>;
    private _purchaseCounter: number;

    constructor(id: number, name: string, shopFounder: string){
        this._id= id;
        this._name= name;
        this._status= ShopStatus.open;
        this._shopFounder= shopFounder;
        this._shopOwners= new Set<string>([shopFounder]);
        this._shopManagers= new Set<string>();
        this._products= new Map<number, [Product, number]>();
        this._rate= ShopRate.NotRated;
        this._discounts= new Map<number, DiscountComponent>();
        this._discountCounter= 0;
        this._purchasePolicies = new Map <number, ImmediatePurchasePolicyComponent>();
        this._purchaseCounter = 0;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get status(): ShopStatus {
        return this._status;
    }

    set status(value: ShopStatus) {
        this._status = value;
    }

    get shopFounder(): string {
        return this._shopFounder;
    }

    set shopFounder(value: string) {
        this._shopFounder = value;
    }

    get shopOwners(): Set<string> {
        return this._shopOwners;
    }

    set shopOwners(value: Set<string>) {
        this._shopOwners = value;
    }

    get shopManagers(): Set<string> {
        return this._shopManagers;
    }

    set shopManagers(value: Set<string>) {
        this._shopManagers = value;
    }

    get products(): Map<number, [Product, number]> {
        return this._products;
    }

    set products(value: Map<number, [Product, number]>) {
        this._products = value;
    }

    get rate(): ShopRate {
        return this._rate;
    }

    set rate(value: ShopRate) {
        this._rate = value;
    }

    addProduct(productName: string, shopId: number, category: ProductCategory, fullPrice: number,quantity: number, relatedSale?: Sale, productDesc?: string ): Product{
        let toAdd= new Product(productName, shopId, category, fullPrice, relatedSale, productDesc);
        if(!this.products.has(toAdd.id)){
            this.products.set(toAdd.id, [toAdd, quantity]);
            return toAdd;
        }
        return toAdd;
    }

    getProductQuantity(productId: number): number{
        let product= this.products.get(productId);
        if(!product)
            throw new Error ("Failed to return product quantity in shop because the product map of the shop is undefined");
        return product[1];
    }

    //Delete a product from the store catalog
    removeProduct(productId: number): void{
        if(!this.products.delete(productId))
            throw new Error(`Failed to remove product, because product id: ${productId} was not found`);
    }

    updateProductQuantity(productId: number, quantity: number): void{
        let product = this.products.get(productId);
        if(!product)
            throw new Error("Failed to update product quantity in shop because the product isn't exist in shop")
        if(quantity < 0)
            quantity= 0;
        this.products.set(productId, [product[0],quantity]);
    }

    getProduct(productId: number): Product{
        if(!this.products)
            throw new Error("Failed to search product in shop because the product map of the shop is undefined");
        let toReturnPair= this.products.get(productId);
        if(toReturnPair)
            return toReturnPair[0];
        throw new Error(`Product with id: ${productId} was not found.`);
    }

    appointShopOwner(ownerId: string): void{
        if(this.shopOwners?.has(ownerId))
            throw new Error("Failed to appoint owner because the member is already a owner of the shop")
        this.shopOwners?.add(ownerId);
    }

    appointShopManager(managerId: string): void{
        if(this.shopManagers?.has(managerId))
            throw new Error("Failed to appoint owner because the member is already a owner of the shop")
        this.shopManagers?.add(managerId);
    }

    calculateBagPrice(bag: ShoppingBag): [Product, number, number][]{

        let productsList = this.extractProducts(bag.products);
        let productsInfo: [Product, number, number][] = [];
        for(let [p, quantity] of bag.products.values()){
            productsInfo.push([p, p.fullPrice, quantity]);
        }
        if(this._discounts.size>0){
            for( let disc of this._discounts.values()){
                productsInfo = disc.calculateProductsPrice(productsInfo);
            }
        }

        return productsInfo;
    }

    canMakePurchase(bag: ShoppingBag, user: User){

    }

    private extractProducts(shopProducts: Map<number, [Product, number]>): Product[]{
        let productsList = [];
        for(let tuple of shopProducts){ productsList.push(tuple[1][0])}
        return productsList;
    }

    addDiscount(disc: DiscountComponent): number{
        this._discounts.set(this._discountCounter,disc);
        this._discountCounter++;
        return this._discountCounter-1;
    }

    removeDiscount(idDisc: number): void{
        this._discounts.delete(idDisc);
    }

    addPurchasePolicy(puPolicy: ImmediatePurchasePolicyComponent): number{
        this._purchasePolicies.set(this._purchaseCounter,puPolicy);
        this._purchaseCounter++;
        return this._purchaseCounter--;
    }

    removePurchasePolicy(idPuPolicy: number){
        this._purchasePolicies.delete(idPuPolicy);
    }

    // checkDiscountPolicies (bag: ShoppingBag): boolean{
    //     return true;
    // }
    //
    // checkPurchasePolicies (bag: ShoppingBag): boolean {
    //     return true;
    // }

}