import {Product} from "./Product";
import {Sale} from "./Sale";
import {productCategory, shopRate, shopStatus} from "../../utilities/Enums";


export class Shop {
    private _id: number;
    private _name: string;
    private _status: shopStatus;
    private _shopFounder: string;
    private _shopOwners: Set<string>;
    private _shopManagers: Set<string>;
    private _products: Map<number, [Product, number]>;
    private _shopAndDiscountPolicy?: string;
    private _rate: shopRate;


    constructor(id: number, name: string, shopFounder: string,shopAndDiscountPolicy?: string){
        this._id= id;
        this._name= name;
        this._status= shopStatus.open;
        this._shopFounder= shopFounder;
        this._shopOwners= new Set<string>([shopFounder]);
        this._shopManagers= new Set<string>();
        this._products= new Map<number, [Product, number]>();
        this._shopAndDiscountPolicy= shopAndDiscountPolicy
        this._rate= shopRate.NotRated
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

    get status(): shopStatus {
        return this._status;
    }

    set status(value: shopStatus) {
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

    get shopAndDiscountPolicy(): string | undefined {
        return this._shopAndDiscountPolicy;
    }

    set shopAndDiscountPolicy(value: string | undefined) {
        this._shopAndDiscountPolicy = value;
    }

    get rate(): shopRate {
        return this._rate;
    }

    set rate(value: shopRate) {
        this._rate = value;
    }

    searchProduct(productId: number): Product | boolean{
        if(!this.products)
            throw new Error("Failed to search product in shop because the product map of the shop is undefined");
        let toReturnPair= this.products.get(productId);
        if(toReturnPair)
            return toReturnPair[0];
        else 
            return false;

        
    }

    getProductQuantity(productId: number): number{
        let product= this.products.get(productId);
        if(!product)
            throw new Error ("Failed to return product quantity in shop because the product map of the shop is undefined");
        return product[1];
    }

    addProduct(productName: string, shopId: number, category: productCategory, productDesc: string, fullPrice: number, discountPrice: number, relatedSale: Sale, quantity: number): void{
        let toAdd= new Product(productName, shopId, category, productDesc, discountPrice, fullPrice, relatedSale);
        this.products.set(toAdd.id, [toAdd, quantity]);
    }

    //Delete a product from the store catalog
    removeProduct(productId: number): void{
        this.products.delete(productId);
    }

    updateProductQuantity(productId: number, quantity: number): void{
        let product = this.products.get(productId);
        if(!product)
            throw new Error("Failed to update product quantity in shop because the product isn't exist in shop")
        let newQuantity = product[1]-quantity;
        if(newQuantity < 0)
            newQuantity= 0;
        this.products.set(productId, [product[0],newQuantity]); 
    }

    appointShopOwner(ownerId: string): void{
        if(this.shopOwners?.has(ownerId))
            throw new Error("Failed to appoint owner because the memmber is already a owner of the shop")
        this.shopOwners?.add(ownerId);
    }

    appointShopManager(managerId: string): void{
        if(this.shopOwners?.has(managerId))
            throw new Error("Failed to appoint owner because the memmber is already a owner of the shop")
        this.shopOwners?.add(managerId);
    }
    
}