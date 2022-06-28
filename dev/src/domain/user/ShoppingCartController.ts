import {Result} from "../../utilities/Result";
import {Product} from "../marketplace/Product";
import {ShoppingCart} from "./ShoppingCart";
import {logger} from "../../helpers/logger";
import {injectable} from "inversify";
import "reflect-metadata";
import {Offer} from "./Offer";

@injectable()
export class ShoppingCartController {
    private readonly _carts: Map<string, ShoppingCart>;

    constructor() {
        this._carts = new Map<string, ShoppingCart>();
    }

    get carts(): Map<string, ShoppingCart> {
        return this._carts;
    }

    //remove cart missing
    async addProduct(cartId: string, toAdd: Product, quantity: number): Promise<Result<Product | void>> {
        //TODO - Ensure that quantity does not exceed product quantity in shop
        let res: Result<Product | void>;
        let cart: ShoppingCart = await this.getCartWithDB(cartId)
        if (cart) {
            try {
                let p = await cart.addProduct(toAdd, quantity);
                logger.info(`[ShoppingCartController/addProduct] The product: ${toAdd.name} was added to ${cartId}'s cart.`);
                res= new Result(true, p, `The product: ${toAdd.name} was added to ${cartId}'s cart.`);
                //await cart.save(cartId);
                // return new Promise<Result<void | Product>>(async (resolve, reject) => {
                //     let result: Result<Product | void> = new Result(true, p, `The product: ${toAdd.name} was added to ${cartId}'s cart.`);
                //     result.ok ? resolve(result) : reject(result.message);
                // });
            } catch (error: any) {
                logger.error(`[ShoppingCartController/addProduct] In ShoppingCartController-> addProduct(${cartId}, ${toAdd.name}, ${quantity}): ${error.message}.`);
                res = new Result(false, undefined, error.message);
            }
        }
        else{
            logger.error(`[ShoppingCartController/addProduct] Failed adding ${toAdd.name} to cart because the needed cart wasn't found.`)
            res =  new Result(false, undefined, "Failed to addProduct to cart because the needed cart wasn't found");
        }
        return new Promise<Result<void | Product>>(async (resolve, reject) => {
            res.ok ? resolve(res) : reject(res.message);
        });
    }

    private async fetchCart(shopId: string): Promise<ShoppingCart> {
        try {
            let shop = await ShoppingCart.findById(shopId);
            return shop
        } catch (e) {
            return undefined;
        }
    }

    private async getCartWithDB(cartId: string): Promise<ShoppingCart> {
        let cart = this.carts.get(cartId);
        if (cart) {
            return cart;
        } else {
            return await this.fetchCart(cartId);
        }
    }

    async removeProduct(cartId: string, toRemove: Product): Promise<Result<void>> {
        let cart = await this.getCartWithDB(cartId)
        if (cart) {
            try {
                cart.removeProduct(toRemove);
                logger.info(`[ShoppingCartController/removeProduct] The product: ${toRemove.name} was removed from ${cartId}'s cart`);
                await cart.save(cartId);
                return new Result(true, undefined)
            } catch (error: any) {
                logger.error(`[ShoppingCartController/removeProduct] In ShoppingCartController-> removeProduct(${cartId}, ${toRemove.name}): ${error.message}.`)
                return new Result(false, undefined, error.message)
            }
        } else {
            logger.error(`[ShoppingCartController/removeProduct] Failed removing ${toRemove.name} to cart because the needed cart wasn't found.`)
            return new Result(false, undefined, "Failed to remove product from cart because the needed cart wasn't found");
        }
    }

    async updateProductQuantity(cartId: string, toUpdate: Product, quantity: number): Promise<Result<void>> {
        let cart = await this.getCartWithDB(cartId)
        if (cart) {
            try {
                cart.updateProductQuantity(toUpdate, quantity);
                logger.info(`[ShoppingCartController/updateProductQuantity] The product: ${toUpdate.name}'s quantity was update in cart with id: ${cartId}`);
                await cart.save(cartId);
                return new Result(true, undefined);
            } catch (error: any) {
                logger.error(`[ShoppingCartController/updateProductQuantity] In ShoppingCartController-> updateProduct(${cartId}, ${toUpdate.name}): ${error.message}.`);
                return new Result(false, undefined, error.message);
            }
        } else {
            logger.error(`[ShoppingCartController/updateProductQuantity] Failed updating ${toUpdate.name}'s quantity to cart because the needed cart wasn't found.`)
            return new Result(false, undefined, "Failed to update product's quantity in cart because the needed cart wasn't found");
        }
    }

