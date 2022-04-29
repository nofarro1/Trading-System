import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {Product} from "./simple_objects/Product";
import {ShoppingCart} from "./simple_objects/ShoppingCart";
import {ShoppingCart as DomainShoppingCart} from "../domain/marketplace/ShoppingCart";
import {Id} from "../utilities/Utils";


export class ShoppingCartService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //Guest Payment - Use-Case 4.1
    addToCart(userID: Id, productID: number, productQuantity: number): Result<void> {
        // return this.systemController.addToCart(userID, product);
        return null;
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(userID: Id): Result<ShoppingCart> {
        // const domainResult: Result<DomainShoppingCart> = this.systemController.checkShoppingCart(userID);
        // let result: Result<ShoppingCart> = new Result <ShoppingCart>(domainResult.ok, null, domainResult.message);
        // if(domainResult.ok) {
        //     const domainShoppingCart = domainResult.data;
        //     result.data = new ShoppingCart();
        // }
        // return result;
        return null;
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(userID: Id, productId: number): Result<void> {
        // return this.systemController.removeFromCart(userID, product);
        return null;
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(userID: string, productId: number, productQuantity: number, additionalDetails?: any): Result<void> {
        // return this.systemController.editProductInCart(userID, product);
        return null;
    }

    //Guest Payment - Use-Case 5
    checkout(userID: Id, paymentDetails: any, deliveryDetails: any): Result<void> {
        // return this.systemController.checkoutProductInCart(shoppingCart, paymentDetails, deliveryDetails);
        return null;
    }
}