import { logger } from "../../helpers/logger";
import { JobType } from "../../utilities/Enums";
import { Permissions } from "../../utilities/Permissions";
import { Result } from "../../utilities/Result";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { MessageBox } from "../notifications/MessageBox";
import { Guest } from "./Guest";
import { Member } from "./Member";
import { Role } from "./Role";
import { User } from "./User";


export class UserController {
    private _connectedGuests: Map<number, Guest>;
    private _members: Map<string, Member>;
    private guestIdCounter: number = 0;
    private roleIdCounter: number = 0;
    
    constructor(){
        this._connectedGuests = new Map<number, Guest>();
        this._members = new Map<string, Member>();
    }
    
    public get connectedGuests(): Map<number, Guest> {
        return this._connectedGuests;
    }

    public get members(): Map<string, Member> {
        return this._members;
    }


    createGuest(): Result<Guest>{
        const shoppingCart = new ShoppingCart();
        const msgBox = new MessageBox(this.guestIdCounter);
        const guest = new Guest(this.guestIdCounter, shoppingCart);
        this.connectedGuests.set(guest.id, guest);
        logger.info(`Guest ${this.guestIdCounter} connected`);
        this.guestIdCounter++;
        return new Result(true, guest);
    }

    exitGuest(guest: Guest): Result<void> {
        this.connectedGuests.delete(guest.id);
        logger.info(`Guest ${guest.id} exit`);
        return new Result(true, undefined);
    }

    addRole(username: string, title: string, jobType: JobType, shopId: number, perm: Set<Permissions>): Result<Role | undefined>{
        if (!this.members.has(username))
            return new Result(false, undefined, `User ${username} not found`);
        const member = this.members.get(username);
        let role = new Role(shopId, title, jobType, perm);
        if(member)
            member.addRole(role);
        return new Result(true, role);
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

    addMember(username: string, shoppingCart: ShoppingCart): Result<Member| undefined>{
        if(this.members.has(username))
            return new Result(false, undefined , `User ${username} already exist`);
        else{
            let member = new Member(username, shoppingCart);
            this.members.set(username, member);
            return new Result(true, member);
        }
    }

    getMember(username: string): Result<Member | undefined>{
        if(this.members.has(username)){
            logger.info(`Member ${username} added to the marketplace`);
            return new Result(true, this.members.get(username));
        }
        else{
            logger.info(`Member ${username} not added to the marketplace because this username is already exists`);
            return new Result(false, undefined, `User ${username} not found`);
        }

    }

    getGuest(guestId: number): Result<User | undefined>{
        if(this.connectedGuests.has(guestId))
            return new Result(true, this.connectedGuests.get(guestId));
        else
            return new Result(false, undefined, `Guest with id ${guestId} not found`);
    }

    addPermission(username: string, shopId: number, perm: Permissions): Result<void>{
        if (!this.members.has(username))
        return new Result(false, undefined, `User ${username} not found`);
        const member = this.members.get(username);
        if (member)
            member.addPermission(shopId, perm);
        return new Result(true, undefined);
    }

    removePermission(username: string, shopId: number, perm: Permissions): Result<void>{
        if (!this.members.has(username))
            return new Result(false, undefined, `User ${username} not found`);
        const member = this.members.get(username);
        if(member)
            member.removePermission(shopId, perm);
        return new Result(true, undefined);
    }

    checkPermission(username: string, shopId: number, perm: Permissions): Result<boolean>{
        if (!this.members.has(username))
            return new Result(false, false, `User ${username} not found`);
        let user = this.members.get(username);
        if (!user?.hasRole(shopId))
            return new Result(false, false, `User ${username} not found`);
        let role = user.roles.get(shopId);
        if (role)
            if(role.hasPermission(perm))
                return new Result(true, true);
            return new Result(false, false, `User ${username} don't have role with shop id ${shopId}`);
        }
    }