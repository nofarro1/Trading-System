import {JobType} from "../../Enums";
import {Permissions} from "../../Permissions";


export class SimpleRole {
    private readonly _shopID: number;
    private readonly _permissions: Permissions[]


    constructor(shopID: number, permissions: Set<Permissions>) {
        this._shopID = shopID;
        this._permissions = [...permissions];
    }


    get shopID(): number {
        return this._shopID;
    }

    get permissions(): Permissions[] {
        return this._permissions;
    }

}