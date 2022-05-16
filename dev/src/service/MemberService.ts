import {Permissions} from "../utilities/Permissions";
import {Result} from "../utilities/Result";
import {Guest as DomainGuest} from "../domain/user/Guest"
import {SystemController} from "../domain/SystemController";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {Member as DomainMember} from "../domain/user/Member";
import {Role as DomainRole} from "../domain/user/Role";


export class MemberService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General SimpleMember - Use-Case 1
    logout(username: string): Result<void | SimpleGuest> {
        const domainResult: Result<void | DomainGuest> = this.systemController.logout(username);
        let result: Result<void | SimpleGuest> = new Result <void | SimpleGuest>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            const domainGuest: DomainGuest = <DomainGuest> domainResult.data;
            result.data = new SimpleGuest(domainGuest.id);
        }
        return result;
    }

    //SimpleShop Owner - Use-Case 4
    appointShopOwner(newOwnerID: string, shopID: number, assigningOwnerID: string, title?: string,
                     permissions?: Permissions[]): Result<void> {
        if(!permissions)
            permissions = new Array<Permissions>();
        return this.systemController.appointShopOwner({member: newOwnerID, shopId: shopID, assigner: assigningOwnerID,
            title: title, permissions: permissions});
    }

    //SimpleShop Owner - Use-Case 6
    appointShopManager(newManagerID: string, shopID: number, assigningOwnerID: string, title?: string,
                       permissions?: Permissions[]): Result<void> {
        if(!permissions)
            permissions = new Array<Permissions>();
        return this.systemController.appointShopManager({member: newManagerID, shopId: shopID, assigner: assigningOwnerID,
            title: title, permissions: permissions});
    }

    //SimpleShop Owner - Use-Case 7.1
    addPermissions(assigningOwnerID: string, promotedManagerID: string, shopID: number, permissions: Permissions): Result<void> {
        return this.systemController.addShopManagerPermission(assigningOwnerID, promotedManagerID, shopID, permissions);
    }

    //SimpleShop Owner - Use-Case 7.2
    removePermissions(assigningOwnerID: string, demotedManagerID: string, shopID: number, permissions: Permissions): Result<void> {
        return this.systemController.removeShopManagerPermission(assigningOwnerID, demotedManagerID, shopID, permissions);
    }

    //SimpleShop Owner - Use-Case 11
    requestShopPersonnelInfo(username: string, shopID: number): Result<void | SimpleMember[]> {
        const domainResult: Result<void | DomainMember[]> = this.systemController.getPersonnelInfo(username, shopID);
        const members: SimpleMember[] = new Array<SimpleMember>();
        const result: Result<void | SimpleMember[]> = new Result <void | SimpleMember[]>(domainResult.ok, undefined, domainResult.message);
        if(domainResult.ok) {
            for (const domainMember of <DomainMember[]> domainResult.data) {
                const role: DomainRole = <DomainRole> domainMember.roles.get(shopID);
                const member: SimpleMember = new SimpleMember(domainMember.username, role.jobType, role.permissions, role.title);
                members.push(member);
            }
            result.data = members;
        }
        return result;
    }
}
