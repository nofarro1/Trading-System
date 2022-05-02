import { JobType } from "../../utilities/Enums";
import { Permissions } from "../../utilities/Permissions";
import {UserID} from "../../utilities/Utils";




export class Role {
    private shopId : number;
    private title: string;
    private jobType: JobType;
    private permissions: Set<Permissions>;

    constructor(shopId: number, title: string, type: JobType, permissions: Set<Permissions>){
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
    
    addPermission(perm: Permissions){
        this.permissions.add(perm);
    }

    hasPermission(perm: Permissions){
        return this.permissions.has(perm);
    }

    removePermission(perm: Permissions){
        this.permissions.delete(perm);
    }

    hasPermissions(perm: Permissions){
        return this.permissions.has(perm);
    }
}