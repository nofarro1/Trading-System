import { Result } from "../../utilities/Result";
import { Member } from "../user/Member";
import { Product } from "./Product";
import { Sale } from "./Sale";
import { Shop } from "./Shop";


export class MarketplaceController {

    private shops: Map<number, Shop>
    idsCounter: number;

    constructor(){
        this.shops= new Map<number,Shop>();
        this.idsCounter= 0;
    }

    setUpShop(userName: Member, shopName: String, purchaseAndDiscountPolicies: String): Result<void>{
        let toAdd= new Shop(this.idsCounter, userName, purchaseAndDiscountPolicies);
        this.shops.set(toAdd.id, toAdd);
        return new Result(true, null);
    }

    closeShop(founder: Member, shopId): Result<void>{
        if(this.shops.has(shopId)){
            let toClose= this.shops.get(shopId);
            if(founder.getId()!=toClose.shopFounder.getId())
                return new Result(false, null, "Only the shop's founder can close it");
            else
                toClose.isActive= false;
            return new Result(true, null);
        }
    }

    addProductToShop(userName: Member, shopId, productName: string, quantity: number, fullPrice: number, discountPrice:number, relatedSale: Sale, productDesc: string): Result<void>{
        if(!this.shops.has(shopId))
            return new Result(false, null, "Failed to add product to the shop because the shop wasn't found");
        let shop= this.shops.get(shopId);
        shop.addProduct(productName, shopId, productDesc, fullPrice, discountPrice, relatedSale, quantity)
        return new Result(true, null);
    }

    removeProductFromShop(shopId: number, productId: number): Result<void>{
        if(!this.shops.has(shopId))
            return new Result(false, null, "Failed to remove product to the shop because the shop wasn't found");
        let shop= this.shops.get(shopId);
        if(shop.removeProduct(productId))
            return new Result(true, null);
        else
            return new Result(false, null, "Failed to remove product to the shop")
    }

    updateProductQuantity(shopId: number, productId: number, quantity: number): Result<void>{
        if(!this.shops.has(shopId))
            return new Result(false, null, "Failed to update product quantity because the shop wasn't found");
        let shop= this.shops.get(shopId);
        if(shop.updateProductQuantity(productId, quantity))
            return new Result(true, null);
        else
            return new Result(false, null, "Failed to update product quantity");
    }

    appointShopOwner(owner: Member, shopId: number){
        if(!this.shops.has(shopId))
            return new Result(false, null, "Failed to appoint owner because the shop wasn't found");
        let shop= this.shops.get(shopId);
        let shopOwners = shop.shopOwners;
        if(shopOwners.has(owner))
            return new Result(false, null, "The member is already the shop owner");
        shopOwners.add(owner);
        return new Result(true, null);  
    }

    appointShopManager(mangaer: Member, shopId: number){
        if(!this.shops.has(shopId))
            return new Result(false, null, "Failed to appoint manager because the shop wasn't found");
        let shop= this.shops.get(shopId);
        let shopManagers= shop.shopManagers;
        if(shopManagers.has(mangaer))
            return new Result(false, null, "The member is already the shop manager");
        shopManagers.add(mangaer);
        return new Result(true, null);  
    }

    showShopProducts(shopId: number): Result<Map<number, [Product, number]>> {
        if(this.shops.has(shopId)){
            let products= this.shops.get(shopId).products;
            return new Result(true, products);
        }
        else
            return new Result(false, null, "Failed to show the shop products");
    }

    

} 