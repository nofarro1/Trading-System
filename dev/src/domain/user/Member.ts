import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { JobType, Permission, Role } from "./Role";
import { User } from "./User";


export class Member implements User{
    private username: string;
    shoppingCart: ShoppingCart;
    messageBox: MessageBox;
    private roles: Role[];

    constructor(username: string, shoppingCart: ShoppingCart, messageBox: MessageBox){
        this.username = username;
        this.shoppingCart = shoppingCart;
        this.messageBox = messageBox;
        this.roles = [];
    }
    
    getUsername(): string { return this.username; }

    getShoppingCart(): ShoppingCart { return this.shoppingCart; }

    getMessageBox(): MessageBox { return this.messageBox; }

    addRole(role: Role) {
        this.roles.push(role)
    }

    removeRole(shopId: number) {
        this.roles = this.roles.filter((role) => role.getShopId() !== shopId )
    }

    getRole(shopId: number) {
        return this.roles.find((role) => role.getShopId() === shopId );
    }

    hasRole(shopId: number){
        return this.roles.reduce((bool, role) => bool || (role.getShopId() === shopId));
    }

    addPermission(shopId: number, perm: Permission) {
        let role = this.getRole(shopId);
        if (role)
            role.addPermition(perm);
    }

    removePermission(shopId: number, perm: Permission) {
        let role = this.getRole(shopId);
        if (role)
            role.removePermission(perm);
    }

}