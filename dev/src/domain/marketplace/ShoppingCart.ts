//import PriorityQueue from "ts-priority-queue"
import { Product } from "./Product"
//import { Sale } from "./Sale"
//import Comparator from "ts-priority-queue/src/PriorityQueue"
//import { Result } from "../../utilities/Result";
import { ShoppingBag } from "./ShoppingBag";
import {UserID} from "../../utilities/Utils";
//import { exceptions } from "winston";


export class ShoppingCart {

    private _bags: Map<UserID, ShoppingBag>;
    private _totalPrice: number;
   

    constructor(){
        this._bags= new Map<UserID, ShoppingBag>();
        this._totalPrice=0;
    }

    get bags(): Map<UserID, ShoppingBag> {
        return this._bags;
    }

    set bags(value: Map<UserID, ShoppingBag>) {
        this._bags = value;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    set totalPrice(value: number) {
        this._totalPrice = value;
    }

//When adding a product to the shopping cart, 
//check if there is a discount to be included on the product.
//If there is, update the total price accordingly.
addProduct(toAdd:Product, quantity: number): void{
    let shopId= toAdd.shopId;
    let bag= this._bags.get(shopId);
    if(!bag){
        let bag= this._bags.get(shopId);
        if (bag){
            this._totalPrice-= bag.totalPrice;
            this._totalPrice+= bag.addProduct(toAdd, quantity);
        }
    }
    let newBag= new ShoppingBag(shopId);
    newBag.addProduct(toAdd, quantity); 
    this._bags.set(shopId, newBag);
    }

removeProduct(toRemove: Product, quantity: number): void{
    let shopId= toRemove.shopId;
    let bag= this._bags.get(shopId)
    if(!bag)
        throw new Error("Failed to remove product because the nedded bag wasn't found");
    this._totalPrice= this._totalPrice - bag.totalPrice + bag.removeProduct(toRemove, quantity);
}    

emptyCart(): void{
    this._bags.clear();
    this._totalPrice=0;
}
}

 