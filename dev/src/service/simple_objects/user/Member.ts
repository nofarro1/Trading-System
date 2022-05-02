import {Role} from "./Role";


export class Member {
    private readonly _username: string;
    private readonly _roles?: Role[];

    constructor(username: string, roles?: Role[]) {
        this._username = username;
        this._roles = roles;
    }


    get username(): string {
        return this._username;
    }

    get roles(): Role[] {
        return this._roles;
    }
}