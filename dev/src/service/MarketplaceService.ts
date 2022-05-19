import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {Shop as DomainShop} from "../domain/marketplace/Shop"
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {Product as DomainProduct} from "../domain/marketplace/Product";
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

    //General SimpleGuest - Use-Case 1
    accessMarketplace(): Result<void | SimpleGuest> {
        const domainResult: Result<void | DomainGuest> = this.systemController.accessMarketplace();
        let result: Result<void | SimpleGuest> = new Result <void | SimpleGuest>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainGuest: DomainGuest = <DomainGuest> domainResult.data;
            result.data = new SimpleGuest(domainGuest.id);
        }
        return result;
    }

    //General SimpleGuest - Use-Case 2
    //General SimpleMember - Use-Case 1
    exitMarketplace(userID: string): Result<void> {
        return this.systemController.exitMarketplace(userID);
    }

    //SimpleGuest Payment - Use-Case 1
    getShopInfo(userID: string, shopID: number): Result<void | SimpleShop> {
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
        return result;
    }

    //SimpleGuest Payment - Use-Case 2
    searchProducts(userID: string, searchType: SearchType, searchTerm: string | ProductCategory, filters?: any): Result<void | SimpleProduct[]> {
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
        return result;
    }

    //SimpleMember Payment - Use-Case 2
    setUpShop(username: string, shopName: string): Result<void | SimpleShop> {
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
        return result;
    }

    //SimpleShop Owner - Use-Case 1.1
    addProductToShop(username: string, shopID: number, category: ProductCategory, name: string, price: number,
                     quantity: number, description?: string): Result<void> {
        return this.systemController.addProduct(username, {shopId: shopID, productCategory: category, productName: name, fullPrice: price,
            quantity: quantity, productDesc: description});
    }

    //SimpleShop Owner - Use-Case 1.2
    removeProductFromShop(username: string, shopID: number, productID: number): Result<void> {
        return this.systemController.deleteProduct(username, shopID, productID);
    }

    //SimpleShop Owner - Use-Case 1.3
    modifyProductQuantityInShop(username: string, shopID: number, productID: number, productQuantity: number): Result<void> {
        return this.systemController.updateProduct(username, shopID, productID, productQuantity);
    }

    //SimpleShop Owner - Use-Case 9
    closeShop(founderID: string, shopID: number): Result<void> {
        return this.systemController.deactivateShop(founderID, shopID);
    }

    //SimpleShop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Result<void | SimpleShopOrder[]> {
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
        return result;
    }
}
