import {Permissions} from "../../utilities/Permissions";
import {Role} from "./Role";
import {Guest} from "./Guest";
import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";

@Entity()
export class Member extends Guest {
    @PrimaryColumn({type: "text"})
    private _username: string;
    @Column({type: "number", array: true}) //TODO - Foreign Key constraint (One To Many)
    private readonly _roles: Map<number, Role>; //ShopID -> Role

    constructor(session: string, username: string) {
        super(session);
        this._username = username;
        this._roles = new Map<number, Role>();
    }

    public get username(): string {
        return this._username;
    }

    public set username(value: string) {
        this._username = value;
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
    public getIdentifier(): string {
        return this.username;
    }
}

