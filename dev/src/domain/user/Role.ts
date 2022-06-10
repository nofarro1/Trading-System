import {JobType} from "../../utilities/Enums";
import {Permissions} from "../../utilities/Permissions";
import {BaseEntity, Column, Entity, OneToOne} from "typeorm";

@Entity()
export class Role extends BaseEntity {
    @Column({type: "int"}) //TODO - Foreign Key constraint (One To One)
    private readonly _shopId: number;
    @Column({type: "text"})
    private _title: string;
    @Column({type: "enum", enum: JobType})
    private _jobType: JobType;
    @Column({type: "enum", enum: Permissions, array: true})
    private _permissions: Set<Permissions>;

    constructor(shopId: number, title: string, type: JobType, permissions: Set<Permissions>) {
        super();
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

    addPermission(perm: Permissions) {
        this.permissions.add(perm);
    }

    hasPermission(perm: Permissions) {
        return this.permissions.has(perm);
    }

    removePermission(perm: Permissions) {
        this.permissions.delete(perm);
    }

    hasPermissions(perm: Permissions) {
        return this.permissions.has(perm);
    }
}