import { Result } from "../../utilities/Result";
import { Product } from "./Product";
import { ShoppingCart } from "./ShoppingCart";


export class ShoppingCartController {
    private carts: Map<number, ShoppingCart>;

    constructor(){
        this.carts= new Map<number, ShoppingCart>();
    }
    addProduct(cartId: number, toAdd: Product, quantity: number): Result<void>{
        if(this.carts.has(cartId)){
            this.carts.get(cartId).addProduct(toAdd, quantity);
            return new Result(true, null);}
        else
            return new Result(false, null, "Failed to add product to cart");
    }

    removeProduct(cartId: number, toRemove: Product, quantity: number): Result<void>{
        if(this.carts.has(cartId)){
            if(this.carts.get(cartId).removeProduct(toRemove))
                return new Result(true, null);}
        else
            return new Result(false, null, "Failed to remove product from cart");
    }
}