import PriorityQueue from "ts-priority-queue"
import { Product } from "./Product"
import { Sale } from "./Sale"
import Comparator from "ts-priority-queue/src/PriorityQueue"
import { Result } from "../../utilities/Result";
import { ShoppingBag } from "./ShoppingBag";
import { exceptions } from "winston";


export class ShoppingCart {
    private bags: Map<number, ShoppingBag>;
    private totalPrice: number;
   

    constructor(){
        this.bags= new Map<number, ShoppingBag>();
        this.totalPrice=0;
}
//When adding a product to the shopping cart, 
//check if there is a discount to be included on the product.
//If there is, update the total price accordingly.


addProduct(toAdd:Product, quantity: number): void{
    let shopId= toAdd.shopId;
    let bag= this.bags.get(shopId);
    if(!bag){
        let bag= this.bags.get(shopId);
        if (bag){
            this.totalPrice-= bag.totalPrice; 
            this.totalPrice+= bag.addProduct(toAdd, quantity);
        }
    }
    let newBag= new ShoppingBag(shopId);
    newBag.addProduct(toAdd, quantity); 
    this.bags.set(shopId, newBag);
    }

removeProduct(toRemove: Product): void{
    let shopId= toRemove.shopId;
    let bag= this.bags.get(shopId)
    if(!bag)
        throw new Error("Failed to remove product because the nedded bag wasn't found");
    this.totalPrice= this.totalPrice - bag.totalPrice + bag.removeProduct(toRemove);
}    

emptyCart(): void{
    this.bags.clear;
    this.totalPrice=0;
}
}

 