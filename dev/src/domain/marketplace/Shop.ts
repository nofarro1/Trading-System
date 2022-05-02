import { Result } from "../../utilities/Result";
import { Product, ProductCategory } from "./Product";
import { Sale } from "./Sale";



let productsCounter= 0;
export class Shop {
    private _id: number;
    private _name: string;
    private _isActive: boolean;
    private _shopFounder: string;
    private _shopOwners: Set<string>;
    private _shopManagers: Set<string>;
    private _products: Map<number, [Product, number]>;
    private _shopAndDiscountPolicy: string;

    constructor(id: number, name: string, shopFounder: string,shopAndDiscountPolicy: string, shopManagers?: Set<string>, shopOwners?: Set<string>){
        this._id= id;
        this._name= name;
        this._isActive= true;
        this._shopFounder= shopFounder;
        this._shopOwners = new Set<string>(shopOwners);
        this._shopOwners.add(this._shopFounder)
        this._shopManagers=  new Set<string>(shopManagers);
        this._products= new Map<number, [Product, number]>();
        this._shopAndDiscountPolicy= shopAndDiscountPolicy
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
    }
    public get shopFounder(): string {
        return this._shopFounder;
    }
    public set shopFounder(value: string) {
        this._shopFounder = value;
    }

    public get shopOwners(): Set<string> {
        return this._shopOwners;
    }
    public set shopOwners(value: Set<string>) {
        this._shopOwners = value;
    }

    public get shopManagers(): Set<string> {
        return this._shopManagers;
    }
    public set shopManagers(value: Set<string>) {
        this._shopManagers = value;
    }

    public get products(): Map<number, [Product, number]> {
        return this._products;
    }
    public set products(value: Map<number, [Product, number]>) {
        this._products = value;
    }

    public get shopAndDiscountPolicy(): string {
        return this._shopAndDiscountPolicy;
    }
    public set shopAndDiscountPolicy(value: string) {
        this._shopAndDiscountPolicy = value;
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

    addProduct(productName: string, shopId: number, category: ProductCategory, productDesc: string, fullPrice: number, discountPrice: number, relatedSale: Sale, quantity: number): void{
        let toAdd= new Product(productsCounter, productName, shopId, category, productDesc, discountPrice, fullPrice, relatedSale);
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
        if(this.shopOwners?.has(ownerId) || this.shopManagers?.has(ownerId))
            throw new Error("Failed to appoint owner because the memmber is already a owner of the shop")
        this.shopOwners?.add(ownerId);
    }

    appointShopManager(managerId: string): void{
        if(this.shopManagers?.has(managerId) || this.shopOwners?.has(managerId))
            throw new Error("Failed to appoint owner because the memmber is already a owner of the shop")
        this.shopManagers?.add(managerId);
    }
    
}