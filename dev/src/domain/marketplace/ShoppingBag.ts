import PriorityQueue from "ts-priority-queue";
import { Product } from "./Product";
import { Sale } from "./Sale";
const compProducts = (p1: Product, p2: Product)=>  p1.fullPrice - p2.fullPrice;

export class ShoppingBag {
    private _shopId: number;
    private _products: Map<number, [Product, number]>;
    private _productsOnSale: Map<Sale, PriorityQueue<Product>>;
    private _totalPrice: number;

    constructor(shopId: number){
        this._shopId= shopId;
        this._products= new Map<number, [Product, number]>();
        this._productsOnSale= new Map<Sale, PriorityQueue<Product>>();
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

    public get productsOnSale(): Map<Sale, PriorityQueue<Product>> {
        return this._productsOnSale;
    }
    public set productsOnSale(value: Map<Sale, PriorityQueue<Product>>) {
        this._productsOnSale = value;
    }

    public get totalPrice(): number {
        return this._totalPrice;
    }
    public set totalPrice(value: number) {
        this._totalPrice = value;
    }

    addProduct(toAdd:Product, quantity: number): number{
        let productPair= this.products.get(toAdd.id);
        if(productPair){
            let updateQuantity = productPair[1]+quantity;
            this.products.set(toAdd.id, [toAdd, updateQuantity]);
        }
        else
            this.products.set(toAdd.id, [toAdd, quantity]);
        if(toAdd.relatedSale){// if the product is on sale
            if(this.productsOnSale.has(toAdd.relatedSale)){
                var queue= this.productsOnSale.get(toAdd.relatedSale);
                if(queue){
                    queue.queue(toAdd); //check if the queue in the sales is update or need to be put again
                    this.totalPrice+= toAdd.fullPrice;
                    this.totalPrice-= toAdd.relatedSale.applyDiscount(queue);
                }
                throw new Error("Failed to add product beacause the queue of the assoicated Sale was undifiend")
            }
            else{  
                queue= new PriorityQueue({comparator: compProducts});
                queue.queue(toAdd);
                this.totalPrice= toAdd.relatedSale.applyDiscount(queue);
                this.productsOnSale.set(toAdd.relatedSale, queue);
            }
        }
        this.totalPrice+= toAdd.fullPrice;
        return this.totalPrice;
        }
    
    removeProduct(toRemove: Product, quantity: number):number {
        if(!this.products.has(toRemove.id))
            throw new Error("Failed to remove product because the product wasn't found in bag.")
        this.totalPrice-= toRemove.discountPrice;
        if(toRemove.relatedSale){
            var queue= this.productsOnSale.get(toRemove.relatedSale);
            if(queue){
                var updatedQueue= new PriorityQueue({comparator: compProducts});
                while(queue.length!=0){
                    var p=queue.dequeue();
                    if(p!=toRemove)
                        updatedQueue.queue(p);
                }
                this.totalPrice-= toRemove.relatedSale.applyDiscount(updatedQueue)*quantity;
            }
            throw new Error("Failed to remove product beacause the queue of the assoicated Sale was undifiend")  
        }
        return this.totalPrice;
    }

    emptyBag(): void{
        this.products.clear;
        this.productsOnSale.clear;
        this.totalPrice= 0;
    }
}