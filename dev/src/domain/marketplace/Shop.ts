import { Result } from "../../utilities/Result";
import { Member } from "../user package/Member";
import { Product, productCategory } from "./Product";
import { Sale } from "./Sale";
let productsCounter= 0;

export class Shop {
    private _id: number; 
    private _name: String;
    private _isActive: boolean;
    private _shopFounder: number;
    private _shopOwners: Set<number> | undefined;
    private _shopManagers: Set<number> | undefined;
    private _products: Map<number, [Product, number]>;
    private _shopAndDiscountPolicy: String;

    constructor(id: number, name: String, shopFounder: number,shopAndDiscountPolicy: String, shopManagers?: Set<number>, shopOwners?: Set<number>){
        this._id= id;
        this._name= name;
        this._isActive= true;
        this._shopFounder= shopFounder;
        this._shopManagers= shopManagers;  
        this._products= new Map<number, [Product, number]>();
        this._shopAndDiscountPolicy= shopAndDiscountPolicy
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get name(): String {
        return this._name;
    }
    public set name(value: String) {
        this._name = value;
    }
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
    }
    public get shopFounder(): number {
        return this._shopFounder;
    }
    public set shopFounder(value: number) {
        this._shopFounder = value;
    }

    public get shopOwners(): Set<number> | undefined {
        return this._shopOwners;
    }
    public set shopOwners(value: Set<number> | undefined) {
        this._shopOwners = value;
    }

    public get shopManagers(): Set<number> | undefined {
        return this._shopManagers;
    }
    public set shopManagers(value: Set<number> | undefined) {
        this._shopManagers = value;
    }

    public get products(): Map<number, [Product, number]> {
        return this._products;
    }
    public set products(value: Map<number, [Product, number]>) {
        this._products = value;
    }

    public get shopAndDiscountPolicy(): String {
        return this._shopAndDiscountPolicy;
    }
    public set shopAndDiscountPolicy(value: String) {
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

    addProduct(productName: string, shopId: number, category: productCategory, productDesc: string, fullPrice: number, discountPrice: number, relatedSale: Sale, quantity: number): void{
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

    appointShopOwner(ownerId: number): void{
        if(this.shopOwners?.has(ownerId))
            throw new Error("Failed to appoint owner because the memmber is already a owner of the shop")
        this.shopOwners?.add(ownerId);
    }

    appointShopManager(managerId: number): void{
        if(this.shopOwners?.has(managerId))
            throw new Error("Failed to appoint owner because the memmber is already a owner of the shop")
        this.shopOwners?.add(managerId);
    }
    
}