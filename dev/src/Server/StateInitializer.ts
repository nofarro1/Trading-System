import {Service} from "../service/Service";
import {resetContainer} from "../helpers/inversify.config";
import {checkRes, Result} from "../utilities/Result";
import memberData from "./initialization_data/members.json"
import shopFounderData from "./initialization_data/shop_founders.json"
import productsData from "./initialization_data/products.json"
import {ProductCategory} from "../utilities/Enums";

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
    "member": MemberData,
    "shop": {
        Id: number,
        sessionId: string,
        founder: string,
        shopName: string
    }
}
type ProductData = {
    category: string,
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
    }

    //initialize the system with data.
    initialize() {
        memberData.forEach(memberData => this.membersData.push(memberData));
        shopFounderData.forEach((founderData) => this.foundersData.push(founderData));
        productsData.forEach((productData) => this.productsData.push(productData));
        //register members.... 10 members
       this.membersData.forEach(this.registerMembers);
        const founder_member_data = this.foundersData.map(founderData => founderData.member);
        founder_member_data.forEach(this.registerMembers);
        //createShops... 4 shops
        //add products to shop... 5 products per shop
        //appoint manager ... 2 managers in different shops
        //appoint shop Owner... 2 AdditionalOwners
    }

    async registerMembers(membersData: MemberData) {
        //Access Marketplace
        const res = await this.service.accessMarketplace(membersData.sessionId);
        //register the members
        const res_register = await this.service.register(membersData.sessionId, membersData.username,
                                    membersData.password, membersData.firstName,
                                    membersData.lastName, membersData.email, membersData.country);
        //leave marketplace
        const exit_res = await this.service.exitMarketplace(membersData.sessionId);
    }

    async createShop(member, shop) {
        //accessMarketplace
        const res = await this.service.accessMarketplace(member.sessionId);
        const login_res = await this.service.login(member.sessionId, member.username,member.password);

        const res_setupShop = await this.service.setUpShop(shop.sessionId, shop.username,shop.name);
        if(checkRes(res_setupShop)) {
            shop.Id = res_setupShop.data.ID;
        }
        //add 20 products
        console.log(this.productsData.length);
        const twentyProducts: ProductData[] = this.productsData.splice(0, 20)
        console.log(this.productsData.length);



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