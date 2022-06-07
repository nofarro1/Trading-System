import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {SimpleShoppingCart} from "../utilities/simple_objects/user/SimpleShoppingCart";
import {inject, injectable} from "inversify";
import {TYPES} from "../helpers/types";
import "reflect-metadata";

@injectable()
export class ShoppingCartService {
    private systemController: SystemController;

    constructor(@inject(TYPES.SystemController)systemController: SystemController) {
        this.systemController = systemController;
    }

    //Guest Payment - Use-Case 4.1
    addToCart(sessionID: string, productID: number, productQuantity: number): Promise<Result<void>> {
        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.addToCart(sessionID, productID, productQuantity);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(sessionID: string): Promise<Result<void | SimpleShoppingCart>> {
        return new Promise<Result<void | SimpleShoppingCart>>((resolve, reject) => {
            let result: Result<void | SimpleShoppingCart> = this.systemController.getCart(sessionID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(sessionID: string, productID: number): Promise<Result<void>> {
        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.removeProductFromCart(sessionID, productID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(sessionID: string, productID: number, productQuantity: number, additionalDetails?: any): Promise<Result<void>> {
        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.editCart(sessionID, productID, productQuantity, additionalDetails);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 5
    checkout(sessionID: string, paymentDetails: any, deliveryDetails: any): Promise<Result<void>> {
        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.checkout(sessionID, paymentDetails, deliveryDetails);
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}