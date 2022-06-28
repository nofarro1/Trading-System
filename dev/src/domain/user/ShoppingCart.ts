//import PriorityQueue from "ts-priority-queue"
import {Product} from "../marketplace/Product"
import {ShoppingBag as DBShoppingBag, ShoppingCart as DBShoppingCart} from "../../../prisma/prisma"
//import { Sale } from "./Sale"
//import Comparator from "ts-priority-queue/src/PriorityQueue"
//import { Result } from "../../utilities/Result";
import {ShoppingBag} from "./ShoppingBag";
import {Offer} from "./Offer";
import {Entity} from "../../utilities/Entity";
import prisma from "../../utilities/PrismaClient";

//import { exceptions } from "winston";


export class ShoppingCart implements Entity {

    private _bags: Map<number, ShoppingBag>; //ShopID -> ShoppingBag
    private _offers: Offer[]
    private username: string

    constructor(username: string) {
        this.username = username
        this._bags = new Map<number, ShoppingBag>();
        this.offers = [];
    }

    get bags(): Map<number, ShoppingBag> {
        return this._bags;
    }

    set bags(value: Map<number, ShoppingBag>) {
        this._bags = value;
    }

    get offers(): Offer[] {
        return this._offers;
    }

    set offers(value: Offer[]) {
        this._offers = value;
    }

//When adding a product to the shopping cart,
    //check if there is a discount to be included on the product.
    //If there is, update the total price accordingly.

    async addProduct(toAdd: Product, quantity: number): Promise<Product> {
        let shopId = toAdd.shopId;
        let bag = this._bags.get(shopId);
        if (bag) {
            bag.addProduct(toAdd, quantity);
        } else {
            bag = new ShoppingBag(toAdd.shopId);
            this.bags.set(shopId, bag);
            bag.addProduct(toAdd, quantity);
        }
       // await bag.saveProductInBag(this.username, toAdd.id, quantity);
        return toAdd;
    }

    removeProduct(toRemove: Product): void {
        let shopId = toRemove.shopId;
        let bag = this.bags.get(shopId);
        if (!bag)
            throw new Error("Failed to remove product because the needed bag wasn't found");
        bag.products.delete(toRemove.id);
        if (bag.isEmpty())
            this.emptyBag(bag.shopId);
        bag.deleteProductInBag(this.username, toRemove.id);
        // this._totalPrice= this._totalPrice - bag.totalPrice + bag.removeProduct(toRemove);
    }

    emptyBag(shopId: number) {
        let bag = this.bags.get(shopId);
        if (bag) {
            bag.delete(this.username);
            this.bags.delete(bag.shopId);
        }
    }

    emptyCart(): void {
        for(let bag of this.bags.values()) {
            bag.delete(this.username);
        }
        this.bags.clear();
        //  this._totalPrice=0;
    }

    updateProductQuantity(toUpdate: Product, quantity: number): void {
        let shopId = toUpdate.shopId;
        let bag = this._bags.get(shopId)
        if (!bag)
            throw new Error("Failed to update product's quantity because the needed bag wasn't found");
        // this._totalPrice= this._totalPrice - bag.totalPrice + bag.updateProductQuantity(toUpdate, quantity);
        bag.updateProductQuantity(toUpdate, quantity);
        bag.update(this.username, toUpdate.id, quantity);
    }

    addOffer(offer: Offer) {
        this._offers.push(offer);
        offer.save(this.username, offer.pId, [...offer.getApproves().keys()])
    }

    removeOffer(offer: Offer) {
        this._offers = this._offers.filter((curr: Offer) => curr != offer);
        offer.delete();
    }

    checksOffers(): [Offer[], Offer[]] {
        let waitings: Offer[] = [];
        let rejected: Offer[] = [];

        for (let offer of this._offers) {
            if (offer.isDone()) {
                if (!offer.answer)
                    rejected.push(offer);
            }
            waitings.push(offer);
        }
        return [waitings, rejected];
    }

    static async findById(username: string): Promise<ShoppingCart> {
        const result: DBShoppingBag[] = await prisma.shoppingBag.findMany({
            where: {username: username}
        })
        const bags = new Map<number, ShoppingBag>();
        for(let dalBag of result){
           let bag = await ShoppingBag.findById(dalBag.username, dalBag.shopId);
           bags.set(bag.shopId,bag);
        }
        let cart = new  ShoppingCart(username);
        cart.bags = bags;
        return cart;
    }

    async save(username: string) {
        await prisma.shoppingCart.create({
            data: {
                username: username,
            },
        });
        // for(let b of this.bags.values()){
        //     b.save(username);
        // }
    }

    update() {
        //Unnecessary
    }

    async delete(username: string) {
        await prisma.shoppingCart.delete({
            where: {
                username: username
            }
        });
    }
}

 