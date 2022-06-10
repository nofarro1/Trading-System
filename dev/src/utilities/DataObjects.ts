// User Related Data Objects

import {Sale} from "../domain/marketplace/Sale";
import {
    DiscountKinds,
    DiscountRelation,
    DiscountType,
    ProductCategory,
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
    relatedSale?: Sale,
    productDesc?: string
}

export interface NewRoleData {
    member: string;
    shopId: number;
    assigner: string;
    title?: string;
    permissions: Permissions[];
}

export interface DiscountData{
    kind: DiscountKinds
}

export class SimpleDiscountData implements DiscountData{

    kind: DiscountKinds = DiscountKinds.SimpleDiscount;
    discountType: DiscountType;
    object: number | ProductCategory | undefined;
    discountPrecent: number;
}

export class ConditionalDiscountData implements DiscountData{
    discount: SimpleDiscountData;
    predTypeObject: DiscountType
    predObject: number | ProductCategory | undefined;
    predRelation: RelationType;
    predValue: number;
    kind: DiscountKinds = DiscountKinds.ConditionalDiscount;
}

export class ContainerDiscountData implements DiscountData{
    kind: DiscountKinds = DiscountKinds.ContainerDiscount;
    discountRelation: DiscountRelation
    discounts: DiscountData[]
}

export const isSimpleDiscount = (disc:DiscountData): disc is SimpleDiscountData =>{
    return disc.kind === DiscountKinds.SimpleDiscount;
}

export const isConditionalDiscount = (disc:DiscountData): disc is ConditionalDiscountData =>{
    return disc.kind === DiscountKinds.ConditionalDiscount;
}
//---------------------------purchase policy data object -------------------//

export interface ImmediatePurchaseData {}

export class SimplePurchaseData implements ImmediatePurchaseData{
    policyType: SimplePolicyType;
    object: number | ProductCategory | Guest;
    predRelation: RelationType;
    predValue: number;
    msg: string;
}

export class ContainerPurchaseData implements ImmediatePurchaseData{
    policiesRelation: PurchasePoliciesRelation;
    policies: ImmediatePurchaseData[];
    dependet?: ImmediatePurchaseData;
    dependetOn?: ImmediatePurchaseData;
}