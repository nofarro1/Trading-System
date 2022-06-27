import {Entity} from "../../utilities/Entity";
import prisma from "../../utilities/PrismaClient";
import {JobType} from "../../utilities/Enums";
import {Permissions} from "../../utilities/Permissions";


export class Role implements Entity{
    private readonly _shopId: number;
    private _jobType: JobType;
    private _assigner: string;
    private _permissions: Set<Permissions>;


    constructor(shopId: number, type: JobType, assigner: string, permissions: Set<Permissions>){
        this._shopId = shopId;
        this._jobType = type;
        this._permissions = permissions;
    }

    public get shopId(): number {
        return this._shopId;
    }
    
    public get jobType(): JobType {
        return this._jobType;
    }
    public set jobType(value: JobType) {
        this._jobType = value;
    }

    get assigner(): string {
        return this._assigner;
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

    findById() {
    }

    async save(username: string) {
        await prisma.role.create({
            data: {
                username: username,
                shopId: this.shopId,
                job_type: this.jobType,
                permissions: Array.from(this.permissions),
            },
        });
    }

    update() {
    }

    delete() {

    }
}