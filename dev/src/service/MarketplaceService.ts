import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {Shop as DomainShop} from "../domain/marketplace/Shop"
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {Product as DomainProduct} from "../domain/marketplace/Product";
import {UserID} from "../utilities/Utils";
import {SimpleShopOrder} from "../utilities/simple_objects/purchase/SimpleShopOrder";
import {ShopOrder as DomainShopOrder} from "../domain/purchase/ShopOrder";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {Guest as DomainGuest} from "../domain/user/Guest";
import {ProductCategory, SearchType} from "../utilities/Enums";


export class MarketplaceService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 1
    accessMarketplace(): Promise<Result<void | SimpleGuest>> {
        const domainResult: Result<void | DomainGuest> = this.systemController.accessMarketplace();
        let result: Result<void | SimpleGuest> = new Result <void | SimpleGuest>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainGuest: DomainGuest = <DomainGuest> domainResult.data;
            result.data = new SimpleGuest(domainGuest.id);
        }
        return new Promise<Result<void | SimpleGuest>> ((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(userID: UserID): Promise<Result<void>> {
        let result = this.systemController.exitMarketplace(userID);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 1
    getShopInfo(userID: UserID, shopID: number): Promise<Result<void | SimpleShop>> {
        const domainResult: Result<void | DomainShop> = this.systemController.getShop(userID, shopID);
        let result: Result<void | SimpleShop> = new Result <void | SimpleShop>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainShop: DomainShop = <DomainShop> domainResult.data;

            //Extract products and quantities from Domain Products
            const products: Map<SimpleProduct, number> = new Map<SimpleProduct, number>();
            for (const [domainProduct, quantity] of domainShop.products.values()) {
                const product: SimpleProduct = new SimpleProduct(domainProduct.id, domainProduct.name, domainProduct.shopId,
                    domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                products.set(product, quantity);
            }

            result.data = new SimpleShop(domainShop.id, domainShop.name, domainShop.status, products);
        }
        return new Promise<Result<void | SimpleShop>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Guest Payment - Use-Case 2
    searchProducts(userID: UserID, searchType: SearchType, searchTerm: string | ProductCategory, filters?: any): Promise<Result<void | SimpleProduct[]>> {
        const domainResult: Result<void | DomainProduct[]> = this.systemController.searchProducts(userID, searchType, searchTerm, filters);
        const products: SimpleProduct[] = new Array<SimpleProduct>();
        const result: Result<void | SimpleProduct[]> = new Result <void | SimpleProduct[]>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            for (const domainProduct of <DomainProduct[]> domainResult.data) {
                const product: SimpleProduct = new SimpleProduct(domainProduct.id, domainProduct.name, domainProduct.shopId,
                    domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                products.push(product);
            }
            result.data = products;
        }
        return new Promise<Result<void | SimpleProduct[]>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Member Payment - Use-Case 2
    setUpShop(username: string, shopName: string): Promise<Result<void | SimpleShop>> {
        const domainResult: Result<void | DomainShop> = this.systemController.setUpShop(username, shopName);
        let result: Result<void | SimpleShop> = new Result <void | SimpleShop>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainShop: DomainShop = <DomainShop> domainResult.data;

            //Extract products and quantities from Domain Products
            const products: Map<SimpleProduct, number> = new Map<SimpleProduct, number>();
            for (const [domainProduct, quantity] of domainShop.products.values()) {
                const product: SimpleProduct = new SimpleProduct(domainProduct.id, domainProduct.name, domainProduct.shopId,
                    domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                products.set(product, quantity);
            }

            result.data = new SimpleShop(domainShop.id, domainShop.name, domainShop.status, products);
        }
        return new Promise<Result<void | SimpleShop>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(username: string, shopID: number, category: ProductCategory, name: string, price: number,
                     quantity: number, description?: string): Promise<Result<void>> {
        let result = this.systemController.addProduct(username, {shopId: shopID, productCategory: category, productName: name, fullPrice: price,
            quantity: quantity, productDesc: description});
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(username: string, shopID: number, productID: number): Promise<Result<void>> {
        let result = this.systemController.deleteProduct(username, shopID, productID);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(username: string, shopID: number, productID: number, productQuantity: number): Promise<Result<void>> {
        let result = this.systemController.updateProduct(username, shopID, productID, productQuantity);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 9
    closeShop(founderID: string, shopID: number): Promise<Result<void>> {
        let result = this.systemController.deactivateShop(founderID, shopID);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Promise<Result<void | SimpleShopOrder[]>> {
        const domainResult: Result<void | DomainShopOrder[]> = this.systemController.getShopPurchases(ownerID, shopID, startDate, endDate, filters);
        const shopOrders: SimpleShopOrder[] = new Array<SimpleShopOrder>();
        const result: Result<void | SimpleShopOrder[]> = new Result <void | SimpleShopOrder[]>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            for (const domainShopOrder of <DomainShopOrder[]> domainResult.data) {

                //Extract products and quantities from Domain Products
                const products: Map<SimpleProduct, number> = new Map<SimpleProduct, number>();
                for (const [domainProduct, quantity] of domainShopOrder.products.values()) {
                    const product: SimpleProduct = new SimpleProduct(domainProduct.id, domainProduct.name, domainProduct.shopId,
                        domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                    products.set(product, quantity);
                }

                const shopOrder: SimpleShopOrder = new SimpleShopOrder(domainShopOrder.shopId, products, domainShopOrder.totalPrice, domainShopOrder.creationTime);
                shopOrders.push(shopOrder);
            }
            result.data = shopOrders;
        }
        return new Promise<Result<void | SimpleShopOrder[]>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}
