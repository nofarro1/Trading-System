import {UserID} from "../../utilities/Utils";


export enum JobType {
    Founder,
    Owner,
    Manager,
    admin
}

export enum Permission{
    Perm,
    ProductManagement,
    Perm2
}

export class Role {
    private shopId : number;
    private title: string;
    private jobType: JobType;
    private permissions: Set<Permission>;

    constructor(shopId: number, title: string, type: JobType, permissions: Set<Permission>){
        this.shopId = shopId;
        this.title = title;
        this.jobType = type;
        this.permissions = permissions;
    }

    getJobType(){
        return this.jobType;
    }

    getTitle(){
        return this.title;
    }

    getShopId(){
        return this.shopId;
    }
    
    addPermission(perm: Permission){
        this.permissions.add(perm);
    }

    hasPermission(perm: Permission){
        return this.permissions.has(perm);
    }

    removePermission(perm: Permission){
        this.permissions.delete(perm);
    }
}