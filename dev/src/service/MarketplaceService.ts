import {Result} from "../utilities/Result";
import {SystemController} from "../domain/controller/SystemController";
import {Shop} from "./simple_objects/Shop";
import {Shop as DomainShop} from "../domain/marketplace/Shop"
import {Product} from "./simple_objects/Product";
import {Product as DomainProduct} from "../domain/marketplace/Product";
import {Id} from "../utilities/Utils";


export class MarketplaceService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //TODO - accessMarketplace + initializeMarketplace

    //Guest Payment - Use-Case 1
    getShopInfo(userID: Id, shopID: number): Result<Shop> {
        // const domainResult: Result<DomainShop> = this.systemController.getShop(userID, shopID);
        // let result: Result<Shop> = new Result <Shop>(domainResult.ok, null, domainResult.message);
        // if(domainResult.ok) {
        //     const domainShop = domainResult.data;
        //     result.data = new Shop(domainShop.ID, domainShop.founderID, domainShop.personnelIDs, domainShop.products);
        // }
        // return result;
        return null;
    }

    //Guest Payment - Use-Case 2
    searchProducts(userID: Id, searchTerm: string /* additional filtering options */): Result<Product[]> {
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

    //TODO - General Member - Use-Case 1
    exitMarketplace(userID: Id): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Member Payment - Use-Case 2
    setUpShop(shopName: string, username: string, description: string): Result<void> {
        // return this.systemController.setUpShop({shopName: shopName, founder: username, description: description, foundedDate: Date.now()});
        return null;
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(username: string, shopID: number, productName: string, productQuantity: number, productPrice: number, productDetails: string): Result<void> {
        // return this.systemController.addProduct(username, shopID, productID, productQuantity);
        return null;
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(username: string, shopID: number, productName: number): Result<void> {
        // return this.systemController.deleteProduct(username, shopID, productID, productQuantity);
        return null;
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(username: string, shopID: number, productName: string, productQuantity: number): Result<void> {
        // return this.systemController.updateProduct(username, shopID, productName, productQuantity);
        return null;
    }

    //Shop Owner - Use-Case 9
    closeShop(founderID: string, shopID: number): Result<void> {
        // return this.systemController.deactivateShop(founderID, shopID);
        return null;
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(ownerID: string, shopID: number, startDate: Date, endDate: Date, filters?: any): Result<void> {
        // return this.systemController.getShopPurchases(ownerID, shopID, startDate, endDate);
        return null;
    }
}