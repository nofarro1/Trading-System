import { Result } from "../../utilities/Result";
import { Member } from "../user/Member";
import { Product } from "./Product";
import { Sale } from "./Sale";
let productsCounter= 0;

export class Shop {
    private _id: number; 
    private _isActive: boolean;
    private _shopFounder: Member;
    private _shopOwners: Set<Member>;
    private _shopManagers: Set<Member>;
    private _products: Map<number, [Product, number]>;
    private _shopAndDiscountPolicy: String;

    constructor(id: number, shopFounder: Member,shopAndDiscountPolicy: String, shopManager?: Set<Member>, shopOwners?: Set<Member>, products?: Map<number, [Product,number]>){
        this.id= id;
        this.shopFounder= Member;
        this.shopManagers= shopManager;  
        this.products= products;
        this.shopAndDiscountPolicy= shopAndDiscountPolicy
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
    }
    public get shopFounder(): Member {
        return this._shopFounder;
    }
    public set shopFounder(value: Member) {
        this._shopFounder = value;
    }

    public get shopOwners(): Set<Member> {
        return this._shopOwners;
    }
    public set shopOwners(value: Set<Member>) {
        this._shopOwners = value;
    }

    public get shopManagers(): Set<Member> {
        return this._shopManagers;
    }
    public set shopManagers(value: Set<Member>) {
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
    
    searchProduct(productId: number): Product{
        return this.products.has(productId)[0];
    }

    getProductQuantity(productId: number): number{
        return this.products.has(productId)[1];
    }

    addProduct(productName: string, shopId: number, productDesc: string, fullPrice: number, discountPrice: number, relatedSale: Sale, quantity: number): void{
        let toAdd= new Product(productsCounter, productName, shopId, productDesc, fullPrice, discountPrice, relatedSale);
        this.products.set(toAdd.id, [toAdd, quantity]);
    }

    //Delete a product from the store catalog
    removeProduct(productId: number): boolean{
        if (this.products.has(productId)){
            this.products.delete(productId);
           return true;
        }
        else
          return false;
    }

    updateProductQuantity(productId: number, quantity: number): boolean{
        if (this.products.has(productId)){
            let product = this.products.get(productId);
            let newQuantity = product[1]-quantity;
            if(newQuantity < 0)
               return false;
            this.products.set(productId, [product[0],newQuantity]);
            return true;
        }
        else 
            return true;    
    }
    
}