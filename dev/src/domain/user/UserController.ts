import { Result } from "../../utilities/Result";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { Guest } from "./Guest";
import { Member } from "./Member";
import { JobType, Permission, Role } from "./Role";
import { User } from "./User";


export class UserController {
    private connectedGuests: Map<number, Guest>;
    private members: Map<string, Member>;
    private guestIdCounter: number = 0;
    private roleIdCounter: number = 0;

    constructor(){
        this.connectedGuests = new Map<number, Guest>();
        this.members = new Map<string, Member>();
    }

    createGuest(): Result<Guest>{
        const shoppingCart = new ShoppingCart();
        const msgBox = new MessageBox(this.guestIdCounter);
        const guest = new Guest(this.guestIdCounter, shoppingCart, msgBox);
        this.guestIdCounter++;
        this.connectedGuests.set(guest.getId(), guest);
        return new Result(true, guest);
    }

    exitGuest(guest: Guest): Result<void> {
        this.connectedGuests.delete(guest.getId());
        return new Result(true, undefined);
    }

    addRole(username: string, title: string, jobType: JobType, shopId: number, perm: Permission[]): Result<void>{
        if (!this.members.has(username))
            return new Result(false, undefined, `user ${username} not found`);
        const member = this.members.get(username);
        let role = new Role(shopId, title, jobType, perm);
        if(member)
            member.addRole(role);
        return new Result(true, undefined);
    }

    removeRole(username: string, shopId: number){
        if (!this.members.has(username))
            return new Result(false, undefined, `user ${username} not found`);
        const member = this.members.get(username);
        if (member){
            if (!member.hasRole(shopId))
                return new Result(false, undefined, `user ${username} not found`);
        }
        if (member)
            member.removeRole(shopId);
    }

    addMember(username: string, shoppingCart: ShoppingCart, msgBox: MessageBox): Result<void>{
        if(this.members.has(username))
            return new Result(false, undefined, `user ${username} already exist`);
        else{
            let member = new Member(username, shoppingCart, msgBox);
            return new Result(true, undefined);
        }
    }

    getMember(username: string): Result<Member | undefined>{
        if(this.members.has(username))
            return new Result(true, this.members.get(username));
        else
            return new Result(false, undefined, `user ${username} not found`);
    }

    getGuest(guestId: number): Result<User | undefined>{
        if(this.connectedGuests.has(guestId))
            return new Result(true, this.connectedGuests.get(guestId));
        else
            return new Result(false, undefined, `guest with id ${guestId} not found`);
    }

    addPermission(username: string, shopId: number, perm: Permission): Result<void>{
        if (!this.members.has(username))
        return new Result(false, undefined, `user ${username} not found`);
        const member = this.members.get(username);
        if (member)
            member.addPermission(shopId, perm);
        return new Result(true, undefined);
    }

    removePermission(username: string, shopId: number, perm: Permission): Result<void>{
        if (!this.members.has(username))
            return new Result(false, undefined, `user ${username} not found`);
        const member = this.members.get(username);
        if(member)
            member.removePermission(shopId,  perm);
        return new Result(true, undefined);
    }

    checkPermission(username: string, shopId: number, perm: Permission): Result<boolean>{
        if (!this.members.has(username))
            return new Result(false, false, `user ${username} not found`);
        let user = this.members.get(username);
        if (!user?.hasRole(shopId))
            return new Result(false, false, `user ${username} not found`);
        let role = user.getRole(shopId);
        if (role)
            return new Result(true, role.hasPermition(perm));
        return new Result(false, false, `user ${username} don't have role with shop id ${shopId}`);
            

        }


    }