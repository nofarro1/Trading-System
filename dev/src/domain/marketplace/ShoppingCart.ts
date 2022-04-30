import PriorityQueue from "ts-priority-queue"
import { Product } from "./Product"
import { Sale } from "./Sale"
import Comparator from "ts-priority-queue/src/PriorityQueue"
import { Result } from "../../utilities/Result";
import { ShoppingBag } from "./ShoppingBag";


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
    if(this.bags.has(shopId)){
        let bag= this.bags.get(shopId);
        this.totalPrice-= bag.totalPrice; 
        this.totalPrice+= bag.addProduct(toAdd, quantity);
    }
    this.bags.set(shopId, new ShoppingBag(shopId));
    this.bags.get(shopId).addProduct(toAdd, quantity);
    }

removeProduct(toRemove: Product): boolean{
    let shopId= toRemove.shopId;
    if(!this.bags.has(shopId))
        return false;
    this.totalPrice-= this.bags.get(shopId).totalPrice;
    let updateBagPrice= this.bags.get(shopId).removeProduct(toRemove);
    if(updateBagPrice == -1){
        return false;
    }
    this.totalPrice+= updateBagPrice;
    return true;
}    

emptyCart(): void{
    this.bags.clear;
    this.totalPrice=0;
}
}

 