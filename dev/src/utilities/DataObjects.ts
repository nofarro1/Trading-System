// User Related Data Objects

import {Sale} from "../domain/marketplace/Sale";
import {LogicalPolicy, PolicyType, ProductCategory, RelationType, SimplePolicyType} from "./Enums";
import {Permissions} from "./Permissions";

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

