import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {SimpleShoppingCart} from "../utilities/simple_objects/user/SimpleShoppingCart";


export class ShoppingCartService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //Guest Payment - Use-Case 4.1
    addToCart(sessionID: string, productID: number, productQuantity: number): Result<void> {
        return this.systemController.addToCart(sessionID, productID, productQuantity);
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(sessionID: string): Result<void | SimpleShoppingCart> {
        return this.systemController.getCart(sessionID);
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(sessionID: string, productID: number): Result<void> {
        return this.systemController.removeProductFromCart(sessionID, productID);
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(sessionID: string, productID: number, productQuantity: number, additionalDetails?: any): Result<void> {
        return this.systemController.editCart(sessionID, productID, productQuantity, additionalDetails);
    }

    //Guest Payment - Use-Case 5
    checkout(sessionID: string, paymentDetails: any, deliveryDetails: any): Result<void> {
        return this.systemController.checkout(sessionID, paymentDetails, deliveryDetails);
    }
}