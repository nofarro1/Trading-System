import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShoppingCart} from "../utilities/simple_objects/user/SimpleShoppingCart";
import {ShoppingCart as DomainShoppingCart} from "../domain/marketplace/ShoppingCart";
import {UserID} from "../utilities/Utils";


export class ShoppingCartService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //SimpleGuest Payment - Use-Case 4.1
    addToCart(userID: UserID, productID: number, productQuantity: number): Result<void> {
        return this.systemController.addToCart(userID, productID, productQuantity);
    }

    //SimpleGuest Payment - Use-Case 4.2
    checkShoppingCart(userID: UserID): Result<void | SimpleShoppingCart> {
        const domainResult: Result<void | DomainShoppingCart> = this.systemController.getCart(userID);
        const products: Map<SimpleProduct, number> = new Map<SimpleProduct, number>();
        let result: Result<void | SimpleShoppingCart> = new Result <void | SimpleShoppingCart>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainShoppingCart = <DomainShoppingCart> domainResult.data;
            for (const [shopID, domainShoppingBag] of Object.entries(domainShoppingCart.bags)) {

                //Extract products and quantities from Domain Products
                for (const [domainProduct, quantity] of domainShoppingBag.products.values()) {
                    const product: SimpleProduct = new SimpleProduct(domainProduct.id, domainProduct.name, domainProduct.shopId,
                        domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                    products.set(product, quantity);
                }

            }
            result.data = new SimpleShoppingCart(userID, products, domainShoppingCart.totalPrice);
        }
        return result;
    }

    //SimpleGuest Payment - Use-Case 4.3
    removeFromCart(userID: UserID, productID: number): Result<void> {
        return this.systemController.removeProductFromCart(userID, productID);
    }

    //SimpleGuest Payment - Use-Case 4.4
    editProductInCart(userID: UserID, productID: number, productQuantity: number, additionalDetails?: any): Result<void> {
        return this.systemController.editCart(userID, productID, productQuantity, additionalDetails);
    }

    //SimpleGuest Payment - Use-Case 5
    checkout(userID: UserID, paymentDetails: any, deliveryDetails: any): Result<void> {
        return this.systemController.checkout(userID, paymentDetails, deliveryDetails);
    }
}