import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShoppingCart} from "../utilities/simple_objects/user/SimpleShoppingCart";
import {ShoppingCart as DomainShoppingCart} from "../domain/marketplace/ShoppingCart";


export class ShoppingCartService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //Guest Payment - Use-Case 4.1
    addToCart(sessionID: string, productID: number, productQuantity: number): Promise<Result<void>> {
        let result: Result<void> = this.systemController.addToCart(sessionID, productID, productQuantity);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(sessionID: string): Promise<Result<void | SimpleShoppingCart>> {
        let result: Result<void | SimpleShoppingCart> = this.systemController.getCart(sessionID);
        return new Promise<Result<void | SimpleShoppingCart>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(sessionID: string, productID: number): Promise<Result<void>> {
        let result: Result<void> = this.systemController.removeProductFromCart(sessionID, productID);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(sessionID: string, productID: number, productQuantity: number, additionalDetails?: any): Promise<Result<void>> {
        let result: Result<void> = this.systemController.editCart(sessionID, productID, productQuantity, additionalDetails);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 5
    checkout(sessionID: string, paymentDetails: any, deliveryDetails: any): Promise<Result<void>> {
        let result: Result<void> = this.systemController.checkout(sessionID, paymentDetails, deliveryDetails);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}