    addCart(username: string): Result<ShoppingCart> {
        let cart = new ShoppingCart(username);
        this.carts.set(username, cart);
        cart.save(username);
        logger.info(`[ShoppingCartController/addCart] New cart was created for ${username}`);

        return new Result(true, this.carts.get(username), undefined);
    }

    async removeCart(username: string): Promise<Result<void>> {
        let toDelete = await this.getCartWithDB(username)
        if (this.carts.has(username) && this.carts.delete(username)) {
            logger.info(`[ShoppingCartController/removeCart] ${username}'s cart was deleted.`)
            toDelete.delete(username);
            return new Result(true, undefined, `${username}'s cart was deleted.`);
        }
        logger.error(`[ShoppingCartController/removeCart] Failed to delete ${username}'s cart, because the cart was not found.`);
        return new Result(false, undefined, `Failed to delete ${username}'s cart, because the cart was not found.`);
    }

    async getCart(username: string): Promise<Result<ShoppingCart | void>> {
        let toReturn = await this.getCartWithDB(username)
        if (toReturn) {
            logger.info(`[ShoppingCartController/getCart] ${username}'s cart was successfully returned.`)
            return new Result(true, toReturn, `${username}'s cart was successfully returned.`);
        }
        logger.error(`[ShoppingCartController/getCart] Failed to returned ${username}'s cart, because the cart was not found.`);
        return new Result(false, undefined, `Failed to returned ${username}'s cart, because the cart was not found.`);
    }

    async emptyCart(username: string): Promise<Result<void>> {
        let toEmpty = await this.getCartWithDB(username)
        if (toEmpty) {
            toEmpty.emptyCart();
            logger.info(`[ShoppingCartController/emptyCart] ${username}'s cart was successfully emptied.`);
            toEmpty.save(username);
            return new Result(true, undefined, `${username}'s cart was successfully emptied.`);
        }
        logger.error(`[ShoppingCartController/emptyCart] Failed to empty ${username}'s cart, because the cart wasn't found`);
        return new Result(false, undefined, `Failed to empty ${username}'s cart, because the cart wasn't found`);
    }

    async emptyBag(username: string, shopId: number): Promise<Result<void>> {
        let cart = await this.getCartWithDB(username)
        if (cart) {
            cart.emptyBag(shopId);
            logger.info(`[ShoppingCartController/emptyBag] ${username}'s bag in shop with id: ${shopId} was successfully emptied.`);
            cart.save(username);
            return new Result(true, undefined);
        }
        logger.info(`[ShoppingCartController/emptyBag] Tried to empty ${username}'s bag in shop with id: ${shopId}, but the bag wasn't found.`);
        return new Result(true, undefined, `Tried to empty ${username}'s bag in shop with id: ${shopId}, but the bag wasn't found.`);
    }

    async addOffer2cart(username: string, toAdd: Offer): Promise<Result<void>> {
        let cart = await this.getCartWithDB(username)
        if (cart) {
            cart.addOffer(toAdd);
            cart.save(username);
            return new Result(true, undefined);
        }
        logger.info(`[ShoppingCartController/addOffer2cart] offer to  ${username}'s cart , but the cart wasn't found.`);
        return new Result(true, undefined, `Tried to add offer to ${username}'s cart, but the bag wasn't found.`);
    }

    async updateOfferFromCart(toUpdate: Offer) {
        let cart = await this.getCartWithDB(toUpdate.user)
        if (cart) {
            // First delete the irrelevant offer and then push the relevant one.
            let i: number = cart.offers.findIndex((curr: Offer) => curr.id === toUpdate.id);
            cart.offers.splice(i, 1);
            cart.offers.push(toUpdate);
            cart.save(toUpdate.user);
            return new Result(true, undefined);
        }
        logger.info(`[ShoppingCartController/updateOfferFromCart] Tried to update offer to  ${toUpdate.user}'s cart , but the cart wasn't found.`);
        return new Result(false, undefined, `Tried to update offer to ${toUpdate.user}'s cart, but the bag wasn't found.`);
    }

    async removeOffer(username: string, toRemoveId: number) {
        let cart = await this.getCartWithDB(username)
        if (cart) {
            // First delete the irrelevant offer and then push the relevant one.
            let i: number = cart.offers.findIndex((curr: Offer) => curr.id === toRemoveId);
            cart.offers.splice(i, 1);
            cart.save(username);
            return new Result(true, undefined);
        }
        logger.info(`[ShoppingCartController/removeOffer] Tried to remove offer to  ${username}'s cart , but the cart wasn't found.`);
        return new Result(true, undefined, `Tried to remove offer to ${username}'s cart, but the bag wasn't found.`);
    }
}
