import PriorityQueue from "ts-priority-queue";
import { Product } from "./Product";
import { Sale } from "./Sale";
import { Shop } from "./Shop"
const compProducts = (p1: Product, p2: Product)=>  p1.fullPrice - p2.fullPrice;

export class ShoppingBag {
    private _shopId: number;
    private _products: Map<number, [Product, number]>;
    private _productsOnSale: Map<Sale, PriorityQueue<Product>>;
    private _totalPrice: number;

    constructor(shopId: number){
        this.shopId= shopId;
        this.products= new Map<number, [Product, number]>();
        this.productsOnSale= new Map<Sale, PriorityQueue<Product>>();
        this.totalPrice= 0;
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
        if(this.products.has(toAdd.id)){
            let updateQuantity = this.products.get(toAdd.id)[1]+quantity;
            this.products.set(toAdd.id, [toAdd, updateQuantity]);
        }
        else
            this.products.set(toAdd.id, [toAdd, quantity]);
        if(toAdd.relatedSale!= null){
            if(this.productsOnSale.has(toAdd.relatedSale)){
                var queue= this.productsOnSale.get(toAdd.relatedSale);
                queue.queue(toAdd); //check if the queue in the sales is update or need to be put again
                this.totalPrice+= toAdd.fullPrice;
                this.totalPrice-= toAdd.relatedSale.applyDiscount(queue);
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
    
    removeProduct(toRemove: Product):number {
        if(!this.products.has(toRemove.id))
            return -1;
        this.totalPrice-= toRemove.discountPrice;
        if(toRemove.relatedSale!=null){
            var queue= this.productsOnSale.get(toRemove.relatedSale);
            var updatedQueue= new PriorityQueue({comparator: compProducts});
            while(queue.length!=0){
                var p=queue.dequeue();
                if(p!=toRemove)
                    updatedQueue.queue(p);
            }
            this.totalPrice-= toRemove.relatedSale.applyDiscount(updatedQueue);
        }
        return this.totalPrice;
    }

    emptyBag(): void{
        this.products.clear;
        this.productsOnSale.clear;
        this.totalPrice= 0;
    }
}