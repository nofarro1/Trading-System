import {Permission} from "../utilities/Permission";
import {Role} from "./simple_objects/Role";
import {Result} from "../utilities/Result";
import {SystemController} from "../domain/controller/SystemController";


class MemberService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Member - Use-Case 1
    logout(username: string): Result<boolean> {
        return new Result<boolean>(true, null, "Logout successful");
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(assigningOwnerID: string, newOwnerID: string, shopID: number): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 6
    appointShopManager(assigningOwnerID: string, newManagerID: string, shopID: number): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(promotingOwnerID: string, promotedManagerID: string, shopID: number, role: Role): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(demotingOwnerID: string, demotedManagerID: string, shopID: number, role: Role): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(ownerID: string, shopID: number): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }
}
