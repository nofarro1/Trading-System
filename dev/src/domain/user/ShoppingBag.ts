import { Product } from "../marketplace/Product";

const compProducts = (p1: Product, p2: Product)=>  p1.fullPrice - p2.fullPrice;

export class ShoppingBag {
    private _shopId: number;
    private _products: Map<number, [Product, number]>; //ProductID -> [Product, Quantity]
    private _totalPrice: number;

    constructor(shopId: number){
        this._shopId= shopId;
        this._products= new Map<number, [Product, number]>();
        this._totalPrice= 0;
    }

    public get shopId(): number {
        return this._shopId;
    }
    public set shopId(value: number) {
        this._shopId = value;
    }

    public get products(): Map<number, [Product, number]> {
        return this._products;
    }
    public set products(value: Map<number, [Product, number]>) {
        this._products = value;
    }

    public get totalPrice(): number {
        return this._totalPrice;
    }
    public set totalPrice(value: number) {
        this._totalPrice = value;
    }

    addProduct(toAdd:Product, quantity: number): void {
        let productPair = this.products.get(toAdd.id);
        if (productPair) {
            let updateQuantity = productPair[1] + quantity;
            this.products.set(toAdd.id, [toAdd, updateQuantity]);
        }
        else
            this.products.set(toAdd.id, [toAdd, quantity]);
        }
    
    removeProduct(toRemove: Product):void {
        if(!this.products.has(toRemove.id))
            throw new Error("Failed to remove product because the product wasn't found in bag.")
        let pTuple= this.products.get(toRemove.id);
        this.products.delete(toRemove.id);
    }

    updateProductQuantity(toUpdate: Product, quantity: number): void {
        if(!this.products.has(toUpdate.id))
            throw new Error("Failed to update product because the product wasn't found in bag.")
        this.products.set(toUpdate.id, [toUpdate, quantity]);
    }

    emptyBag(): void{
        this.products.clear;
        // this.totalPrice = 0;
    }

    isEmpty(): boolean {
        return this.products.size == 0;
    }
}