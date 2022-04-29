import {Permissions} from "../utilities/Permissions";
import {Role} from "./simple_objects/Role";
import {Result} from "../utilities/Result";
import {Guest as DomainGuest} from "../domain/user/Guest"
import {SystemController} from "../domain/controller/SystemController";
import {Guest} from "./simple_objects/Guest";
import {Member} from "./simple_objects/Member";


export class MemberService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Member - Use-Case 1
    logout(username: string): Result<Guest> {
        let result: Result<Guest> = new Result<Guest>(false, null);
        let domainResult: Result<DomainGuest> = this.systemController.logout(username);
        if (domainResult.ok == true) {
            let simpleGuest: Guest = new Guest(domainResult.data.id);
            result = new Result<Guest>(true, simpleGuest, domainResult.message);
        } else result.message = domainResult.message;
        return result;
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(assigningOwnerID: string, newOwnerID: string, shopID: number, title: string): Result<void> {
        // return this.systemController.appointShopOwner(assigningOwnerID, newOwnerID, shopID);
        return null;
    }

    //Shop Owner - Use-Case 6
    appointShopManager(assigningOwnerID: string, newManagerID: string, shopID: number, title: string): Result<void> {
        // return this.systemController.appointShopManager(assigningOwnerID, newManagerID, shopID);
        return null;
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(assigningOwnerID: string, promotedManagerID: string, shopID: number, permissions: Permissions[]): Result<void> {

        return null;
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(assigningOwnerID: string, demotedManagerID: string, shopID: number, permissions: Permissions[]): Result<void> {
        return new Result<void>(true, null, "Success");
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(username: string, shopID: number): Result<Member[]> {
        return null;
    }
}
