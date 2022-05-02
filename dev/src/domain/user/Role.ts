import {UserID} from "../../utilities/Utils";


export enum JobType {
    Founder,
    Owner,
    Manager
}

export enum Permission{
    Perm
}

export class Role {
    private shopId : number;
    private title: string;
    private jobType: JobType;
    private permissions: Permission[];

    constructor(shopId: number, title: string, type: JobType, permissions: Permission[]){
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
    
    addPermition(perm: Permission){
        this.permissions.push(perm);
    }

    hasPermition(perm: Permission){
        return this.permissions.includes(perm);
    }

    removePermission(perm: Permission){
        this.permissions = this.permissions.filter((permition)=> !perm);
    }
}