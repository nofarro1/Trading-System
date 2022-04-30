

// User Related Data Objects

import {JobType} from "../domain/user/Role";
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

export interface NewShopData {
    founder: string;
    shopName: string;
    description: string;
    foundedDate?: Date;
}

export interface NewProductData {
    shopId: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
}

export interface NewRoleData {
    title: string;
    shopId: number;
    assigner: string;
    jobRole?: JobType;
    permissions?: Permissions[];
}
