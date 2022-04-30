import { Result } from "../../utilities/Result";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { Guest } from "./Guest";
import { Member } from "./Member";
import { Permission, Role } from "./Role";
import { User } from "./User";


export class UserController {
    private connectedGuests: Map<number, Guest>;
    private members: Map<number, Member>;
    private guestIdCounter: number = 0;
    private memberIdCounter: number = 0;
    private roleIdCounter: number = 0;

    constructor(){}

    createGuest(): Result<Guest>{
        const shoppingCart = new ShoppingCart();
        const msgBox = new MessageBox();
        const guest = new Guest(this.guestIdCounter, shoppingCart, msgBox);
        this.guestIdCounter++;
        this.connectedGuests.set(guest.getId(), guest);
        return new Result(true, guest);
    }

    exitGuest(guest: Guest): Result<void> {
        this.connectedGuests.delete(guest.getId());
        return new Result(false, null);
    }

    addRole(memberId: number, role: Role): Result<void>{
        const member = this.members.get(memberId);
        member.addRole(role);
        return new Result(true, null);
    }

    removeRole(memberId: number, roleId: number){
        const member = this.members.get(memberId);
        member.removeRole(roleId);
    }

    getUser(id: number): Result<User>{
        if(this.connectedGuests.has(id))
            return new Result(true, this.connectedGuests.get(id));
        else if(this.members.has(id))
            return new Result(true, this.members.get(id));
        else
            return new Result(false, null, `user with id ${id} not found`);
    }

    addPermition(memberId: number, roleId: number, perm: Permission): Result<void>{
        if (!this.members.has(memberId))
            return new Result(false, null, `user with id ${memberId} not found`);
        const member = this.members.get(memberId);
        member.addPermission(roleId, perm);
        return new Result(true, null);
    }

    removePermition(memberId: number, roleId: number, perm: Permission): Result<void>{
        if (!this.members.has(memberId))
            return new Result(false, null, `user with id ${memberId} not found`);
        const member = this.members.get(memberId);
        member.removePermission(roleId, perm);
        return new Result(true, null);
    }
}