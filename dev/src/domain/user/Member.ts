import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { JobType, Permission, Role } from "./Role";
import { User } from "./User";


export class Member implements User{
    private username: string;
    shoppingCart: ShoppingCart;
    messageBox: MessageBox;
    private roles: Set<Role>;

    constructor(username: string, shoppingCart: ShoppingCart, messageBox: MessageBox){
        this.username = username;
        this.shoppingCart = shoppingCart;
        this.messageBox = messageBox;
        this.roles = new Set<Role>();
    }

    getRoles(): Role[]{
        return this.roles;
    }
    
    getUsername(): string { return this.username; }

    getShoppingCart(): ShoppingCart { return this.shoppingCart; }

    getMessageBox(): MessageBox { return this.messageBox; }

    addRole(role: Role) {
        this.roles.add(role);
    }

    removeRole(shopId: number, jobType: JobType) {
        let r;
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId && role.getJobType() === jobType)
                r = role;
        });
        if (r)
            this.roles.delete(r);
    }

    getRole(shopId: number, jobType: JobType) {
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId && role.getJobType() === jobType){
                return role;
            }
        });
    }

    hasRole(shopId: number, jobType: JobType) {
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId && role.getJobType() === jobType)
                return true;
        });
        return false;
    }

    addPermission(shopId: number, jobType: JobType, perm: Permission) {
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId && role.getJobType() === jobType)
                role.addPermission(perm);
        })
    }

    removePermission(shopId: number, jobType: JobType, perm: Permission) {
        this.roles.forEach((role) => {
            if (role.getShopId() === shopId && role.getJobType() === jobType)
                role.removePermission(perm);
        })
    }

}