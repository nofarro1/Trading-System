import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { Permission, Role } from "./Role";
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

    removeRole(roleId: number) {
        this.roles = this.roles.filter((role) => role.getId() !== roleId)
    }

    getRole(roleId: number){
        return this.roles.find((role) => role.getId() === roleId);
    }

    addPermission(roleId: number, perm: Permission) {
        let role = this.roles.find((role) => role.getId() === roleId);
        role.addPermition(perm);
    }

    removePermission(roleId: number, perm: Permission) {
        let role = this.roles.find((role) => role.getId() === roleId);
        role.removePermission(perm);
    }

}