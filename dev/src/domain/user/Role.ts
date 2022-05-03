import { JobType } from "../../utilities/Enums";
import { Permissions } from "../../utilities/Permissions";
import {UserID} from "../../utilities/Utils";




export class Role {
    private _shopId: number;
    private _title: string;

    private _jobType: JobType;

    private _permissions: Set<Permissions>;


    constructor(shopId: number, title: string, type: JobType, permissions: Set<Permissions>){
        this._shopId = shopId;
        this._title = title;
        this._jobType = type;
        this._permissions = permissions;
    }

    public get shopId(): number {
        return this._shopId;
    }
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
    
    public get jobType(): JobType {
        return this._jobType;
    }
    public set jobType(value: JobType) {
        this._jobType = value;
    }
    public get permissions(): Set<Permissions> {
        return this._permissions;
    }
    public set permissions(value: Set<Permissions>) {
        this._permissions = value;
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