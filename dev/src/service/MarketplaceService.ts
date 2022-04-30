import {Result} from "../utilities/Result";
import {SystemController} from "../domain/controller/SystemController";
import {Shop} from "./simple_objects/marketplace/Shop";
import {Shop as DomainShop} from "../domain/marketplace/Shop"
import {Product} from "./simple_objects/marketplace/Product";
import {Product as DomainProduct} from "../domain/marketplace/Product";
import {Id} from "../utilities/Utils";
import {NewProductData} from "../utilities/DataObjects";
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
    accessMarketplace(): Result<Guest> {
        // const domainResult: Result<DomainGuest> = this.systemController.accessMarketplace();
        // let result: Result<Guest> = new Result <Guest>(domainResult.ok, null, domainResult.message);
        // if(domainResult.ok) {
        //     const domainGuest: DomainGuest = domainResult.data;
        //     result.data = new Guest(domainGuest.id);
        // }
        // return result;
        return null;
    }

    //General Guest - Use-Case 2
    //General Member - Use-Case 1
    exitMarketplace(userID: Id): Result<void> {
        return this.systemController.exitMarketplace(userID);
    }

    //Guest Payment - Use-Case 1
    getShopInfo(userID: Id, shopID: number): Result<Shop> {
        // const domainResult: Result<DomainShop> = this.systemController.getShop(userID, shopID);
        // let result: Result<Shop> = new Result <Shop>(domainResult.ok, null, domainResult.message);
        // if(domainResult.ok) {
        //     const domainShop: DomainShop = domainResult.data;
        //     result.data = new Shop(domainShop.ID, domainShop.founderID, domainShop.personnelIDs, domainShop.products);
        // }
        // return result;
        return null;
    }

    //Guest Payment - Use-Case 2
    searchProducts(userID: Id, searchTerm: string, filters?: any): Result<Product[]> {
        // const domainResult: Result<DomainProduct[]> = this.systemController.searchProducts(userID, searchTerm);
        // const products: Product[] = new Array<Product>();
        // const result: Result<Product[]> = new Result <Product[]>(domainResult.ok, products, domainResult.message);
        // if(domainResult.ok) {
        //     for (const domainProduct of domainResult.data) {
        //         const product: Product = new Product(domainProduct.shopID, domainProduct.id, domainProduct.name, domainProduct.quantity);
        //         products.push(product);
        //     }
        // }
        // return result;
        return null;
    }

    //Member Payment - Use-Case 2
    setUpShop(shopName: string, username: string, description: string): Result<void> {
        return this.systemController.setUpShop({shopName: shopName, founder: username, description: description, foundedDate: new Date()});
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(username: string, productInfo: NewProductData): Result<void> {
        return this.systemController.addProduct(username, productInfo);
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(username: string, shopID: number, productID: number): Result<void> {
        return this.systemController.deleteProduct(username, shopID, productID);
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(username: string, shopID: number, productName: string, productQuantity: number): Result<void> {
        return this.systemController.updateProduct(username, shopID, productName, productQuantity);
    }

    //Shop Owner - Use-Case 9
    closeShop(founderID: string, shopID: number): Result<void> {
        return this.systemController.deactivateShop(founderID, shopID);
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Result<ShopOrder[]> {
        // const domainResult: Result<DomainProduct[]> = this.systemController.getShopPurchases(ownerID, shopID, startDate, endDate);
        // const shopOrders: ShopOrder[] = new Array<ShopOrder>();
        // const result: Result<ShopOrder[]> = new Result <ShopOrder[]>(domainResult.ok, shopOrders, domainResult.message);
        // if(domainResult.ok) {
        //     for (const domainShopOrder of domainResult.data) {
        //         const shopOrder: ShopOrder = new ShopOrder(); //TODO
        //         shopOrders.push(shopOrder);
        //     }
        // }
        // return result;
        return null;
    }
}
