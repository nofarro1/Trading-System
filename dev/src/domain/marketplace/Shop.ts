import {Product} from "./Product";
import {ShoppingBag} from "../user/ShoppingBag";
import {DiscountComponent} from "./DiscountAndPurchasePolicies/Components/DiscountComponent";
import {
    ImmediatePurchasePolicyComponent
} from "./DiscountAndPurchasePolicies/Components/ImmediatePurchasePolicyComponent";
import {Answer} from "../../utilities/Types";
import {Guest} from "../user/Guest";
import {
    DiscountData,
    ImmediatePurchaseData,
    isConditionalDiscount,
    isContainerDiscount, isContainerPurchaseData,
    isSimpleDiscount,
    isSimplePurchaseData,

} from "../../utilities/DataObjects";
import {SimpleDiscount} from "./DiscountAndPurchasePolicies/leaves/SimpleDiscount";
import {PredicateDiscountPolicy} from "./DiscountAndPurchasePolicies/Predicates/PredicateDiscountPolicy";
import {ConditionalDiscount} from "./DiscountAndPurchasePolicies/leaves/ConditionalDiscount";
import {
    AndDiscounts
} from "./DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicCompositions/AndDiscounts";
import {OrDiscounts} from "./DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicCompositions/OrDiscounts";
import {
    XorDiscounts
} from "./DiscountAndPurchasePolicies/Containers/DiscountsContainers/LogicCompositions/XorDiscounts";
import {
    AdditionDiscounts
} from "./DiscountAndPurchasePolicies/Containers/DiscountsContainers/NumericConditions/AdditionDiscounts";
import {
    MaxDiscounts
} from "./DiscountAndPurchasePolicies/Containers/DiscountsContainers/NumericConditions/MaxDiscounts";
import {SimplePurchase} from "./DiscountAndPurchasePolicies/leaves/SimplePurchase";
import {AndPolicy} from "./DiscountAndPurchasePolicies/Containers/PurchaseContainers/AndPolicy";
import {OrPolicy} from "./DiscountAndPurchasePolicies/Containers/PurchaseContainers/OrPolicy";
import {
    ConditioningPurchasePolicies
} from "./DiscountAndPurchasePolicies/Containers/PurchaseContainers/ConditionalPolicy";
import {
    ContainerDiscountComponent
} from "./DiscountAndPurchasePolicies/Containers/DiscountsContainers/ContainerDiscountComponent";
import {Offer} from "../user/Offer";
import {Entity} from "../../utilities/Entity";
import prisma from "../../utilities/PrismaClient";
import {
    DiscountKinds,
    DiscountRelation,
    ProductCategory,
    PurchasePoliciesRelation,
    ShopRate,
    ShopStatus
} from "../../utilities/Enums";
import {AppointmentAgreement} from "./AppointmentAgreement";
import {Discount, DiscountContainer, DiscountInContainer} from "../../../prisma/prisma";
import {toSimpleShoppingCart} from "../../utilities/simple_objects/SimpleObjectFactory";



export class Shop implements Entity{

    private _id: number;
    private _name: string;
    private _status: ShopStatus;
    private _shopFounder: string;
    private _shopOwners: Set<string>;
    private _shopManagers: Set<string>;
    private _products: Map<number, [Product, number]>;
    private _productsCounter: number;
    private _rate: ShopRate;
    private _discounts: Map<number, DiscountComponent>;
    private _discountsArray: DiscountComponent[];
    private _discountCounter: number;
    private _purchasePolicies: Map<number, ImmediatePurchasePolicyComponent>;
    private _purchasePoliciesArray: ImmediatePurchasePolicyComponent[];
    private _purchaseCounter: number;
    private _description?: string;
    private _offers: Map<number, Offer>
    private _offersArray: Offer[];
    private _offerCounter: number;
    private _appointmentAgreements: Map<string, AppointmentAgreement>;

