

// User Related Data Objects

import {Member} from "./user/Member";
import {JobType} from "./user/Role";

export interface loginData {
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
    founder: Member;
    description: string;
    contactEmail: string;
    foundedDate: Date;
}

export interface newRoleData {
    title: string;
    jobRole: JobType;
    shopBelonging: Shop;
    assigner: Member | null;
    permissions: MemberPermissions[]
    
    
}