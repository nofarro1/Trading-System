

// User Related Data Objects

import {Member} from "../domain/user/Member";
import {JobType} from "../domain/user/Role";
import {Shop} from "../domain/marketplace/Shop";
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
    member: string
    jobRole: JobType;
    shopId: number;
    assigner: string;
    title?: string;
    permissions?: Permissions[];
}
