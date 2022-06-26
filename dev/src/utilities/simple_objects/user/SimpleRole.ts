import {JobType} from "../../Enums";
import {Permissions} from "../../Permissions";


export class SimpleRole {
    private readonly _shopID: number;
    private readonly _permissions: Permissions[]
    private readonly _title?: string;


    constructor(shopID: number, permissions: Set<Permissions>, title?: string) {
        this._shopID = shopID;
        this._permissions = [...permissions];
        this._title = title;
    }


    get shopID(): number {
        return this._shopID;
    }

    get permissions(): Permissions[] {
        return this._permissions;
    }

    get title(): string {
        return this._title;
    }
}