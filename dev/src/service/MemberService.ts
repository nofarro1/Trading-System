import {Permissions} from "../utilities/Permissions";
import {Result} from "../utilities/Result";
import {Guest as DomainGuest} from "../domain/user/Guest"
import {SystemController} from "../domain/controller/SystemController";
import {Guest} from "./simple_objects/user/Guest";
import {Member} from "./simple_objects/user/Member";
import {Member as DomainMember} from "../domain/user/Member";
import {Role as DomainRole} from "../domain/user/Role";


export class MemberService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Member - Use-Case 1
    logout(username: string): Result<void | Guest> {
        const domainResult: Result<void | DomainGuest> = this.systemController.logout(username);
        let result: Result<void | Guest> = new Result <void | Guest>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainGuest: DomainGuest = <DomainGuest> domainResult.data;
            result.data = new Guest(domainGuest.id);
        }
        return result;
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(newOwnerID: string, shopID: number, assigningOwnerID: string, title?: string,
                     permissions?: Permissions[]): Result<void> {
        if(!permissions)
            permissions = new Array<Permissions>();
        return this.systemController.appointShopOwner({member: newOwnerID, shopId: shopID, assigner: assigningOwnerID,
            title: title, permissions: permissions});
    }

    //Shop Owner - Use-Case 6
    appointShopManager(newManagerID: string, shopID: number, assigningOwnerID: string, title?: string,
                       permissions?: Permissions[]): Result<void> {
        if(!permissions)
            permissions = new Array<Permissions>();
        return this.systemController.appointShopManager({member: newManagerID, shopId: shopID, assigner: assigningOwnerID,
            title: title, permissions: permissions});
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(assigningOwnerID: string, promotedManagerID: string, shopID: number, permissions: Permissions): Result<void> {
        return this.systemController.addShopManagerPermission(assigningOwnerID, promotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(assigningOwnerID: string, demotedManagerID: string, shopID: number, permissions: Permissions): Result<void> {
        return this.systemController.removeShopManagerPermission(assigningOwnerID, demotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(username: string, shopID: number): Result<void | Member[]> {
        const domainResult: Result<void | DomainMember[]> = this.systemController.getPersonnelInfo(username, shopID);
        const members: Member[] = new Array<Member>();
        const result: Result<void | Member[]> = new Result <void | Member[]>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            for (const domainMember of <DomainMember[]> domainResult.data) {
                const role: DomainRole = <DomainRole> domainMember.roles.get(shopID);
                const member: Member = new Member(domainMember.username, role.jobType, role.permissions, role.title);
                members.push(member);
            }
            result.data = members;
        }
        return result;
    }
}
