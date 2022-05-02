import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {Product} from "./simple_objects/marketplace/Product";
import {ShoppingCart} from "./simple_objects/marketplace/ShoppingCart";
import {ShoppingCart as DomainShoppingCart} from "../domain/marketplace/ShoppingCart";
import {UserID} from "../utilities/Utils";


export class ShoppingCartService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //Guest Payment - Use-Case 4.1
    addToCart(userID: UserID, productID: number, productQuantity: number): Result<void> {
        // return this.systemController.addToCart(userID, productID, productQuantity);
        // @ts-ignore
        return null;
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(userID: UserID): Result<ShoppingCart> {
        // const domainResult: Result<DomainShoppingCart> = this.systemController.checkShoppingCart(userID);
        // let result: Result<ShoppingCart> = new Result <ShoppingCart>(domainResult.ok, null, domainResult.message);
        // if(domainResult.ok) {
        //     const domainShoppingCart = domainResult.data;
        //     result.data = new ShoppingCart();
        // }
        // return result;
        // @ts-ignore
        return null;
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(userID: UserID, productID: number): Result<void> {
        // return this.systemController.removeFromCart(userID, product);
        // @ts-ignore
        return null;
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(userID: UserID, productId: number, productQuantity: number, additionalDetails?: any): Result<void> {
        // return this.systemController.editProductInCart(userID, product);
        // @ts-ignore
        return null;
    }

    //Guest Payment - Use-Case 5
    checkout(userID: UserID, paymentDetails: any, deliveryDetails: any): Result<void> {
        // return this.systemController.checkoutProductInCart(shoppingCart, paymentDetails, deliveryDetails);
        // @ts-ignore
        return null;
    }
}