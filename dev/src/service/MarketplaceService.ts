import {Result} from "../utilities/Result";
import {SystemController} from "../domain/controller/SystemController";


class MarketplaceService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //Guest Payment - Use-Case 1
    getShopInfo(userID: string, shopID: number): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Guest Payment - Use-Case 2
    searchProducts(userID: string, searchTerm: string /* additional filtering options */): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //General Member - Use-Case 1
    exitMarketplace(userID: string): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Member Payment - Use-Case 2
    setUpShop(username: string): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 1.1
    addProductToShop(username: string, shopID: number, productID: number, productQuantity: number): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 1.2
    removeProductFromShop(username: string, shopID: number, productID: number, productQuantity: number): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 1.3
    modifyProductQuantityInShop(username: string, shopID: number, productID: number): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 9
    closeShop(founderID: string, shopID: number): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    getShopPurchaseHistory(ownerID: string, shopID: number, startDate: Date, endDate: Date /* Optionally add filters */): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }
}