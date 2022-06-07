import PriorityQueue from "ts-priority-queue";
import { Product } from "../marketplace/Product";
import { Sale } from "../marketplace/Sale";
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
        // if(pTuple) {

        //}
            //let quantity = pTuple[1];

        //     this.totalPrice-= toRemove.discountPrice*quantity;
        //     // After removing the items check if there is discount to apply.
        //     if (toRemove.relatedSale) {
        //         var queue = this.productsOnSale.get(toRemove.relatedSale);
        //         if (queue) {
        //             var updatedQueue = new PriorityQueue({comparator: compProducts});
        //             while (queue.length != 0) {
        //                 var p = queue.dequeue();
        //                 if (p != toRemove)
        //                     updatedQueue.queue(p);
        //             }
        //             this.totalPrice -= toRemove.relatedSale.applyDiscount(updatedQueue);
        //         }
        //         throw new Error("Failed to remove product beacause the queue of the assoicated Sale was undifiend")
        //     }
        // }
        // return this.totalPrice;
    }

    updateProductQuantity(toUpdate: Product, quantity: number): number {
        if(!this.products.has(toUpdate.id))
            throw new Error("Failed to update product because the product wasn't found in bag.")
        //let pTuple= this.products.get(toUpdate.id);
        // if(pTuple) {
        //     let oldQuantity = pTuple[1];
        //     this.totalPrice= this.totalPrice-toUpdate.discountPrice*oldQuantity+toUpdate.fullPrice*quantity;
        //     // After removing the items check if there is discount to apply.
        //     if (toUpdate.relatedSale) {
        //         var queue = this.productsOnSale.get(toUpdate.relatedSale);
        //         if (queue) {
        //             var updatedQueue = new PriorityQueue({comparator: compProducts});
        //             while (queue.length != 0) {
        //                 var p = queue.dequeue();
        //                 if (p != toUpdate)
        //                     updatedQueue.queue(p);
        //             }
        //             this.totalPrice -= toUpdate.relatedSale.applyDiscount(updatedQueue);
        //         }
        //         throw new Error("Failed to update product because the queue of the associated Sale was undefined")
        //     }
        // }
        this.products.set(toUpdate.id, [toUpdate, quantity]);
        return this.totalPrice;
    }

    emptyBag(): void{
        this.products.clear;
        // this.totalPrice = 0;
    }

    isEmpty(): boolean {
        return this.products.size == 0;
    }
}