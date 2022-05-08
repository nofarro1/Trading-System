import {SystemController} from "../SystemController";
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
        return this.systemController.addToCart(userID, productID, productQuantity);
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(userID: UserID): Result<void | ShoppingCart> {
        const domainResult: Result<void | DomainShoppingCart> = this.systemController.getCart(userID);
        const products: Map<Product, number> = new Map<Product, number>();
        let result: Result<void | ShoppingCart> = new Result <void | ShoppingCart>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainShoppingCart = <DomainShoppingCart> domainResult.data;
            for (const [shopID, domainShoppingBag] of Object.entries(domainShoppingCart.bags)) {

                //Extract products and quantities from Domain Products
                for (const [domainProduct, quantity] of domainShoppingBag.products.values()) {
                    const product: Product = new Product(domainProduct.id, domainProduct.name, domainProduct.shopId,
                        domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                    products.set(product, quantity);
                }

            }
            result.data = new ShoppingCart(userID, products, domainShoppingCart.totalPrice);
        }
        return result;
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(userID: UserID, productID: number): Result<void> {
        return this.systemController.removeProductFromCart(userID, productID);
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(userID: UserID, productID: number, productQuantity: number, additionalDetails?: any): Result<void> {
        return this.systemController.editCart(userID, productID, productQuantity, additionalDetails);
    }

    //Guest Payment - Use-Case 5
    checkout(userID: UserID, paymentDetails: any, deliveryDetails: any): Result<void> {
        return this.systemController.checkout(userID, paymentDetails, deliveryDetails);
    }
}