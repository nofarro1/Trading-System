// User Related Data Objects

import {Member} from "../domain/user/Member";
import {JobType, Permission} from "../domain/user/Role";
import {Shop} from "../domain/marketplace/Shop";

import {ProductCategory} from "../domain/marketplace/Product";
import {Sale} from "../domain/marketplace/Sale";

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
    userId: number,
    shopId: number,
    productCategory: ProductCategory,
    productName: string,
    quantity: number,
    fullPrice: number,
    discountPrice: number,
    relatedSale: Sale,
    productDesc: string
}

export interface NewRoleData {
    member: string
    shopId: number;
    assigner: string;
    title: string;
    permissions: Permission[];
}
