

export class Role {
    private readonly _username: string;
    private readonly _appointingOwnerID: string;
    private readonly _shopID: number;
    private readonly _permissions: Permissions[];


    constructor(username: string, appointingOwnerID: string, shopID: number, permissions: Permissions[]) {
        this._username = username;
        this._appointingOwnerID = appointingOwnerID;
        this._shopID = shopID;
        this._permissions = permissions;
    }


    get username(): string {
        return this._username;
    }

    get appointingOwnerID(): string {
        return this._appointingOwnerID;
    }

    get shopID(): number {
        return this._shopID;
    }

    get permissions(): Permissions[] {
        return this._permissions;
    }
}