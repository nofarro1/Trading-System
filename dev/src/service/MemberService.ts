import {Permissions} from "../utilities/Permissions";
import {Role} from "./simple_objects/user/Role";
import {Result} from "../utilities/Result";
import {Guest as DomainGuest} from "../domain/user/Guest"
import {SystemController} from "../domain/controller/SystemController";
import {Guest} from "./simple_objects/user/Guest";
import {Member} from "./simple_objects/user/Member";
import {Member as DomainMember} from "../domain/user/Member";
import {Product as DomainProduct} from "../domain/marketplace/Product";
import {ShopOrder} from "./simple_objects/purchase/ShopOrder";
import {NewRoleData} from "../utilities/DataObjects";


export class MemberService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Member - Use-Case 1
    logout(username: string): Result<Guest> {
        // let result: Result<Guest> = new Result<Guest>(false, null);
        // let domainResult: Result<DomainGuest> = this.systemController.logout(username);
        // if (domainResult.ok == true) {
        //     let simpleGuest: Guest = new Guest(domainResult.data.id);
        //     result = new Result<Guest>(true, simpleGuest, domainResult.message);
        // } else result.message = domainResult.message;
        // return result;
        return null;
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(newRoleData: NewRoleData): Result<void> {
        return this.systemController.appointShopOwner(newRoleData);
    }

    //Shop Owner - Use-Case 6
    appointShopManager(newRoleData: NewRoleData): Result<void> {
        return this.systemController.appointShopManager(newRoleData);
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(assigningOwnerID: string, promotedManagerID: string, shopID: number, permissions: Permissions[]): Result<void> {
        return this.systemController.addShopManagerPermissions(assigningOwnerID, promotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(assigningOwnerID: string, demotedManagerID: string, shopID: number, permissions: Permissions[]): Result<void> {
        return this.systemController.removeShopManagerPermissions(assigningOwnerID, demotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(username: string, shopID: number): Result<Member[]> {
        // const domainResult: Result<DomainMember[]> = this.systemController.getPersonnelInfo(username, shopID);
        // const members: Member[] = new Array<Member>();
        // const result: Result<Member[]> = new Result <Member[]>(domainResult.ok, members, domainResult.message);
        // if(domainResult.ok) {
        //     for (const domainMember of domainResult.data) {
        //         const member: Member = new Member(domainMember.username, null); //TODO
        //         members.push(member);
        //     }
        // }
        // return result;
        return null;
    }
}
