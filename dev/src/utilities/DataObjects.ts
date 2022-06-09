// User Related Data Objects

import {Sale} from "../domain/marketplace/Sale";
import {DiscountKinds, DiscountRelation, DiscountType, ProductCategory, RelationType} from "./Enums";
import {Permissions} from "./Permissions";
import {Product} from "../domain/marketplace/Product";

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

export interface DiscountData{}

export class SimpleDiscountData implements DiscountData{

    discountType: DiscountType;
    object: Product | ProductCategory | undefined;
    discountPrecent: number;
}

export class ConditionalDiscountData implements DiscountData{
    discount: SimpleDiscountData;
    predTypeObject: DiscountType
    predObject: number | ProductCategory | undefined;
    predRelation: RelationType;
    predValue: number;
}

export class ContainerDiscountData implements DiscountData{
    //kind: DiscountKinds
    discountRelation: DiscountRelation
    discounts: DiscountData[]
}