// User Related Data Objects

import {
    DiscountKinds,
    DiscountRelation,
    DiscountType,
    ProductCategory,
    PurchasePoliciesKinds,
    PurchasePoliciesRelation,
    RelationType,
    SimplePolicyType
} from "./Enums";
import {Permissions} from "./Permissions";
import {Guest} from "../domain/user/Guest";

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterMemberData {
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    country?: string;
}

export interface NewProductData {
    shopId: number,
    productCategory: ProductCategory,
    productName: string,
    quantity: number,
    fullPrice: number,
    discountPrice?: number,
    productDesc?: string
}

export interface NewRoleData {
    member: string;
    shopId: number;
    assigner: string;
    title?: string;
    permissions: Permissions[];
}


// TODO constructors
export interface DiscountData{
    kind: DiscountKinds
}

export class SimpleDiscountData implements DiscountData{
    kind: DiscountKinds;
    discountType: DiscountType;
    object: number | ProductCategory | undefined;
    discountPresent: number; // between 0-100

    constructor(discType: DiscountType, discObject:number | ProductCategory | undefined, discPresent: number ) {
        this.kind= DiscountKinds.SimpleDiscount;
        this.discountType = discType;
        this.object = discObject;
        this.discountPresent= discPresent;
    }

}

export class ConditionalDiscountData implements DiscountData{
    kind: DiscountKinds;
    discount: SimpleDiscountData;
    predTypeObject: DiscountType
    predObject: number | ProductCategory | undefined;
    predRelation: RelationType;
    predValue: number;

    constructor(discount: SimpleDiscountData, predTypeObject: DiscountType, predObject: number | ProductCategory | undefined, predRelation: RelationType,predValue: number ){
        this.kind = DiscountKinds.ConditionalDiscount;
        this.discount = discount;
        this.predTypeObject = predTypeObject;
        this.predObject = predObject;
        this.predRelation = predRelation;
        this.predValue = predValue;
    }
}

export class ContainerDiscountData implements DiscountData{
    kind: DiscountKinds;
    discountRelation: DiscountRelation;
    discounts: DiscountData[];

    constructor(discountRelation: DiscountRelation, discounts: DiscountData[]){
        this.kind = DiscountKinds.ContainerDiscount;
        this.discountRelation = discountRelation;
        this.discounts = discounts;
    }
}

export const isSimpleDiscount = (disc:DiscountData): disc is SimpleDiscountData =>{
    return disc.kind === DiscountKinds.SimpleDiscount;
}

export const isConditionalDiscount = (disc:DiscountData): disc is ConditionalDiscountData =>{
    return disc.kind === DiscountKinds.ConditionalDiscount;
}

export const isContainerDiscount = (disc: DiscountData): disc is ContainerDiscountData=>{
    return disc.kind === DiscountKinds.ContainerDiscount;
}
//---------------------------purchase policy data object -------------------//

export interface ImmediatePurchaseData {
    kind: PurchasePoliciesKinds;
}

export class SimplePurchaseData implements ImmediatePurchaseData{
    kind: PurchasePoliciesKinds;
    policyType: SimplePolicyType;
    object: number | ProductCategory | Guest;
    predRelation: RelationType;
    predValue: number;
    msg: string;

    constructor(policyType: SimplePolicyType, object: number | ProductCategory | Guest, predRelation: RelationType, predValue: number, msg: string){
        this.kind= PurchasePoliciesKinds.SimplePurchase;
        this.policyType = policyType;
        this.object = object;
        this.predRelation = predRelation;
        this.predValue = predValue;
        this.msg = msg;
    }
}

export class ContainerPurchaseData implements ImmediatePurchaseData{
    kind: PurchasePoliciesKinds;
    policiesRelation: PurchasePoliciesRelation;
    policies: ImmediatePurchaseData[];
    dependet?: ImmediatePurchaseData;
    dependetOn?: ImmediatePurchaseData;

    constructor(policiesRelation: PurchasePoliciesRelation, policies: ImmediatePurchaseData[], dependet?: ImmediatePurchaseData, dependetOn?: ImmediatePurchaseData) {
        this.kind= PurchasePoliciesKinds.ContainerPurchasePolicy;
        this.policiesRelation = policiesRelation;
        this.policies = policies;
        this.dependet = dependet;
        this.dependetOn = dependetOn;
    }
}

export const isSimplePurchaseData = (policy: ImmediatePurchaseData): policy is SimplePurchaseData=>{
    return policy.kind === PurchasePoliciesKinds.SimplePurchase;
}

export const isContainerPurchaseData = (policy: ImmediatePurchaseData): policy is ContainerPurchaseData=>{
    return policy.kind === PurchasePoliciesKinds.ContainerPurchasePolicy;
}