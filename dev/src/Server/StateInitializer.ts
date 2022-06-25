import {Service} from "../service/Service";
import {resetContainer} from "../helpers/inversify.config";
import {checkRes, Result} from "../utilities/Result";
import memberData from "./initialization_data/members.json"
import shopFounderData from "./initialization_data/shop_founders.json"
import productsData from "./initialization_data/products.json"
import {ProductCategory, toCategoryEnum} from "../utilities/Enums";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {logger} from "../helpers/logger";

type MemberData = {
    sessionId: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    country?: string
}

type ShopFounderData = {
    member: MemberData,
    shop: {
        Id: number,
        sessionId: string,
        founder: string,
        shopName: string
    }
}
type ProductData = {
    category: string | ProductCategory,
    name: string,
    price: number,
    quantity: number,
    description?: string
}

export class StateInitializer {
    service: Service;
    private DataSource: any;
    private membersData: MemberData[];
    private foundersData: ShopFounderData[];
    private productsData: ProductData[];

    constructor(service: Service, DataSource) {
        this.service = service;
        this.DataSource = DataSource;
        this.membersData = [];
        this.foundersData = [];
        this.productsData = [];
        memberData.forEach(memberData => this.membersData.push(memberData))
        shopFounderData.forEach((founderData) => this.foundersData.push(founderData));
        productsData.forEach((productData) => this.productsData.push(productData));
    }

    //initialize the system with data.
    async initialize() {
        let success = true;
        //register members, non shop founders
        this.membersData.forEach(this.registerMembers);
        //registering shop founders createShops and adding products for each shop
        for (const {member, shop} of this.foundersData) {
            let reg_success = await this.registerMembers(member)
            success = success && reg_success && await this.createShop(member, shop);
        }

        //appoint shop Owner... 2 AdditionalOwners
    }

    private async registerMembers(membersData: MemberData): Promise<boolean> {
        //Access Marketplace
        const res = await this.service.accessMarketplace(membersData.sessionId);
        //register the members
        const res_register = await this.service.register(membersData.sessionId, membersData.username,
            membersData.password, membersData.firstName,
            membersData.lastName, membersData.email, membersData.country);
        //leave marketplace
        const exit_res = await this.service.exitMarketplace(membersData.sessionId);
        return res.ok && res_register.ok && exit_res.ok;
    }

    private async createShop(member, shop): Promise<boolean> {
        //accessMarketplace
        let success = true;
        const res = await this.service.accessMarketplace(member.sessionId);
        success = success && res.ok;
        const login_res = await this.service.login(member.sessionId, member.username, member.password);
        success = success && login_res.ok;
        const res_setupShop = await this.service.setUpShop(shop.sessionId, shop.username, shop.name);
        if (!checkRes(res_setupShop)) {
            success = false;
        } else shop.Id = res_setupShop.data.ID;
        //add 20 products
        console.log(`adding to shop ${shop.Id} 20 products - amount left:${this.productsData.length}`);
        const twentyProducts: ProductData[] = this.productsData.splice(0, 20)
        const add_products_res = await this.addProductsToShop(shop, twentyProducts);
        if (!add_products_res) {
            logger.error(`failed add to shop ${shop.Id} 20 products`)
            success = false;
        }
        console.log(`added to shop ${shop.Id} 20 products - amount left:${this.productsData.length}`);
        const exit_res = await this.service.exitMarketplace(member.sessionId)
        return success && exit_res.ok;
    }

    private async addProductsToShop(shop: { Id: number, sessionId: string, founder: string, shopName: string }, products: ProductData[]) {
        const promises: Promise<Result<SimpleProduct | void>>[] = products.map((pd) => {
            return this.service.addProductToShop(shop.sessionId, shop.founder, shop.Id, toCategoryEnum(pd.category), pd.name, pd.price, pd.quantity, pd.description)
        });
        try {
            const results: Result<SimpleProduct | void>[] = await Promise.all(promises);
            return results.reduce((acc, curr) => acc && curr.ok, true);
        } catch (err: any) {
            logger.error("failed to add to shop products");
            return false;
        }

    }

    private addShopOwners(shopId, newOwner:MemberData,assigner:MemberData){

    }

    reset() {
        try {
            resetContainer()
            //datasource.clearDatabase
            return Result.Ok(true, "successfully reset the system");
        } catch (e) {
            return Result.Fail("unexpected Failure happened during reset");
        }

    }


}