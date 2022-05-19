import {Permissions} from "../utilities/Permissions";
import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";


export class MemberService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Member - Use-Case 1
    logout(sessionID: string, username: string): Result<void | SimpleGuest> {
        return this.systemController.logout(sessionID, username);
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(sessionID: string, newOwnerID: string, shopID: number, assigningOwnerID: string,
                     title?: string, permissions?: Permissions[]): Result<void> {
        if(!permissions)
            permissions = new Array<Permissions>();
        return this.systemController.appointShopOwner(sessionID, {member: newOwnerID, shopId: shopID, assigner: assigningOwnerID,
            title: title, permissions: permissions});
    }

    //Shop Owner - Use-Case 6
    appointShopManager(sessionID: string, newManagerID: string, shopID: number, assigningOwnerID: string,
                       title?: string, permissions?: Permissions[]): Result<void> {
        if(!permissions)
            permissions = new Array<Permissions>();
        return this.systemController.appointShopManager(sessionID, {member: newManagerID, shopId: shopID, assigner: assigningOwnerID,
            title: title, permissions: permissions});
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(sessionID: string, assigningOwnerID: string, promotedManagerID: string, shopID: number, permissions: Permissions): Result<void> {
        return this.systemController.addShopManagerPermission(sessionID, assigningOwnerID, promotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(sessionID: string, assigningOwnerID: string, demotedManagerID: string, shopID: number, permissions: Permissions): Result<void> {
        return this.systemController.removeShopManagerPermission(sessionID, assigningOwnerID, demotedManagerID, shopID, permissions);
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(sessionID: string, username: string, shopID: number): Result<void | SimpleMember[]> {
        return this.systemController.getPersonnelInfo(sessionID, username, shopID);
    }
}
