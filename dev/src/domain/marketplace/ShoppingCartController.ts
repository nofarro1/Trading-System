//import { ExceptionHandler } from "winston";
import { Result } from "../../utilities/Result";
import { Product } from "./Product";
import { ShoppingCart } from "./ShoppingCart";
import {logger} from "../../helpers/logger";


export class ShoppingCartController {
    private carts: Map<string, ShoppingCart>;

    constructor(){
        this.carts= new Map<string, ShoppingCart>();
    }



    //remove cart missing
    addProduct(cartId: string, toAdd: Product, quantity: number): Result<void>{
        //TODO - Ensure that quantity does not exceed product quantity in shop
        let cart = this.carts.get(cartId);
        if(cart){
            try {
                cart.addProduct(toAdd, quantity);
                logger.info(`The product: ${toAdd.name} was added to cart with id: ${cartId}`);
                return new Result(true, undefined);
            }

            catch (error: any) {
                logger.error(`In ShoppingCartController-> addProduct(${cartId}, ${toAdd.name}, ${quantity}): ${error.message}.`)
                return new Result(false, undefined, error.message)
            }
        }
        logger.error(`Failed adding ${toAdd.name} to cart because the needed cart wasn't found.`)
        return new Result(false, undefined, "Failed to addProduct to cart because the needed cart wasn't found")
    }

    removeProduct(cartId: string, toRemove: Product): Result<void>{
        let cart= this.carts.get(cartId);
        if(cart){
            try {
                cart.removeProduct(toRemove);
                logger.info(`The product: ${toRemove.name} was removed from cart with id: ${cartId}`);
                return new Result(true, undefined)
            } 
            catch (error: any) {
                logger.error(`In ShoppingCartController-> removeProduct(${cartId}, ${toRemove.name}): ${error.message}.`)
                return new Result(false, undefined, error.message)
            } 
        }     
        else {
            logger.error(`Failed removing ${toRemove.name} to cart because the needed cart wasn't found.`)
            return new Result(false, undefined, "Failed to remove product from cart because the needed cart wasn't found");
        }
    }

    updateProductQuantity(cartId: string, toUpdate: Product, quantity: number): Result<void>{
        let cart= this.carts.get(cartId);
        if(cart){
            try{
                cart.updateProductQuantity(toUpdate, quantity);
                logger.info(`The product: ${toUpdate.name}'s quantity was update in cart with id: ${cartId}`);
                return new Result(true, undefined);
            }
            catch(error: any){
                logger.error(`In ShoppingCartController-> updateProduct(${cartId}, ${toUpdate.name}): ${error.message}.`)
                return new Result(false, undefined, error.message)
            }
        }
        else {
            logger.error(`Failed updating ${toUpdate.name}'s quantity to cart because the needed cart wasn't found.`)
            return new Result(false, undefined, "Failed to update product's quantity in cart because the needed cart wasn't found");
        }
    }

    addCart(userName: string): Result<void>{
        this.carts.set(userName, new ShoppingCart());
        logger.info(`New cart was created for ${userName}` );
        return new Result(true, undefined);
    }

    removeCart(userName: string): Result <void>{
        if(this.carts.delete(userName)){
            logger.info(`${userName}'s cart was deleted.`)
            return new Result(true, undefined);
        }
        logger.error(`Failed to delete ${userName}'s cart, because the cart was not found.`);
        return new Result(false, undefined, `Failed to delete ${userName}'s cart, because the cart was not found.`);
    }

    getCart(userName: string): Result<ShoppingCart | void>{
        let toReturn= this.carts.get(userName);
        if(toReturn){
            logger.info(`${userName}'s cart was returned successfully.`)
            return new Result(true, toReturn);
        }
        logger.error(`Failed to returned ${userName}'s cart, because the cart was not found.`);
        return new Result(false, undefined, `Failed to returned ${userName}'s cart, because the cart was not found.`);
    }
}