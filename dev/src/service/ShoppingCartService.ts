import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {Product} from "./simple_objects/Product";
import {ShoppingCart} from "./simple_objects/ShoppingCart";


class ShoppingCartService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //Guest Payment - Use-Case 4.1
    addToCart(userID: string, product: Product): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(userID: string): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(userID: string, product: Product): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(userID: string, product: Product, additionalDetails: any): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Guest Payment - Use-Case 5
    checkout(shoppingCart: ShoppingCart, paymentDetails: any, deliveryDetails: any): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }
}