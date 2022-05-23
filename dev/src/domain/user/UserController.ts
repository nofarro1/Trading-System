import { logger } from "../../helpers/logger";
import { JobType } from "../../utilities/Enums";
import { Permissions } from "../../utilities/Permissions";
import { Result } from "../../utilities/Result";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { Guest } from "./Guest";
import { Member } from "./Member";
import { Role } from "./Role";


export class UserController {
    private _connectedGuests: Map<string, Guest>;
    private _members: Map<string, Member>;
    
    constructor(){
        this._connectedGuests = new Map<string, Guest>();
        this._members = new Map<string, Member>();
    }
    
    public get connectedGuests(): Map<string, Guest> {
        return this._connectedGuests;
    }

    public get members(): Map<string, Member> {
        return this._members;
    }


    createGuest(session: string): Result<Guest>{
        const shoppingCart = new ShoppingCart();
        const guest = new Guest(session, shoppingCart);
        this.connectedGuests.set(guest.session, guest);
        logger.info(`Guest ${session} connected`);
        return new Result(true, guest);
    }

    exitGuest(guest: Guest): Result<void> {
        this.connectedGuests.delete(guest.session);
        logger.info(`Guest ${guest.session} exit`);
        return new Result(true, undefined);
    }

    addRole(username: string, title: string, jobType: JobType, shopId: number, perm: Set<Permissions>): Result<Role | undefined>{
        if (!this.members.has(username)){
            logger.warn(`[addRole] Role of shop ${shopId} not added to member ${username} beacause this member not exist`);
            return new Result(false, undefined, `User ${username} not found`);
        }
        const member = this.members.get(username);
        let role = new Role(shopId, title, jobType, perm);
        if(member)
            member.addRole(role);
        logger.info(`[addRole] Role ${role} added to member ${username}`);
        return new Result(true, role);
    }

    removeRole(username: string, shopId: number): Result<void>{
        if (!this.members.has(username)){
            logger.warn(`[removeRole] Role of shop ${shopId} NOT removed from member ${username} because this member not exist`); 
            return new Result(false, undefined, `user ${username} not found`);
        }
        const member = this.members.get(username);
        if (member){
            if (!member.hasRole(shopId)){
                logger.warn(`[removeRole] Role of shop ${shopId} NOT removed from member ${username} because this member don't have roles of this shop`); 
                return new Result(false, undefined, `user ${username} not found`);
                logger.info(`Role of shop ${shopId} removed from member ${username}`); 
            }
        }
        if (member){
            member.removeRole(shopId);
            logger.info(`[removeRole] Role of shop ${shopId} removed from member ${username}`); 
            return new Result(true, undefined);
        }
        return new Result(false, undefined);
    }

    addMember(session: string, username: string, shoppingCart: ShoppingCart): Result<Member| undefined>{
        if(this.members.has(username)){
            logger.info(`[addMember] Member with username:  ${username}, already exist in the marketplace`);
            return new Result(false, undefined , `User ${username} already exist`);
        }
        else{
            let member = new Member(session, username, shoppingCart);
            this.members.set(username, member);
            logger.info(`[addMember] Member ${username} added to the marketPlace`); 
            return new Result(true, member);
        }
    }

    getMember(username: string): Result<Member | undefined>{
        if(this.members.has(username)){
            return new Result(true, this.members.get(username));
        }
        else{
            return new Result(false, undefined, `User ${username} not found`);
        }

    }

    getGuest(guestId: string): Result<Guest | undefined>{
        if(this.connectedGuests.has(guestId))
            return new Result(true, this.connectedGuests.get(guestId));
        else
            return new Result(false, undefined, `Guest with id ${guestId} not found`);
    }

    addPermission(username: string, shopId: number, perm: Permissions): Result<void>{
        if (!this.members.has(username)){
            logger.warn(`[addPermission] Permission ${perm} does not added to member ${username} beacause this member not exist`);
            return new Result(false, undefined, `User ${username} not found`);
        }
        const member = this.members.get(username);
        if (member){
            member.addPermission(shopId, perm);
            logger.info(`[addPermission] Permission ${perm} added to member ${username}`);
            return new Result(true, undefined);
        }
        return new Result(false, undefined);
    }

    removePermission(username: string, shopId: number, perm: Permissions): Result<void>{
        if (!this.members.has(username)){
            logger.warn(`[removePermission] Permission ${perm} removed from member ${username} beacause this member not exist`);
            return new Result(false, undefined, `User ${username} not found`);
        }
        const member = this.members.get(username);
        if(member){
            member.removePermission(shopId, perm);
            logger.info(`[removePermission] Permission ${perm} removed from member ${username}`);
            return new Result(true, undefined);
        }
        return new Result(false, undefined);
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