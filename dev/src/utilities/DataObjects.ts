

// User Related Data Objects

import {Member} from "../domain/user/Member";
import {JobType} from "../domain/user/Role";
import {Shop} from "../domain/marketplace/Shop";
import {Permissions} from "./Permissions";
import {Id} from "./Utils";

export interface loginData {
    guestId:Id;
    username: string;
    password: string;
}

export interface registerMemberData {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
}

export interface newShopData {
    shopName: string;
    founder: string;
    description: string;
    foundedDate: Date;
}

export interface newProductData {
    name: string,
    description: string;
    shopId: number;
    price: number;
    quantity: number;
}



export interface newRoleData {
    title: string;
    shopId: number;
    assigner: string;
    jobRole?: JobType;
    permissions?: Permissions[]
}