import {Result} from "../utilities/Result";
import {SystemController} from "../domain/controller/SystemController";
import {Shop} from "./simple_objects/marketplace/Shop";
import {Shop as DomainShop} from "../domain/marketplace/Shop"
import {Product} from "./simple_objects/marketplace/Product";
import {Product as DomainProduct, ProductCategory} from "../domain/marketplace/Product";
import {UserID} from "../utilities/Utils";
import {ShopOrder} from "./simple_objects/purchase/ShopOrder";
import {ShopOrder as DomainShopOrder} from "../domain/purchase/ShopOrder";
import {Guest} from "./simple_objects/user/Guest";
import {Guest as DomainGuest} from "../domain/user/Guest";


export class MarketplaceService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 1
    accessMarketplace(): Result<void | Guest> {
        const domainResult: Result<void | DomainGuest> = this.systemController.accessMarketplace();
        let result: Result<void | Guest> = new Result <void | Guest>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainGuest: DomainGuest = <DomainGuest> domainResult.data;
            result.data = new Guest(domainGuest.id);
        }
        return result;
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(userID: UserID): Result<void> {
        return this.systemController.exitMarketplace(userID);
    }

    //Guest Payment - Use-Case 1
    getShopInfo(userID: UserID, shopID: number): Result<void | Shop> {
        const domainResult: Result<void | DomainShop> = this.systemController.getShop(userID, shopID);
        let result: Result<void | Shop> = new Result <void | Shop>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainShop: DomainShop = <DomainShop> domainResult.data;

            //Extract products and quantities from Domain Products
            const products: Map<Product, number> = new Map<Product, number>();
            for (const [domainProduct, quantity] of domainShop.products.values()) {
                const product: Product = new Product(domainProduct.id, domainProduct.name, domainProduct.shopId,
                    domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                products.set(product, quantity);
            }

            result.data = new Shop(domainShop.id, domainShop.name, domainShop.isActive, products);
        }
        return result;
    }

    //Guest Payment - Use-Case 2
    searchProducts(userID: UserID, searchTerm: string, filters?: any): Result<void | Product[]> {
        const domainResult: Result<void | DomainProduct[]> = this.systemController.searchProducts(userID, searchTerm, filters);
        const products: Product[] = new Array<Product>();
        const result: Result<void | Product[]> = new Result <void | Product[]>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            for (const domainProduct of <DomainProduct[]> domainResult.data) {
                const product: Product = new Product(domainProduct.id, domainProduct.name, domainProduct.shopId,
                    domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                products.push(product);
            }
            result.data = products;
        }
        return result;
    }

    //Member Payment - Use-Case 2
    setUpShop(username: string, shopName: string): Result<void | Shop> {
        const domainResult: Result<void | DomainShop> = this.systemController.setUpShop(username, shopName);
        let result: Result<void | Shop> = new Result <void | Shop>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainShop: DomainShop = <DomainShop> domainResult.data;

            //Extract products and quantities from Domain Products
            const products: Map<Product, number> = new Map<Product, number>();
            for (const [domainProduct, quantity] of domainShop.products.values()) {
                const product: Product = new Product(domainProduct.id, domainProduct.name, domainProduct.shopId,
                    domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                products.set(product, quantity);
            }

            result.data = new Shop(domainShop.id, domainShop.name, domainShop.isActive, products);
        }
        return result;
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(username: string, shopID: number, category: ProductCategory, name: string, price: number,
                     quantity: number, description?: string): Result<void> {
        return this.systemController.addProduct(username, {shopId: shopID, category: category, name: name, price: price,
            quantity: quantity, description: description});
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(username: string, shopID: number, productID: number): Result<void> {
        return this.systemController.deleteProduct(username, shopID, productID);
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(username: string, shopID: number, productID: number, productQuantity: number): Result<void> {
        return this.systemController.updateProduct(username, shopID, productID, productQuantity);
    }

    //Shop Owner - Use-Case 9
    closeShop(founderID: string, shopID: number): Result<void> {
        return this.systemController.deactivateShop(founderID, shopID);
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Result<void | ShopOrder[]> {
        const domainResult: Result<void | DomainShopOrder[]> = this.systemController.getShopPurchases(ownerID, shopID, startDate, endDate);
        const shopOrders: ShopOrder[] = new Array<ShopOrder>();
        const result: Result<void | ShopOrder[]> = new Result <void | ShopOrder[]>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            for (const domainShopOrder of <DomainShopOrder[]> domainResult.data) {

                //Extract products and quantities from Domain Products
                const products: Map<Product, number> = new Map<Product, number>();
                for (const [domainProduct, quantity] of domainShopOrder.products.values()) {
                    const product: Product = new Product(domainProduct.id, domainProduct.name, domainProduct.shopId,
                        domainProduct.fullPrice, domainProduct.category, domainProduct.rate, domainProduct.description);
                    products.set(product, quantity);
                }

                const shopOrder: ShopOrder = new ShopOrder(domainShopOrder.shopId, products, domainShopOrder.totalPrices, domainShopOrder.creationTime);
                shopOrders.push(shopOrder);
            }
            result.data = shopOrders;
        }
        return result;
    }
}
