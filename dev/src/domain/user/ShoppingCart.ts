//import PriorityQueue from "ts-priority-queue"
import { Product } from "../marketplace/Product"
//import { Sale } from "./Sale"
//import Comparator from "ts-priority-queue/src/PriorityQueue"
//import { Result } from "../../utilities/Result";
import { ShoppingBag } from "./ShoppingBag";
import {Offer} from "./Offer";
//import { exceptions } from "winston";


export class ShoppingCart {

    private _bags: Map<number, ShoppingBag>; //ShopID -> ShoppingBag
    private _offers: Offer[]
  //  private _totalPrice: number;
   

    constructor(){
        this._bags= new Map<number, ShoppingBag>();
     //   this._totalPrice=0;
    }

    get bags(): Map<number, ShoppingBag> {
        return this._bags;
    }

    set bags(value: Map<number, ShoppingBag>) {
        this._bags = value;
    }

    //When adding a product to the shopping cart,
    //check if there is a discount to be included on the product.
    //If there is, update the total price accordingly.

    addProduct(toAdd:Product, quantity: number): void{
        let shopId= toAdd.shopId;
        let bag= this._bags.get(shopId);
        if(bag){
            bag.addProduct(toAdd, quantity);
        }
        else{
            let newBag= new ShoppingBag(shopId);
            newBag.addProduct(toAdd, quantity);
            this.bags.set(shopId, newBag);
        }
    }

    removeProduct(toRemove: Product): void{
        let shopId = toRemove.shopId;
        let bag = this.bags.get(shopId);
        if(!bag)
            throw new Error("Failed to remove product because the needed bag wasn't found");
        bag.products.delete(toRemove.id);
        if(bag.isEmpty())
            this.emptyBag(bag.shopId);
       // this._totalPrice= this._totalPrice - bag.totalPrice + bag.removeProduct(toRemove);
    }

    emptyBag(shopId: number){
      let bag = this.bags.get(shopId);
      if(bag){
          this.bags.delete(bag.shopId);
      }
    }

    emptyCart(): void{
        this.bags.clear();
      //  this._totalPrice=0;
    }

    updateProductQuantity(toUpdate: Product, quantity: number): void {
        let shopId = toUpdate.shopId;
        let bag = this._bags.get(shopId)
        if(!bag)
            throw new Error("Failed to update product's quantity because the needed bag wasn't found");
       // this._totalPrice= this._totalPrice - bag.totalPrice + bag.updateProductQuantity(toUpdate, quantity);
        bag.updateProductQuantity(toUpdate, quantity);
    }

    addOffer(offer: Offer){
        this._offers.push(offer);
    }

    removeOffer(offer: Offer){
       this._offers = this._offers.filter((curr: Offer)=> curr != offer);
    }

    checksOffers(): [Offer[], Offer[]]{
        let waitings: Offer[] = [];
        let rejected: Offer[] = [];

        for (let offer of this._offers) {
            if(offer.isDone()){
                if(!offer.answer)
                    rejected.push(offer);
            }
            waitings.push(offer);
            return [waitings, rejected];
        }

    }
}

 