    constructor(id: number, name: string, shopFounder: string, description?: string){
        this._id= id;
        this._name= name;
        this._status= ShopStatus.Open;
        this._shopFounder= shopFounder;
        this._shopOwners= new Set<string>([shopFounder]);
        this._shopManagers= new Set<string>();
        this._products= new Map<number, [Product, number]>();
        this._productsCounter = 0;
        this._rate = ShopRate.NotRated;
        this._discounts = new Map<number, DiscountComponent>();
        this._discountsArray = [];
        this._discountCounter = 0;
        this._purchasePolicies = new Map<number, ImmediatePurchasePolicyComponent>();
        this._purchasePoliciesArray = [];
        this._purchaseCounter = 0;
        this._description = description;
        this._offers = new Map<number, Offer>();
        this.offersArray = []
        this._offerCounter = 0;
        this._appointmentAgreements = new Map<string, AppointmentAgreement>();
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get status(): ShopStatus {
        return this._status;
    }

    set status(value: ShopStatus) {
        this._status = value;
    }

    get shopFounder(): string {
        return this._shopFounder;
    }

    get description(): string {
        return this._description;
    }

    set shopFounder(value: string) {
        this._shopFounder = value;
    }

    get shopOwners(): Set<string> {
        return this._shopOwners;
    }

    set shopOwners(value: Set<string>) {
        this._shopOwners = value;
    }

    get shopManagers(): Set<string> {
        return this._shopManagers;
    }

    set shopManagers(value: Set<string>) {
        this._shopManagers = value;
    }

    get products(): Map<number, [Product, number]> {
        return this._products;
    }

    set products(value: Map<number, [Product, number]>) {
        this._products = value;
    }

    get productsCounter(): number {
        return this._productsCounter;
    }

    set productsCounter(value: number) {
        this._productsCounter = value;
    }

    get rate(): ShopRate {
        return this._rate;
    }

    set rate(value: ShopRate) {
        this._rate = value;
    }

    set description(value: string) {
        this._description = value;
    }

    get discounts(): Map<number, DiscountComponent> {
        return this._discounts;
    }

    getDiscounts(): DiscountComponent[] {
        return this._discountsArray;
    }

    get discountCounter(): number {
        return this._discountCounter;
    }

    set discountCounter(value: number) {
        this._discountCounter = value;
    }

    set discountsArray(value: DiscountComponent[]) {
        this._discountsArray = value;
    }

    get purchasePolicies(): Map<number, ImmediatePurchasePolicyComponent> {
        return this._purchasePolicies;
    }

    get purchasePoliciesArray(): ImmediatePurchasePolicyComponent[] {
        return this._purchasePoliciesArray;
    }

    set purchasePoliciesArray(value: ImmediatePurchasePolicyComponent[]) {
        this._purchasePoliciesArray = value;
    }

    get purchaseCounter(): number {
        this._purchaseCounter++;
        return this._purchaseCounter--;
    }

    set purchaseCounter(value: number) {
        this._purchaseCounter = value;
    }

    get offers(): Map<number, Offer> {
        return this._offers;
    }


    get offerCounter(): number {
        return this._offerCounter;
    }

    get offersArray(): Offer[] {
        return this._offersArray;
    }

    set offersArray(value: Offer[]) {
        this._offersArray = value;
    }


    get appointmentAgreements(): Map<string, AppointmentAgreement> {
        return this._appointmentAgreements;
    }

    addProduct(productName: string, category: ProductCategory, fullPrice: number, quantity: number, productDesc?: string): Product {
        let toAdd = new Product(productName, this.id, this._productsCounter, category, fullPrice, productDesc);
        if (!this.products.has(toAdd.id)) {
            this.products.set(toAdd.id, [toAdd, quantity]);
            this._productsCounter++;
            //Persist Product and ProductInShop
            toAdd.save(quantity);
            return toAdd;
        }


        return toAdd;
    }

    getProductQuantity(productId: number): number {
        let product = this.products.get(productId);
        if (!product)
            throw new Error("Failed to return product quantity in shop because the product map of the shop is undefined");
        return product[1];
    }

    //Delete a product from the store catalog
    removeProduct(productId: number): void {
        if (!this.products.delete(productId))
            throw new Error(`Failed to remove product, because product id: ${productId} was not found`);
    }

    updateProductQuantity(productId: number, quantity: number): void {
        let product = this.products.get(productId);
        if (!product)
            throw new Error("Failed to update product quantity in shop because the product isn't exist in shop")
        if (quantity < 0)
            quantity = 0;
        this.products.set(productId, [product[0], quantity]);
    }

    getProduct(productId: number): Product {
        if (!this.products)
            throw new Error("Failed to search product in shop because the product map of the shop is undefined");
        let toReturnPair = this.products.get(productId);
        if (toReturnPair)
            return toReturnPair[0];
        throw new Error(`Product with id: ${productId} was not found.`);
    }

    appointShopOwner(ownerId: string): void {
        if (this.shopOwners?.has(ownerId))
            throw new Error("Failed to appoint owner because the member is already a owner of the shop")
        this.shopOwners?.add(ownerId);
        this.createShopOwner(ownerId);
    }

    removeShopOwner(ownerId: string): boolean {
        for (let offer of this._offers.values()) {
            offer.approves.delete(ownerId);
        }
        this.deleteShopOwner(ownerId);
        return this._shopOwners.delete(ownerId);
    }

    appointShopManager(managerId: string): void {
        if (this.shopManagers?.has(managerId))
            throw new Error("Failed to appoint owner because the member is already a owner of the shop")
        this.shopManagers?.add(managerId);
        this.createShopManager(managerId);
    }

    removeShopManager(managerId: string) {
        this.deleteShopManager(managerId);
        return this.shopManagers.delete(managerId);
    }

    calculateBagPrice(bag: ShoppingBag): [Product, number, number][] {

        let productsList = this.extractProducts(bag.products);
        let productsInfo: [Product, number, number][] = [];
        for (let [p, quantity] of bag.products.values()) {
            productsInfo.push([p, p.fullPrice, quantity]);
        }
        if (this._discounts.size > 0) {
            for (let disc of this._discounts.values()) {
                if (disc.predicate(productsInfo))
                    productsInfo = disc.calculateProductsPrice(productsInfo);
            }
        }

        return productsInfo;
    }

    canMakePurchase(purchaseInfo: [bag: ShoppingBag, user: Guest]): Answer {
        let policies = Array.from(this._purchasePolicies.values());
        let callBack = (acc: Answer, currPolicy: ImmediatePurchasePolicyComponent): Answer => {
            let ans = currPolicy.CanMakePurchase(purchaseInfo);
            return acc = {ok: acc.ok && ans.ok, message: acc.message + '\n' + ans.message}
        };
        return policies.reduce(callBack, {ok: true, message: "Couldn't make purchase because:"});
    }


    addDiscount(disc: DiscountData): number {
        let toAdd: DiscountComponent = this.discData2Component(disc);
        this._discounts.set(this._discountCounter, toAdd);
        this._discountsArray = [...this._discounts.values()];
        this._discountCounter = this._discountCounter + 1;
        toAdd.save(toAdd.id, this.id);
        return this._discountCounter - 1;
    }

    addSubDiscount(discId: number, toAdd: DiscountData) {
        let disc: DiscountComponent = this.discounts.get(discId);
        if (disc instanceof ContainerDiscountComponent) {
            let toAddComponent = this.discData2Component(toAdd);
            disc.addDiscountElement(toAddComponent);
        }
        this._discountsArray = [...this._discounts.values()];
    }

    removeDiscount(idDisc: number): void {
        this._discounts.get(idDisc).delete(this.id);
        this._discounts.delete(idDisc);
        this._discountsArray = [...this._discounts.values()];

    }

    getDiscount(discId: number): DiscountComponent | undefined{
        let toReturn:DiscountComponent = this.discounts.get(discId);
        return toReturn;
    }

    addPurchasePolicy(puPolicy: ImmediatePurchaseData): number {
        let toAdd: ImmediatePurchasePolicyComponent = this.policyData2Component(puPolicy);
        this._purchasePolicies.set(this._purchaseCounter, toAdd);
        this._purchasePoliciesArray = [...this._purchasePolicies.values()];
        this._purchaseCounter++;
        return this._purchaseCounter--;
    }

    removePurchasePolicy(idPuPolicy: number) {
        this._purchasePolicies.delete(idPuPolicy);
        this._purchasePoliciesArray = [...this._purchasePolicies.values()];
    }

    getPurchasePolicy(id2return: number): ImmediatePurchasePolicyComponent {
        return this._purchasePolicies.get(id2return);
    }

    addOfferPrice2Product(userId: string, pId: number, offeredPrice: number): Offer {
        let offer = new Offer(this._offerCounter, userId, this.id, pId, offeredPrice, this.shopOwners)
        this._offers.set(this._offerCounter, offer);
        this.offersArray = [...this._offers.values()];
        this._offerCounter = this._offerCounter + 1;
        offer.save(userId, pId, Array.from(this.shopOwners));
        return offer;
    }

    removeOffer(offerId: number) {
        if (this.offers.has(offerId)) {
            let offer: Offer = this.offers.get(offerId);
            this.offers.delete(offerId);
            offer.delete();
            this.offersArray = [...this.offers.values()];
        }
    }

    getOffer(offerId: number) {
        return this.offers.get(offerId);
    }

    answerOffer(offerId: number, ownerId: string, answer: boolean) {
        let offer = this._offers.get(offerId);
        if (offer) {
            offer.setAnswer(ownerId, answer);
            return true;
        }
        return false;
    }

    filingCounterOffer(offerId: number, owner: string, bid: number) {
        let offer = this._offers.get(offerId);
        if (offer){
            offer.price = bid;
            offer.setAnswer(owner, false);
        }

        return offer;
    }

    acceptCounterOfferByMember(id: number) {
        let offer: Offer = this.offers.get(id);
        offer.resetApproves();
    }
// Check if there is an offer price on this product. If there is return the offered price else return -1.
    hasOffer(pId: number): number{
        let price: number = -1;
        for (let offer of this.offers.values()){
            if (offer.pId === pId){
                price = offer.price;
                break;
            }
        }
        return price;
    }

    private extractProducts(shopProducts: Map<number, [Product, number]>): Product[] {
        let productsList = [];
        for (let tuple of shopProducts) {
            productsList.push(tuple[1][0])
        }
        return productsList;
    }

    private discData2Component(disc: DiscountData): DiscountComponent {
        if (isSimpleDiscount(disc)) {
            let discInf = {type: disc.discountType, object: disc.object}
            return new SimpleDiscount(this._discountCounter, discInf, disc.discountPresent);
        } else if (isConditionalDiscount(disc)) {
            let discInf = {type: disc.discount.discountType, object: disc.discount.object}
            let simpDisc = new SimpleDiscount(this.discountCounter, discInf, disc.discount.discountPresent);
            let pred = new PredicateDiscountPolicy(disc.predTypeObject, disc.predObject, disc.predRelation, disc.predValue);
            return new ConditionalDiscount(this._discountCounter, simpDisc, pred);
        } else if (isContainerDiscount(disc)) {
            let discComponents: DiscountComponent[] = [];
            for (let toAdd of disc.discounts) {
                discComponents.push(this.discData2Component(toAdd))
            }
            switch (disc.discountRelation) {
                case DiscountRelation.And:
                    return new AndDiscounts(this.discountCounter, discComponents);
                case DiscountRelation.Or:
                    return new OrDiscounts(this.discountCounter, discComponents);
                case DiscountRelation.Xor:
                    return new XorDiscounts(this.discountCounter, discComponents);
                case DiscountRelation.Addition:
                    return new AdditionDiscounts(this.discountCounter, discComponents);
                case DiscountRelation.Max:
                    return new MaxDiscounts(this.discountCounter, discComponents);
            }
        }
        else{
            throw new Error("Discount");
            return null;
        }
    }

    private policyData2Component(puPolicy: ImmediatePurchaseData): ImmediatePurchasePolicyComponent {
        if (isSimplePurchaseData(puPolicy)) {
            return new SimplePurchase(this._purchaseCounter, puPolicy.policyType, puPolicy.object, puPolicy.predRelation, puPolicy.predValue, puPolicy.msg);
        } else if (isContainerPurchaseData(puPolicy)) {
            let policiesComponent: ImmediatePurchasePolicyComponent[] = [];
            for (let toAdd of puPolicy.policies) {
                policiesComponent.push(this.policyData2Component(toAdd))
            }
            switch (puPolicy.policiesRelation) {
                case PurchasePoliciesRelation.And:
                    return new AndPolicy(this._purchaseCounter, policiesComponent);
                    break;
                case PurchasePoliciesRelation.Or:
                    return new OrPolicy(this._purchaseCounter, policiesComponent);
                    break;
                case PurchasePoliciesRelation.Conditional:
                    if (puPolicy.dependet && puPolicy.dependetOn) {
                        let dependet = this.policyData2Component(puPolicy.dependet);
                        let dependetOn = this.policyData2Component(puPolicy.dependetOn);
                        return new ConditioningPurchasePolicies(this._purchaseCounter, dependet, dependetOn);
                    }
                    break;
            }
        }
        else
            throw new Error("Discount");
            return null;
    }

    submitOwnerAppointment(member: string, assigner: string) {
        let agreement = new AppointmentAgreement(member, assigner, this.shopOwners);
        this._appointmentAgreements.set(member, agreement);
        return agreement;
    }

    answerAppointmentAgreement(member: string, owner: string, answer: boolean): void | AppointmentAgreement {
        let agreement: AppointmentAgreement = this._appointmentAgreements.get(member);
        if (agreement) {
            agreement.setAnswer(owner, answer);
            return agreement;
        }
        return agreement;
    }

    removeAppointmentAgreement(member: string){
        this._appointmentAgreements.delete(member);
    }

    async save() {
        await prisma.shop.create({
            data: {
                id: this.id,
                name: this.name,
                status: this.status,
                shop_founder: this.shopFounder,
                rate: this.rate,
                description: this.description,
            },
        });

        for(const shop_owner of this.shopOwners)
            await this.createShopOwner(shop_owner);
        for(const shop_manager of this.shopManagers)
            await this.createShopManager(shop_manager);
    }

    private async createShopManager(username: string) {
        await prisma.shopManager.create({
            data: {
                username: username,
                shopId: this.id,
            },
        });
    }

    private async createShopOwner(username: string) {
        await prisma.shopOwner.create({
            data: {
                username: username,
                shopId: this.id,
            },
        });
    }

    async update() {
        await prisma.shop.update({
            where: {
                id: this.id,
            },
            data: {
                name: this.name,
                status: this.status,
                shop_founder: this.shopFounder,
                rate: this.rate,
                description: this.description,
            },
        });
    }

    static async findById(id: number) {
        let dalShop = await prisma.shop.findUnique({
            where: {id: id}
        });
        let shop = new Shop(id, dalShop.name, dalShop.shop_founder, dalShop. description);
        let owners = await shop.findAllShopOwner(id);
           for( let username of owners){
               shop._shopOwners.add(username.username)
           }

        let managers = await shop.findAllShopManager(id);
            for( let username of managers){
                shop._shopManagers.add(username.username)
            }

        let products = await Shop.findAllShopProducts(id);
        shop.products = products;

        return shop;
    }

    private async findShopOwner(username: string) {
         await prisma.shopOwner.findUnique({
            where: {
                username_shopId: {
                    username: username,
                    shopId: this.id,
                }
            }
        });
    }

    private async findShopManager(username: string) {
        await prisma.shopOwner.findUnique({
            where: {
                username_shopId: {
                    username: username,
                    shopId: this.id,
                }
            }
        });
    }

     private async findAllShopOwner(shopId: number){
         let owners: { username: string }[] = await prisma.shopOwner.findMany({
           where: {shopId},
             select: {username: true}
        })
         return [...owners.values()]
    }

    static async findAllShopProducts(shopId: number): Promise<Map<number, [Product, number]>> {
        let products = await prisma.productInShop.findMany({
            where: {shopId: shopId}
        })
        let productsMap = new Map<number, [Product, number]>()
        for(let dalP of products){
            let p = await Product.findById(dalP.productId, dalP.shopId)
            if(p)
                productsMap.set(dalP.productId,[p, dalP.product_quantity])
        }
        return productsMap;
    }

    private async findAllShopManager(shopId: number){
         let managers: { username: string }[] = await prisma.shopManager.findMany({
           where: {shopId},
             select: {username: true}
        })
         return [...managers.values()]
    }

    async delete() {
        await prisma.shop.delete({
            where: {
                id: this.id
            },
        })
    }

    private async deleteShopOwner(username: string) {
        await prisma.shopOwner.delete({
            where: {
                username_shopId: {
                    username: username,
                    shopId: this.id,
                }
            }
        });
    }

    private async deleteShopManager(username: string) {
        await prisma.shopManager.delete({
            where: {
                username_shopId: {
                    username: username,
                    shopId: this.id,
                }
            }
        });
    }


    private async findAllDiscs(shopId: number): Promise<DiscountComponent[]> {
        let dalDiscs: Discount[]= await prisma.discount.findMany({
            where: {shopId : this.id},
        });
        const d: Promise<DiscountComponent>[] = dalDiscs.map((dalDisc)=> this.dalDisc2Component(dalDisc, shopId));
        return await Promise.all(d);
    }

    private dalDisc2Component(dalDisc: Discount, shopId: number): Promise<DiscountComponent>{
        let type = dalDisc.kind;
        if(type === DiscountKinds.SimpleDiscount)
            return SimpleDiscount.findById(dalDisc.id, shopId);
        if(type === DiscountKinds.ConditionalDiscount)
            return ConditionalDiscount.findById(dalDisc.id, shopId);
        if(type === DiscountKinds.ContainerDiscount)
            return Shop.findContainerById(dalDisc.id, shopId);
    }

     static async findContainerById(containingDiscount: number, shopId: number): Promise<ContainerDiscountComponent> {
        let dalDisc: DiscountContainer = await prisma.discountContainer.findUnique({
            where: {id_shopId: {id: containingDiscount, shopId: shopId}},
        });
        let subDalDiscs: DiscountInContainer[] = await prisma.discountInContainer.findMany({
            where: {containingDiscount: containingDiscount, shopId: shopId},
        });

        let subCompDiscs: Promise<DiscountComponent>[] = subDalDiscs.map((currDisc:DiscountInContainer): Promise<DiscountComponent>=>{return ContainerDiscountComponent.dalDisc2Component(currDisc, shopId)})
        if(dalDisc.type === DiscountRelation.And){
            return new AndDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
        if (dalDisc.type === DiscountRelation.Or){
            return new OrDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
        if (dalDisc.type === DiscountRelation.Xor){
            return new XorDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
        if (dalDisc.type === DiscountRelation.Addition){
            return new AdditionDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
        if (dalDisc.type === DiscountRelation.Max){
            return new MaxDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
    }


}