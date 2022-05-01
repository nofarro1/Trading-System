

export class Role {
    private username: string;
    private appointingOwnerID: string;
    private shopID: number;
    private permissions: Permissions[];


    constructor(username: string, appointingOwnerID: string, shopID: number, permissions: Permissions[]) {
        this.username = username;
        this.appointingOwnerID = appointingOwnerID;
        this.shopID = shopID;
        this.permissions = permissions;
    }
}