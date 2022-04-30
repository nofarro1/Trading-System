

export class Role {
    username: string;
    appointingOwnerID: string;
    shopID: number;
    permissions: Permissions[];


    constructor(username: string, appointingOwnerID: string, shopID: number, permissions: Permissions[]) {
        this.username = username;
        this.appointingOwnerID = appointingOwnerID;
        this.shopID = shopID;
        this.permissions = permissions;
    }
}