import { Result } from "../../utilities/Result";
import { Product } from "../marketplace/Product";
import { ShoppingCart } from "./ShoppingCart";
import {logger} from "../../helpers/logger";
import {injectable} from "inversify";
import "reflect-metadata";
import {Offer} from "./Offer";

@injectable()
export class ShoppingCartController {
    private readonly _carts: Map<string, ShoppingCart>;

    constructor(){
        this._carts = new Map<string, ShoppingCart>();
    }

    get carts(): Map<string, ShoppingCart> {
        return this._carts;
    }

    //remove cart missing
    addProduct(cartId: string, toAdd: Product, quantity: number): Result<void>{
        //TODO - Ensure that quantity does not exceed product quantity in shop
        let cart = this.carts.get(cartId);
        if(cart){
            try {
                cart.addProduct(toAdd, quantity);
                logger.info(`[ShoppingCartController/addProduct] The product: ${toAdd.name} was added to ${cartId}'s cart.`);
                return new Result(true, undefined, `The product: ${toAdd.name} was added to ${cartId}'s cart.`);
            }

            catch (error: any) {
                logger.error(`[ShoppingCartController/addProduct] In ShoppingCartController-> addProduct(${cartId}, ${toAdd.name}, ${quantity}): ${error.message}.`);
                return new Result(false, undefined, error.message);
            }
        }
        logger.error(`[ShoppingCartController/addProduct] Failed adding ${toAdd.name} to cart because the needed cart wasn't found.`)
        return new Result(false, undefined, "Failed to addProduct to cart because the needed cart wasn't found");
    }

    removeProduct(cartId: string, toRemove: Product): Result<void>{
        let cart = this.carts.get(cartId);
        if(cart){
            try {
                cart.removeProduct(toRemove);
                logger.info(`[ShoppingCartController/removeProduct] The product: ${toRemove.name} was removed from ${cartId}'s cart`);
                return new Result(true, undefined)
            }
            catch (error: any) {
                logger.error(`[ShoppingCartController/removeProduct] In ShoppingCartController-> removeProduct(${cartId}, ${toRemove.name}): ${error.message}.`)
                return new Result(false, undefined, error.message)
            }
        }
        else {
            logger.error(`[ShoppingCartController/removeProduct] Failed removing ${toRemove.name} to cart because the needed cart wasn't found.`)
            return new Result(false, undefined, "Failed to remove product from cart because the needed cart wasn't found");
        }
    }

    updateProductQuantity(cartId: string, toUpdate: Product, quantity: number): Result<void>{
        let cart = this.carts.get(cartId);
        if(cart){
            try{
                cart.updateProductQuantity(toUpdate, quantity);
                logger.info(`[ShoppingCartController/updateProductQuantity] The product: ${toUpdate.name}'s quantity was update in cart with id: ${cartId}`);
                return new Result(true, undefined);
            }
            catch(error: any){
                logger.error(`[ShoppingCartController/updateProductQuantity] In ShoppingCartController-> updateProduct(${cartId}, ${toUpdate.name}): ${error.message}.`);
                return new Result(false, undefined, error.message);
            }
        }
        else {
            logger.error(`[ShoppingCartController/updateProductQuantity] Failed updating ${toUpdate.name}'s quantity to cart because the needed cart wasn't found.`)
            return new Result(false, undefined, "Failed to update product's quantity in cart because the needed cart wasn't found");
        }
    }

    addCart(username: string): Result<ShoppingCart>{
        this.carts.set(username, new ShoppingCart(username));
        logger.info(`[ShoppingCartController/addCart] New cart was created for ${username}`);
        return new Result(true, this.carts.get(username),undefined);
    }

    removeCart(username: string): Result<void>{
        if(this.carts.delete(username)){
            logger.info(`[ShoppingCartController/removeCart] ${username}'s cart was deleted.`)
            return new Result(true, undefined, `${username}'s cart was deleted.`);
        }
        logger.error(`[ShoppingCartController/removeCart] Failed to delete ${username}'s cart, because the cart was not found.`);
        return new Result(false, undefined, `Failed to delete ${username}'s cart, because the cart was not found.`);
    }

    getCart(username: string): Result<ShoppingCart | void>{
        let toReturn = this.carts.get(username);
        if(toReturn){
            logger.info(`[ShoppingCartController/getCart] ${username}'s cart was successfully returned.`)
            return new Result(true, toReturn, `${username}'s cart was successfully returned.`);
        }
        logger.error(`[ShoppingCartController/getCart] Failed to returned ${username}'s cart, because the cart was not found.`);
        return new Result(false, undefined, `Failed to returned ${username}'s cart, because the cart was not found.`);
    }

    emptyCart(username: string): Result<void>{
        let toEmpty = this.carts.get(username);
        if(toEmpty){
            toEmpty.emptyCart(); 
            logger.info(`[ShoppingCartController/emptyCart] ${username}'s cart was successfully emptied.`);
            return new Result(true,  undefined, `${username}'s cart was successfully emptied.`);
        }
        logger.error(`[ShoppingCartController/emptyCart] Failed to empty ${username}'s cart, because the cart wasn't found`);
        return new Result(false, undefined, `Failed to empty ${username}'s cart, because the cart wasn't found`);
    }

    emptyBag(username: string, shopId: number): Result<void>{
        let cart = this.carts.get(username);
        if(cart){
            cart.emptyBag(shopId);
            logger.info(`[ShoppingCartController/emptyBag] ${username}'s bag in shop with id: ${shopId} was successfully emptied.`);
            return new Result(true,  undefined);
        }
        logger.info(`[ShoppingCartController/emptyBag] Tried to empty ${username}'s bag in shop with id: ${shopId}, but the bag wasn't found.`);
        return new Result(true, undefined, `Tried to empty ${username}'s bag in shop with id: ${shopId}, but the bag wasn't found.`);
    }

    addOffer2cart(username: string, toAdd: Offer): Result <void>{
        let cart = this.carts.get(username);
        if(cart){
            cart.addOffer(toAdd);
            return new Result(true, undefined);
        }
        logger.info(`[ShoppingCartController/addOffer2cart] offer to  ${username}'s cart , but the cart wasn't found.`);
        return new Result(true, undefined, `Tried to add offer to ${username}'s cart, but the bag wasn't found.`);
    }

    updateOfferFromCart(toUpdate: Offer){
        let cart = this.carts.get(toUpdate.user);
        if(cart){
            // First delete the irrelevant offer and then push the relevant one.
            let i: number = cart.offers.findIndex((curr: Offer)=> curr.id===toUpdate.id);
            cart.offers.splice(i, 1);
            cart.offers.push(toUpdate);
            return new Result(true, undefined);
        }
        logger.info(`[ShoppingCartController/updateOfferFromCart] Tried to update offer to  ${toUpdate.user}'s cart , but the cart wasn't found.`);
        return new Result(false, undefined, `Tried to update offer to ${toUpdate.user}'s cart, but the bag wasn't found.`);
    }

    removeOffer(username: string, toRemoveId: number){
        let cart = this.carts.get(username);
        if(cart){
            // First delete the irrelevant offer and then push the relevant one.
            let i: number = cart.offers.findIndex((curr: Offer)=> curr.id=== toRemoveId);
            cart.offers.splice(i, 1);
            return new Result(true, undefined);
        }
        logger.info(`[ShoppingCartController/removeOffer] Tried to remove offer to  ${username}'s cart , but the cart wasn't found.`);
        return new Result(true, undefined, `Tried to remove offer to ${username}'s cart, but the bag wasn't found.`);
    }
}
