import { Result } from "../../utilities/Result";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { Guest } from "./Guest";
import { Member } from "./Member";
import { JobType, Permission, Role } from "./Role";
import { User } from "./User";


export class UserController {
    private connectedGuests: Map<number, Guest>;
    private members: Map<number, Member>;
    private guestIdCounter: number = 0;
    private memberIdCounter: number = 0;
    private roleIdCounter: number = 0;

    constructor(){
        this.connectedGuests = new Map<number, Guest>();
        this.members = new Map<number, Member>();
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

    addRole(memberId: number, role: Role): Result<void>{
        if (!this.members.has(memberId))
            return new Result(false, undefined, `user with id ${memberId} not found`);
        const member = this.members.get(memberId);
        if(member)
            member.addRole(role);
        return new Result(true, undefined);
    }

    removeRole(memberId: number, shopId: number, jobType: JobType){
        if (!this.members.has(memberId))
            return new Result(false, undefined, `user with id ${memberId} not found`);
        const member = this.members.get(memberId);
        if (member){
            if (!member.hasRole(shopId, jobType))
                return new Result(false, undefined, `user with id ${memberId} not found`);
        }
        if (member)
            member.removeRole(shopId, jobType);
    }

    getUser(id: number): Result<User | undefined>{
        if(this.connectedGuests.has(id))
            return new Result(true, this.connectedGuests.get(id));
        else if(this.members.has(id))
            return new Result(true, this.members.get(id));
        else
            return new Result(false, undefined, `user with id ${id} not found`);
    }

    addPermition(memberId: number, shopId: number, jobType: JobType, perm: Permission): Result<void>{
        if (!this.members.has(memberId))
        return new Result(false, undefined, `user with id ${memberId} not found`);
        const member = this.members.get(memberId);
        if (member)
            member.addPermission(shopId, jobType, perm);
        return new Result(true, undefined);
    }

    removePermition(memberId: number, shopId: number, jobType: JobType, perm: Permission): Result<void>{
        if (!this.members.has(memberId))
            return new Result(false, undefined, `user with id ${memberId} not found`);
        const member = this.members.get(memberId);
        if(member)
            member.removePermission(shopId, jobType, perm);
        return new Result(true, undefined);
    }

    checkPermission(memberId: number, shopId: number, jobType:JobType, perm: Permission): Result<boolean>{
        if (!this.members.has(memberId))
            return new Result(false, false, `user with id ${memberId} not found`);
        let user = this.members.get(memberId);
        if (!user?.hasRole(shopId, jobType))
            return new Result(false, false, `user with id ${memberId} not found`);
        let role = user.getRole(shopId, jobType);
        if (role)
            return new Result(true, role.hasPermition(perm));
        return new Result(false, false, `user with id ${memberId} don't have role with shop id ${shopId} and job type ${jobType}`);
            

        }


    }