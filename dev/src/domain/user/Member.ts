import {Permissions} from "../../utilities/Permissions";
import {Role} from "./Role";
import {Guest} from "./Guest";
import {Entity} from "../../utilities/Entity";
import prisma from "../../utilities/PrismaClient";


export class Member extends Guest implements Entity{
    private _username: string;
    private readonly _roles: Map<number, Role>;

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
        if(!this.roles.has(role.shopId)) {
            this.roles.set(role.shopId, role);
        }
    }

    removeRole(shopId: number) {
        if (this.roles.has(shopId))
            this.roles.delete(shopId);
    }

    hasRole(shopId: number) {
       return this.roles.has(shopId);
    }

    addPermission(shopId: number, perm: Permissions) {
        if(this.roles.has(shopId)) {
            this.roles.get(shopId).addPermission(perm);
        }
        this.roles.forEach((role) => {
            if (role.shopId === shopId)
                role.addPermission(perm);
        })
    }

    removePermission(shopId: number, perm: Permissions) {
        if(this.roles.has(shopId)) {
            this.roles.get(shopId).removePermission(perm);
        }
    }
    public getIdentifier(): string {
        return this.username;
    }

    findById() {
    }

    async save() {
        await prisma.member.create({
            data: {
                username: this.username,
            },
        });
    }

    update() {
    }
}

