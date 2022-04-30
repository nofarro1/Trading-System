import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { JobType, Permission, Role } from "./Role";
import { User } from "./User";


export class Member implements User{
    id: number;
    shoppingCart: ShoppingCart;
    messageBox: MessageBox;
    private username: string;
    private roles: Role[];

    constructor(id: number, shoppingCart: ShoppingCart, messageBox: MessageBox, username: string, roles: Role[]){
        this.id = id;
        this.shoppingCart = shoppingCart;
        this.messageBox = messageBox;
        this.username = username;
        this.roles = roles;
    }
    
    getId(): number { return this.id; }

    getShoppingCart(): ShoppingCart { return this.shoppingCart; }

    getMessageBox(): MessageBox { return this.messageBox; }

    addRole(role: Role) {
        this.roles.push(role);
    }

    removeRole(shopId: number, jobType: JobType) {
        this.roles = this.roles.filter((role) => role.getShopId() !== shopId || role.getJobType() !== jobType)
    }

    getRole(shopId: number, jobType: JobType) {
        return this.roles.find((role) => role.getShopId() === shopId && role.getJobType() === jobType);
    }

    hasRole(shopId: number, jobType: JobType){
        return this.roles.reduce((bool, role) => bool || (role.getShopId() === shopId && role.getJobType() === jobType));
    }

    addPermission(shopId: number, jobType: JobType, perm: Permission) {
        let role = this.getRole(shopId, jobType);
        if (role)
            role.addPermition(perm);
    }

    removePermission(shopId: number, jobType: JobType, perm: Permission) {
        let role = this.getRole(shopId, jobType);
        if (role)
            role.removePermission(perm);
    }

}