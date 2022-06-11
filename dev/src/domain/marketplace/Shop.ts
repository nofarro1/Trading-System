import {Product} from "./Product";
import {PurchasePoliciesRelation, ProductCategory, ShopRate, ShopStatus, DiscountRelation} from "../../utilities/Enums";
import {ShoppingBag} from "../user/ShoppingBag";
import {DiscountComponent} from "./DiscountAndPurchasePolicies/Components/DiscountComponent";
import {ImmediatePurchasePolicyComponent} from "./DiscountAndPurchasePolicies/Components/ImmediatePurchasePolicyComponent";
import {Answer} from "../../utilities/Types";
import {Guest} from "../user/Guest";
import {BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryColumn} from "typeorm";
import {
    ConditionalDiscountData,
    ContainerDiscountData,
    ContainerPurchaseData,
    DiscountData,
    ImmediatePurchaseData,
    isConditionalDiscount,
    isContainerDiscount, isContainerPurchaseData,
    isSimpleDiscount,
    isSimplePurchaseData,
    SimpleDiscountData,
    SimplePurchaseData
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


@Entity()
export class Shop extends BaseEntity {
    @PrimaryColumn({type: "int"})
    private _id: number;
    @Column({type: "text"})
    private _name: string;
    @Column({type: "enum", enum: ShopStatus})
    private _status: ShopStatus;
    @Column({type: "text"}) //TODO - Foreign Key constraint (One To One)
    private _shopFounder: string;
    @Column({type: "text", array: true}) //TODO - Foreign Key constraint (One To Many)
    private _shopOwners: Set<string>;
    @Column({type: "text", array: true}) //TODO - Foreign Key constraint (One To Many)
    private _shopManagers: Set<string>;
    @Column({type: "int", array: true}) //TODO - Foreign Key constraint (One To Many)
    private _products: Map<number, [Product, number]>;
    @Column({type: "int"})
    private _productsCounter: number;
    @Column({type: "enum", enum: ShopRate})
    private _rate: ShopRate;
    @Column({type: "int", array: true})
    private readonly _discounts: Map<number, DiscountComponent>;
    @Column({type: "int"})
    private _discountCounter: number;
    @Column({type: "int", array: true})
    private readonly _purchasePolicies: Map<number, ImmediatePurchasePolicyComponent>;
    @Column({type: "int"})
    private _purchaseCounter: number;
    @Column({type: "text", nullable: true})
    private _description?: string;
    private _offers: Map<number, Offer>
    private offerCounter: number;

    constructor(id: number, name: string, shopFounder: string, description?: string) {
        super();
        this._id = id;
        this._name = name;
        this._status = ShopStatus.open;
        this._shopFounder = shopFounder;
        this._shopOwners = new Set<string>([shopFounder]);
        this._shopManagers = new Set<string>();
        this._products = new Map<number, [Product, number]>();
        this._productsCounter = 0;
        this._rate = ShopRate.NotRated;
        this._discounts = new Map<number, DiscountComponent>();
        this._discountCounter = 0;
        this._purchasePolicies = new Map<number, ImmediatePurchasePolicyComponent>();
        this._purchaseCounter = 0;
        this._description = description;
        this.offerCounter = 0;
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

    getDiscounts(): DiscountComponent[]{
        return [...this._discounts.values()];
    }

    get discountCounter(): number {
        return this._discountCounter;
    }

    set discountCounter(value: number) {
        this._discountCounter = value;
    }

    get purchasePolicies(): Map<number, ImmediatePurchasePolicyComponent> {
        return this._purchasePolicies;
    }

    get purchaseCounter(): number {
        this._purchaseCounter++;
        return this._purchaseCounter--;
    }

    set purchaseCounter(value: number) {
        this._purchaseCounter = value;
    }

    addProduct(productName: string, category: ProductCategory, fullPrice: number, quantity: number, productDesc?: string): Product {
        let toAdd = new Product(productName, this.id, this._productsCounter, category, fullPrice, productDesc);
        if (!this.products.has(toAdd.id)) {
            this.products.set(toAdd.id, [toAdd, quantity]);
            this._productsCounter++;
            return toAdd;
        }

        return toAdd;
    }

    getProductQuantity(productId: number): number{
        let product= this.products.get(productId);
        if(!product)
            throw new Error ("Failed to return product quantity in shop because the product map of the shop is undefined");
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
    }

    removeShopOwner (ownerId: string): boolean{
        for (let offer of this._offers.values()){
            offer.approvers.delete(ownerId);
        }
        return this._shopOwners.delete(ownerId);
    }

    appointShopManager(managerId: string): void{
        if(this.shopManagers?.has(managerId))
            throw new Error("Failed to appoint owner because the member is already a owner of the shop")
        this.shopManagers?.add(managerId);
    }

    removeShopManager (managerId: string){
        return this.shopManagers.delete(managerId);
    }

    calculateBagPrice(bag: ShoppingBag): [Product, number, number][]{

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


    addDiscount(disc: DiscountData): number{
        let toAdd:DiscountComponent = this.discData2Component(disc);
        this._discounts.set(this._discountCounter,toAdd);
        this._discountCounter = this._discountCounter+1;
        return this._discountCounter-1;
    }

    addSubDiscount(discId: number, toAdd: DiscountData) {
        let disc:DiscountComponent = this.discounts.get(discId);
        if(disc instanceof ContainerDiscountComponent){
            let toAddComponent = this.discData2Component(toAdd);
            disc.addDiscountElement(toAddComponent);
        }
    }


    removeDiscount(idDisc: number): void {
        this._discounts.delete(idDisc);
    }

    getDiscount (id2return: number): DiscountComponent{
        return this.discounts.get(id2return);
    }

    addPurchasePolicy(puPolicy: ImmediatePurchaseData): number{
        let toAdd:ImmediatePurchasePolicyComponent = this.policyData2Component(puPolicy);
        this._purchasePolicies.set(this._purchaseCounter,toAdd);
        this._purchaseCounter++;
        return this._purchaseCounter--;
    }

    removePurchasePolicy(idPuPolicy: number) {
        this._purchasePolicies.delete(idPuPolicy);
    }

    getPurchasePolicy (id2return: number): ImmediatePurchasePolicyComponent{
        return this._purchasePolicies.get(id2return);
    }

    addOfferPrice2Product( userId: string, pId: number, offeredPrice: number): Offer{
        let offer = new Offer(this.offerCounter,userId, this.id, pId, offeredPrice, this.shopOwners)
        this._offers.set(this.offerCounter, offer);
        this.offerCounter= this.offerCounter+1;
        return offer;
    }

    getOffer(offerId: number){
            return this._offers.get(offerId);
    }

    answerOffer(offerId: number, ownerId: string, answer: boolean): boolean{
        let offer = this._offers.get(offerId);
        if(offer){
            offer.setAnswer(ownerId, answer);
            return true;
        }
        return false;
    }

    private extractProducts(shopProducts: Map<number, [Product, number]>): Product[]{
        let productsList = [];
        for(let tuple of shopProducts){ productsList.push(tuple[1][0])}
        return productsList;
    }



    private discData2Component (disc: DiscountData): DiscountComponent {
        if (isSimpleDiscount(disc)) {
            let discInf = {type: disc.discountType, object: disc.object}
            return new SimpleDiscount(this._discountCounter, discInf, disc.discountPresent);
        } else if (isConditionalDiscount(disc)) {
            let discInf = {type: disc.discount.discountType, object: disc.discount.object}
            let simpDisc = new SimpleDiscount(this.discountCounter, discInf, disc.discount.discountPresent);
            let pred = new PredicateDiscountPolicy(disc.predTypeObject, disc.predObject, disc.predRelation, disc.predValue);
            return new ConditionalDiscount(this._discountCounter, simpDisc, pred);
        }
        else if (isContainerDiscount(disc)) {
            let discComponents: DiscountComponent[] = [];
            for (let toAdd of disc.discounts){
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
    }

    private policyData2Component (puPolicy: ImmediatePurchaseData): ImmediatePurchasePolicyComponent{
            if ( isSimplePurchaseData(puPolicy)) {
                return new SimplePurchase(this._purchaseCounter, puPolicy.policyType, puPolicy.object, puPolicy.predRelation, puPolicy.predValue, puPolicy.msg);
            }
            else if (isContainerPurchaseData(puPolicy)) {
                let policiesComponent: ImmediatePurchasePolicyComponent[] = [];
                for (let toAdd of puPolicy.policies){
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
        }
}