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

    //Guest Payment - Use-Case 4.1
    addToCart(sessionID: string, productID: number, productQuantity: number): Promise<Result<void>> {
        let result = this.systemController.addToCart(sessionID, productID, productQuantity);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.2
    checkShoppingCart(sessionID: string): Promise<Result<void | SimpleShoppingCart>> {
        const domainResult: Result<void | DomainShoppingCart> = this.systemController.getCart(sessionID);
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
            result.data = new SimpleShoppingCart(sessionID, products, domainShoppingCart.totalPrice);
        }
        return new Promise<Result<void | SimpleShoppingCart>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.3
    removeFromCart(sessionID: string, productID: number): Promise<Result<void>> {
        let result = this.systemController.removeProductFromCart(sessionID, productID);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 4.4
    editProductInCart(sessionID: string, productID: number, productQuantity: number, additionalDetails?: any): Promise<Result<void>> {
        let result = this.systemController.editCart(sessionID, productID, productQuantity, additionalDetails);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 5
    checkout(sessionID: string, paymentDetails: any, deliveryDetails: any): Promise<Result<void>> {
        let result = this.systemController.checkout(sessionID, paymentDetails, deliveryDetails);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}