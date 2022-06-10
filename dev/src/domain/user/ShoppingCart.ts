import {Product} from "../marketplace/Product"
import {ShoppingBag} from "./ShoppingBag";
import {BaseEntity, Column, Entity, OneToMany} from "typeorm";

@Entity()
export class ShoppingCart extends BaseEntity {
    @Column({type: "int"}) //TODO One To Many(() => ShoppingBag, shoppingBag => shoppingBag.shoppingCart)
    private _bags: Map<number, ShoppingBag>; //ShopID -> ShoppingBag
    // private _totalPrice: number;

    constructor() {
        super();
        this._bags = new Map<number, ShoppingBag>();
        // this._totalPrice=0;
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

    addProduct(toAdd: Product, quantity: number): void {
        let shopId = toAdd.shopId;
        let bag = this._bags.get(shopId);
        if (bag) {
            bag.addProduct(toAdd, quantity);
        } else {
            let newBag = new ShoppingBag(shopId);
            newBag.addProduct(toAdd, quantity);
            this.bags.set(shopId, newBag);
        }
    }

    removeProduct(toRemove: Product): void {
        let shopId = toRemove.shopId;
        let bag = this.bags.get(shopId);
        if (!bag)
            throw new Error("Failed to remove product because the needed bag wasn't found");
        bag.products.delete(toRemove.id);
        if (bag.isEmpty())
            this.emptyBag(bag.shopId);
        // this._totalPrice= this._totalPrice - bag.totalPrice + bag.removeProduct(toRemove);
    }

    emptyBag(shopId: number) {
        let bag = this.bags.get(shopId);
        if (bag) {
            this.bags.delete(bag.shopId);
        }
    }

    emptyCart(): void {
        this.bags.clear();
        // this._totalPrice=0;
    }

    updateProductQuantity(toUpdate: Product, quantity: number): void {
        let shopId = toUpdate.shopId;
        let bag = this._bags.get(shopId)
        if (!bag)
            throw new Error("Failed to update product's quantity because the needed bag wasn't found");
        // this._totalPrice= this._totalPrice - bag.totalPrice + bag.updateProductQuantity(toUpdate, quantity);
        bag.updateProductQuantity(toUpdate, quantity);
    }
}