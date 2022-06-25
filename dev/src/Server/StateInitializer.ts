import {Service} from "../service/Service";
import {resetContainer} from "../helpers/inversify.config";
import {checkRes, Result} from "../utilities/Result";
import memberData from "./initialization_data/members.json"
import shopFounderData from "./initialization_data/shop_founders.json"
import productsData from "./initialization_data/products.json"
import {ProductCategory, toCategoryEnum} from "../utilities/Enums";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {logger} from "../helpers/logger";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";

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
    id: number,
    category: string | ProductCategory,
    name: string,
    price: number,
    quantity: number,
    description?: string
}

export class StateInitializer {
    service: Service;
    private DataSource: any;
    private membersData: MemberData[] = [];
    private foundersData: ShopFounderData[] = [];
    private productsData: ProductData[] = [];
    private addedProducts: SimpleProduct[] = [];

    constructor(service: Service, DataSource) {
        this.service = service;
        this.DataSource = DataSource;
        memberData.forEach(memberData => this.membersData.push(memberData))
        shopFounderData.forEach((founderData) => this.foundersData.push(founderData));
        productsData.forEach((productData) => this.productsData.push(productData));
    }

    //initialize the system with data.
    async initialize() {
        let success = true;
        //register members, non shop founders
        const registered = await Promise.all(this.membersData.map(this.registerMembers))
        registered.reduce((acc, curr) => acc && curr, success);
        //registering shop founders createShops and adding products for each shop
        for (const {member, shop} of this.foundersData) {
            let reg_success = await this.registerMembers(member)
            success = success && reg_success && await this.createShop(member, shop);
        }
        //added products to cart
        return success && await this.populateCarts();
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
        //login to user;
        const login_res: Result<void | SimpleMember> = await this.service.login(member.sessionId, member.username, member.password);
        success = success && login_res.ok;
        //setup shop
        const res_setupShop: Result<void | SimpleShop> = await this.service.setUpShop(shop.sessionId, shop.username, shop.name);
        if (!checkRes(res_setupShop)) {
            success = false;
        } else shop.Id = res_setupShop.data.ID;
        //add 20 products
        const twentyProducts: ProductData[] = this.productsData.splice(0, 20)
        const add_products_res = await this.addProductsToShop(shop, twentyProducts);
        if (!add_products_res) {
            logger.error(`failed add to shop ${shop.Id} 20 products`)
            success = false;
        }
        console.log(`added to shop ${shop.Id} 20 products - amount left:${this.productsData.length}`);
        //added owners and managers from the general member population
        const {added_owners, added_managers} = await this.addedShopStaff(shop, member);
        //exiting the shop founder
        const exit_res: Result<void> = await this.service.exitMarketplace(member.sessionId)
        return success && added_owners && added_managers && exit_res.ok;
    }

    private async addedShopStaff(shop, member) {
        const added_owners: boolean = await this.addShopOwners(shop.Id, member);
        const added_managers: boolean = await this.addShopManagers(shop.Id, member);
        return {added_owners, added_managers};
    }

    private async addProductsToShop(shop: { Id: number, sessionId: string, founder: string, shopName: string }, products: ProductData[]) {
        const promises: Promise<Result<SimpleProduct | void>>[] = products.map(async (pd) => {
            const res = await this.service.addProductToShop(shop.sessionId, shop.founder, shop.Id, toCategoryEnum(pd.category), pd.name, pd.price, pd.quantity, pd.description);
            if (checkRes(res)) {
                pd.id = res.data.productID;
                this.addedProducts.push(res.data)
            }
            return res;
        });
        try {
            const results: Result<SimpleProduct | void>[] = await Promise.all(promises);
            return results.reduce((acc, curr) => acc && curr.ok, true);
        } catch (err: any) {
            logger.error("failed to add to shop products");
            return false;
        }

    }

    private async addShopOwners(shopID: number, assigner: MemberData) {
        let success = true;
        const three_owners = this.membersData.splice(0, 3);
        for (const owner of three_owners) {
            const res = await this.service.appointShopOwner(assigner.sessionId, owner.username, shopID, assigner.username);
            success = success && res.ok
        }
        return success;
    }

    private async addShopManagers(shopID: number, assigner: MemberData) {
        let success = true;
        const three_owners = this.membersData.splice(0, 2);
        for (const owner of three_owners) {
            const res = await this.service.appointShopManager(assigner.sessionId, owner.username, shopID, assigner.username);
            success = success && res.ok
        }
        return success
    }

    private async populateCarts() {
        let okList = []
        const all_members = this.membersData.concat(this.foundersData.map(f => f.member));
        for (let i = 0; i < 100; i++) {
            const member = StateInitializer.getRandomFromList(all_members);
            for(let j = 0; j< StateInitializer.getRandomFromList([1,2,3,4,5]); j++){
                const product = StateInitializer.getRandomFromList(this.addedProducts);
                okList.push(await this.populateCart(member, product));
            }
        }
        return okList.reduce((acc, curr) => acc && curr, true)
    }

    private async populateCart(member: MemberData, product: SimpleProduct) {
        const res = await this.service.addToCart(member.sessionId, product.productID, StateInitializer.getRandomFromList([1, 2, 3]));
        return res.ok
    }

    private static getRandomFromList<T>(list: T[]): T {
        return list[Math.random() * list.length]
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