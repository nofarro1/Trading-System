import { Permissions } from "../../Permissions";
import {JobType} from "../../Enums";


class SimpleRole {
}

export class SimpleMember {
    private readonly _username: string;
    private readonly _roles: SimpleRole[]

    constructor(username: string, roles: SimpleRole[] = []) {
        this._username = username;
        this._roles = roles;
    }

    get username(): string {
        return this._username;
    }

    get roles(): SimpleRole[] {
        return this._roles;
    }
}