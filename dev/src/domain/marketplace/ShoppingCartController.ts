import { ExceptionHandler } from "winston";
import { Result } from "../../utilities/Result";
import { Product } from "./Product";
import { ShoppingCart } from "./ShoppingCart";


export class ShoppingCartController {
    private carts: Map<number, ShoppingCart>;

    constructor(){
        this.carts= new Map<number, ShoppingCart>();
    }
    addProduct(cartId: number, toAdd: Product, quantity: number): Result<void>{
        let cart= this.carts.get(cartId);
        if(cart){
            try {
                cart.addProduct(toAdd, quantity);
                return new Result(true, undefined);
            }

            catch (error: any) {
                return new Result(false, undefined, error.message)
            }
        }
        return new Result(false, undefined, "Failed to addProduct to cart because the needed cart wasn't found")
    }

    removeProduct(cartId: number, toRemove: Product, quantity: number): Result<void>{
        let cart= this.carts.get(cartId);
        if(cart){
            try {
                cart.removeProduct(toRemove)
                return new Result(true, undefined)
            } 
            catch (error: any) {
                return new Result(false, undefined, error.message)
            } 
        }     
        else
            return new Result(false, undefined, "Failed to remove product from cart because the needed cart wasn't found");
    }
}