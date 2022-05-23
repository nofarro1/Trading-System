import { Permissions } from "../../utilities/Permissions";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import {  Role } from "./Role";
import { Guest } from "./Guest";


export class Member extends Guest{
    private _username: string;
    private _roles: Map<number, Role>;
    
    constructor(session: string, username: string, shoppingCart: ShoppingCart){
        super(session, shoppingCart);
        this._username = username;
        this._roles = new Map<number, Role>();
    }
    
    public get username(): string {
        return this._username;
    }

    public set username(value: string) {
        this._username = value;
    }
    
    public get shoppingCart(): ShoppingCart {
        return this._shoppingCart;
    }

    public get roles(): Map<number, Role> {
        return this._roles;
    }

    addRole(role: Role) {
        this.roles.set(role.shopId, role);
    }

    removeRole(shopId: number) {
        let r;
        this.roles.forEach((role) => {
            if (role.shopId === shopId)
                r = role;
        });
        if (r)
            this.roles.delete(r);
    }

    hasRole(shopId: number) {
        this.roles.forEach((role) => {
            if (role.shopId === shopId)
                return true;
        });
        return false;
    }

    addPermission(shopId: number, perm: Permissions) {
        this.roles.forEach((role) => {
            if (role.shopId === shopId)
                role.addPermission(perm);
        })
    }

    removePermission(shopId: number, perm: Permissions) {
        this.roles.forEach((role) => {
            if (role.shopId === shopId)
                role.removePermission(perm);
        })
    }
}

