import { Permissions } from "../../utilities/Permissions";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import {  Role } from "./Role";
import { User } from "./User";


export class Member implements User{
    private _username: string;
    _shoppingCart: ShoppingCart;
    private _roles: Map<number, Role>;
    
    constructor(username: string, shoppingCart: ShoppingCart){
        this._username = username;
        this._shoppingCart = shoppingCart;
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
        this.roles.set(role.getShopId(), role);
    }

    removeRole(shopId: number) {
        let r;
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId)
                r = role;
        });
        if (r)
            this.roles.delete(r);
    }

    hasRole(shopId: number) {
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId)
                return true;
        });
        return false;
    }

    addPermission(shopId: number, perm: Permissions) {
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId)
                role.addPermission(perm);
        })
    }

    removePermission(shopId: number, perm: Permissions) {
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId)
                role.removePermission(perm);
        })
    }
}

